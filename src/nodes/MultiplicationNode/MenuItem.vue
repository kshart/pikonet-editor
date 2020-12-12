<template>
  <div class="menu-item" @click="appendNodeConfig">
    Умножение 2 значений
  </div>
</template>

<script lang="ts">
import Node from '@/api/models/Node'
import MultiplicationNode from './MultiplicationNode'
import { mapActions } from 'vuex'
import { Component, Vue } from 'vue-property-decorator'

@Component({
  methods: mapActions({
    documentAppendNodeConfig: 'document/appendNodeConfig'
  })
})
export default class MultiplicationNodeMenuItem extends Vue {
  appendNodeConfig () {
    const nodeConfig = new MultiplicationNode({
      title: 'MultiplicationNode'
    })
    this.documentAppendNodeConfig(nodeConfig)
  }

  documentAppendNodeConfig!: (node: Node) => void
}
</script>

<style scoped>
  .menu-item {
    padding: 5px 15px;
    transition: background 0.1s ease-out;
  }
  .menu-item:hover {
    cursor: pointer;
    background: #555;
    transition: background 0.1s ease-out;
  }
</style>
