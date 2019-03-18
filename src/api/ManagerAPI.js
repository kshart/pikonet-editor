/**
 * API для работы с данными каналов.
 * @author Артём Каширин <kshart@yandex.ru>
 * @memberof api
 */
export default class ManagerAPI {
  constructor ({ connection }) {
    this.connection = connection
  }

  get connected () {
    return this.connection.connected
  }

  on () {
    this.connection.addEventListener.apply(this.connection, arguments)
  }

  off () {
    this.connection.removeEventListener.apply(this.connection, arguments)
  }

  nodeGetList () {
    this.connection.send('nodeGetList')
  }
  nodeCreate (node) {
    this.connection.send('nodeCreate', { node })
  }
  nodeUpdate (nodes) {
    this.connection.send('nodeUpdate', { nodes })
  }
  nodeDelete (id) {
    this.connection.send('nodeDelete', { id })
  }
  linkGetList () {
    this.connection.send('linkGetList')
  }
  linkCreate (link) {
    this.connection.send('linkCreate', { link })
  }
  linkDelete (id) {
    this.connection.send('linkDelete', { id })
  }
  channelWatch (channel) {
    this.connection.send('channelWatch', { channel })
  }
  channelUnwatch (channel) {
    this.connection.send('channelUnwatch', { channel })
  }
}
