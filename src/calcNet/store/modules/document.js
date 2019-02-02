
import Api from '@/calcNet/api/index'
import items from '@/calcNet/nodes/index'
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
  SELECT_NODE_TO_CONFIGURE: 'SELECT_NODE_TO_CONFIGURE'
}

const state = {
  nodeConfigs: [],
  isUpdateIds: [],
  nodeIdToConfigure: null
}

const api = new Api()
let updateTimer = null

const actions = {
  /**
   * Инициализация модуля
   *
   * @param {object} context
   */
  init ({ commit }) {
    api.open()
    api.addEventListener('open', event => {
      api.send('NODE_GET_LIST')
    })
    api.addEventListener('close', event => {
      setTimeout(() => api.open(), 1000)
    })
    api.addEventListener('NODE_LIST', event => {
      commit(types.INIT_NODE_CONFIGS, event.data.nodes)
    })
    api.addEventListener('NODE_CREATED', event => {
      commit(types.APPEND_NODE_CONFIG, event.data.node)
    })
    api.addEventListener('NODE_UPDATED', event => {
      console.log('NODE_UPDATED')
      // commit(types.UPDATE_NODE_CONFIG, event.data.nodeIds)
    })
    api.addEventListener('NODE_DELETED', event => {
      commit(types.REMOVE_NODE_CONFIG, event.data.id)
    })
    updateTimer = setInterval(() => {
      if (state.isUpdateIds.length > 0) {
        const nodes = state.isUpdateIds.map(id => state.nodeConfigs.find(conf => conf.id === id))
        console.log(state.isUpdateIds, nodes)
        api.send('NODE_UPDATE', { nodes })
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
    api.send('NODE_CREATE', { node })
  },

  /**
   * Удалить ноду
   *
   * @param {object} context
   * @param {string} id      id ноды
   */
  removeNodeConfig ({ commit }, id) {
    console.log('removeNodeConfig')
    api.send('NODE_DELETE', { id })
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
