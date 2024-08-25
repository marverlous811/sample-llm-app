import { MessageContent } from '@/common'
import { ChatBotEvent, ChatBotEventType, IChatBotService } from '@/services'
import { useCallback, useEffect, useState } from 'react'

export const useChatHook = (service: IChatBotService) => {
  const [messages, setMessages] = useState<MessageContent[]>([])
  const [isThinking, setIsThinking] = useState(false)

  useEffect(() => {
    let id = service.subcribe(onChatBotEvent)

    return () => {
      service.unSubcribe(id)
    }
  })

  const onChatBotEvent = useCallback((event: ChatBotEvent) => {
    switch (event.type) {
      case ChatBotEventType.ON_MESSAGE:
        setMessages((prev) => [...prev, event.payload])
        setIsThinking(false)
        break
    }
  }, [])

  const send = async (payload: string) => {
    if (isThinking) return
    try {
      const message = await service.sendMsg(payload)
      setMessages((prev) => [...prev, message])
      setIsThinking(true)
    } catch (e) {
      console.error(e)
    }
  }

  return [messages, isThinking, send] as const
}
