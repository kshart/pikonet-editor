
import Node from '@/api/models/Node'

/**
 * Класс для хранения настроек ноды.
 * @memberof calcNet.config
 */
export default class StaticValueNode extends Node {
  /**
   * Имя типа ноды
   * @type {!string}
   */
  // type = null

  /**
   * Конструктор для конфига ноды
   * @param {object} config параметры для создания ноды
   */
  constructor (config) {
    super({
      ...config,
      type: 'StaticValueNode'
    })
  }
}
