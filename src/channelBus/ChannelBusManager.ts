import ChannelBusAPI from '@/api/ChannelBusAPI'

/**
 * Класс для хранения настроек приема данных из ноды.
 */
export interface СhannelsConfig {
  /**
   * Функция вызывается при обновлении канала.
   * @param data - Данные канала.
   */
  onUpdate(data: unknown): void;

  /**
   * Имя канала из которого нужно брать данные.
   */
  channelName: string;
}

interface EventChannelUpdate {
  params: {
    id: string;
    data: unknown;
  };
}

/**
 * Компонент для регистрации каналов, данные из которых нужно обновлять.
 * @author Артём Каширин <kshart@yandex.ru>
 * @memberof channelBus
 */
export default class ChannelBusManager {
  /**
   * watcher'ы для каналов от локальных компонентов.
   */
  localWatchers = new Map<unknown, Array<СhannelsConfig>>()

  /**
   * watcher'ы для каналов зарегистрированные на сервере.
   */
  serverWatchers = new Map<string, Set<Function>>()

  /**
   * Данные каналов.
   */
  data = new Map<string, unknown>()

  /**
   * Соединения с сервером.
   */
  channelBusAPI: ChannelBusAPI

  constructor (channelBusAPI: ChannelBusAPI) {
    this.channelBusAPI = channelBusAPI
    this.channelBusAPI.on('nodeChannelUpdate', event => {
      this.onNodeChannelUpdate(event as unknown as EventChannelUpdate)
    })
  }

  /**
   * Обновить каналы для компонента.
   * Новые каналы подпишутся на сервере, старые отпишутся.
   * @param component - Компонент для которого обновляются каналы.
   * @param channelsConfig - Каналы которые нужно подписать на обнавления.
   */
  updateWatchers (component: unknown, channelsConfig: Array<СhannelsConfig>) {
    console.log('updateWatchers', component, channelsConfig)
    const oldWatcherConfigs = this.localWatchers.get(component) || []
    this.localWatchers.set(component, channelsConfig)
    const watchersToAdd = []
    const watchersToDelete = []
    for (const channelConfig of channelsConfig) {
      if (!oldWatcherConfigs.find(conf => conf.channelName === channelConfig.channelName)) {
        watchersToAdd.push(channelConfig)
      }
    }
    for (const channelConfig of oldWatcherConfigs) {
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
   * @param channelsData - Каналы и данные которые нужно записать.
   */
  setChannelsData (channelsData: Record<string, any>) {
    this.channelBusAPI.sendChannelsData(channelsData)
  }

  /**
   * Отписать каналы компонента, от обновления.
   * @param component - Компонент для которого обновляются каналы.
   */
  removeWatchers (component: unknown) {
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
   * @param channelsConfig - Каналы которые нужно подписать на обновления.
   */
  createServerWatchers (channelsConfig: Array<СhannelsConfig>) {
    const watchChannelNames = []
    for (const { channelName, onUpdate } of channelsConfig) {
      const watchers = this.serverWatchers.get(channelName)
      if (watchers) {
        watchers.add(onUpdate)
      } else {
        const watchers = new Set<Function>()
        watchers.add(onUpdate)
        this.serverWatchers.set(channelName, watchers)
        watchChannelNames.push(channelName)
      }
    }
    if (watchChannelNames.length > 0) {
      this.channelBusAPI.channelsWatch(watchChannelNames)
    }
    console.log('createServerWatchers', this)
  }

  /**
   * Отписать каналы от обновления.
   * Если число надсмотрщиков над каналом будет равно 0, то канал отписывается от сервера.
   * @param channelsConfig - Каналы которые нужно отписать от обновления.
   */
  removeServerWatchers (channelsConfig: Array<СhannelsConfig>) {
    const unwatchChannelNames = []
    for (const { channelName, onUpdate } of channelsConfig) {
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
      this.channelBusAPI.channelsUnwatch(unwatchChannelNames)
    }
    console.log('removeServerWatchers', this)
  }

  /**
   * Событие, обновления данных в канале.
   * @param params - В.
   */
  onNodeChannelUpdate ({ params: { id, data } }: EventChannelUpdate) {
    const watchers = this.serverWatchers.get(id)
    if (!watchers) {
      console.log(`onNodeChannelUpdate(${this.data})`)
      return
    }
    this.data.set(id, data)
    for (const watcher of watchers) {
      watcher(data)
    }
  }
}
