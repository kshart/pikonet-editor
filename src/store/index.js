import Vue from 'vue'
import Vuex from 'vuex'
import document from './modules/document'

Vue.use(Vuex)

// TODO У редактора свой стор, который регистрируется динамически.
const store = new Vuex.Store({
  modules: {
    document
  },
  strict: true
})

store.dispatch('document/init')
// store.dispatch('document/loadFromStorage')
// store.dispatch('document/startAutoSaveNodeConfigs')

window.store = store
export default store
