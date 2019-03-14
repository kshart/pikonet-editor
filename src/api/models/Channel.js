/**
 * @author Артём Каширин <kshart@yandex.ru>
 * @fileoverview Module
 */

/**
 * Класс для хранения настроек канала.
 * @class
 * @memberof module:api/models
 */
export default class Channel {
  constructor ({ id, name, writable }) {
    /**
     * Уникальный ключ канала
     * @type {!String}
     */
    this.id = id

    /**
     * Имя канала у ноды
     * @type {!String}
     */
    this.name = name

    /**
     * Доступность сигнала на запись
     * @type {Boolean}
     */
    this.writable = writable
  }
}
