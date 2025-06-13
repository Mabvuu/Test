// src/components/AdminDashboard.jsx
import React, { useState, useRef } from 'react';

const AdminDashboard = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [managers, setManagers] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const idCounter = useRef(1);

  const resetForm = () => {
    setName('');
    setEmail('');
    setEditIndex(null);
  };

  const handleAddOrEdit = () => {
    setMessage('');
    setError('');
    if (!name.trim() || !email.trim()) {
      setError('Name and email are required.');
      return;
    }
    if (editIndex === null) {
      // add
      if (managers.some(m => m.email === email)) {
        setError('Email already in use.');
        return;
      }
      const newMgr = {
        id_number: idCounter.current++,
        name: name.trim(),
        email: email.trim(),
      };
      setManagers([...managers, newMgr]);
      setMessage('Manager added.');
    } else {
      // edit
      const duplicate = managers.some(
        (m, i) => m.email === email && i !== editIndex
      );
      if (duplicate) {
        setError('Email already in use.');
        return;
      }
      const updated = managers.map((m, i) =>
        i === editIndex ? { ...m, name: name.trim(), email: email.trim() } : m
      );
      setManagers(updated);
      setMessage('Manager updated.');
    }
    resetForm();
  };

  const handleDelete = i => {
    setMessage('');
    setError('');
    const updated = managers.filter((_, idx) => idx !== i);
    setManagers(updated);
    setMessage('Manager removed.');
    // if you were editing this one, reset form
    if (editIndex === i) resetForm();
  };

  const startEdit = i => {
    const m = managers[i];
    setEditIndex(i);
    setName(m.name);
    setEmail(m.email);
    setMessage('');
    setError('');
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto py-8 space-y-8">
        {/* Form */}
        <section className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl text-gray-800 mb-4">
            {editIndex !== null ? 'Edit Manager' : 'Add New Manager'}
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Full name"
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <button
              onClick={handleAddOrEdit}
              className="mt-2 bg-green-600 text-white rounded px-4 py-2"
            >
              {editIndex !== null ? 'Update' : 'Add'}
            </button>
            {message && <p className="text-green-600 mt-2 text-sm">{message}</p>}
            {error && <p className="text-red-600 mt-2 text-sm">{error}</p>}
          </div>
        </section>

        {/* List */}
        <section className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl text-gray-800 mb-4">Account Managers</h2>
          {managers.length === 0 ? (
            <p className="text-gray-600">No managers yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-gray-800">
                <thead>
                  <tr>
                    <th className="py-2 px-3 text-left border-b">Name</th>
                    <th className="py-2 px-3 text-left border-b">Email</th>
                    <th className="py-2 px-3 text-left border-b">ID</th>
                    <th className="py-2 px-3 text-left border-b">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {managers.map((m, i) => (
                    <tr key={m.id_number}>
                      <td className="py-2 px-3 border-b">{m.name}</td>
                      <td className="py-2 px-3 border-b">{m.email}</td>
                      <td className="py-2 px-3 border-b">{m.id_number}</td>
                      <td className="py-2 px-3 border-b space-x-2">
                        <button onClick={() => startEdit(i)} className="text-green-600">
                          Edit
                        </button>
                        <button onClick={() => handleDelete(i)} className="text-red-600">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;
