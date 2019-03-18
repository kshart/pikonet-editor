/**
 * Соединение с API.
 * @author Артём Каширин <kshart@yandex.ru>
 * @memberof api
 * @extends EventTarget
 */
export default class WebSocketConnection extends EventTarget {
  constructor ({ url = 'ws://127.0.0.1:1069' }) {
    super()

    /**
     * Путь к API.
     * @type {!String}
     */
    this.url = url

    /**
     * Сокет.
     * @type {WebSocket} socket
     * @private
     */
    this.wSocket = null

    /**
     * @type {Map<String, Set<Function>>} socket
     */
    this.requestWaitResponce = new Map()

    this.lastResposeId = 0

    this.open()
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
      const { id, requestId, method, params } = JSON.parse(event.data)
      const eventData = new Event(method, params)
      eventData.id = id
      eventData.params = params
      eventData.requestId = requestId
      this.dispatchEvent(eventData)

      if (this.requestWaitResponce.has(requestId)) {
        const callbacks = this.requestWaitResponce.get(requestId)
        for (let { resolve } of callbacks) {
          resolve(params)
        }
        this.requestWaitResponce.delete(requestId)
      }
    })
    this.addEventListener('nodeList', event => console.log('nodeList', event))
  }

  /**
   * Отправить пакет
   * @param {String} method - Тип пакета.
   * @param {Object} params - "полезная нагрузка", зависит от типа пакета.
   * @param {Object} config - Параметры запроса.
   * @param {Boolean} config.waitResult - Необходимость ожидать ответ на запрос.
   * @access package
   */
  send (method, params = null, config) {
    if (!this.connected) {
      console.warn('API: Соединение отсутствует')
      return false
    }
    const id = ++this.lastResposeId
    if (config && config.waitResult) {
      let callbacks
      if (this.requestWaitResponce.has(id)) {
        callbacks = this.requestWaitResponce.get(id)
      } else {
        callbacks = new Set()
        this.requestWaitResponce.set(id, callbacks)
      }
      const result = new Promise((resolve, reject) => {
        callbacks.add({
          resolve,
          reject
        })
      })
      this.wSocket.send(JSON.stringify({
        id,
        method,
        params
      }))
      return result
    } else {
      this.wSocket.send(JSON.stringify({
        id,
        method,
        params
      }))
    }
  }
}
