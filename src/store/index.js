import Vue from 'vue'
import Vuex from 'vuex'
import document from './modules/document'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    document
  },
  strict: true
})

store.dispatch('document/init')
// store.dispatch('document/loadFromStorage')
// store.dispatch('document/startAutoSaveNodeConfigs')

export default store
