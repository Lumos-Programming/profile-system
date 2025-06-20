"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Users, Search, MessageSquare, Github, LinkIcon, Calendar } from "lucide-react"
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
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)

  const filteredMembers = mockMembers.filter(
    (member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.nickname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.roles.some((role) => role.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  return (
    <div className="space-y-6">
      {/* 検索・フィルター */}
      <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Users className="w-5 h-5 text-indigo-600" />
            メンバー一覧
          </CardTitle>
          <CardDescription>サークルメンバーのプロフィールを確認できます</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="名前、ニックネーム、学部、ロールで検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 rounded-lg"
            />
          </div>
        </CardContent>
      </Card>

      {/* メンバーカード一覧 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filteredMembers.map((member) => (
          <Card
            key={member.id}
            className="border-0 shadow-md bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all cursor-pointer hover:scale-105"
            onClick={() => setSelectedMember(member)}
          >
            <CardContent className="p-4 text-center">
              <Avatar className="w-12 h-12 mx-auto mb-3">
                <AvatarImage src={member.avatar || "/placeholder.svg"} />
                <AvatarFallback className="bg-gradient-to-br from-indigo-400 to-purple-400 text-white">
                  {member.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <h3 className="font-medium text-sm truncate mb-1">{member.name}</h3>
              <p className="text-xs text-gray-600 mb-2">@{member.nickname}</p>
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

      {filteredMembers.length === 0 && (
        <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm">
          <CardContent className="text-center py-12">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">メンバーが見つかりません</h3>
            <p className="text-gray-500">検索条件を変更してみてください</p>
          </CardContent>
        </Card>
      )}

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
                    <h4 className="font-medium text-gray-800">学部</h4>
                    <p className="text-sm text-gray-600">{selectedMember.department}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-800">学年</h4>
                    <p className="text-sm text-gray-600">{selectedMember.year}</p>
                  </div>
                </div>

                {/* ロール */}
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-800">ロール</h4>
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
                  <h4 className="font-medium text-gray-800">自己紹介</h4>
                  <div className="prose prose-sm max-w-none bg-gray-50 p-4 rounded-lg">
                    <ReactMarkdown>{selectedMember.bio}</ReactMarkdown>
                  </div>
                </div>

                {/* 連携アカウント */}
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-800">連携アカウント</h4>
                  <div className="flex gap-3">
                    {selectedMember.accounts.line && (
                      <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                        <MessageSquare className="w-4 h-4 text-green-600" />
                        <span className="text-sm">LINE</span>
                      </div>
                    )}
                    {selectedMember.accounts.discord && (
                      <div className="flex items-center gap-2 p-2 bg-indigo-50 rounded-lg">
                        <MessageSquare className="w-4 h-4 text-indigo-600" />
                        <span className="text-sm">Discord</span>
                      </div>
                    )}
                    {selectedMember.accounts.github && (
                      <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                        <Github className="w-4 h-4 text-gray-700" />
                        <span className="text-sm">GitHub</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* リンク */}
                {selectedMember.links.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-800">お気に入りリンク</h4>
                    <div className="space-y-2">
                      {selectedMember.links.map((link, index) => (
                        <a
                          key={index}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <LinkIcon className="w-4 h-4 text-gray-600" />
                          <span className="text-sm font-medium">{link.title}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* 参加イベント */}
                {selectedMember.events.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-800">参加イベント</h4>
                    <div className="space-y-2">
                      {selectedMember.events.map((event, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-600" />
                            <div>
                              <p className="text-sm font-medium">{event.name}</p>
                              <p className="text-xs text-gray-600">{event.date}</p>
                            </div>
                          </div>
                          <Badge
                            variant="secondary"
                            className={
                              event.status === "upcoming" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"
                            }
                          >
                            {event.status === "upcoming" ? "参加予定" : "参加済み"}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
