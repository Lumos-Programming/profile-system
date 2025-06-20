"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Calendar, Clock, Users, ImageIcon, ChevronLeft, ChevronRight, Plus } from "lucide-react"
import EventParticipationForm from "@/components/event-participation-form"
import ParticipantsList from "@/components/participants-list"

interface Participant {
  id: string
  name: string
  nickname: string
  avatar?: string
  isCurrentUser?: boolean
}

interface Event {
  id: string
  name: string
  date: string
  description: string
  images: string[]
  year: string
  visibility: "public" | "discord"
  deadline: string
  isDeadlinePassed: boolean
  isParticipating: boolean
  participantCount: number
  participants: Participant[]
}

const mockEvents: Event[] = [
  {
    id: "1",
    name: "新歓BBQ大会",
    date: "2024-04-15",
    description: "新入生歓迎のBBQ大会を開催します！みんなでワイワイ楽しみましょう🍖",
    images: ["/placeholder.svg?height=300&width=400", "/placeholder.svg?height=300&width=400"],
    year: "2024",
    visibility: "public",
    deadline: "2024-04-10T23:59:59",
    isDeadlinePassed: false,
    isParticipating: true,
    participantCount: 15,
    participants: [
      { id: "1", name: "田中 太郎", nickname: "たなたろ", isCurrentUser: true },
      { id: "2", name: "佐藤 花子", nickname: "さとはな" },
      { id: "3", name: "山田 次郎", nickname: "やまじ" },
      { id: "4", name: "鈴木 一郎", nickname: "すずいち" },
      { id: "5", name: "高橋 美咲", nickname: "みさき" },
      { id: "6", name: "伊藤 健太", nickname: "けんた" },
      { id: "7", name: "渡辺 愛", nickname: "あい" },
    ],
  },
  {
    id: "2",
    name: "プログラミング勉強会",
    date: "2024-03-20",
    description: "React/Next.jsの基礎を学ぶ勉強会です。初心者大歓迎！",
    images: ["/placeholder.svg?height=300&width=400"],
    year: "2023",
    visibility: "discord",
    deadline: "2024-03-18T18:00:00",
    isDeadlinePassed: true,
    isParticipating: false,
    participantCount: 8,
    participants: [
      { id: "1", name: "田中 太郎", nickname: "たなたろ" },
      { id: "3", name: "山田 次郎", nickname: "やまじ" },
      { id: "8", name: "中村 翔", nickname: "しょう" },
    ],
  },
  {
    id: "3",
    name: "文化祭出展準備",
    date: "2024-05-01",
    description: "文化祭での展示準備を行います。みんなで協力して素晴らしい展示を作りましょう！",
    images: [],
    year: "2024",
    visibility: "public",
    deadline: "2024-04-25T23:59:59",
    isDeadlinePassed: false,
    isParticipating: false,
    participantCount: 12,
    participants: [
      { id: "2", name: "佐藤 花子", nickname: "さとはな" },
      { id: "3", name: "山田 次郎", nickname: "やまじ" },
      { id: "9", name: "小林 優", nickname: "ゆう" },
      { id: "10", name: "加藤 美穂", nickname: "みほ" },
    ],
  },
]

export default function EventList() {
  const [selectedYear, setSelectedYear] = useState<string>("all")
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest")
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showParticipationForm, setShowParticipationForm] = useState(false)
  const [showParticipantsList, setShowParticipantsList] = useState(false)

  const years = Array.from(new Set(mockEvents.map((event) => event.year))).sort((a, b) => b.localeCompare(a))

  const filteredEvents = mockEvents
    .filter((event) => selectedYear === "all" || event.year === selectedYear)
    .sort((a, b) => {
      const dateA = new Date(a.date).getTime()
      const dateB = new Date(b.date).getTime()
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB
    })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "short",
    })
  }

  const formatDeadline = (deadlineString: string) => {
    const deadline = new Date(deadlineString)
    return deadline.toLocaleDateString("ja-JP", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const nextImage = () => {
    if (selectedEvent && selectedEvent.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % selectedEvent.images.length)
    }
  }

  const prevImage = () => {
    if (selectedEvent && selectedEvent.images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + selectedEvent.images.length) % selectedEvent.images.length)
    }
  }

  const handleParticipate = (event: Event) => {
    setSelectedEvent(event)
    setShowParticipationForm(true)
  }

  const handleShowParticipants = (event: Event) => {
    setSelectedEvent(event)
    setShowParticipantsList(true)
  }

  return (
    <div className="space-y-6">
      {/* フィルター・ソート */}
      <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calendar className="w-5 h-5 text-indigo-600" />
            イベント一覧
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">年度</label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">すべて</SelectItem>
                  {years.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}年度
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">並び順</label>
              <Select value={sortOrder} onValueChange={(value: "newest" | "oldest") => setSortOrder(value)}>
                <SelectTrigger className="rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">新しい順</SelectItem>
                  <SelectItem value="oldest">古い順</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* イベント一覧 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredEvents.map((event) => (
          <Card
            key={event.id}
            className="border-0 shadow-md bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => setSelectedEvent(event)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg truncate mb-2">{event.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <Calendar className="w-4 h-4" />
                    {formatDate(event.date)}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {event.year}年度
                    </Badge>
                    <Badge variant={event.visibility === "public" ? "default" : "secondary"} className="text-xs">
                      {event.visibility === "public" ? "全体公開" : "Discord限定"}
                    </Badge>
                    {event.isParticipating && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                        参加中
                      </Badge>
                    )}
                  </div>
                </div>
                {event.images.length > 0 && (
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    <img
                      src={event.images[0] || "/placeholder.svg"}
                      alt={event.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-sm text-gray-700 line-clamp-2">{event.description}</p>

              {/* 参加者アイコン表示 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {event.participants.slice(0, 5).map((participant) => (
                      <Avatar
                        key={participant.id}
                        className={`w-8 h-8 border-2 ${
                          participant.isCurrentUser ? "border-indigo-500 ring-2 ring-indigo-200" : "border-white"
                        }`}
                      >
                        <AvatarImage src={participant.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="bg-gradient-to-br from-indigo-400 to-purple-400 text-white text-xs">
                          {participant.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                    {event.participantCount > 5 && (
                      <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center">
                        <Plus className="w-3 h-3 text-gray-600" />
                      </div>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-gray-600 hover:text-gray-800 p-1 h-auto"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleShowParticipants(event)
                    }}
                  >
                    {event.participantCount}人参加
                  </Button>
                </div>

                {!event.isDeadlinePassed ? (
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    締切: {formatDeadline(event.deadline)}
                  </div>
                ) : (
                  <Badge variant="secondary" className="bg-gray-100 text-gray-600 text-xs">
                    募集終了
                  </Badge>
                )}
              </div>

              {!event.isDeadlinePassed && (
                <Button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleParticipate(event)
                  }}
                  className={`w-full rounded-lg ${
                    event.isParticipating ? "bg-orange-600 hover:bg-orange-700" : "bg-indigo-600 hover:bg-indigo-700"
                  }`}
                >
                  {event.isParticipating ? "参加内容を変更" : "参加する"}
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm">
          <CardContent className="text-center py-12">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">イベントが見つかりません</h3>
            <p className="text-gray-500">条件を変更してみてください</p>
          </CardContent>
        </Card>
      )}

      {/* イベント詳細ダイアログ */}
      <Dialog
        open={!!selectedEvent && !showParticipationForm && !showParticipantsList}
        onOpenChange={() => setSelectedEvent(null)}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedEvent && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl">{selectedEvent.name}</DialogTitle>
                <DialogDescription className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {formatDate(selectedEvent.date)}
                  </span>
                  <Badge variant={selectedEvent.visibility === "public" ? "default" : "secondary"}>
                    {selectedEvent.visibility === "public" ? "全体公開" : "Discord限定"}
                  </Badge>
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* 画像ギャラリー */}
                {selectedEvent.images.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="font-medium flex items-center gap-2">
                      <ImageIcon className="w-4 h-4" />
                      イベント画像
                    </h4>
                    <div className="relative">
                      <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={selectedEvent.images[currentImageIndex] || "/placeholder.svg"}
                          alt={`${selectedEvent.name} - ${currentImageIndex + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {selectedEvent.images.length > 1 && (
                        <>
                          <Button
                            variant="outline"
                            size="icon"
                            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm"
                            onClick={prevImage}
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm"
                            onClick={nextImage}
                          >
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                            {currentImageIndex + 1} / {selectedEvent.images.length}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* イベント詳細 */}
                <div className="space-y-4">
                  <h4 className="font-medium">イベント詳細</h4>
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedEvent.description}</p>
                </div>

                {/* 参加者プレビュー */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      参加者 ({selectedEvent.participantCount}人)
                    </h4>
                    <Button variant="outline" size="sm" onClick={() => handleShowParticipants(selectedEvent)}>
                      全員を見る
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedEvent.participants.slice(0, 8).map((participant) => (
                      <div key={participant.id} className="flex items-center gap-2 bg-gray-50 rounded-full px-3 py-1">
                        <Avatar className={`w-6 h-6 ${participant.isCurrentUser ? "ring-2 ring-indigo-400" : ""}`}>
                          <AvatarImage src={participant.avatar || "/placeholder.svg"} />
                          <AvatarFallback className="bg-gradient-to-br from-indigo-400 to-purple-400 text-white text-xs">
                            {participant.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{participant.nickname}</span>
                      </div>
                    ))}
                    {selectedEvent.participantCount > 8 && (
                      <div className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1">
                        <span className="text-sm text-gray-600">他{selectedEvent.participantCount - 8}人</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* 参加ボタン */}
                {!selectedEvent.isDeadlinePassed && (
                  <div className="pt-4 border-t">
                    <Button
                      onClick={() => handleParticipate(selectedEvent)}
                      className={`w-full ${
                        selectedEvent.isParticipating
                          ? "bg-orange-600 hover:bg-orange-700"
                          : "bg-indigo-600 hover:bg-indigo-700"
                      }`}
                    >
                      {selectedEvent.isParticipating ? "参加内容を変更・キャンセル" : "このイベントに参加する"}
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* 参加フォームダイアログ */}
      <EventParticipationForm
        event={selectedEvent}
        isOpen={showParticipationForm}
        onClose={() => {
          setShowParticipationForm(false)
          setSelectedEvent(null)
        }}
      />

      {/* 参加者一覧ダイアログ */}
      <ParticipantsList
        event={selectedEvent}
        isOpen={showParticipantsList}
        onClose={() => {
          setShowParticipantsList(false)
          setSelectedEvent(null)
        }}
      />
    </div>
  )
}
