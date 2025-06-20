"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Users } from "lucide-react"

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
  participants: Participant[]
  participantCount: number
}

interface ParticipantsListProps {
  event: Event | null
  isOpen: boolean
  onClose: () => void
}

export default function ParticipantsList({ event, isOpen, onClose }: ParticipantsListProps) {
  if (!event) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            {event.name} - 参加者一覧
          </DialogTitle>
          <DialogDescription>{event.participantCount}人が参加予定です</DialogDescription>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[60vh] space-y-3">
          {event.participants.map((participant) => (
            <div
              key={participant.id}
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                participant.isCurrentUser ? "bg-indigo-50 border border-indigo-200" : "bg-gray-50 hover:bg-gray-100"
              }`}
            >
              <Avatar className={`w-10 h-10 ${participant.isCurrentUser ? "ring-2 ring-indigo-400" : ""}`}>
                <AvatarImage src={participant.avatar || "/placeholder.svg"} />
                <AvatarFallback className="bg-gradient-to-br from-indigo-400 to-purple-400 text-white">
                  {participant.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-sm truncate">{participant.name}</p>
                  {participant.isCurrentUser && (
                    <Badge variant="secondary" className="bg-indigo-100 text-indigo-800 text-xs">
                      あなた
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-gray-600">@{participant.nickname}</p>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
