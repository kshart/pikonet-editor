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

<script lang="ts">
import Link from '@/editor/Document/Link.vue'
import BaseShape from '@/editor/BaseShape.vue'
import ChannelBusComponent from '@/channelBus/ChannelBusComponent'
import StaticValueNode from './StaticValueNode'
import { override } from '@/decorators'
import { Component, Prop, Mixins } from 'vue-property-decorator'

/**
 * @description Нода для статического числа.
 *
 * @vue-prop {number} initialCounter - Initial counter's value
 * @vue-prop {StaticValueNode} nodeConfig конфигурация ноды
 */
@Component({
  components: {
    Link,
    BaseShape
  }
})
export default class StaticValueNodeShape extends Mixins(ChannelBusComponent) {
  /**
   * Конфигурация ноды
   */
  @Prop({ required: true })
  readonly nodeConfig!: StaticValueNode

  /**
   * @inheritdoc
   */
  @override
  get channelsConfig () {
    return [
      {
        propName: 'value',
        nodeId: this.nodeConfig.id,
        channelName: 'value'
      }
    ]
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
