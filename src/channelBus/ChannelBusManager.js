/**
 * Класс для хранения настроек приема данных из ноды.
 * @typedef {Object} СhannelsConfig
 * @memberof channelBus
 * @property {Function} onUpdate - Функция вызывается при обновлении канала.
 * @property {String} channelName - Имя канала из которого нужно брать данные.
 */

/**
 * Компонент для регистрации каналов, данные из которых нужно обновлять.
 * @author Артём Каширин <kshart@yandex.ru>
 * @memberof channelBus
 */
export default class ChannelBusManager {
  constructor ({ api }) {
    /**
     * watcher'ы для каналов от локальных компонентов.
     * @type {Map<any, Array<СhannelsConfig>>}
     */
    this.localWatchers = new Map()

    /**
     * watcher'ы для каналов зарегистрированные на сервере.
     * @type {Map<String, Set<Function>>}
     */
    this.serverWatchers = new Map()

    /**
     * Данные каналов.
     * @type {Map<String, any>}
     */
    this.data = new Map()

    /**
     * Соединения с сервером.
     * @type {api.Api}
     */
    this.api = api
    this.api.channelBus.on('nodeChannelUpdate', event => this.onNodeChannelUpdate(event))
  }

  /**
   * Обновить каналы для компонента.
   * Новые каналы подпишутся на сервере, старые отпишутся.
   * @param component - Компонент для которого обновляются каналы.
   * @param {Array<СhannelsConfig>} channelsConfig - Каналы которые нужно подписать на обнавления.
   */
  updateWatchers (component, channelsConfig) {
    console.log('updateWatchers', component, channelsConfig)
    const oldWatcherConfigs = this.localWatchers.get(component) || []
    this.localWatchers.set(component, channelsConfig)
    const watchersToAdd = []
    const watchersToDelete = []
    for (let channelConfig of channelsConfig) {
      if (!oldWatcherConfigs.find(conf => conf.channelName === channelConfig.channelName)) {
        watchersToAdd.push(channelConfig)
      }
    }
    for (let channelConfig of oldWatcherConfigs) {
      if (!channelsConfig.find(conf => conf.channelName === channelConfig.channelName)) {
        watchersToDelete.push(channelConfig)
      }
    }
    if (watchersToAdd.length > 0) {
      this.createServerWatchers(watchersToAdd)
    }
    if (watchersToDelete.length > 0) {
      this.removeServerWatchers(watchersToDelete)
    }
  }

  /**
   * Отправить данные в каналы.
   * @param {Object<String, any>} channelsData - Каналы и данные которые нужно записать.
   */
  setChannelsData (channelsData) {
    this.api.channelBus.sendChannelsData(channelsData)
  }

  /**
   * Отписать каналы компонента, от обновления.
   * @param component - Компонент для которого обновляются каналы.
   */
  removeWatchers (component) {
    console.log('removeWatchers', component)
    const oldWatcherConfigs = this.localWatchers.get(component)
    if (oldWatcherConfigs) {
      this.localWatchers.delete(component)
      this.removeServerWatchers(oldWatcherConfigs)
    }
  }

  /**
   * Подписать каналы на обновления.
   * Если канал впервые подписан, то он подписывается на сервере.
   * @param {Array<СhannelsConfig>} channelsConfig - Каналы которые нужно подписать на обновления.
   */
  createServerWatchers (channelsConfig) {
    const watchChannelNames = []
    for (let { channelName, onUpdate } of channelsConfig) {
      if (this.serverWatchers.has(channelName)) {
        const watchers = this.serverWatchers.get(channelName)
        watchers.add(onUpdate)
      } else {
        const watchers = new Set()
        watchers.add(onUpdate)
        this.serverWatchers.set(channelName, watchers)
        watchChannelNames.push(channelName)
      }
    }
    if (watchChannelNames.length > 0) {
      this.api.channelBus.channelsWatch(watchChannelNames)
    }
    console.log('createServerWatchers', this)
  }

  /**
   * Отписать каналы от обновления.
   * Если число надсмотрщиков над каналом будет равно 0, то канал отписывается от сервера.
   * @param {Array<СhannelsConfig>} channelsConfig - Каналы которые нужно отписать от обновления.
   */
  removeServerWatchers (channelsConfig) {
    const unwatchChannelNames = []
    for (let { channelName, onUpdate } of channelsConfig) {
      const watchers = this.serverWatchers.get(channelName)
      if (!watchers) {
        console.error(`ChannelBusManager::removeServerWatchers Ошибка при удаленни канала ${channelName}`)
      } else {
        watchers.delete(onUpdate)
        if (watchers.size < 1) {
          this.serverWatchers.delete(channelName)
          unwatchChannelNames.push(channelName)
        }
      }
    }
    if (unwatchChannelNames.length > 0) {
      this.api.channelBus.channelsUnwatch(unwatchChannelNames)
    }
    console.log('removeServerWatchers', this)
  }

  /**
   * Событие, обновления данных в канале.
   * @param {Object} params - В.
   */
  onNodeChannelUpdate ({ params: { id, data } }) {
    const watchers = this.serverWatchers.get(id)
    if (!watchers) {
      console.log(`onNodeChannelUpdate(${this.data})`)
      return
    }
    this.data.set(id, data)
    for (let watcher of watchers) {
      watcher(data)
    }
  }
}
