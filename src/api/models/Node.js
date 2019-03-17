/**
 * Класс для хранения настроек ноды.
 * @author Артём Каширин <kshart@yandex.ru>
 * @memberof api.models
 */
export default class Node {
  constructor ({ id, type, server, position, title }) {
    /**
     * Уникальный ключ ноды
     * @type {!String}
     */
    this.id = id

    /**
     * Имя типа ноды
     * @type {!String}
     */
    this.type = type

    /**
     * Имя сервера к которому прикреплен
     * @type {String}
     */
    this.server = server

    /**
     * Координаты ноды на графической схеме
     * @type {!Point}
     */
    this.position = position

    /**
     * Заголовок ноды
     * @type {String}
     */
    this.title = title

    /**
     * Параметры для внешних систем
     * @type {Object}
     * @property {Array<api.models.Channel>} channels каналы.
     */
    this.external = {}
  }
}
