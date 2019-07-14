/**
 * @module ChannelBusComponent
 * @description Примеси для упрощения работы с данными из каналов
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
  mounted () {
    // channelsMap.set(this, this.channelsConfig)
  },
  watch: {
    channelsConfig: {
      immediate: true,
      handler () {
        const config = []
        for (let conf of this.channelsConfig) {
          const channelName = conf.nodeId + '#' + conf.channelName
          config.push({
            channelName,
            onUpdate (value) {
              console.log(`onUpdate ${channelName} - ${value}`)
            }
          })
        }
        this.$channelBus.updateWatchers(this, config)
        this.channels = {}
        for (let conf of this.channelsConfig) {
          this.channels[conf.propName] = 0
        }
      }
    }
  }
}
