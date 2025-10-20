"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { MessageSquare, Github } from "lucide-react"
import ReactMarkdown from "react-markdown"

interface Member {
  id: string
  name: string
  nickname: string
  department: string
  year: string
  roles: string[]
  bio: string
  avatar?: string
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

const mockMembers: Member[] = [
  {
    id: "1",
    name: "田中 太郎",
    nickname: "たなたろ",
    department: "情報工学部",
    year: "2年生",
    roles: ["Web班", "副代表"],
    bio: `# 自己紹介

プログラミングが好きな2年生です！

## 興味のある分野
- **Webアプリ開発**
- **機械学習**
- **UI/UXデザイン**

よろしくお願いします！ 🚀`,
    accounts: { line: true, discord: true, github: true },
    links: [
      { title: "個人ブログ", url: "https://tanaka-blog.com" },
      { title: "ポートフォリオ", url: "https://tanaka-portfolio.dev" },
    ],
    events: [
      { name: "新歓BBQ大会", date: "2024-04-15", status: "upcoming" },
      { name: "冬合宿", date: "2024-02-10", status: "completed" },
    ],
  },
  {
    id: "2",
    name: "佐藤 花子",
    nickname: "さとはな",
    department: "経済学部",
    year: "3年生",
    roles: ["イベント班", "代表"],
    bio: "イベント企画が大好きです！みんなで楽しい思い出を作りましょう✨",
    accounts: { line: true, discord: true, github: false },
    links: [],
    events: [{ name: "文化祭出展準備", date: "2024-05-01", status: "upcoming" }],
  },
  {
    id: "3",
    name: "山田 次郎",
    nickname: "やまじ",
    department: "理学部",
    year: "1年生",
    roles: ["新入生"],
    bio: "新入生です！よろしくお願いします🌟",
    accounts: { line: true, discord: true, github: false },
    links: [],
    events: [{ name: "新歓BBQ大会", date: "2024-04-15", status: "upcoming" }],
  },
  {
    id: "4",
    name: "鈴木 一郎",
    nickname: "すずいち",
    department: "情報工学部",
    year: "1年生",
    roles: ["新入生"],
    bio: "プログラミング初心者ですが、頑張ります！",
    accounts: { line: true, discord: true, github: true },
    links: [],
    events: [{ name: "新歓BBQ大会", date: "2024-04-15", status: "upcoming" }],
  },
  {
    id: "5",
    name: "高橋 美咲",
    nickname: "みさき",
    department: "経済学部",
    year: "2年生",
    roles: ["広報班"],
    bio: "SNS運用とデザインが得意です📱",
    accounts: { line: true, discord: true, github: false },
    links: [{ title: "Instagram", url: "https://instagram.com/misaki" }],
    events: [],
  },
  {
    id: "6",
    name: "伊藤 健太",
    nickname: "けんた",
    department: "情報工学部",
    year: "4年生",
    roles: ["4年生", "技術顧問"],
    bio: "卒業研究でAI開発をしています。技術的な質問はお気軽に！",
    accounts: { line: true, discord: true, github: true },
    links: [{ title: "研究室ページ", url: "https://lab.example.com" }],
    events: [],
  },
]

export default function MemberList() {
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)

  const filteredMembers = mockMembers

  return (
    <div className="space-y-6">
      {/* メンバーカード一覧 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filteredMembers.map((member) => (
          <Card
            key={member.id}
            className="border-0 shadow-md bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all cursor-pointer hover:scale-105 dark:bg-gray-800/80 dark:border-gray-700"
            onClick={() => setSelectedMember(member)}
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
                {member.roles.slice(0, 2).map((role) => (
                  <Badge key={role} variant="secondary" className="text-xs px-1 py-0">
                    {role}
                  </Badge>
                ))}
                {member.roles.length > 2 && (
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
                    {selectedMember.roles.map((role) => (
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
