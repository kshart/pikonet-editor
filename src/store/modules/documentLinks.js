import api from '@/api/index'

const types = {
  INIT_LINK_CONFIGS: 'INIT_LINK_CONFIGS',
  APPEND_LINK_CONFIG: 'APPEND_LINK_CONFIG',
  REMOVE_LINK_CONFIG: 'REMOVE_LINK_CONFIG',
  FLUSH_UPDATED_LINKS: 'FLUSH_UPDATED_LINKS',
  BEGIN_CREATE_LINK: 'BEGIN_CREATE_LINK',
  UPDATE_CREATE_LINK: 'UPDATE_CREATE_LINK',
  END_CREATE_LINK: 'END_CREATE_LINK'
}

const state = {
  isUpdateIds: [],
  createLink: {
    enabled: false,
    from: null,
    to: null
  },
  items: []
}

const linkPointComponents = new Map()

const actions = {
  /**
   * Инициализация модуля
   *
   * @param {object} context
   */
  init ({ state, commit }) {
    if (api.manager.connected) {
      api.manager.linkGetList()
    }
    api.manager.on('open', event => api.manager.linkGetList())
    api.manager.on('linkList', event => {
      commit(types.INIT_LINK_CONFIGS, event.params.links)
    })
    api.manager.on('linkCreated', event => {
      commit(types.APPEND_LINK_CONFIG, event.params.link)
    })
    api.manager.on('linkUpdated', event => {
      console.log('LINK_UPDATED TODO: сделать')
    })
    api.manager.on('linkDeleted', event => {
      commit(types.REMOVE_LINK_CONFIG, {
        from: event.params.from,
        to: event.params.to
      })
    })
    /* updateTimer = */ setInterval(() => {
      if (api.manager.connected && state.isUpdateIds.length > 0) {
        const links = state.isUpdateIds.map(({ from, to }) => state.items.find(conf => conf.from === from && conf.to === to))
        api.manager.linksCreate(links)
        commit(types.FLUSH_UPDATED_LINKS)
      }
    }, 1000)
  },
  /**
   * Регистрация vue компонента как линка
   *
   * @param {String} id - уникальный ключ соединения
   * @param {VueComponent} $vue - компонент
   */
  mountLinkPoint ({ commit }, { id, $vue }) {
    linkPointComponents.set(id, $vue)
  },

  /**
   * Удалить линк/vue компонент из зарегистированных
   *
   * @param {String} id - уникальный ключ соединения
   * @param {VueComponent} $vue - компонент
   */
  dismountLinkPoint ({ commit }, { id, $vue }) {
    linkPointComponents.delete(id)
  },

  /**
   * Начало создания соединения
   *
   * @param {ActionContext} [vuexContext]
   * @param {Object} payload
   * @param {String} payload.from - начало соединения
   * @param {String} payload.to - конец соединения
   */
  beginCreateLink ({ commit }, { from, to }) {
    commit(types.BEGIN_CREATE_LINK, { from, to })
  },

  /**
   * Обновление параметров создания соединения
   *
   * @param {ActionContext} [vuexContext]
   * @param {Object} payload
   * @param {String} payload.from - начало соединения
   */
  updateCreateLink ({ commit }, { from }) {
    commit(types.UPDATE_CREATE_LINK, { from })
  },

  /**
   * Конец создания соединения
   *
   * @param {ActionContext} [vuexContext]
   * @param {?Object} payload
   * @param {String} payload.to - конец соединения
   */
  endCreateLink ({ commit }, payload) {
    commit(types.END_CREATE_LINK, payload)
  },

  /**
   * Удалить соединение
   *
   * @param {Object} context
   * @param {Object} payload
   * @param {String} payload.from
   * @param {String} payload.to
   */
  removeLinkConfig ({ commit }, { from, to }) {
    api.manager.linkDelete({ from, to })
  }
}

const getters = {
  /**
   * Массив vue елементов для linkPoint
   *
   * @return {Map<VueComponent>} vue компоненты
   */
  getLinkPoints: state => {
    return linkPointComponents
  }
}

const mutations = {
  [types.INIT_LINK_CONFIGS] (state, items) {
    state.items = items
  },
  [types.APPEND_LINK_CONFIG] (state, linkConfig) {
    state.items.push(linkConfig)
  },
  [types.REMOVE_LINK_CONFIG] (state, { from, to }) {
    const index = state.items.findIndex(conf => conf.from === from && conf.to === to)
    if (index >= 0) {
      state.items.splice(index, 1)
    }
  },
  [types.FLUSH_UPDATED_LINKS] (state) {
    state.isUpdateIds = []
  },
  [types.BEGIN_CREATE_LINK] (state, { from, to }) {
    state.createLink.enabled = true
    state.createLink.from = from
  },
  [types.UPDATE_CREATE_LINK] (state, { from, to }) {
    state.createLink.enabled = false
    if (from) {
      state.createLink.from = from
    }
    if (to) {
      state.createLink.to = to
    }
  },
  [types.END_CREATE_LINK] (state, params) {
    if (params) {
      state.createLink.to = params.to
    }
    const oldLink = state.items.find(link => link.from === state.createLink.from && link.to === state.createLink.to)
    if (!oldLink && state.createLink.from && state.createLink.to && state.createLink.from !== state.createLink.to) {
      state.items.push({
        from: state.createLink.from,
        to: state.createLink.to,
        type: 'default'
      })
      state.isUpdateIds.push({
        from: state.createLink.from,
        to: state.createLink.to
      })
    }
    state.createLink.enabled = false
    state.createLink.from = null
    state.createLink.to = null
  },
  [types.REMOVE_LINK_CONFIG] (state, { from, to }) {
    const index = state.items.findIndex(conf => conf.from === from && conf.to === to)
    if (index >= 0) {
      state.items.splice(index, 1)
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
