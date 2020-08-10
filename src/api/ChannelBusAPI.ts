import WebSocketConnection, { SocketEventListener } from './WebSocketConnection'

export interface ChannelBusConfig {
  connection: WebSocketConnection;
}

/**
 * API для работы с данными каналов.
 * @author Артём Каширин <kshart@yandex.ru>
 */
export default class ChannelBusAPI {
  connection: WebSocketConnection

  channelsData = new Map()

  constructor ({ connection }: ChannelBusConfig) {
    this.connection = connection
  }

  /**
   * Соединение с API есть и watcher'ы для каналов на сервере зарегистрированны
   * @return {boolean}
   */
  get connected () {
    return this.connection.connected
  }

  on (type: string, listener: SocketEventListener | null, options?: boolean | AddEventListenerOptions): void {
    this.connection.addEventListener(type, listener as EventListener, options)
  }

  off (type: string, callback: SocketEventListener | null, options?: EventListenerOptions | boolean): void {
    this.connection.removeEventListener(type, callback as EventListener, options)
  }

  getChannelList (nodeId: string) {
    return this.connection.send('nodeGetChannelList', { nodeId }, { waitResult: true })
  }

  channelRead (channelId: string) {
    console.error('call channelRead', channelId)
  }

  /**
   * Отправить данные в каналы.
   * @param channelsData - Каналы и данные которые нужно записать.
   */
  sendChannelsData (channelsData: Record<string, any>) {
    console.log('sendChannelsData', { channelsData })
    this.connection.send('nodeChannelsSendData', { channelsData })
  }

  /**
   * Зарегистрировать просмотрщики каналов.
   * @param channelsId - ID каналов.
   */
  channelsWatch (channelsId: Array<string>) {
    this.connection.send('nodeChannelsWatch', { channelsId })
  }

  /**
   * Удалить просмотрщики каналов.
   * @param channelsId - ID каналов.
   */
  channelsUnwatch (channelsId: Array<string>) {
    this.connection.send('nodeChannelsUnwatch', { channelsId })
  }
}
