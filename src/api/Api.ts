import ManagerAPI from './ManagerAPI'
import ChannelBusAPI from './ChannelBusAPI'

declare module 'vue/types/vue' {
  interface Vue {
    $api: Api
  }
}

/**
 * Соединение с API.
 * @author Артём Каширин <kshart@yandex.ru>
 */
export default class Api {
  manager: ManagerAPI
  channelBus: ChannelBusAPI

  constructor (manager: ManagerAPI, channelBus: ChannelBusAPI) {
    this.manager = manager
    this.channelBus = channelBus
  }
}
