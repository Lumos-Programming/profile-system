"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserCheck, Clock, Shield, Plus, MessageSquare, AlertCircle, Check, X } from "lucide-react"

interface PendingUser {
  id: string
  name: string
  nickname: string
  department: string
  studentId: string
  bio: string
  discordConnected: boolean
  registeredAt: string
}

interface ApprovedUser {
  id: string
  name: string
  nickname: string
  department: string
  roles: string[]
  approvedAt: string
}

interface DiscordUser {
  id: string
  discordId: string
  discordName: string
  joinedAt: string
  registered: boolean
}

const mockPendingUsers: PendingUser[] = [
  {
    id: "1",
    name: "鈴木 一郎",
    nickname: "すずいち",
    department: "情報工学部",
    studentId: "B1234568",
    bio: "新入生です！よろしくお願いします。",
    discordConnected: true,
    registeredAt: "2024-01-15",
  },
  {
    id: "2",
    name: "高橋 美咲",
    nickname: "みさき",
    department: "経済学部",
    studentId: "E2023456",
    bio: "イベント企画に興味があります！",
    discordConnected: false,
    registeredAt: "2024-01-14",
  },
]

const mockApprovedUsers: ApprovedUser[] = [
  {
    id: "1",
    name: "田中 太郎",
    nickname: "たなたろ",
    department: "情報工学部",
    roles: ["2年生", "Web班", "副代表"],
    approvedAt: "2024-01-10",
  },
  {
    id: "2",
    name: "佐藤 花子",
    nickname: "さとはな",
    department: "経済学部",
    roles: ["3年生", "イベント班", "代表"],
    approvedAt: "2024-01-08",
  },
]

const mockDiscordUsers: DiscordUser[] = [
  {
    id: "1",
    discordId: "newuser#1111",
    discordName: "新規ユーザー",
    joinedAt: "2024-01-16",
    registered: false,
  },
  {
    id: "2",
    discordId: "another#2222",
    discordName: "未登録メンバー",
    joinedAt: "2024-01-15",
    registered: false,
  },
]

export default function AdminDashboard() {
  const [pendingUsers, setPendingUsers] = useState(mockPendingUsers)
  const [approvedUsers, setApprovedUsers] = useState(mockApprovedUsers)
  const [newRoleName, setNewRoleName] = useState("")
  const [availableRoles] = useState([
    "1年生",
    "2年生",
    "3年生",
    "4年生",
    "Web班",
    "イベント班",
    "広報班",
    "代表",
    "副代表",
    "会計",
    "書記",
  ])

  const approveUser = (userId: string) => {
    const user = pendingUsers.find((u) => u.id === userId)
    if (user) {
      setPendingUsers((prev) => prev.filter((u) => u.id !== userId))
      setApprovedUsers((prev) => [
        ...prev,
        {
          id: user.id,
          name: user.name,
          nickname: user.nickname,
          department: user.department,
          roles: [],
          approvedAt: new Date().toISOString().split("T")[0],
        },
      ])
    }
  }

  const rejectUser = (userId: string) => {
    setPendingUsers((prev) => prev.filter((u) => u.id !== userId))
  }

  return (
    <div className="space-y-6">
      {/* 統計カード */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">承認待ち</p>
                <p className="text-2xl font-bold">{pendingUsers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <UserCheck className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">承認済み</p>
                <p className="text-2xl font-bold">{approvedUsers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MessageSquare className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Discord未登録</p>
                <p className="text-2xl font-bold">{mockDiscordUsers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Shield className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">ロール数</p>
                <p className="text-2xl font-bold">{availableRoles.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pending" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 rounded-lg">
          <TabsTrigger value="pending" className="rounded-lg">
            承認待ち
          </TabsTrigger>
          <TabsTrigger value="approved" className="rounded-lg">
            承認済み
          </TabsTrigger>
          <TabsTrigger value="discord" className="rounded-lg">
            Discord未登録
          </TabsTrigger>
          <TabsTrigger value="roles" className="rounded-lg">
            ロール管理
          </TabsTrigger>
        </TabsList>

        {/* 承認待ちユーザー */}
        <TabsContent value="pending" className="space-y-4">
          <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-yellow-600" />
                承認待ちユーザー
              </CardTitle>
              <CardDescription>新規登録されたユーザーの承認・拒否を行えます</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {pendingUsers.map((user) => (
                <div key={user.id} className="p-4 border rounded-lg bg-gray-50">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={`/placeholder.svg?height=40&width=40`} />
                        <AvatarFallback className="bg-gradient-to-br from-indigo-400 to-purple-400 text-white">
                          {user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{user.name}</h4>
                          <Badge variant="outline" className="text-xs">
                            @{user.nickname}
                          </Badge>
                          {user.discordConnected ? (
                            <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                              Discord連携済み
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 text-xs">
                              一般モード
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-1">
                          {user.department} • {user.studentId}
                        </p>
                        <p className="text-sm text-gray-700">{user.bio}</p>
                        <p className="text-xs text-gray-500 mt-2">登録日: {user.registeredAt}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => approveUser(user.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Check className="w-4 h-4 mr-1" />
                        承認
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => rejectUser(user.id)}
                        className="border-red-200 text-red-600 hover:bg-red-50"
                      >
                        <X className="w-4 h-4 mr-1" />
                        拒否
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              {pendingUsers.length === 0 && (
                <div className="text-center py-8">
                  <UserCheck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">承認待ちユーザーはいません</h3>
                  <p className="text-gray-500">新規登録があると、ここに表示されます</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 承認済みユーザー */}
        <TabsContent value="approved" className="space-y-4">
          <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-green-600" />
                承認済みユーザー
              </CardTitle>
              <CardDescription>承認されたユーザーのロール管理を行えます</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {approvedUsers.map((user) => (
                <div key={user.id} className="p-4 border rounded-lg bg-gray-50">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={`/placeholder.svg?height=40&width=40`} />
                        <AvatarFallback className="bg-gradient-to-br from-indigo-400 to-purple-400 text-white">
                          {user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium">{user.name}</h4>
                          <Badge variant="outline" className="text-xs">
                            @{user.nickname}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{user.department}</p>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {user.roles.map((role) => (
                            <Badge key={role} variant="secondary" className="text-xs">
                              {role}
                            </Badge>
                          ))}
                        </div>
                        <p className="text-xs text-gray-500">承認日: {user.approvedAt}</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      <Shield className="w-4 h-4 mr-1" />
                      ロール編集
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Discord未登録ユーザー */}
        <TabsContent value="discord" className="space-y-4">
          <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-blue-600" />
                Discord未登録ユーザー
              </CardTitle>
              <CardDescription>Discordに参加しているが、システムに登録されていないユーザー</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockDiscordUsers.map((user) => (
                <div key={user.id} className="p-4 border rounded-lg bg-blue-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <MessageSquare className="w-8 h-8 text-blue-600" />
                      <div>
                        <h4 className="font-medium">{user.discordName}</h4>
                        <p className="text-sm text-gray-600">{user.discordId}</p>
                        <p className="text-xs text-gray-500">参加日: {user.joinedAt}</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                      未登録
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ロール管理 */}
        <TabsContent value="roles" className="space-y-4">
          <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-purple-600" />
                ロール管理
              </CardTitle>
              <CardDescription>ユーザーに割り当て可能なロールを管理します</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 新しいロール追加 */}
              <div className="p-4 border rounded-lg bg-gray-50">
                <div className="flex gap-2">
                  <Input
                    placeholder="新しいロール名"
                    value={newRoleName}
                    onChange={(e) => setNewRoleName(e.target.value)}
                    className="flex-1"
                  />
                  <Button>
                    <Plus className="w-4 h-4 mr-1" />
                    追加
                  </Button>
                </div>
              </div>

              {/* 既存ロール一覧 */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {availableRoles.map((role) => (
                  <div key={role} className="flex items-center justify-between p-2 border rounded-lg bg-white">
                    <span className="text-sm font-medium">{role}</span>
                    <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-red-500 hover:text-red-700">
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
