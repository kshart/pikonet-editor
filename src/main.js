import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/index'
import ChannelBus from './channelBus/index'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

Vue.config.productionTip = false
Vue.config.performance = true

Vue.use(ChannelBus)
Vue.component('FontAwesomeIcon', FontAwesomeIcon)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
