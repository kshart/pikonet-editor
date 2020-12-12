import WebSocketConnection from './WebSocketConnection'
import ManagerAPI from './ManagerAPI'
import ChannelBusAPI from './ChannelBusAPI'

export const managerAPI = new ManagerAPI({
  connection: new WebSocketConnection({ url: 'ws://127.0.0.1:1069' })
})

export const channelBusAPI = new ChannelBusAPI({
  connection: new WebSocketConnection({ url: 'ws://127.0.0.1:169' })
})
