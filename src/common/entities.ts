export type MessageContent = {
  id: number
  sender: 'user' | 'bot'
  content: string
  ts: number
}