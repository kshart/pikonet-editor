/**
 * Класс для хранения настроек соединений.
 * @author Артём Каширин <kshart@yandex.ru>
 * @memberof api.models
 */
export default class Link {
  constructor ({ from, to, type }) {
    /**
     * Имя канала куда будут отправленны данные.
     * @type {String}
     */
    this.from = from

    /**
     * Имя канала куда будут отправленны данные.
     * @type {String}
     */
    this.to = to

    /**
     * Тип соединения.
     * @type {String}
     */
    this.type = type
  }
}
