const createChannelNameFromConfig = conf => conf.nodeId + '/' + conf.channelName

/**
 * @module ChannelBusComponent
 * @description Примеси для упрощения работы с данными из каналов
 * @memberof channelBus
 *
 * @vue-computed {Array<api.models.Channel>} channelsConfig - Конфигурация каналов.
 * @vue-data {Object} channels - Данные из каналов.
 */
export default {
  data () {
    return {
      channels: {}
    }
  },
  beforeDestroy () {
    this.$channelBus.removeWatchers(this)
  },
  methods: {
    /**
     * Отправить данные в канал.
     * @param {String} propName - Имя канала.
     * @param {any} data - Данные которые нужно записать.
     */
    setChannelData (propName, data) {
      const channel = this.channelsConfig.find(conf => conf.propName === propName)
      if (!channel) {
        console.error(`ChannelBusComponent::setChannelData канал с propName = '${propName}' не найден.`)
        return
      }
      const channelName = createChannelNameFromConfig(channel)
      this.$channelBus.setChannelsData({ [channelName]: data })
    }
  },
  watch: {
    channelsConfig: {
      immediate: true,
      handler () {
        if (!Array.isArray(this.channelsConfig)) {
          console.error(`ChannelBusComponent::channelsConfig не является масивом`)
          return
        }
        const config = []
        for (let conf of this.channelsConfig) {
          config.push({
            channelName: createChannelNameFromConfig(conf),
            onUpdate: value => {
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
  }
}
