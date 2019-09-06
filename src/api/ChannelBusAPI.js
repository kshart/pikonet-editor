/**
 * API для работы с данными каналов.
 * @author Артём Каширин <kshart@yandex.ru>
 * @memberof api
 */
export default class ChannelBusAPI {
  constructor ({ connection }) {
    this.connection = connection

    this.channelsData = new Map()
  }

  /**
   * Соединение с API есть и watcher'ы для каналов на сервере зарегистрированны
   * @return {boolean}
   */
  get connected () {
    return this.connection.connected
  }

  on () {
    this.connection.addEventListener.apply(this.connection, arguments)
  }

  off () {
    this.connection.removeEventListener.apply(this.connection, arguments)
  }

  getChannelList (nodeId) {
    return this.connection.send('nodeGetChannelList', { nodeId }, { waitResult: true })
  }

  channelRead (channelId) {
  }

  /**
   * Отправить данные в канал.
   * @param {String} channelName - ID канала.
   * @param {any} data - Данные которые необходимо записать в канал.
   */
  channelSend (channelName, data) {
    console.log(channelName, data)
  }

  /**
   * Зарегистрировать просмотрщик канала.
   * @param {Array<String>} channelNames - ID канала.
   */
  channelsWatch (channelNames) {
    this.connection.send('nodeChannelsWatch', { channelNames })
  }

  /**
   * Удалить просмотрщик канала.
   * @param {Array<String>} channelNames - ID канала.
   */
  channelsUnwatch (channelNames) {
    console.log('channelsUnwatch', channelNames)
  }
}
