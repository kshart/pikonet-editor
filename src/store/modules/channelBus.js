import api from '@/api/index'
import items from '@/nodes/index'
import documentLinks from './documentLinks'

const types = {
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
    api.channelBus.on('nodeList', event => {
      console.log(event.params.nodes)
      commit(types.INIT_NODE_CONFIGS, event.params.nodes)
    })
    api.channelBus.on('nodeCreated', event => {
      commit(types.APPEND_NODE_CONFIG, event.params.node)
    })
    api.channelBus.on('nodeUpdated', event => {
      console.log('NODE_UPDATED')
      // commit(types.UPDATE_NODE_CONFIG, event.params.nodeIds)
    })
    api.channelBus.on('nodeDeleted', event => {
      commit(types.REMOVE_NODE_CONFIG, event.params.id)
    })
    /* updateTimer = */ setInterval(() => {
      if (api.connected && state.isUpdateIds.length > 0) {
        const nodes = state.isUpdateIds.map(id => state.nodeConfigs.find(conf => conf.id === id))
        console.log(state.isUpdateIds, nodes)
        api.manager.nodeUpdate(nodes)
        commit(types.FLUSH_UPDATED_NODES)
      }
    }, 1000)
  },

  /**
   * Загрузка авто-сохранения
   *
   * @param {object} context
   */
  loadFromStorage ({ commit }) {
    const stringRawNodeConfigs = localStorage.getItem('Document.nodeConfigs')
    if (!stringRawNodeConfigs) {
      return
    }
    const rawNodeConfigs = JSON.parse(stringRawNodeConfigs)
    const nodeConfigs = []
    for (let nodeConfig of rawNodeConfigs) {
      if (!items[nodeConfig.type]) {
        console.error('unsupportConfig', nodeConfig)
        continue
      }
      const NodeClass = items[nodeConfig.type].class
      nodeConfigs.push(new NodeClass(nodeConfig))
    }
    commit(types.INIT_NODE_CONFIGS, nodeConfigs)
  },

  /**
   * Создать новую ноду
   *
   * @param {object} context
   * @param {calcNet.config.Node} nodeConfig конфиг
   */
  appendNodeConfig ({ commit }, node) {
    api.manager.nodeCreate(node)
  },

  /**
   * Удалить ноду
   *
   * @param {object} context
   * @param {string} id      id ноды
   */
  removeNodeConfig ({ commit }, id) {
    console.log('removeNodeConfig')
    api.manager.nodeDelete(id)
  },

  /**
   * Изменить ноду
   *
   * @param {object} context
   */
  updateNodeConfig ({ commit }, config) {
    commit(types.UPDATE_NODE_CONFIG, config)
  }
}

const getters = {
}

const mutations = {
  [types.INIT_NODE_CONFIGS] (state, nodeConfigs) {
    state.nodeConfigs = nodeConfigs
  },
  [types.APPEND_NODE_CONFIG] (state, nodeConfig) {
    state.nodeConfigs.push(nodeConfig)
  },
  [types.REMOVE_NODE_CONFIG] (state, id) {
    console.log('REMOVE_NODE_CONFIG')
    const index = state.nodeConfigs.findIndex(conf => conf.id === id)
    if (index >= 0) {
      state.nodeConfigs.splice(index, 1)
    }
  },
  [types.UPDATE_NODE_CONFIG] (state, { id, callback }) {
    const nodeConfig = state.nodeConfigs.find(conf => conf.id === id)
    if (!nodeConfig) {
      return
    }
    callback(nodeConfig)
    if (!state.isUpdateIds.includes(nodeConfig.id)) {
      state.isUpdateIds.push(nodeConfig.id)
    }
  },
  [types.FLUSH_UPDATED_NODES] (state) {
    state.isUpdateIds = []
  },
  [types.SELECT_NODE_TO_CONFIGURE] (state, nodeId) {
    state.nodeIdToConfigure = nodeId
  },

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
  getters,
  actions,
  state
}
