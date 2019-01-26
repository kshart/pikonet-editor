<template>
  <div class="item-selector">
    <component v-for="(item, key) of items" :key="key" :is="key + 'MenuItem'" @select="$emit('select', key)" />
  </div>
</template>

<script>
import items from '@/calcNet/nodes/index'

const components = {}
for (let key in items) {
  const item = items[key]
  components[key + 'MenuItem'] = item.menuItem
}

export default {
  name: 'ItemSelector',
  components,
  data () {
    return {
      items
    }
  }
}
</script>

<style scoped>
  .item-selector {
    background: #444;
    color: #eee;
  }
</style>
