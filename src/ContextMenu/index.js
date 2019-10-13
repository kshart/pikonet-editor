
import ContextMenu from './Component'

export default {
  install (Vue) {
    Vue.component('ContextMenu', ContextMenu)
    Vue.mixin({
      beforeCreate () {
        this.$createContextMenu = ({ event, list }) => {
          const position = {
            x: event.clientX,
            y: event.clientY
          }
          const contextMenu = new Vue({ render: h => h('ContextMenu', {
            props: {
              position,
              list
            }
          }) })
          contextMenu.$mount()
          document.documentElement.appendChild(contextMenu.$el)
        }
      }
    })
  }
}
