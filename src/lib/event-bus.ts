import { makeUniqueId, matchRuleShort } from "@/helper"

export type MsgBusCallback<T> = (data: T) => void

export class EventBus<T> {
  private _channels: Map<string, Map<string, MsgBusCallback<T>>> = new Map()

  public register = (channel: string, callback: MsgBusCallback<T>): string => {
    const listenerId = makeUniqueId()
    let channelListeners = this._channels.get(channel)
    if (!channelListeners) {
      channelListeners = new Map()
    }
    channelListeners.set(listenerId, callback)
    this._channels.set(channel, channelListeners)
    return listenerId
  }

  public unregister = (channel: string, listenerId: string): void => {
    const channelListeners = this._channels.get(channel)
    if (channelListeners) {
      channelListeners.delete(listenerId)
      if (channelListeners.size === 0) {
        this._channels.delete(channel)
      }
    }
  }

  public publish = (channel: string, data: T): void => {
    const listChannel = Array.from(this._channels.keys())
    const listChannelMatched = listChannel.filter((c) =>
      matchRuleShort(c, channel)
    )
    // console.log(listChannelMatched)
    listChannelMatched.forEach((c) => {
      const listenerMap = this._channels.get(c)
      if (listenerMap) {
        const listListener = Array.from(listenerMap.values())
        listListener.forEach((l) => l(data))
      }
    })
  }
}