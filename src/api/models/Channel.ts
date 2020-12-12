/**
 * Класс для хранения настроек канала.
 * @author Артём Каширин <kshart@yandex.ru>
 */
export default class Channel {
  /**
   * Уникальный ключ канала
   */
  id: string

  /**
   * Имя канала у ноды
   */
  name: string

  /**
   * Доступность сигнала на запись
   */
  writable: boolean

  constructor ({ id, name, writable }: Channel) {
    this.id = id
    this.name = name
    this.writable = writable
  }
}
