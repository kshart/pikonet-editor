/**
 * API для работы с данными каналов.
 * @author Артём Каширин <kshart@yandex.ru>
 * @memberof api
 */
export default class ManagerAPI {
  constructor ({ api }) {
    this.api = api
  }

  nodeGetList () {
    this.api.send('nodeGetList')
  }
  nodeCreate (node) {
    this.api.send('nodeCreate', { node })
  }
  nodeUpdate (nodes) {
    this.api.send('nodeUpdate', { nodes })
  }
  nodeDelete (id) {
    this.api.send('nodeDelete', { id })
  }
  linkGetList () {
    this.api.send('linkGetList')
  }
  linkCreate (link) {
    this.api.send('linkCreate', { link })
  }
  linkDelete (id) {
    this.api.send('linkDelete', { id })
  }
  channelWatch (channel) {
    this.api.send('channelWatch', { channel })
  }
  channelUnwatch (channel) {
    this.api.send('channelUnwatch', { channel })
  }
}
