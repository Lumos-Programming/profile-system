"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { MessageSquare, Github } from "lucide-react"
import ReactMarkdown from "react-markdown"

// API から返ってくる一覧用の型（MemberSummary）
interface MemberSummary {
  id: string
  name: string
  nickname: string
  roles: string[]
  avatar?: string
}

// API から返ってくる詳細用の型（MemberDetail）
interface MemberDetail extends MemberSummary {
  department: string
  year: string
  bio: string
  accounts: {
    line: boolean
    discord: boolean
    github: boolean
  }
  links: Array<{
    title: string
    url: string
  }>
  events: Array<{
    name: string
    date: string
    status: "upcoming" | "completed"
  }>
}

const API_BASE_URL = "http://localhost:8080"

export default function MemberList() {
  const [members, setMembers] = useState<MemberSummary[]>([])
  const [selectedMember, setSelectedMember] = useState<MemberDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 一覧を取得
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/members`)
      .then((res) => {
        if (!res.ok) throw new Error("メンバー一覧の取得に失敗しました")
        return res.json()
      })
      .then((data) => {
        setMembers(data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  // 詳細を取得
  const handleMemberClick = async (memberId: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/members/${memberId}`)
      if (!res.ok) throw new Error("メンバー詳細の取得に失敗しました")
      const data = await res.json()
      setSelectedMember(data)
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        <span className="ml-3 text-gray-600 dark:text-gray-400">読み込み中...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{error}</p>
        <p className="text-gray-500 mt-2">バックエンドサーバーが起動しているか確認してください</p>
      </div>
    )
  }

  if (members.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">メンバーが登録されていません</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* メンバーカード一覧 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {members.map((member) => (
          <Card
            key={member.id}
            className="border-0 shadow-md bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all cursor-pointer hover:scale-105 dark:bg-gray-800/80 dark:border-gray-700"
            onClick={() => handleMemberClick(member.id)}
          >
            <CardContent className="p-4 text-center">
              <Avatar className="w-12 h-12 mx-auto mb-3">
                <AvatarImage src={member.avatar || "/placeholder.svg"} />
                <AvatarFallback className="bg-gradient-to-br from-indigo-400 to-purple-400 text-white">
                  {member.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <h3 className="font-medium text-sm truncate mb-1 dark:text-gray-100">{member.name}</h3>
              <p className="text-xs text-gray-600 mb-2 dark:text-gray-400">@{member.nickname}</p>
              <div className="flex flex-wrap gap-1 justify-center">
                {(member.roles ?? []).slice(0, 2).map((role) => (
                  <Badge key={role} variant="secondary" className="text-xs px-1 py-0">
                    {role}
                  </Badge>
                ))}
                {(member.roles ?? []).length > 2 && (
                  <Badge variant="secondary" className="text-xs px-1 py-0">
                    +{member.roles.length - 2}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* メンバー詳細ダイアログ */}
      <Dialog open={!!selectedMember} onOpenChange={() => setSelectedMember(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedMember && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={selectedMember.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="bg-gradient-to-br from-indigo-400 to-purple-400 text-white text-xl">
                      {selectedMember.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <DialogTitle className="text-xl">{selectedMember.name}</DialogTitle>
                    <DialogDescription className="text-base">@{selectedMember.nickname}</DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-6">
                {/* 基本情報 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-800 dark:text-gray-200">学部</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{selectedMember.department}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-800 dark:text-gray-200">学年</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{selectedMember.year}</p>
                  </div>
                </div>

                {/* ロール */}
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-800 dark:text-gray-200">ロール</h4>
                  <div className="flex flex-wrap gap-2">
                    {(selectedMember.roles ?? []).map((role) => (
                      <Badge key={role} variant="secondary">
                        {role}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* 自己紹介 */}
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-800 dark:text-gray-200">自己紹介</h4>
                  <div className="prose prose-sm max-w-none bg-gray-50 p-4 rounded-lg dark:bg-gray-800 dark:text-gray-200">
                    <ReactMarkdown>{selectedMember.bio}</ReactMarkdown>
                  </div>
                </div>

                {/* 連携アカウント */}
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-800 dark:text-gray-200">連携アカウント</h4>
                  <div className="flex gap-3">
                    {selectedMember.accounts.line && (
                      <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg dark:bg-green-900/20">
                        <MessageSquare className="w-4 h-4 text-green-600 dark:text-green-400" />
                        <span className="text-sm dark:text-gray-200">LINE</span>
                      </div>
                    )}
                    {selectedMember.accounts.discord && (
                      <div className="flex items-center gap-2 p-2 bg-indigo-50 rounded-lg dark:bg-indigo-900/20">
                        <MessageSquare className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        <span className="text-sm dark:text-gray-200">Discord</span>
                      </div>
                    )}
                    {selectedMember.accounts.github && (
                      <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg dark:bg-gray-800">
                        <Github className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                        <span className="text-sm dark:text-gray-200">GitHub</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
