/**
 * Соединение с API.
 * @author Артём Каширин <kshart@yandex.ru>
 * @memberof api
 */
export default class Api {
  install (Vue) {
    Vue.mixin({
      beforeCreate () {
        const options = this.$options
        if (options.api) {
          this.$api = typeof options.api === 'function'
            ? options.api()
            : options.api
        } else if (options.parent && options.parent.$api) {
          this.$api = options.parent.$api
        }
      }
    })
  }

  constructor ({ modules }) {
    this.modules = modules
    for (let moduleName in modules) {
      this[moduleName] = modules[moduleName]
    }
  }
}
