"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { UserCheck, Clock, Shield, Plus, MessageSquare, Check, X, Calendar, Users, Settings } from "lucide-react"
import EventCreationForm from "@/components/event-creation-form"

interface User {
  id: string
  name: string
  nickname: string
  department: string
  studentId: string
  year: string
  roles: string[]
  status: "pending" | "approved"
  lineConnected: boolean
  discordConnected: boolean
  registeredAt: string
  approvedAt?: string
}

const mockUsers: User[] = [
  {
    id: "1",
    name: "田中 太郎",
    nickname: "たなたろ",
    department: "情報工学部",
    studentId: "B1234567",
    year: "2年生",
    roles: ["Web班", "副代表"],
    status: "approved",
    lineConnected: true,
    discordConnected: true,
    registeredAt: "2024-01-10",
    approvedAt: "2024-01-10",
  },
  {
    id: "2",
    name: "佐藤 花子",
    nickname: "さとはな",
    department: "経済学部",
    studentId: "E2023456",
    year: "3年生",
    roles: ["イベント班", "代表"],
    status: "approved",
    lineConnected: true,
    discordConnected: true,
    registeredAt: "2024-01-08",
    approvedAt: "2024-01-08",
  },
  {
    id: "3",
    name: "鈴木 一郎",
    nickname: "すずいち",
    department: "情報工学部",
    studentId: "B1234568",
    year: "1年生",
    roles: [],
    status: "pending",
    lineConnected: true,
    discordConnected: true,
    registeredAt: "2024-01-15",
  },
  {
    id: "4",
    name: "高橋 美咲",
    nickname: "みさき",
    department: "経済学部",
    studentId: "E2023457",
    year: "2年生",
    roles: [],
    status: "pending",
    lineConnected: true,
    discordConnected: false,
    registeredAt: "2024-01-14",
  },
]

export default function AdminDashboard() {
  const [users, setUsers] = useState(mockUsers)
  const [showEventForm, setShowEventForm] = useState(false)
  const [visibleColumns, setVisibleColumns] = useState({
    name: true,
    year: true,
    roles: true,
    line: true,
    discord: true,
  })

  const pendingUsers = users.filter((user) => user.status === "pending")
  const approvedUsers = users.filter((user) => user.status === "approved")

  const approveUser = (userId: string) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId
          ? { ...user, status: "approved" as const, approvedAt: new Date().toISOString().split("T")[0] }
          : user,
      ),
    )
  }

  const rejectUser = (userId: string) => {
    setUsers((prev) => prev.filter((user) => user.id !== userId))
  }

  const toggleColumn = (column: keyof typeof visibleColumns) => {
    setVisibleColumns((prev) => ({ ...prev, [column]: !prev[column] }))
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
                <p className="text-sm text-gray-600">総ユーザー数</p>
                <p className="text-2xl font-bold">{users.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">アクティブイベント</p>
                <p className="text-2xl font-bold">3</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 rounded-lg">
          <TabsTrigger value="users" className="rounded-lg flex items-center gap-2">
            <Users className="w-4 h-4" />
            ユーザー管理
          </TabsTrigger>
          <TabsTrigger value="events" className="rounded-lg flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            イベント追加
          </TabsTrigger>
        </TabsList>

        {/* ユーザー管理タブ */}
        <TabsContent value="users" className="space-y-6">
          {/* 表示カラム設定 */}
          <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-gray-600" />
                表示設定
              </CardTitle>
              <CardDescription>表示するカラムを選択してください</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="name" checked={visibleColumns.name} onCheckedChange={() => toggleColumn("name")} />
                  <label htmlFor="name" className="text-sm font-medium">
                    名前
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="year" checked={visibleColumns.year} onCheckedChange={() => toggleColumn("year")} />
                  <label htmlFor="year" className="text-sm font-medium">
                    学年
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="roles" checked={visibleColumns.roles} onCheckedChange={() => toggleColumn("roles")} />
                  <label htmlFor="roles" className="text-sm font-medium">
                    ロール
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="line" checked={visibleColumns.line} onCheckedChange={() => toggleColumn("line")} />
                  <label htmlFor="line" className="text-sm font-medium">
                    LINE連携
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="discord"
                    checked={visibleColumns.discord}
                    onCheckedChange={() => toggleColumn("discord")}
                  />
                  <label htmlFor="discord" className="text-sm font-medium">
                    Discord連携
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ユーザー一覧テーブル */}
          <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-600" />
                ユーザー一覧
              </CardTitle>
              <CardDescription>全ユーザーの管理を行えます</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>アバター</TableHead>
                      {visibleColumns.name && <TableHead>名前</TableHead>}
                      {visibleColumns.year && <TableHead>学年</TableHead>}
                      {visibleColumns.roles && <TableHead>ロール</TableHead>}
                      {visibleColumns.line && <TableHead>LINE</TableHead>}
                      {visibleColumns.discord && <TableHead>Discord</TableHead>}
                      <TableHead>操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={`/placeholder.svg?height=32&width=32`} />
                            <AvatarFallback className="bg-gradient-to-br from-indigo-400 to-purple-400 text-white text-xs">
                              {user.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                        </TableCell>
                        {visibleColumns.name && (
                          <TableCell>
                            <div>
                              <p className="font-medium text-sm">{user.name}</p>
                              <p className="text-xs text-gray-600">@{user.nickname}</p>
                            </div>
                          </TableCell>
                        )}
                        {visibleColumns.year && (
                          <TableCell>
                            <Badge variant="outline" className="text-xs">
                              {user.year}
                            </Badge>
                          </TableCell>
                        )}
                        {visibleColumns.roles && (
                          <TableCell>
                            {user.status === "pending" ? (
                              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 text-xs">
                                承認待ち
                              </Badge>
                            ) : (
                              <div className="flex flex-wrap gap-1">
                                {user.roles.map((role) => (
                                  <Badge key={role} variant="secondary" className="text-xs">
                                    {role}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </TableCell>
                        )}
                        {visibleColumns.line && (
                          <TableCell>
                            <Badge
                              variant={user.lineConnected ? "default" : "secondary"}
                              className={`text-xs ${
                                user.lineConnected ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {user.lineConnected ? "連携済み" : "未連携"}
                            </Badge>
                          </TableCell>
                        )}
                        {visibleColumns.discord && (
                          <TableCell>
                            <Badge
                              variant={user.discordConnected ? "default" : "secondary"}
                              className={`text-xs ${
                                user.discordConnected ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {user.discordConnected ? "連携済み" : "未連携"}
                            </Badge>
                          </TableCell>
                        )}
                        <TableCell>
                          {user.status === "pending" ? (
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                onClick={() => approveUser(user.id)}
                                className="bg-green-600 hover:bg-green-700 h-7 px-2"
                              >
                                <Check className="w-3 h-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => rejectUser(user.id)}
                                className="border-red-200 text-red-600 hover:bg-red-50 h-7 px-2"
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                          ) : (
                            <Button size="sm" variant="outline" className="h-7 px-2">
                              <Shield className="w-3 h-3 mr-1" />
                              編集
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* イベント追加タブ */}
        <TabsContent value="events" className="space-y-6">
          <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-600" />
                イベント管理
              </CardTitle>
              <CardDescription>新しいイベントの作成・既存イベントの管理を行えます</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={() => setShowEventForm(true)} className="w-full md:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                新しいイベントを作成
              </Button>

              {/* 既存イベント一覧 */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-800">既存イベント</h4>

                <div className="p-4 border rounded-lg bg-gray-50">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h4 className="font-medium mb-1">新歓BBQ大会</h4>
                      <p className="text-sm text-gray-600 mb-2">2024年4月15日 開催</p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary" className="text-xs">
                          15人参加
                        </Badge>
                        <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                          募集中
                        </Badge>
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                          全体公開
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        編集
                      </Button>
                      <Button size="sm" variant="outline">
                        参加者確認
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg bg-gray-50">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h4 className="font-medium mb-1">プログラミング勉強会</h4>
                      <p className="text-sm text-gray-600 mb-2">2024年3月20日 開催</p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary" className="text-xs">
                          8人参加
                        </Badge>
                        <Badge variant="secondary" className="bg-gray-100 text-gray-600 text-xs">
                          募集終了
                        </Badge>
                        <Badge variant="secondary" className="bg-purple-100 text-purple-800 text-xs">
                          Discord限定
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        編集
                      </Button>
                      <Button size="sm" variant="outline">
                        参加者確認
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg bg-gray-50">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h4 className="font-medium mb-1">文化祭出展準備</h4>
                      <p className="text-sm text-gray-600 mb-2">2024年5月1日 開催</p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary" className="text-xs">
                          12人参加
                        </Badge>
                        <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                          募集中
                        </Badge>
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                          全体公開
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        編集
                      </Button>
                      <Button size="sm" variant="outline">
                        参加者確認
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* イベント作成フォーム */}
      <EventCreationForm isOpen={showEventForm} onClose={() => setShowEventForm(false)} />
    </div>
  )
}
