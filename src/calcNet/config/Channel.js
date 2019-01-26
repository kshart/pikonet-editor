
/**
 * Класс для хранения настроек канала.
 * @memberof calcNet.config
 */
export class Channel {
  /**
   * Уникальный ключ канала
   * {NodeId}.name
   * @type {!string}
   */
  id = null

  /**
   * Имя канала у ноды
   */
  name = null

  // readable = true

  /**
   * Доступность сигнала на запись
   * @type {boolean}
   */
  writable = false

  // data = null

  /**
   * Линки к другим каналам
   * @type {Array.<calcNet.config.Link>}
   */
  links = []

  /**
   * Конструктор для конфига канала
   * @param {object} config параметры для создания канала
   */
  constructor ({ id, name, writable }) {
    this.id = id
    this.name = name
    this.writable = writable
  }
}
