
interface Point {
  x: 0;
  y: 0;
}

/**
 * Класс для хранения настроек ноды.
 * @author Артём Каширин <kshart@yandex.ru>
 */
export default class Node {
  /**
   * Уникальный ключ ноды
   */
  id: string

  /**
   * Имя типа ноды
   */
  type: string

  /**
   * Имя сервера к которому прикреплен
   */
  server: string

  /**
   * Координаты ноды на графической схеме
   */
  position: Point

  /**
   * Заголовок ноды
   */
  title: string

  /**
   * Параметры для внешних систем
   * @type {Object}
   * @property {Array<api.models.Channel>} channels каналы.
   */
  external = {}

  constructor ({ id, type, server, position, title }: Node) {
    this.id = id
    this.type = type
    this.server = server
    this.position = position
    this.title = title
  }
}
