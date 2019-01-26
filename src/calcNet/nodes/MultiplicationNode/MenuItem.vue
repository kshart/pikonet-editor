<template>
  <div class="menu-item" @click="appendNodeConfig">
    MultiplicationNode
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import MultiplicationNode from './MultiplicationNode'

export default {
  name: 'MultiplicationNode-MenuItem',
  methods: {
    appendNodeConfig () {
      const nodeConfig = new MultiplicationNode({
        position: {
          x: Math.random() * 100,
          y: Math.random() * 100
        },
        title: 'MultiplicationNode'
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
