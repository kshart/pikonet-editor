<template>
  <div class="shape">
    <div class="shape-head" @click="$emit('select')" @mousedown.left="$emit('startDrag', $event)">
      {{ nodeConfig.type }}
      <br/>
      {{ nodeConfig.title }} - {{ nodeConfig.id }}
    </div>
    <button class="remove-button" @click="removeNodeConfig()">
      <FontAwesomeIcon icon="trash-alt" :style="{ color: 'white' }" />
    </button>
    <div class="shape-body">
      <div class="link">
        <Link :id="nodeConfig.id + '/value1'"/>
      </div>
      <div class="link">
        <Link :id="nodeConfig.id + '/value2'"/>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import Link from '@/calcNet/editor/Document/Link'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons'

library.add(faTrashAlt)

/**
 * @vue-prop {MultiplicationNode} nodeConfig конфигурация ноды
 */
export default {
  name: 'MultiplicationNode-Shape',
  components: {
    Link
  },
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
  .shape {
    background: #eee;
    border: 1px #bbb solid;
    margin: 0;
    padding: 0;
    width: 300px;
  }
  .shape-body {
    display: flex;
  }
  .shape-head {
    position: relative;
    background: #333;
    padding: 4px;
    padding-right: 20px;
    color: #eee;
    font-size: 14px;
    text-align: left;
  }
  .link {
    display: flex;
    align-items: center;
    padding: 5px;
    background: #ccc;
    border-left: 1px #bbb solid;
  }

  .remove-button {
    right: 0;
    top : 0;
    width: 40px;
    height: 40px;
    position: absolute;
    background: none;
    border: none;
    font-size: 20px;
  }
  .remove-button:active {
    background: #fff;
  }
</style>
