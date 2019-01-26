
const types = {
  BEGIN_CREATE_LINK: 'BEGIN_CREATE_LINK',
  END_CREATE_LINK: 'END_CREATE_LINK'
}

const state = {
  createLink: {
    enable: false,
    from: null,
    to: null
  },
  items: [
    {
      from: 'Node2/value',
      to: 'Node3/value'
    }, {
      from: 'Node3/value',
      to: 'Node4/value'
    }, {
      from: 'Node4/value',
      to: 'Node5/value'
    }, {
      from: 'Node5/value',
      to: 'Node6/value'
    }
  ]
}

const linkPointComponents = new Map()

const actions = {
  /**
   * Регистрация vue компонента как линка
   *
   * @param {string} id - уникальный ключ соединения
   * @param {VueComponent} $vue - компонент
   */
  mountLinkPoint ({ commit }, { id, $vue }) {
    linkPointComponents.set(id, $vue)
  },

  /**
   * Удалить линк/vue компонент из зарегистированных
   *
   * @param {string} id - уникальный ключ соединения
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
   * @param {string} payload.from - начало соединения
   * @param {string} payload.to - конец соединения
   */
  beginCreateLink ({ commit }, { from, to }) {
    commit(types.BEGIN_CREATE_LINK, { from, to })
  },

  /**
   * Обновление параметров создания соединения
   *
   * @param {ActionContext} [vuexContext]
   * @param {Object} payload
   * @param {string} payload.from - начало соединения
   * @param {string} payload.to - конец соединения
   */
  updateCreateLink ({ commit }, { from, to }) {
    commit(types.UPDATE_CREATE_LINK, { from, to })
  },

  /**
   * Конец создания соединения
   *
   * @param {ActionContext} [vuexContext]
   * @param {Object} payload
   * @param {string} payload.from - начало соединения
   * @param {string} payload.to - конец соединения
   */
  endCreateLink ({ commit }, { from, to }) {
    commit(types.END_CREATE_LINK, { from, to })
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
  [types.BEGIN_CREATE_LINK] (state, { from, to }) {
    state.createLink.enable = true
    state.createLink.from = from
  },
  [types.UPDATE_CREATE_LINK] (state, { from, to }) {
    state.createLink.enable = false
    if (from) {
      state.createLink.from = from
    }
    if (to) {
      state.createLink.to = to
    }
  },
  [types.END_CREATE_LINK] (state, { from, to }) {
    state.createLink.to = to
    const oldLink = state.items.find(link => link.from === state.createLink.from && link.to === state.createLink.to)
    if (!oldLink) {
      console.log(state.createLink.from, state.createLink.to)
      state.items.push({
        from: state.createLink.from,
        to: state.createLink.to
      })
    }
    state.createLink.enable = false
    state.createLink.from = null
    state.createLink.to = null
  }
}

export default {
  namespaced: true,
  mutations,
  getters,
  actions,
  state
}
