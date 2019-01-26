
import items from '@/calcNet/nodes/index'

const types = {
  // LOAD: 'LOAD',
  INIT_NODE_CONFIGS: 'INIT_NODE_CONFIGS',
  APPEND_NODE_CONFIG: 'APPEND_NODE_CONFIG',
  REMOVE_NODE_CONFIG: 'REMOVE_NODE_CONFIG',
  UPDATE_NODE_CONFIG: 'UPDATE_NODE_CONFIG',
  selectItem: 'selectItem',
  setAttributes: 'setAttributes'
}

const state = {
  nodeConfigs: []
}

let autoSaveTimer = null

const actions = {
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
      const NodeClass = items[nodeConfig.type].configClass
      nodeConfigs.push(new NodeClass(nodeConfig))
    }
    commit(types.INIT_NODE_CONFIGS, nodeConfigs)
  },

  /**
   * Запуск авто-сохранения
   *
   * @param {object} context
   */
  startAutoSaveNodeConfigs ({ state }) {
    if (autoSaveTimer) {
      clearInterval(autoSaveTimer)
    }
    autoSaveTimer = setInterval(() => {
      localStorage.setItem('Document.nodeConfigs', JSON.stringify(state.nodeConfigs))
    }, 10 * 1000)
  },

  /**
   * Создать новую ноду
   *
   * @param {object} context
   * @param {calcNet.config.Node} nodeConfig конфиг
   */
  appendNodeConfig ({ commit }, nodeConfig) {
    commit(types.APPEND_NODE_CONFIG, nodeConfig)
  },

  /**
   * Удалить ноду
   *
   * @param {object} context
   * @param {string} id      id ноды
   */
  removeNodeConfig ({ commit }, id) {
    console.log('removeNodeConfig')
    commit(types.REMOVE_NODE_CONFIG, id)
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
    if (!nodeConfig.id) {
      let lastId = state.nodeConfigs.length
      while (state.nodeConfigs.find(conf => conf.id === `Node${lastId}`)) {
        ++lastId
      }
      nodeConfig.id = `Node${lastId}`
    }
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
    if (nodeConfig) {
      callback(nodeConfig)
    }
  }
}

export default {
  namespaced: true,
  mutations,
  getters,
  actions,
  state
}
