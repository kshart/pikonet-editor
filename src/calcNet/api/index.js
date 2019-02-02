
export default class extends EventTarget {
  url = 'ws://127.0.0.1:1069'
  /**
   * @type {WebSocket} socket
   */
  wSocket = null
  getNodeList
  open () {
    this.wSocket = new WebSocket(this.url)
    this.wSocket.addEventListener('open', event => {
      console.log('open')
      this.dispatchEvent(new Event('open'))
    })
    this.wSocket.addEventListener('close', event => {
      this.dispatchEvent(new Event('close'))
      console.log('close')
    })
    this.wSocket.addEventListener('message', event => {
      const { type, ...data } = JSON.parse(event.data)
      const eventData = new Event(type, data)
      eventData.data = data
      this.dispatchEvent(eventData)
      console.log(data)
    })
    this.addEventListener('NODE_LIST', event => console.log('NODE_LIST', event))
  }
  send (type, data = {}) {
    if (!this.wSocket || this.wSocket.readyState !== WebSocket.OPEN) {
      return false
    }
    console.log('send', type, data)
    this.wSocket.send(JSON.stringify({
      type,
      ...data
    }))
  }
}
