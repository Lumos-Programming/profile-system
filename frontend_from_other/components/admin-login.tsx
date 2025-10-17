"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield, Eye, EyeOff } from "lucide-react"

interface AdminLoginProps {
  onLogin: () => void
}

export default function AdminLogin({ onLogin }: AdminLoginProps) {
  const [credentials, setCredentials] = useState({
    id: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()

    // 簡単な認証チェック（実際の実装では適切な認証を行う）
    if (credentials.id === "admin" && credentials.password === "password") {
      onLogin()
      setError("")
    } else {
      setError("IDまたはパスワードが正しくありません")
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-md border-0 shadow-lg bg-white/90 backdrop-blur-sm">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-xl">管理者ログイン</CardTitle>
          <CardDescription>管理者機能にアクセスするには認証が必要です</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="adminId">管理者ID</Label>
              <Input
                id="adminId"
                type="text"
                value={credentials.id}
                onChange={(e) => setCredentials((prev) => ({ ...prev, id: e.target.value }))}
                className="rounded-lg"
                placeholder="管理者IDを入力"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="adminPassword">パスワード</Label>
              <div className="relative">
                <Input
                  id="adminPassword"
                  type={showPassword ? "text" : "password"}
                  value={credentials.password}
                  onChange={(e) => setCredentials((prev) => ({ ...prev, password: e.target.value }))}
                  className="rounded-lg pr-10"
                  placeholder="パスワードを入力"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
            </div>

            {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</div>}

            <Button type="submit" className="w-full rounded-lg">
              <Shield className="w-4 h-4 mr-2" />
              ログイン
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
