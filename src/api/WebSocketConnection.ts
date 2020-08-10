interface ResponseCallback {
  resolve: Function;
  reject: Function;
}

export interface SocketEventData {
  id: number;
  params: any;
  requestId: number;
}

export interface SocketEventListener {
  (evt: CustomEvent<SocketEventData>): void;
}

interface SocketMessage {
  id: number;
  requestId: number;
  method: string;
  params: any;
}

/**
 * Соединение с API.
 * @author Артём Каширин <kshart@yandex.ru>
 */
export default class WebSocketConnection extends EventTarget {
  /**
   * Путь к API.
   */
  url: string

  /**
   * Сокет.
   */
  private wSocket: WebSocket | null = null

  requestWaitResponce = new Map<number, Set<ResponseCallback>>()

  lastResposeId = 0

  constructor ({ url = 'ws://127.0.0.1:1069' }) {
    super()
    this.url = url
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
      const { id, requestId, method, params } = <SocketMessage>JSON.parse(event.data)
      const eventData = new CustomEvent<SocketEventData>(method, {
        detail: {
          id,
          params,
          requestId
        }
      })
      this.dispatchEvent(eventData)

      if (this.requestWaitResponce.has(requestId)) {
        const callbacks = <Set<ResponseCallback>>this.requestWaitResponce.get(requestId)
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
   * @param method - Тип пакета.
   * @param params - "полезная нагрузка", зависит от типа пакета.
   * @param {Object} config - Параметры запроса.
   * @param {boolean} config.waitResult - Необходимость ожидать ответ на запрос.
   */
  send (method: string, params: Object | null = null, config: any | null = null) {
    if (this.wSocket == null || !this.connected) {
      console.warn('API: Соединение отсутствует')
      return false
    }
    const id = ++this.lastResposeId
    if (config?.waitResult) {
      let callbacks = new Set<ResponseCallback>()
      if (this.requestWaitResponce.has(id)) {
        callbacks = <Set<ResponseCallback>>this.requestWaitResponce.get(id)
      } else {
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
