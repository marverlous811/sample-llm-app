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

const ChatModule = () => {
  const [messages, isThinking, send] = useChatHook()
  const [text, setText] = useState('')
  return (
    <>
      <MainContainer responsive style={{ width: '100%', height: '100%' }}>
        <Sidebar position="left">
          <Search placeholder="Search..." />
          <ConversationList></ConversationList>
        </Sidebar>
        <ChatContainer>
          {/* <h1>????</h1>
          <ChatBotConservation messages={messages} send={send} /> */}
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
              console.log(_innerHtml)
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
