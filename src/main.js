import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './calcNet/store/index'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

Vue.config.productionTip = false
Vue.config.performance = true

Vue.component('FontAwesomeIcon', FontAwesomeIcon)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
