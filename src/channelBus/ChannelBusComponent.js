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
  watch: {
    channelsConfig: {
      immediate: true,
      handler () {
        const config = []
        for (let conf of this.channelsConfig) {
          const channelName = conf.nodeId + '/' + conf.channelName
          config.push({
            channelName,
            onUpdate: value => {
              this.channels[conf.propName] = value
              console.log(`onUpdate ${conf.propName} - ${value}`)
            }
          })
        }
        this.$channelBus.updateWatchers(this, config)
        this.channels = {}
        for (let conf of this.channelsConfig) {
          const channelName = conf.nodeId + '/' + conf.channelName
          this.$set(this.channels, conf.propName, this.$channelBus.data.get(channelName))
        }
      }
    }
  }
}
