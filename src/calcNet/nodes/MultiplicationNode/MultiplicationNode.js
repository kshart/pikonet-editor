
import Node from '@/calcNet/config/Node'

/**
 * Класс для хранения настроек ноды.
 * @memberof calcNet.config
 */
export default class MultiplicationNode extends Node {
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
      type: 'MultiplicationNode'
    })
  }
}
