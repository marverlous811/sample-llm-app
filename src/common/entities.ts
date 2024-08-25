export type MessageContent = {
  sender: 'user' | 'bot'
  content: string
  ts: number
}