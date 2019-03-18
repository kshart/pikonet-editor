<template>
  <div class="config-panel">
    MultiplicationNode
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'MultiplicationNode-ConfigPanel',
  computed: {
    ...mapState('document', {
      node: state => state.nodeConfigs.find(node => node.id === state.nodeIdToConfigure)
    })
  },
  mounted () {
    this.$api.channelBus.getChannelList(this.node.id)
      .then(channels => console.log(channels))
  }
}
</script>

<style scoped>
  .config-panel {
    padding: 15px;
    background: #555;
  }
</style>
