import Vue from 'vue'
import { PluginObject } from 'vue/types'
import ContextMenu from './Component.vue'

export interface CreateContextMenuOptions {
  event: any;
  list: any;
}

declare module 'vue/types/vue' {
  interface Vue {
    $createContextMenu(options: CreateContextMenuOptions): void;
  }
}

const module = {
  install (Vue) {
    Vue.component('ContextMenu', ContextMenu)
    Vue.mixin({
      beforeCreate () {
        this.$createContextMenu = ({ event, list }) => {
          const position = {
            x: event.clientX,
            y: event.clientY
          }
          const contextMenu = new Vue({
            render: h => h('ContextMenu', {
              props: {
                position,
                list
              }
            })
          })
          contextMenu.$mount()
          document.documentElement.appendChild(contextMenu.$el)
        }
      }
    })
  }
} as PluginObject<null>

export default module
