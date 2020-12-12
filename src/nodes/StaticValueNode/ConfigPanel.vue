<template>
  <div class="config-panel">
    StaticValueNode
    <input v-model="value" />
    <div v-if="nodeParams">
      <h4>Каналы:</h4>
      <div v-for="channel of nodeParams.channels" :key="channel.id">
        {{ channel.name }} - {{ channel.id }}
        <input
          :value="channels[channel.name]"
          @change="setChannelData(channel.name, $event.target.value)"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { mapState, mapMutations } from 'vuex'
import { channelBusAPI } from '@/api/index'
import Node from '@/api/models/Node'
import ChannelBusComponent from '@/channelBus/ChannelBusComponent'
import { Component, Mixins } from 'vue-property-decorator'

/**
 * @module StaticValueNode-ConfigPanel
 * @description Панель для настройки ноды StaticValueNode
 *
 * @vue-data {Object} nodeParams - Каналы ноды.
 * @vue-data {Object} nodeParams.nodeId - ID ноды.
 * @vue-data {Object} nodeParams.channels - Каналы ноды.
 */
@Component({
  methods: {
    ...mapMutations('document', {
      updateNodeConfig: 'UPDATE_NODE_CONFIG'
    })
  },
  computed: {
    ...mapState('document', {
      node: state => state.nodeConfigs.find(node => node.id === state.nodeIdToConfigure)
    })
  }
})
export default class StaticValueNodeConfigPanel extends Mixins(ChannelBusComponent) {
  node!: Node
  nodeParams: Node | null = null
  updateNodeConfig!: (payload: any) => void

  get value () {
    return null // this.node.value
  }

  set value (value) {
    if (!this.node) {
      return
    }
    this.updateNodeConfig({
      id: this.node.id,
      callback: (nodeConfig) => {
        this.$set(nodeConfig, 'value', value)
      }
    })
  }

  get channelsConfig () {
    if (!this.nodeParams) {
      return []
    }
    return this.nodeParams.channels.map(({ name, id }) => ({
      propName: name,
      nodeId: this.nodeParams.nodeId,
      channelName: name
    }))
  }

  mounted () {
    channelBusAPI.getChannelList(this.node.id)
      .then((nodeParams) => {
        this.nodeParams = nodeParams
      })
  }
}
</script>

<style scoped>
  .config-panel {
    padding: 15px;
    background: #555;
  }
</style>
