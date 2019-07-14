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
  /**
   * watcher'ы для каналов зарегистрированные на сервере
   * @type {Map<String, Number>}
   */
  apiWatchers = new Map()

  /**
   * watcher'ы для каналов от локальных компонентов
   * @type {Map<Object, Array<String>>}
   */
  localWatchers = new Map()

  /**
   * Обновить каналы для компонента.
   * Новые каналы подпишутся на сервере, старые отпишутся.
   * @param component - Компонент для которого обновляются каналы.
   * @param {Array<СhannelsConfig>} channelsConfig - Каналы которые нужно подписать на обнавления.
   */
  updateWatchers (component, channelsConfig) {
    console.log('updateWatchers', component, channelsConfig)
    const oldWatchers = this.localWatchers.get(component)
    this.localWatchers.set(component, channelsConfig)
    const watchersToAdd = []
    const watchersToDelete = []
    for (let { channelName } of channelsConfig) {
      if (!oldWatchers.includes(channelName)) {
        watchersToAdd.push(channelName)
      }
    }
    for (let channelName of oldWatchers) {
      if (!channelsConfig.find(conf => conf.channelName === channelName)) {
        watchersToDelete.push(channelName)
      }
    }
    if (watchersToAdd.length > 0) {
      this.createAPIWatchers(watchersToAdd)
    }
    if (watchersToDelete.length > 0) {
      this.removeAPIWatchers(watchersToDelete)
    }
    // for (let { channelName, onUpdate } of channelsConfig) {
    //   let i = 0
    //   channelName = channelName + ''
    //   setInterval(() => onUpdate(++i), 100)
    // }
  }

  removeWatchers (component) {
    console.log('removeWatchers', component)
  }

  /**
   * Подписать каналы на обновления.
   * Если канал впервые подписан, то он подписывается на сервере.
   * @param {Array<String>} channelNames - Каналы которые нужно подписать на обнавления.
   */
  createAPIWatchers (channelNames) {
    const registerRemoteWatchers = []
    for (let channelName of channelNames) {
      const watchersCount = this.apiWatchers.get(channelName)
      if (watchersCount) {
        this.apiWatchers.set(channelName, watchersCount + 1)
      } else {
        registerRemoteWatchers.push(channelName)
        this.apiWatchers.set(channelName, 1)
      }
    }
    if (registerRemoteWatchers.length > 0) {
      this.registerRemoteAPIWatchers(registerRemoteWatchers)
    }
  }

  /**
   * Отписать каналы от обновления.
   * Если число надсмотрщиков над каналом будет равно 0, то канал отписывается от сервера.
   * @param {Array<String>} channelNames - Каналы которые нужно отписать от обнавления.
   */
  removeAPIWatchers (channelNames) {
    const unregisterRemoteWatchers = []
    for (let channelName of channelNames) {
      const watchersCount = this.apiWatchers.get(channelName)
      if (!watchersCount) {
        console.error(`ChannelBusManager::removeAPIWatchers Ошибка при удаленни канала ${channelName}`)
      } else if (watchersCount > 1) {
        this.apiWatchers.set(channelName, watchersCount - 1)
      } else {
        unregisterRemoteWatchers.push(channelName)
        this.apiWatchers.delete(channelName)
      }
    }
    if (unregisterRemoteWatchers.length > 0) {
      this.unregisterRemoteAPIWatchers(unregisterRemoteWatchers)
    }
  }

  /**
   * Соединение с API есть и watcher'ы для каналов на сервере зарегистрированны
   * @return {boolean}
   */
  isAPIConnected () {
    return true
  }

  registerRemoteAPIWatchers (channelNames) {
    console.log('registerRemoteAPIWatchers', channelNames)
  }
  unregisterRemoteAPIWatchers (channelNames) {
    console.log('unregisterRemoteAPIWatchers', channelNames)
  }
}
