/**
 * Соединение с API.
 * @author Артём Каширин <kshart@yandex.ru>
 * @memberof api
 * @extends EventTarget
 */
export default class Api extends EventTarget {
  install (Vue) {
    Vue.mixin({
      beforeCreate () {
        const options = this.$options
        if (options.api) {
          this.$api = typeof options.api === 'function'
            ? options.api()
            : options.api
        } else if (options.parent && options.parent.$api) {
          this.$api = options.parent.$api
        }
      }
    })
  }

  constructor ({ url = 'ws://127.0.0.1:1069', modules }) {
    super()

    /**
     * Путь к API.
     * @type {!String}
     */
    this.url = url

    /**
     * Сокет.
     * @type {WebSocket} socket
     */
    this.wSocket = null

    for (let moduleName in modules) {
      this[moduleName] = new modules[moduleName]({ api: this })
    }
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
      const { id, method, params } = JSON.parse(event.data)
      const eventData = new Event(method, params)
      eventData.id = id
      eventData.params = params
      this.dispatchEvent(eventData)
    })
    this.addEventListener('nodeList', event => console.log('nodeList', event))
  }

  /**
   * Отправить пакет
   * @param {String} method - Тип пакета.
   * @param {Object} params - "полезная нагрузка", зависит от типа пакета.
   * @access package
   */
  send (method, params = null) {
    if (!this.connected) {
      console.warn('API: Соединение отсутствует')
      return false
    }
    this.wSocket.send(JSON.stringify({
      id: 0,
      method,
      params
    }))
  }
}
