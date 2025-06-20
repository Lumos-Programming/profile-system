"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar, Send, X } from "lucide-react"

interface Event {
  id: string
  name: string
  isParticipating: boolean
}

interface EventParticipationFormProps {
  event: Event | null
  isOpen: boolean
  onClose: () => void
}

export default function EventParticipationForm({ event, isOpen, onClose }: EventParticipationFormProps) {
  const [formData, setFormData] = useState({
    reason: "",
    comment: "",
    dietary: "",
    transportation: "",
    emergency: false,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // フォーム送信処理
    console.log("Form submitted:", formData)
    onClose()
  }

  const handleCancel = () => {
    // キャンセル処理
    onClose()
  }

  if (!event) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            {event.name} - 参加申し込み
          </DialogTitle>
          <DialogDescription>
            {event.isParticipating
              ? "参加内容の変更・キャンセルができます"
              : "以下の項目を入力して参加申し込みを行ってください"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 参加理由 */}
          <div className="space-y-2">
            <Label htmlFor="reason" className="flex items-center gap-1">
              参加理由
              <span className="text-red-500">*</span>
            </Label>
            <Input
              id="reason"
              value={formData.reason}
              onChange={(e) => setFormData((prev) => ({ ...prev, reason: e.target.value }))}
              placeholder="このイベントに参加したい理由を教えてください"
              className="rounded-lg"
              required
            />
          </div>

          {/* 意気込み・コメント */}
          <div className="space-y-2">
            <Label htmlFor="comment">意気込み・コメント</Label>
            <Textarea
              id="comment"
              value={formData.comment}
              onChange={(e) => setFormData((prev) => ({ ...prev, comment: e.target.value }))}
              placeholder="イベントへの意気込みや、主催者へのメッセージがあれば入力してください"
              className="rounded-lg min-h-[100px]"
            />
          </div>

          {/* 食事制限 */}
          <div className="space-y-2">
            <Label htmlFor="dietary">食事制限・アレルギー</Label>
            <Select
              value={formData.dietary}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, dietary: value }))}
            >
              <SelectTrigger className="rounded-lg">
                <SelectValue placeholder="該当するものを選択してください" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">特になし</SelectItem>
                <SelectItem value="vegetarian">ベジタリアン</SelectItem>
                <SelectItem value="vegan">ビーガン</SelectItem>
                <SelectItem value="halal">ハラル</SelectItem>
                <SelectItem value="allergy">アレルギーあり（詳細は別途連絡）</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 交通手段 */}
          <div className="space-y-2">
            <Label htmlFor="transportation">交通手段</Label>
            <Select
              value={formData.transportation}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, transportation: value }))}
            >
              <SelectTrigger className="rounded-lg">
                <SelectValue placeholder="当日の交通手段を選択してください" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="train">電車</SelectItem>
                <SelectItem value="car">自家用車</SelectItem>
                <SelectItem value="bicycle">自転車</SelectItem>
                <SelectItem value="walk">徒歩</SelectItem>
                <SelectItem value="other">その他</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 緊急連絡先 */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="emergency"
              checked={formData.emergency}
              onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, emergency: !!checked }))}
            />
            <Label htmlFor="emergency" className="text-sm">
              緊急時の連絡先として、登録済みのLINEアカウントの使用に同意します
            </Label>
          </div>

          {/* ボタン */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            {event.isParticipating && (
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="border-red-200 text-red-600 hover:bg-red-50"
              >
                <X className="w-4 h-4 mr-2" />
                参加をキャンセル
              </Button>
            )}
            <Button variant="outline" onClick={onClose}>
              閉じる
            </Button>
            <Button type="submit">
              <Send className="w-4 h-4 mr-2" />
              {event.isParticipating ? "変更を保存" : "参加申し込み"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
