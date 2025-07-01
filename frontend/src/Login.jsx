// src/Login.jsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login({ setToken, setIsAdmin }) {
  const [view, setView] = useState('admin') // 'admin' or 'manager'
  const [adminEmail, setAdminEmail] = useState('')
  const [adminPassword, setAdminPassword] = useState('')
  const [managerEmail, setManagerEmail] = useState('')
  const [idNumber, setIdNumber] = useState('')
  const navigate = useNavigate()

  const submitAdmin = () => {
    // simulate admin login
    setToken('mockToken')
    setIsAdmin(true)
    navigate('/add')
  }

  const submitManager = () => {
    // simulate manager login
    setToken('mockToken')
    setIsAdmin(false)
    navigate('/tenants')
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f5f5f5] text-gray-700">
      <div className="flex space-x-4 mb-6">
       <button
          onClick={() => setView('admin')}
          className={`px-4 py-2 rounded-md font-semibold border border-white ${
            view === 'admin' ? 'bg-[#4F5862] text-white' : 'bg-[#8A9A57] text-white'
          }`}
        >
          ADMIN
        </button>
        <button
          onClick={() => setView('manager')}
          className={`px-4 py-2 rounded-md font-semibold border border-white ${
            view === 'manager' ? 'bg-[#4F5862] text-white' : 'bg-[#8A9A57] text-white'
          }`}
        >
          ACCOUNT MANAGER
        </button>
      </div>

      {view === 'admin' ? (
        <div className="w-full max-w-sm bg-[#808000] rounded-lg shadow-md p-6">
          <div className="rounded-full border-4 border-white border-double p-1">
            <img src="/Test/images/logo1.png" alt="Logo" className="h-36 w-36" />
          </div>
          <h1 className="text-2xl font-bold text-center text-white">
            ADMIN LOGIN
          </h1>
          <div className="mb-4">
            <label htmlFor="adminEmail" className="block mb-2 text-white">
              Email
            </label>
            <input
              id="adminEmail"
              type="email"
              placeholder="Enter your email"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#6B8E23]"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="adminPassword" className="block mb-2 text-white">
              Password
            </label>
            <input
              id="adminPassword"
              type="password"
              placeholder="Enter your password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#6B8E23]"
            />
          </div>
          <button
            onClick={submitAdmin}
            className="w-full bg-white text-[#6E7881] hover:text-[#ffffff]  py-2 rounded-md hover:bg-[#556B2F] transition-colors"
          >
            LOGIN
          </button>
        </div>
      ) : (
        <div className="w-full max-w-sm bg-white rounded-lg shadow-md p-6">
          <div className="rounded-full border-4 border-[#4F5862] border-double p-1">
    <img
      src="/images/logo1.png"
      alt="Logo"
      className="h-36 w-36 rounded-full"
    />
  </div>
         <h1 className="text-2xl font-bold text-center mb-6 pt-4 text-[#4F5862]">
            ACCOUNT MANAGER LOGIN
          </h1>
          <div className="mb-4">
            <label htmlFor="managerEmail" className="block mb-2 text-gray-700">
              Email
            </label>
            <input
              id="managerEmail"
              type="email"
              placeholder="Enter your email"
              value={managerEmail}
              onChange={(e) => setManagerEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#6B8E23]"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="idNumber" className="block mb-2 text-gray-700">
              ID Number
            </label>
            <input
              id="idNumber"
              type="text"
              placeholder="Enter your ID number"
              value={idNumber}
              onChange={(e) => setIdNumber(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#6B8E23]"
            />
          </div>
          <button
            onClick={submitManager}
            className="w-full bg-[#8A9A57] text-white py-2 rounded-md hover:bg-[#556B2F] transition-colors"
          >
            LOGIN
          </button>
        </div>
      )}
    </div>
  )
}
