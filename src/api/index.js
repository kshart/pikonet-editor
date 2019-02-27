
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
      const { type, payload } = JSON.parse(event.data)
      const eventData = new Event(type, payload)
      eventData.payload = payload
      this.dispatchEvent(eventData)
      console.log(payload)
    })
    this.addEventListener('nodeList', event => console.log('nodeList', event))
  }
  send (type, payload = null) {
    if (!this.wSocket || this.wSocket.readyState !== WebSocket.OPEN) {
      return false
    }
    console.log('send', type, payload)
    this.wSocket.send(JSON.stringify({
      type,
      payload
    }))
  }
}
