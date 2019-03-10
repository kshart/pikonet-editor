
import Api from '@/api/index'
import items from '@/nodes/index'
import documentLinks from './documentLinks'

const types = {
  // LOAD: 'LOAD',
  INIT_NODE_CONFIGS: 'INIT_NODE_CONFIGS',
  APPEND_NODE_CONFIG: 'APPEND_NODE_CONFIG',
  REMOVE_NODE_CONFIG: 'REMOVE_NODE_CONFIG',
  UPDATE_NODE_CONFIG: 'UPDATE_NODE_CONFIG',
  selectItem: 'selectItem',
  setAttributes: 'setAttributes',
  FLUSH_UPDATED_NODES: 'FLUSH_UPDATED_NODES',
  SELECT_NODE_TO_CONFIGURE: 'SELECT_NODE_TO_CONFIGURE',
  UPDATE_RETRY_COUNT: 'UPDATE_RETRY_COUNT',
  UPDATE_CONNECTION_STATE: 'UPDATE_CONNECTION_STATE'
}

const state = {
  isConnected: false,
  loadingRetryCount: 0,
  nodeConfigs: [],
  isUpdateIds: [],
  nodeIdToConfigure: null
}

const api = new Api()
// let updateTimer = null

const actions = {
  /**
   * Инициализация модуля
   *
   * @param {object} context
   */
  init ({ state, commit }) {
    api.open()
    api.addEventListener('open', event => {
      commit(types.UPDATE_RETRY_COUNT, { loadingRetryCount: 0 })
      commit(types.UPDATE_CONNECTION_STATE, { isConnected: true })
      api.send('nodeGetList')
    })
    api.addEventListener('close', event => {
      commit(types.UPDATE_CONNECTION_STATE, { isConnected: false })
    })
    api.addEventListener('tryConnect', event => {
      commit(types.UPDATE_RETRY_COUNT, {
        loadingRetryCount: state.loadingRetryCount + 1
      })
    })
    api.addEventListener('nodeList', event => {
      console.log(event.payload.nodes)
      commit(types.INIT_NODE_CONFIGS, event.payload.nodes)
    })
    api.addEventListener('nodeCreated', event => {
      commit(types.APPEND_NODE_CONFIG, event.payload.node)
    })
    api.addEventListener('nodeUpdated', event => {
      console.log('NODE_UPDATED')
      // commit(types.UPDATE_NODE_CONFIG, event.payload.nodeIds)
    })
    api.addEventListener('nodeDeleted', event => {
      commit(types.REMOVE_NODE_CONFIG, event.payload.id)
    })
    /* updateTimer = */ setInterval(() => {
      if (api.connected && state.isUpdateIds.length > 0) {
        const nodes = state.isUpdateIds.map(id => state.nodeConfigs.find(conf => conf.id === id))
        console.log(state.isUpdateIds, nodes)
        api.send('nodeUpdate', { nodes })
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
    api.send('nodeCreate', { node })
  },

  /**
   * Удалить ноду
   *
   * @param {object} context
   * @param {string} id      id ноды
   */
  removeNodeConfig ({ commit }, id) {
    console.log('removeNodeConfig')
    api.send('nodeDelete', { id })
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
