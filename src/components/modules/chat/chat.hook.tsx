import { MessageContent } from '@/common'
import { useState } from 'react'

export const useChatHook = () => {
  const [messages, setMessages] = useState<MessageContent[]>([])
  const [isThinking, setIsThinking] = useState(false)

  const send = (payload: string) => {
    const message: MessageContent = {
      content: payload,
      sender: 'user',
      ts: Date.now(),
    }
    setMessages((prev) => [...prev, message])
  }

  return [messages, isThinking, send] as const
}
