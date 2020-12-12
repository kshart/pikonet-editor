import Vue from 'vue'
import { Mixin } from 'vue-mixin-decorator'
import { Watch } from 'vue-property-decorator'
import channelBus from '@/channelBus/index'

/**
 * Настройки для привязки каналов.
 */
interface ChannelConfig {
  /**
   * Имя параметра из `channels` в который будут приходить данные.
   */
  propName: string

  /**
   * Имя ноды в которой находится канал.
   */
  nodeId: string

  /**
   * Имя канала из которого нужно брать данные.
   */
  channelName: string
}

/**
 * Данные из каналов.
 */
interface ChannelsData {
  [propName: string]: any
}

const createChannelNameFromConfig = (conf: ChannelConfig) => conf.nodeId + '/' + conf.channelName

/**
 * Примеси для упрощения работы с данными из каналов
 */
@Mixin
export default class ChannelBusMixin extends Vue {
  channels = <ChannelsData>{}

  /**
   * Конфигурация каналов.
   */
  get channelsConfig (): Array<ChannelConfig> {
    return []
  }

  beforeDestroy () {
    this.$channelBus.removeWatchers(this)
  }

  /**
   * Отправить данные в канал.
   * @param propName - Имя канала.
   * @param data - Данные которые нужно записать.
   */
  setChannelData (propName: string, data: any) {
    const channel = this.channelsConfig.find(conf => conf.propName === propName)
    if (!channel) {
      console.error(`ChannelBusComponent::setChannelData канал с propName = '${propName}' не найден.`)
      return
    }
    const channelName = createChannelNameFromConfig(channel)
    this.$channelBus.setChannelsData({ [channelName]: data })
  }

  @Watch('channelsConfig', { immediate: true })
  handler () {
    if (!Array.isArray(this.channelsConfig)) {
      console.error(`ChannelBusComponent::channelsConfig не является масивом`)
      return
    }
    const config = []
    for (let conf of this.channelsConfig) {
      config.push({
        channelName: createChannelNameFromConfig(conf),
        onUpdate: (value: any) => {
          this.channels[conf.propName] = value
        }
      })
    }
    this.$channelBus.updateWatchers(this, config)
    this.channels = {}
    for (let conf of this.channelsConfig) {
      const channelName = createChannelNameFromConfig(conf)
      this.$set(this.channels, conf.propName, this.$channelBus.data.get(channelName))
    }
  }
}
