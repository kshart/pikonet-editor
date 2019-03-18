/**
 * Соединение с API.
 * @namespace api
 */

/**
 * Модели от API.
 * @namespace api.models
 */

import Vue from 'vue'
import Api from './Api'
import ManagerAPI from './ManagerAPI'
import ChannelBusAPI from './ChannelBusAPI'
import WebSocketConnection from './WebSocketConnection'

const api = new Api({
  modules: {
    manager: new ManagerAPI({
      connection: new WebSocketConnection({ url: 'ws://127.0.0.1:1069' })
    }),
    channelBus: new ChannelBusAPI({
      connection: new WebSocketConnection({ url: 'ws://127.0.0.1:69' })
    })
  }
})
Vue.use(api)

export default api
