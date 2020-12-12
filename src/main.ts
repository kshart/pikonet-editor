import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index'
import ChannelBus from './channelBus/index'
import ContextMenu from './ContextMenu/index'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

Vue.config.productionTip = false
Vue.config.performance = true

Vue.use(ChannelBus)
Vue.use(ContextMenu)
Vue.component('FontAwesomeIcon', FontAwesomeIcon)

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
