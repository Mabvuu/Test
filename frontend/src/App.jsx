// src/App.jsx
import React, { useState } from 'react'
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

import Login from './Login'
import WelcomePage from './components/WelcomePage'
import TenantPage from './pages/TenantPage'
import Reports from './components/Reports'
import Cashbook from './components/Cashbook'
import PaymentsPage from './components/Payments'
import AdminDashboard from './components/AdminDashboard'
import AdminNav from './components/AdminNav'
import AgentNav from './components/Navbar'
import Sales from './components/SalesOne'

const DesktopGuard = ({ children }) => {
  const isDesktop = window.innerWidth >= 768
  if (!isDesktop) {
    return (
      <div className="flex items-center justify-center h-screen text-center px-4">
        <p className="text-lg font-semibold">
          This site is only accessible on desktop screens. Please switch to
          a device with a width of at least 768px.
        </p>
      </div>
    )
  }
  return children
}

const App = () => {
  const [user, setUser] = useState({ token: null, isAdmin: false })

  const handleLogout = () =>
    setUser({ token: null, isAdmin: false })

  return (
    <Router>
      {user.token && user.isAdmin && <AdminNav />}
      {user.token && !user.isAdmin && <AgentNav />}

      <Routes>
        <Route
          path="/"
          element={
            user.token ? (
              <WelcomePage onLogout={handleLogout} />
            ) : (
              <Login
                setToken={(t) =>
                  setUser(u => ({ ...u, token: t }))
                }
                setIsAdmin={(flag) =>
                  setUser(u => ({ ...u, isAdmin: flag }))
                }
              />
            )
          }
        />

        <Route
          path="/*"
          element={
            <DesktopGuard>
              {user.token ? (
                <Routes>
                  <Route path="tenants" element={<TenantPage />} />
                  <Route path="tenants/:posId" element={<TenantPage />} /> 
                 <Route path="payments/:posId" element={<PaymentsPage />} />
                  <Route path="payments/:posId/cashbook" element={<Cashbook/>} />
                  <Route path="payments/:posId/sales" element={<Sales/>} />
                  <Route path="reports" element={<Reports />} />
                  <Route
                    path="add"
                    element={
                      user.isAdmin
                        ? <AdminDashboard />
                        : <Navigate to="/" replace />
                    }
                  />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              ) : (
                <Navigate to="/" replace />
              )}
            </DesktopGuard>
          }
        />
      </Routes>
    </Router>
  )
}

export default App
