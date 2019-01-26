import Vue from 'vue'
import Vuex from 'vuex'
import document from './modules/document'
import documentLinks from './modules/documentLinks'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    document,
    documentLinks
  },
  strict: true
})

store.dispatch('document/loadFromStorage')
store.dispatch('document/startAutoSaveNodeConfigs')

export default store
