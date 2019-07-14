<template>
  <BaseShape :nodeConfig="nodeConfig" @select="$emit('select')" @startDrag="$emit('startDrag', $event)">
    <slot>
      <div class="shape-content">
        Значение: {{ channels.value }}
      </div>
      <div class="link">
        <Link :id="nodeConfig.id + '/value'"/>
      </div>
    </slot>
  </BaseShape>
</template>

<script>
import Link from '@/editor/Document/Link'
import BaseShape from '@/editor/BaseShape'
import ChannelBusClient from '@/channelBus/ChannelBusComponent'

/**
 * @description Нода для статического числа.
 *
 * @vue-prop {Number} initialCounter - Initial counter's value
 * @vue-prop {StaticValueNode} nodeConfig конфигурация ноды
 */
export default {
  name: 'StaticValueNodeShape',
  components: {
    Link,
    BaseShape
  },
  mixins: [ ChannelBusClient ],
  props: ['nodeConfig'],
  computed: {
    channelsConfig () {
      return [
        {
          propName: 'value',
          nodeId: this.nodeConfig.id,
          channelName: 'value'
        }
      ]
    }
  }
}
</script>

<style scoped>
  .shape-content {
    width: 100%;
    padding: 5px 15px;
  }
  .link {
    display: flex;
    align-items: center;
    padding: 5px;
    background: #ccc;
    border-left: 1px #bbb solid;
  }
</style>
