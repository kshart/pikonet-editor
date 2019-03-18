import api from '@/api/index'
import documentLinks from './documentLinks'

const types = {
  UPDATE_RETRY_COUNT: 'UPDATE_RETRY_COUNT',
  UPDATE_CONNECTION_STATE: 'UPDATE_CONNECTION_STATE'
}

const state = {
}

const actions = {
  /**
   * Инициализация модуля
   *
   * @param {object} context
   */
  init ({ state, commit }) {
    api.open()
    api.channelBus.on('tryConnect', event => {
      commit(types.UPDATE_RETRY_COUNT, {
        loadingRetryCount: state.loadingRetryCount + 1
      })
    })
    api.channelBus.on('open', event => {
      commit(types.UPDATE_RETRY_COUNT, { loadingRetryCount: 0 })
      commit(types.UPDATE_CONNECTION_STATE, { isConnected: true })
      api.manager.nodeGetList()
    })
    api.channelBus.on('close', event => {
      commit(types.UPDATE_CONNECTION_STATE, { isConnected: false })
    })
  }
}

const mutations = {
  [types.UPDATE_RETRY_COUNT] (state, { loadingRetryCount }) {
    state.loadingRetryCount = loadingRetryCount
  },

  [types.UPDATE_CONNECTION_STATE] (state, { isConnected }) {
    state.isConnected = isConnected
  }
}

/**
 * @memberof store
 */
export default {
  namespaced: true,
  modules: {
    links: documentLinks
  },
  mutations,
  actions,
  state
}
