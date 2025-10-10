"use client"

import { useState } from "react"
import AdminLogin from "@/components/admin-login"
import AdminDashboard from "@/components/admin-dashboard"

export default function AdminPage() {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false)

  const handleAdminLogin = () => {
    setIsAdminAuthenticated(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <h2 className="text-2xl font-semibold mb-4">管理者</h2>
        {!isAdminAuthenticated ? <AdminLogin onLogin={handleAdminLogin} /> : <AdminDashboard />}
      </div>
    </div>
  )
}
