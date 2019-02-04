<template>
  <div class="config-panel">
    StaticValueNode
    <input v-model="value" />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'StaticValueNode-ConfigPanel',
  computed: {
    value: {
      get () {
        return this.node.value
      },
      set (value) {
        if (!this.node) {
          return
        }
        this.UPDATE_NODE_CONFIG({
          id: this.node.id,
          callback: nodeConfig => {
            this.$set(nodeConfig, 'value', value)
          }
        })
      }
    },
    ...mapState('document', {
      node: state => state.nodeConfigs.find(node => node.id === state.nodeIdToConfigure)
    })
  },
  methods: {
    ...mapMutations('document', ['UPDATE_NODE_CONFIG'])
  }
}
</script>

<style scoped>
  .config-panel {
    padding: 15px;
    background: #555;
  }
</style>
