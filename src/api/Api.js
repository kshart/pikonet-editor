import ChannelBus from './ChannelBus'

/**
 * Соединение с API.
 * @author Артём Каширин <kshart@yandex.ru>
 * @memberof module:api
 * @extends EventTarget
 */
export default class Api extends EventTarget {
  constructor ({ url = 'ws://127.0.0.1:1069' }) {
    super()

    /**
     * Уникальный ключ канала.
     * @type {!String}
     */
    this.url = url

    /**
     * Сокет.
     * @type {WebSocket} socket
     */
    this.wSocket = null

    this.channelBus = new ChannelBus({ api: this })
  }

  get connected () {
    return this.wSocket && this.wSocket.readyState === WebSocket.OPEN
  }

  /**
   * Открыть соединение.
   */
  open () {
    console.log('Попытка подключения')
    this.dispatchEvent(new Event('tryConnect'))
    this.wSocket = new WebSocket(this.url)
    this.wSocket.addEventListener('open', event => {
      this.dispatchEvent(new Event('open'))
    })
    this.wSocket.addEventListener('close', event => {
      this.dispatchEvent(new Event('close'))
      setTimeout(() => this.open(), 5000)
    })
    this.wSocket.addEventListener('message', event => {
      const { type, payload } = JSON.parse(event.data)
      const eventData = new Event(type, payload)
      eventData.payload = payload
      this.dispatchEvent(eventData)
    })
    this.addEventListener('nodeList', event => console.log('nodeList', event))
  }

  /**
   * Отправить пакет
   * @param {String} type тип пакета
   * @param {Object} payload "полезная нагрузка", зависит от типа пакета
   */
  send (type, payload = null) {
    if (!this.connected) {
      console.warn('API: Соединение отсутствует')
      return false
    }
    this.wSocket.send(JSON.stringify({
      type,
      payload
    }))
  }
}
