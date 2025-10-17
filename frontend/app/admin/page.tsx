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
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                <h1 className="text-3xl font-bold mb-6">管理者ページ</h1>
                {!isAdminAuthenticated ? <AdminLogin onLogin={handleAdminLogin} /> : <AdminDashboard />}
            </div>
        </div>
    )
}
