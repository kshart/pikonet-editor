import Link from './models/Link'
import Node from './models/Node'
import Channel from './models/Channel'
import WebSocketConnection, { SocketEventListener } from './WebSocketConnection'

export interface ManagerConfig {
  connection: WebSocketConnection;
}


/**
 * API для работы с данными каналов.
 * @author Артём Каширин <kshart@yandex.ru>
 */
export default class ManagerAPI {
  connection: WebSocketConnection

  constructor ({ connection }: ManagerConfig) {
    this.connection = connection
  }

  get connected () {
    return this.connection.connected
  }

  on (type: string, listener: SocketEventListener | null, options?: boolean | AddEventListenerOptions): void {
    this.connection.addEventListener(type, <EventListener>listener, options)
  }

  off (type: string, callback: SocketEventListener | null, options?: EventListenerOptions | boolean): void {
    this.connection.removeEventListener(type, <EventListener>callback, options)
  }

  nodeGetList () {
    this.connection.send('nodeGetList')
  }

  nodeCreate (node: Node) {
    this.connection.send('nodeCreate', { node })
  }

  nodeUpdate (nodes: Array<Node>) {
    this.connection.send('nodeUpdate', { nodes })
  }

  nodeDelete (id: string) {
    this.connection.send('nodeDelete', { id })
  }

  linkGetList () {
    this.connection.send('linkGetList')
  }

  linksCreate (links: Array<Link>) {
    links.forEach(link => this.connection.send('linkCreate', { link }))
  }

  linkDelete ({ from, to }: Link) {
    this.connection.send('linkDelete', { from, to })
  }

  channelWatch (channel: Channel) {
    this.connection.send('channelWatch', { channel })
  }

  channelUnwatch (channel: Channel) {
    this.connection.send('channelUnwatch', { channel })
  }
}
