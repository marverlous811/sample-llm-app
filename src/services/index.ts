import { MessageContent } from '@/common'
import { EventBus } from '@/lib'
import { Event } from '@tauri-apps/api/event'
import { invoke } from '@tauri-apps/api/tauri'
import { appWindow } from '@tauri-apps/api/window'

export enum ChatBotEventType {
  ON_MESSAGE = 'on_message',
}

export type ChatBotEvent = {
  id: number,
  type: ChatBotEventType,
  payload: any
}

export interface IChatBotService {
  sendMsg: (msg: string) => Promise<MessageContent>
  subcribe: (callback: (event: ChatBotEvent) => void) => string
  unSubcribe: (listenerId: string) => void
}

export class TauriService implements IChatBotService {
  private _msgBus = new EventBus<ChatBotEvent>()
  constructor() {
    appWindow.listen<MessageContent>('bot_answer', this.onBotAnswer)
  }

  sendMsg = (msg: string): Promise<MessageContent> => {
    return new Promise((resolve, reject) => {
      invoke('send_message', { message: msg }).then(res => {
        console.log("res", res)
        resolve(res as any)
      }).catch(err => {
        console.error("err", err)
        reject(err)
      })
    })
  }

  subcribe = (callback: (event: ChatBotEvent) => void): string => {
    return this._msgBus.register('chatbot', callback)
  }

  unSubcribe = (listenerId: string): void => {
    return this._msgBus.unregister('chatbot', listenerId)
  }

  private onBotAnswer = (event: Event<MessageContent>) => {
    this._msgBus.publish('chatbot', {
      id: event.id,
      type: ChatBotEventType.ON_MESSAGE,
      payload: event.payload
    })
  }
}