<template>
  <div class="editor">
    <ItemSelector />
    <Workspace
      class="workspace"
      :rect="{
        width: 1600,
        height: 600
      }"
    />
    <div class="prop-manager">
      {!{ schema }!}
    </div>
  </div>
</template>

<script>
import Workspace from './Workspace'
import ItemSelector from './ItemSelector/ItemSelector'

/**
 * Точка с координатами `x` и `y`
 * @typedef {Object} Point
 * @property {number} x
 * @property {number} y
 */

/**
 * Точка с координатами `x` и `y`
 * @typedef {Object} calcNet.Node
 * @property {number} type
 * @property {string} server Имя сервера к которому прикреплен
 * @property {Point} position
 * @property {number} title
 */

/**
 * Объект с всеми начстройками ???
 * @typedef {Object} Schema
 * @property {Array.<Schema.Item>} items  - Штуки в объекте.
 */

export default {
  name: 'Editor',
  components: {
    Workspace,
    ItemSelector
  }
}
</script>

<style scoped>
  .editor {
    display: flex;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: #f00;
  }

  .workspace {
    width: 100%;
    height: 100%;
    background: #fff;
    color: #333;
  }

  .prop-manager {
    width: 300px;
    background: #0f0;
  }
</style>
