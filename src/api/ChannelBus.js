/**
 * API для работы с данными каналов.
 * @author Артём Каширин <kshart@yandex.ru>
 * @memberof module:api
 */
export default class ChannelBus {
  constructor ({ api }) {
    /**
     * Уникальный ключ канала
     * @type {String}
     */
    this.api = api

    this.registredChannels = new Map()
  }

  getChannelList (nodeId) {
  }
  channelRead (channelId) {
  }

  /**
   * Отправить данные в канал.
   * @param {String} channelId - ID канала.
   * @param {any} data - Данные которые необходимо записать в канал.
   */
  channelSend (channelId, data) {
    console.log(channelId, data)
  }

  /**
   * Зарегистрировать просмотрщик канала.
   * @param {String} channelId - ID канала.
   * @param {any} component - Компонент для которого регистрируется слушатель канала.
   */
  channelWatch (channelId, component = null) {
    console.log(channelId, component)
  }

  /**
   * Удалить просмотрщик канала.
   * @param {String} channelId - ID канала.
   * @param {any} component - Компонент для которого был зарегистрирован слушатель канала.
   */
  channelUnwatch (channelId, component = null) {
    console.log(channelId, component)
  }
}
