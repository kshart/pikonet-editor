/**
 * Класс для хранения настроек соединений.
 * @author Артём Каширин <kshart@yandex.ru>
 */
export default class Link {
  /**
   * Имя канала куда будут отправленны данные.
   */
  from: string

  /**
   * Имя канала куда будут отправленны данные.
   */
  to: string

  /**
   * Тип соединения.
   */
  type: string

  constructor ({ from, to, type }: Link) {
    this.from = from
    this.to = to
    this.type = type
  }
}
