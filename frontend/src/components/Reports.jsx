// src/components/Reports.jsx
import React, { useState, useEffect, useMemo } from 'react'

const mockReportsData = [
  {
    id: 1,
    date: new Date('2025-06-01'),
    source: 'cashbook',
    tenant: 'Acme Corp',
    bank: 'First National',
    count: 3,
    data: [
      { Date: '2025-06-01', Amount: 100, Bank: 'First National' },
      { Date: '2025-06-02', Amount: 200, Bank: 'First National' },
      { Date: '2025-06-03', Amount: 150, Bank: 'First National' },
    ],
  },
  {
    id: 2,
    date: new Date('2025-06-05'),
    source: 'payments',
    tenant: 'Wayne Enterprises',
    bank: 'Gotham Bank',
    count: 2,
    data: [
      { Date: '2025-06-04', Amount: 300, Bank: 'Gotham Bank' },
      { Date: '2025-06-05', Amount: 400, Bank: 'Gotham Bank' },
    ],
  },
]

export default function Reports() {
  const [reports, setReports]           = useState([])
  const [loading, setLoading]           = useState(true)
  const [filterSource, setFilterSource] = useState('all')    // 'all' | 'cashbook' | 'payments'
  const [searchText, setSearchText]     = useState('')
  const [modalReport, setModalReport]   = useState(null)
  const [notification, setNotification] = useState(null)

  // simulate fetch on mount
  useEffect(() => {
    setTimeout(() => {
      setReports(mockReportsData)
      setLoading(false)
    }, 500) // half-second “load”
  }, [])

  const filtered = useMemo(() => {
    return reports
      .filter(r => filterSource === 'all' || r.source === filterSource)
      .filter(r => r.tenant.toLowerCase().includes(searchText.toLowerCase()))
  }, [reports, filterSource, searchText])

  const fmtDate = dt => dt.toLocaleDateString()
  const openModal  = rpt => setModalReport(rpt)
  const closeModal = ()  => setModalReport(null)

  const deleteReport = id => {
    setReports(rs => rs.filter(r => r.id !== id))
    setNotification({ msg: 'Report deleted', type: 'success' })
    closeModal()
  }

  if (loading) return <p className="p-6 text-center">Loading…</p>
  // error never happens in this simulation

  return (
    <div className="container mx-auto pt-35 px-4 p-6 space-y-6">
      {notification && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
          <div className={`pointer-events-auto p-4 rounded shadow-lg ${
            notification.type === 'success' ? 'bg-green-100' : 'bg-red-100'
          }`}>
            <div className="flex justify-between items-center">
              <span>{notification.msg}</span>
              <button onClick={() => setNotification(null)} className="ml-4 font-bold">×</button>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Reports</h1>
        <button
          onClick={() => window.history.back()}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
        >
          ← Back
        </button>
      </div>

      <div className="flex flex-wrap items-center space-x-4">
        <input
          type="text"
          placeholder="Search tenant…"
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          className="border rounded px-3 py-2 flex-grow max-w-sm"
        />
        <select
          value={filterSource}
          onChange={e => setFilterSource(e.target.value)}
          className="border w-32 rounded px-3 py-2"
        >
          <option value="all">All Sources</option>
          <option value="cashbook">Cashbook</option>
          <option value="payments">Payments</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse shadow-sm">
          <thead>
            <tr className="bg-gray-100">
              {['Date','Tenant','Bank','Count','Source','Actions'].map(h => (
                <th key={h} className="border px-4 py-2 text-left text-sm font-medium">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="border px-4 py-6 text-center text-gray-500">
                  No reports found.
                </td>
              </tr>
            )}
            {filtered.map(r => (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{fmtDate(r.date)}</td>
                <td className="border px-4 py-2">{r.tenant}</td>
                <td className="border px-4 py-2">{r.bank}</td>
                <td className="border px-4 py-2">{r.count}</td>
                <td className="border px-4 py-2 capitalize">{r.source}</td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => openModal(r)}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalReport && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[80vh] overflow-auto">
            <div className="flex justify-between items-center border-b px-6 py-4">
              <h2 className="text-xl font-semibold">Report Details</h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => deleteReport(modalReport.id)}
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                >
                  Delete
                </button>
                <button
                  onClick={closeModal}
                  className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm"
                >
                  Close
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <p><strong>Date:</strong> {fmtDate(modalReport.date)}</p>
              <p><strong>Tenant:</strong> {modalReport.tenant}</p>
              <p><strong>Bank:</strong> {modalReport.bank}</p>
              <p><strong>Source:</strong> {modalReport.source}</p>
              <p><strong>Records:</strong> {modalReport.count}</p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      {modalReport.data.length > 0 &&
                        Object.keys(modalReport.data[0]).map(col => (
                          <th key={col} className="border px-3 py-2 text-left">
                            {col}
                          </th>
                        ))}
                    </tr>
                  </thead>
                  <tbody>
                    {modalReport.data.map((row, i) => (
                      <tr key={i} className="hover:bg-gray-50">
                        {Object.values(row).map((val, j) => (
                          <td key={j} className="border px-3 py-1">
                            {val}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
