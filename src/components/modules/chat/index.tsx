'use client'

import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css'
import {
  MainContainer,
  ChatContainer,
  Sidebar,
  Search,
  ConversationList,
  MessageList,
  MessageInput,
  Message,
  TypingIndicator,
} from '@chatscope/chat-ui-kit-react'
import { useChatHook } from './chat.hook'
import { useState } from 'react'
import { TauriService } from '@/services'

const ChatModule = () => {
  const [messages, isThinking, send] = useChatHook(new TauriService())
  const [text, setText] = useState('')
  return (
    <>
      <MainContainer responsive style={{ width: '100%', height: '100%' }}>
        <Sidebar position="left">
          <Search placeholder="Search..." />
          <ConversationList></ConversationList>
        </Sidebar>
        <ChatContainer>
          <MessageList
            typingIndicator={
              isThinking ? (
                <TypingIndicator content={'Give me a sec for think...'} />
              ) : null
            }
          >
            {messages.map((message, idx) => {
              return (
                <Message
                  key={idx}
                  model={{
                    message: message.content,
                    sentTime: new Date(message.ts).toLocaleTimeString(),
                    sender: message.sender,
                    direction:
                      message.sender === 'user' ? 'outgoing' : 'incoming',
                    position: 'single',
                    type: 'text',
                  }}
                />
              )
            })}
          </MessageList>
          <MessageInput
            attachButton={false}
            placeholder="Ask me a question"
            value={text}
            disabled={isThinking}
            onChange={(_innerHtml, content) => {
              setText(content)
            }}
            onSend={() => {
              if (send) {
                send(text)
                setText('')
              }
            }}
          />
        </ChatContainer>
      </MainContainer>
    </>
  )
}

export default ChatModule
