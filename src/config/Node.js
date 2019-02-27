
/**
 * Класс для хранения настроек ноды.
 * @memberof calcNet.config
 */
export default class Node {
  /**
   * Уникальный ключ ноды
   * @type {!string}
   */
  id = null

  /**
   * Имя типа ноды
   * @type {!string}
   */
  type = null

  /**
   * Имя сервера к которому прикреплен
   * @type {string}
   */
  server = null

  /**
   * Координаты ноды на графической схеме
   * @type {!Point}
   */
  position = null

  /**
   * Заголовок ноды
   * @type {string}
   */
  title = ''

  /**
   * Параметры для внешних систем
   * @type {object}
   * @property {Array.<calcNet.config.Channel>} channels каналы.
   */
  external = {
  }

  /**
   * Конструктор для конфига ноды
   * @param {object} config параметры для создания ноды
   */
  constructor ({ id, type, server, position, title }) {
    this.id = id
    this.type = type
    this.server = server
    this.position = position
    this.title = title
  }
}
