/**
 * Модуль для работы с каналами.
 * @namespace channelBus
 */

/**
 * Класс для хранения настроек приема данных из ноды.
 * @typedef {Object} ChannelBusConfig
 * @memberof channelBus
 * @property {String} propNme - Имя параметра из `channels` в который будут приходить данные.
 * @property {String} nodeId - Имя ноды в которой находится канал.
 * @property {String} channelName - Имя канала из которого нужно брать данные.
 */

import ChannelBusManager from './ChannelBusManager'

const channelBusManager = new ChannelBusManager()

export default {
  install (Vue) {
    Vue.mixin({
      beforeCreate () {
        this.$channelBus = channelBusManager
      }
    })
  }
}
