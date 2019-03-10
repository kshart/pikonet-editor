<template>
  <BaseShape :nodeConfig="nodeConfig" @select="$emit('select')" @startDrag="$emit('startDrag', $event)">
    <slot>
      in1
      <div class="link">
        <Link :id="nodeConfig.id + '/in1'"/>
      </div>
      in2
      <div class="link">
        <Link :id="nodeConfig.id + '/in2'"/>
      </div>
      value
      <div class="link">
        <Link :id="nodeConfig.id + '/value'"/>
      </div>
    </slot>
  </BaseShape>
</template>

<script>
import Link from '@/editor/Document/Link'
import BaseShape from '@/editor/BaseShape'

/**
 * Нода для умножения.
 * @vue-prop {MultiplicationNode} nodeConfig конфигурация ноды
 */
export default {
  name: 'MultiplicationNode-Shape',
  components: {
    Link,
    BaseShape
  },
  props: ['nodeConfig']
}
</script>

<style scoped>
  .link {
    display: flex;
    align-items: center;
    padding: 5px;
    background: #ccc;
    border-left: 1px #bbb solid;
  }
</style>
