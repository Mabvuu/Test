import React, { useState, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import * as XLSX from 'xlsx';

const BANKS = [
  "CBZ Bank Limited",
  "Standard Chartered Bank Zimbabwe",
  "FBC Bank Limited",
  "Stanbic Bank Zimbabwe",
  "Ecobank Zimbabwe",
  "ZB Bank Limited",
  "BancABC Zimbabwe",
  "NMB Bank Limited",
  "Agribank (Agricultural Bank of Zimbabwe)",
  "Steward Bank",
  "POSB (People's Own Savings Bank)","Metbank Limited","First Capital Bank",
];

export default function Sales() {
  const { posId } = useParams();
  const { state: { name } = {} } = useLocation();
  const navigate = useNavigate();

  const [step, setStep] = useState('choose');
  const [method, setMethod] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [bank, setBank] = useState('');
  const [rows, setRows] = useState([]);
  const [saved, setSaved] = useState(false);

  const fileInputRef = useRef(null);

  const mapRow = raw => {
    const out = { date: '', posId: '', description: '', amount: '', currency: '' };
    for (let key in raw) {
      const norm = key.trim().toLowerCase().replace(/\s+/g, '');
      const val = raw[key];
      if (norm === 'date') out.date = val;
      else if (norm === 'posid' || norm === 'pos') out.posId = val;
      else if (norm === 'description') out.description = val;
      else if (norm === 'amount') out.amount = val;
      else if (norm === 'currency') out.currency = val;
    }
    if (method === 'bank' && !out.posId) {
      out.posId = posId;
    }
    if (!out.currency) out.currency = currency;
    return out;
  };

  const handleFileUpload = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = evt => {
      const data = new Uint8Array(evt.target.result);
      const wb = XLSX.read(data, { type: 'array' });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(ws, { defval: '' });
      const parsed = json.map(mapRow);
      setRows(parsed);
      setSaved(false);
    };
    reader.readAsArrayBuffer(file);
  };

  const onSave = async () => {
    if (!name) {
      alert("Missing agent name. Cannot save.");
      return;
    }
    if (!rows.length) {
      alert("No data to save. Upload or fill in rows first.");
      return;
    }
    if (method === 'bank' && !bank) {
      alert("Select a bank before saving.");
      return;
    }

    const reportDate = new Date().toISOString().split('T')[0];
    // simulate network delay and fake save
    alert("Saving...");
    setTimeout(() => {
      const fakeId = Math.floor(Math.random() * 1000000);
      const tableData = rows.map(row => {
        return { ...row, Bank: bank || '' };
      });
      const existing = JSON.parse(localStorage.getItem('simulatedSalesReports') || '[]');
      existing.push({ reportId: fakeId, name, posId, date: reportDate, source: method, bank, tableData });
      localStorage.setItem('simulatedSalesReports', JSON.stringify(existing));
      alert(`Saved ID: ${fakeId}`);
      setSaved(true);
    }, 500);
  };

  const onClear = () => {
    setRows([]);
    setSaved(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (step === 'choose') {
    return (
      <div className="p-4 pt-40">
        <h2 className="text-xl font-bold">Select Payment Method</h2>
        <select
          value={method}
          onChange={e => setMethod(e.target.value)}
          className="mt-2 p-2 border rounded"
        >
          <option value="">-- Choose --</option>
          <option value="bank">Bank Payment</option>
          <option value="ecocash">Ecocash</option>
          <option value="cash">Cash</option>
        </select>
        <div className="mt-4">
          <button
            disabled={!method}
            onClick={() => {
              setStep('form');
              setRows([]);
              setSaved(false);
              if (fileInputRef.current) fileInputRef.current.value = '';
            }}
            className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div id="sales" className="flex flex-col pt-40 px-4 h-screen bg-gray-50">
      <div className="p-4 bg-white shadow flex flex-wrap items-end space-x-4">
        <h1 className="text-xl font-bold">Sales</h1>
        <div className="text-sm text-gray-600">
          POS ID: <span className="font-medium">{posId}</span>
        </div>
        <label className="flex flex-col">
          <span className="text-sm">Currency</span>
          <select
            value={currency}
            onChange={e => {
              setCurrency(e.target.value);
              setRows(rs =>
                rs.map(r => ({
                  ...r,
                  currency: r.currency || e.target.value,
                }))
              );
              setSaved(false);
            }}
            className="p-2 border w-24 rounded"
          >
            <option value="USD">USD</option>
            <option value="ZWG">ZWG</option>
          </select>
        </label>
        {method === 'bank' && (
          <label className="flex flex-col">
            <span className="text-sm">Bank</span>
            <select
              value={bank}
              onChange={e => {
                setBank(e.target.value);
                setSaved(false);
              }}
              className="p-2 border rounded"
            >
              <option value="">--Select a Bank--</option>
              {BANKS.map(b => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </label>
        )}
        <label className="flex flex-col flex-grow min-w-[200px]">
          <span className="text-sm">Upload Excel</span>
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileUpload}
            className="p-2 border rounded"
          />
        </label>
      </div>

      <div className="flex-1 overflow-auto p-4">
        {rows.length === 0 ? (
          <p className="text-gray-500 text-center">No data. Upload an Excel.</p>
        ) : (
          <table className="min-w-full border">
            <thead>
              <tr>
                <th className="border px-2">Date</th>
                {method === 'bank' && <th className="border px-2">POS ID</th>}
                <th className="border px-2">Description</th>
                <th className="border px-2">Amount</th>
                <th className="border px-2">Currency</th>
                {method === 'bank' && <th className="border px-2">Bank</th>}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr key={idx}>
                  <td className="border px-2">
                    <input
                      type="date"
                      value={row.date}
                      onChange={e => {
                        const newRows = [...rows];
                        newRows[idx].date = e.target.value;
                        setRows(newRows);
                        setSaved(false);
                      }}
                      className="w-full"
                    />
                  </td>
                  {method === 'bank' && (
                    <td className="border px-2">
                      <input
                        type="text"
                        value={row.posId}
                        onChange={e => {
                          const newRows = [...rows];
                          newRows[idx].posId = e.target.value;
                          setRows(newRows);
                          setSaved(false);
                        }}
                        className="w-full"
                      />
                    </td>
                  )}
                  <td className="border px-2">
                    <input
                      type="text"
                      value={row.description}
                      onChange={e => {
                        const newRows = [...rows];
                        newRows[idx].description = e.target.value;
                        setRows(newRows);
                        setSaved(false);
                      }}
                      className="w-full"
                    />
                  </td>
                  <td className="border px-2">
                    <input
                      type="number"
                      value={row.amount}
                      onChange={e => {
                        const newRows = [...rows];
                        newRows[idx].amount = e.target.value;
                        setRows(newRows);
                        setSaved(false);
                      }}
                      className="w-full"
                    />
                  </td>
                  <td className="border px-2">
                    <select
                      value={row.currency}
                      onChange={e => {
                        const newRows = [...rows];
                        newRows[idx].currency = e.target.value;
                        setRows(newRows);
                        setSaved(false);
                      }}
                      className="w-full"
                    >
                      <option value="USD">USD</option>
                      <option value="ZWG">ZWG</option>
                    </select>
                  </td>
                  {method === 'bank' && (
                    <td className="border px-2 text-center">
                      {bank}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="p-4 bg-white shadow flex justify-end space-x-3">
        <button
          onClick={onClear}
          className="px-4 py-2 bg-yellow-500 text-white rounded"
        >
          Clear
        </button>
        <button
          onClick={() => {
            setStep('choose');
            setMethod('');
            setRows([]);
            setSaved(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
          }}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          Change Method
        </button>

        {!saved ? (
          <button
            onClick={onSave}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Save
          </button>
        ) : (
          <button
            onClick={() => {
              setStep('choose');
              setMethod('');
              setRows([]);
              setSaved(false);
              if (fileInputRef.current) fileInputRef.current.value = '';
            }}
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            Start Over
          </button>
        )}

        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
        >
          Back
        </button>

        <button
          onClick={() => navigate(`/payments/${posId}/cashbook`, { state: { name } })}
          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
}
