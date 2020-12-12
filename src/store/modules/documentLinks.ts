import { managerAPI } from '@/api/index'
import Link from '@/api/models/Link'
import { GetterTree, MutationTree, ActionTree } from 'vuex'

/**
 * @see <Link>
 */
export interface LinkCreateConfig {
  from: string;
  to: string;
}

export enum types {
  INIT_LINK_CONFIGS = 'INIT_LINK_CONFIGS',
  APPEND_LINK_CONFIG = 'APPEND_LINK_CONFIG',
  REMOVE_LINK_CONFIG = 'REMOVE_LINK_CONFIG',
  FLUSH_UPDATED_LINKS = 'FLUSH_UPDATED_LINKS',
  BEGIN_CREATE_LINK = 'BEGIN_CREATE_LINK',
  UPDATE_CREATE_LINK = 'UPDATE_CREATE_LINK',
  END_CREATE_LINK = 'END_CREATE_LINK'
}

class State {
  isUpdateIds: Array<LinkCreateConfig> = []

  createLink = {
    enabled: false,
    from: null as string | null,
    to: null as string | null
  }

  items: Array<Link> = []
}

const linkPointComponents = new Map()

const actions = {
  /**
   * Инициализация модуля
   */
  init ({ state, commit }) {
    if (managerAPI.connected) {
      managerAPI.linkGetList()
    }
    managerAPI.on('open', () => managerAPI.linkGetList())
    managerAPI.on('linkList', event => {
      commit(types.INIT_LINK_CONFIGS, event.detail.params.links)
    })
    managerAPI.on('linkCreated', event => {
      commit(types.APPEND_LINK_CONFIG, event.detail.params.link)
    })
    managerAPI.on('linkUpdated', () => {
      console.log('LINK_UPDATED TODO: сделать')
    })
    managerAPI.on('linkDeleted', event => {
      commit(types.REMOVE_LINK_CONFIG, {
        from: event.detail.params.from,
        to: event.detail.params.to
      })
    })
    /* updateTimer = */ setInterval(() => {
      if (managerAPI.connected && state.isUpdateIds.length > 0) {
        const links = []
        for (const { from, to } of state.isUpdateIds) {
          const link = state.items.find(conf => conf.from === from && conf.to === to)
          if (link) {
            links.push(link)
          }
        }
        managerAPI.linksCreate(links)
        commit(types.FLUSH_UPDATED_LINKS)
      }
    }, 1000)
  },
  /**
   * Регистрация vue компонента как линка
   *
   * @param {string} id - уникальный ключ соединения
   * @param {VueComponent} $vue - компонент
   */
  mountLinkPoint (context, { id, $vue }) {
    linkPointComponents.set(id, $vue)
  },

  /**
   * Удалить линк/vue компонент из зарегистированных
   *
   * @param {string} id - уникальный ключ соединения
   * @param {VueComponent} $vue - компонент
   */
  dismountLinkPoint (context, { id, $vue }) {
    console.error('call dismountLinkPoint', id, $vue)
    linkPointComponents.delete(id)
  },

  /**
   * Начало создания соединения.
   */
  beginCreateLink ({ commit }, link: LinkCreateConfig) {
    commit(types.BEGIN_CREATE_LINK, link)
  },

  /**
   * Обновление параметров создания соединения.
   */
  updateCreateLink ({ commit }, link: LinkCreateConfig) {
    commit(types.UPDATE_CREATE_LINK, link)
  },

  /**
   * Конец создания соединения
   */
  endCreateLink ({ commit }, link: LinkCreateConfig) {
    commit(types.END_CREATE_LINK, link)
  },

  /**
   * Удалить соединение
   */
  removeLinkConfig (context, link: Link) {
    managerAPI.linkDelete(link)
  }
} as ActionTree<State, null>

const getters = {
  /**
   * Массив vue елементов для linkPoint
   *
   * @return {Map<VueComponent>} vue компоненты
   */
  getLinkPoints: () => {
    return linkPointComponents
  }
} as GetterTree<State, null>

const mutations = {
  [types.INIT_LINK_CONFIGS] (state, items) {
    state.items = items
  },
  [types.APPEND_LINK_CONFIG] (state, linkConfig) {
    state.items.push(linkConfig)
  },
  [types.REMOVE_LINK_CONFIG] (state, link: Link) {
    const index = state.items.findIndex(conf => conf.from === link.from && conf.to === link.to)
    if (index >= 0) {
      state.items.splice(index, 1)
    }
  },
  [types.FLUSH_UPDATED_LINKS] (state) {
    state.isUpdateIds = []
  },
  [types.BEGIN_CREATE_LINK] (state, link: LinkCreateConfig) {
    state.createLink.enabled = true
    state.createLink.from = link.from
  },
  [types.UPDATE_CREATE_LINK] (state, link: LinkCreateConfig) {
    state.createLink.enabled = false
    if (link.from) {
      state.createLink.from = link.from
    }
    if (link.to) {
      state.createLink.to = link.to
    }
  },
  [types.END_CREATE_LINK] (state, link: LinkCreateConfig) {
    if (link) {
      state.createLink.to = link.to
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
} as MutationTree<State>

export default {
  namespaced: true,
  mutations,
  getters,
  actions,
  state: new State()
}
