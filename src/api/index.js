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

const api = new Api({
  manager: { url: 'ws://127.0.0.1:1069' },
  channelBus: { url: 'ws://127.0.0.1:169' }
})
Vue.use(api)

export default api
