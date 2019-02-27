<template>
  <div class="menu-item" @click="appendNodeConfig">
    StaticValueNode
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import StaticValueNode from './StaticValueNode'

export default {
  name: 'StaticValueNode-MenuItem',
  methods: {
    appendNodeConfig () {
      const nodeConfig = new StaticValueNode({
        title: 'StaticValueNode'
      })
      this.documentAppendNodeConfig(nodeConfig)
    },
    ...mapActions({
      documentAppendNodeConfig: 'document/appendNodeConfig'
    })
  }
}
</script>

<style scoped>
  .menu-item {
    padding: 15px;
    transition: background 0.1s ease-out;
  }
  .menu-item:hover {
    cursor: pointer;
    background: #555;
    transition: background 0.1s ease-out;
  }
</style>
