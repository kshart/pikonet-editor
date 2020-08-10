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

<script>
import { mapState, mapMutations } from 'vuex';
import ChannelBusComponent from '@/channelBus/ChannelBusComponent';

/**
 * @module StaticValueNode-ConfigPanel
 * @description Панель для настройки ноды StaticValueNode
 *
 * @vue-computed {Array<api.models.Channel>} value - Конфигурация каналов.
 * @vue-data {Object} nodeParams - Каналы ноды.
 * @vue-data {Object} nodeParams.nodeId - ID ноды.
 * @vue-data {Object} nodeParams.channels - Каналы ноды.
 */
export default {
  name: 'StaticValueNode-ConfigPanel',
  mixins: [ChannelBusComponent],
  data() {
    return {
      nodeParams: null,
    };
  },
  computed: {
    value: {
      get() {
        return this.node.value;
      },
      set(value) {
        if (!this.node) {
          return;
        }
        this.UPDATE_NODE_CONFIG({
          id: this.node.id,
          callback: (nodeConfig) => {
            this.$set(nodeConfig, 'value', value);
          },
        });
      },
    },
    channelsConfig() {
      if (!this.nodeParams) {
        return [];
      }
      return this.nodeParams.channels.map(({ name, id }) => ({
        propName: name,
        nodeId: this.nodeParams.nodeId,
        channelName: name,
      }));
    },
    ...mapState('document', {
      node: (state) => state.nodeConfigs.find((node) => node.id === state.nodeIdToConfigure),
    }),
  },
  mounted() {
    this.$api.channelBus.getChannelList(this.node.id)
      .then((nodeParams) => {
        this.nodeParams = nodeParams;
      });
  },
  methods: {
    ...mapMutations('document', ['UPDATE_NODE_CONFIG']),
  },
};
</script>

<style scoped>
  .config-panel {
    padding: 15px;
    background: #555;
  }
</style>
