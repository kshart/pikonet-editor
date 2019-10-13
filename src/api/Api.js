import ManagerAPI from './ManagerAPI'
import ChannelBusAPI from './ChannelBusAPI'
import WebSocketConnection from './WebSocketConnection'

/**
 * Соединение с API.
 * @author Артём Каширин <kshart@yandex.ru>
 * @memberof api
 */
export default class Api {
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

  constructor ({ manager, channelBus }) {
    this.manager = new ManagerAPI({
      connection: new WebSocketConnection(manager)
    })
    this.channelBus = new ChannelBusAPI({
      connection: new WebSocketConnection(channelBus)
    })
  }
}
