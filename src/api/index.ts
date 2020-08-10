import _Vue from 'vue'
import Api from './Api'
import WebSocketConnection from './WebSocketConnection'
import ManagerAPI from './ManagerAPI'
import ChannelBusAPI from './ChannelBusAPI'
import { PluginFunction } from 'vue/types'

export interface PluginOption {
}

const api = new Api(
  new ManagerAPI({
    connection: new WebSocketConnection({ url: 'ws://127.0.0.1:1069' })
  }),
  new ChannelBusAPI({
    connection: new WebSocketConnection({ url: 'ws://127.0.0.1:169' })
  })
)

export default api

export const apiInstall: PluginFunction<PluginOption> = (Vue) => {
  Vue.mixin({
    beforeCreate () {
      this.$api = api
    }
  })
}
