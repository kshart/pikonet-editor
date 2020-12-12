<template>
  <div class="config-panel">
    MultiplicationNode
  </div>
</template>

<script lang="ts">
import Node from '@/api/models/Node'
import { mapState } from 'vuex'
import { channelBusAPI } from '@/api/index'
import { Component, Vue } from 'vue-property-decorator'

@Component({
  computed: {
    ...mapState('document', {
      node: state => state.nodeConfigs.find(node => node.id === state.nodeIdToConfigure)
    })
  }
})
export default class MultiplicationNodeConfigPanel extends Vue {
  node!: Node;
  mounted () {
    channelBusAPI.getChannelList(this.node.id)
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
