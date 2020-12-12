import { channelBusAPI } from '@/api/index'
import { PluginObject } from 'vue/types'
import ChannelBusManager from './ChannelBusManager'

const channelBusManager = new ChannelBusManager(channelBusAPI)

declare module 'vue/types/vue' {
  interface Vue {
    $channelBus: ChannelBusManager;
  }
}

const module: PluginObject<null> = {
  install (Vue) {
    Vue.mixin({
      beforeCreate () {
        this.$channelBus = channelBusManager
      }
    })
  }
}

export default module
