<template>
  <div class="left-panel">
    <div class="left-panel__head">Pikonet Editor</div>
    <div class="panel-block">
      <div class="panel-block__title" @click="showNodeTypes = !showNodeTypes">Создать новую ноду</div>
      <div v-if="showNodeTypes" class="panel-block__content">
        <component v-for="(item, key) of items" :key="key" :is="key + 'MenuItem'" @select="$emit('select', key)" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import items from '@/nodes/index'
import { Component, Vue } from 'vue-property-decorator'

const components = {} as Record<string, typeof Vue>
for (const key in items) {
  const item = items[key]
  components[key + 'MenuItem'] = item.menuItem
}

@Component({
  components
})
export default class LeftPanel extends Vue {
  private items = items
  private showNodeTypes = true
}
</script>

<style scoped>
  .left-panel {
    width: 250px;
    background: #444;
  }
  .left-panel__head {
    padding: 15px 15px;
    font-size: 18px;
    color: #bbb;
  }
  .panel-block__title {
    background: #555;
    padding: 10px 15px;
    color: #eee;
  }
  .panel-block__content {
    color: #eee;
  }
</style>
