import api from '@/api/index'
import Node from '@/api/models/Node'
import items from '@/nodes/index'
import documentLinks from './documentLinks'
import { GetterTree, MutationTree, ActionTree } from 'vuex'

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

class State {
  /**
   * Состояние соединения с API.
   */
  isConnected = false;

  /**
   * Колличество попыток соединения с API. Если 0 то соединение установленно.
   */
  loadingRetryCount = 0

  /**
   * Конфигурации нод.
   */
  nodeConfigs: Array<Node> = []

  /**
   * ID нод которые необходимо обновить.
   */
  isUpdateIds: Array<string> = []

  /**
   * ID ноды для редактирования параметров.
   */
  nodeIdToConfigure: string | null = null
}

// let updateTimer = null

const actions = {
  /**
   * Инициализация модуля
   *
   * @param {object} context
   */
  init ({ state, commit, dispatch }) {
    dispatch('links/init')
    if (api.manager.connected) {
      api.manager.nodeGetList()
    }
    api.manager.on('open', () => {
      commit(types.UPDATE_RETRY_COUNT, { loadingRetryCount: 0 })
      commit(types.UPDATE_CONNECTION_STATE, { isConnected: true })
      api.manager.nodeGetList()
    })
    api.manager.on('close', () => {
      commit(types.UPDATE_CONNECTION_STATE, { isConnected: false })
    })
    api.manager.on('tryConnect', () => {
      commit(types.UPDATE_RETRY_COUNT, {
        loadingRetryCount: state.loadingRetryCount + 1
      })
    })
    api.manager.on('nodeList', event => {
      commit(types.INIT_NODE_CONFIGS, event.detail.params.nodes)
    })
    api.manager.on('nodeCreated', event => {
      commit(types.APPEND_NODE_CONFIG, event.detail.params.node)
    })
    api.manager.on('nodeUpdated', event => {
      console.log('NODE_UPDATED TODO: сделать', event)
      // commit(types.UPDATE_NODE_CONFIG, event.params.nodeIds)
    })
    api.manager.on('nodeDeleted', event => {
      commit(types.REMOVE_NODE_CONFIG, event.detail.params.id)
    })
    /* updateTimer = */ setInterval(() => {
      if (api.manager.connected && state.isUpdateIds.length > 0) {
        const nodes = []
        for (const id of state.isUpdateIds) {
          const node = state.nodeConfigs.find(conf => conf.id === id)
          if (node) {
            nodes.push(node)
          }
        }
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
    for (const nodeConfig of rawNodeConfigs) {
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
   * @param context
   * @param nodeConfig конфиг
   */
  appendNodeConfig (context, node: Node) {
    api.manager.nodeCreate(node)
  },

  /**
   * Удалить ноду
   *
   * @param {object} context
   * @param {string} id      id ноды
   */
  removeNodeConfig (context, id: string) {
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
} as ActionTree<State, null>

const getters = {
} as GetterTree<State, null>

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
} as MutationTree<State>

/**
 * @namespace store/document
 */
export default {
  namespaced: true,
  modules: {
    links: documentLinks
  },
  mutations,
  getters,
  actions,
  state: new State()
}
