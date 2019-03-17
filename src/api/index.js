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

const api = new Api({
  modules: {
    manager: ManagerAPI,
    channelBus: ChannelBusAPI
  }
})
Vue.use(api)

export default api
