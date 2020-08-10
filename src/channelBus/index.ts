import api from '@/api/index'
import { PluginObject } from 'vue/types'
import ChannelBusManager from './ChannelBusManager'

const channelBusManager = new ChannelBusManager(api)

export interface PluginOption {
}

declare module 'vue/types/vue' {
  interface Vue {
    $channelBus: ChannelBusManager
  }
}

const module: PluginObject<PluginOption> = {
  install (Vue) {
    Vue.mixin({
      beforeCreate () {
        this.$channelBus = channelBusManager
      }
    })
  }
}

export default module
