"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Settings, MessageCircle, Calendar, Shield } from "lucide-react"
import ProfileEdit from "@/components/profile-edit"
import MemberList from "@/components/member-list"
import AdminDashboard from "@/components/admin-dashboard"
import EventList from "@/components/event-list"
import AdminLogin from "@/components/admin-login"

export default function HomePage() {
  const [currentView, setCurrentView] = useState<"profile" | "members" | "admin" | "events">("profile")
  const [userRole] = useState<"user" | "admin">("user") // 実際の実装では認証状態から取得
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false)

  const handleAdminLogin = () => {
    setIsAdminAuthenticated(true)
    setCurrentView("admin")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">🎓 サークルプロフィール</h1>
          <p className="text-gray-600">メンバー同士をつなぐプロフィール管理システム</p>
        </div>

        {/* ナビゲーション */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <Button
            variant={currentView === "profile" ? "default" : "outline"}
            onClick={() => setCurrentView("profile")}
            className="rounded-full"
          >
            <Settings className="w-4 h-4 mr-2" />
            プロフィール
          </Button>
          <Button
            variant={currentView === "members" ? "default" : "outline"}
            onClick={() => setCurrentView("members")}
            className="rounded-full"
          >
            <Users className="w-4 h-4 mr-2" />
            メンバー一覧
          </Button>
          <Button
            variant={currentView === "events" ? "default" : "outline"}
            onClick={() => setCurrentView("events")}
            className="rounded-full"
          >
            <Calendar className="w-4 h-4 mr-2" />
            イベント
          </Button>
          <Button
            variant={currentView === "admin" ? "default" : "outline"}
            onClick={() => setCurrentView("admin")}
            className="rounded-full"
          >
            <Shield className="w-4 h-4 mr-2" />
            管理者
          </Button>
        </div>

        {/* ステータス表示 */}
        <Card className="mb-6 border-0 shadow-md bg-white/80 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-indigo-600" />
                <span className="text-sm font-medium">Discord連携状態:</span>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  サークル内モード
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">承認状態:</span>
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                  承認待ち
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* メインコンテンツ */}
        {currentView === "profile" && <ProfileEdit />}
        {currentView === "members" && <MemberList />}
        {currentView === "events" && <EventList />}
        {currentView === "admin" && (
          <>{!isAdminAuthenticated ? <AdminLogin onLogin={handleAdminLogin} /> : <AdminDashboard />}</>
        )}
      </div>
    </div>
  )
}
