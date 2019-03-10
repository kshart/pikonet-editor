<template>
  <div class="base-shape">
    <div class="base-shape-head" @mousedown.left="$emit('startDrag', $event)">
      {{ nodeConfig.type }}
      <br/>
      {{ nodeConfig.title }} - {{ nodeConfig.id }}
    </div>
    <button class="button button-update" @click="$emit('select')">
      <FontAwesomeIcon icon="cogs" :style="{ color: 'white' }" />
    </button>
    <button class="button button-remove" @click="removeNodeConfig()">
      <FontAwesomeIcon icon="trash-alt" :style="{ color: 'white' }" />
    </button>
    <div class="base-shape-body">
      <slot>
      </slot>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faCogs, faTrashAlt } from '@fortawesome/free-solid-svg-icons'

library.add(faCogs)
library.add(faTrashAlt)

/**
 * @description Шаблон для отображения нод в рабочем пространстве.
 *
 * @vue-prop {Number} initialCounter - Initial counter's value
 * @vue-prop {StaticValueNode} nodeConfig конфигурация ноды
 */
export default {
  name: 'BaseShape',
  props: ['nodeConfig'],
  methods: {
    removeNodeConfig () {
      this.documentRemoveNodeConfig(this.nodeConfig.id)
    },
    ...mapActions({
      documentRemoveNodeConfig: 'document/removeNodeConfig'
    })
  }
}
</script>

<style scoped>
  .base-shape {
    background: #eee;
    border: 1px #bbb solid;
    margin: 0;
    padding: 0;
    width: 300px;
  }
  .base-shape-body {
    display: flex;
  }
  .base-shape-head {
    position: relative;
    background: #333;
    padding: 4px;
    padding-right: 20px;
    color: #eee;
    font-size: 14px;
    text-align: left;
  }

  .button {
    width: 40px;
    height: 40px;
    position: absolute;
    background: none;
    border: none;
    font-size: 20px;
    outline: none;
  }
  .button:hover {
    background: #555;
  }
  .button:active {
    background: #666;
  }
  .button-remove {
    right: 0;
    top : 0;
  }
  .button-update {
    right: 40px;
    top : 0;
  }
</style>
