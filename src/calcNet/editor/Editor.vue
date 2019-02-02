<template>
  <div class="editor">
    <ItemSelector />
    <Workspace
      class="workspace"
      :rect="{
        width: 1600,
        height: 600
      }"
    />
    <div class="prop-manager">
      {{ nodeIdToConfigure }}
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Workspace from './Workspace'
import ItemSelector from './ItemSelector/ItemSelector'

export default {
  name: 'Editor',
  components: {
    Workspace,
    ItemSelector
  },
  computed: {
    ...mapState('document', {
      nodeIdToConfigure: state => state.nodeIdToConfigure
    })
  }
}
</script>

<style scoped>
  .editor {
    display: flex;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: #f00;
  }

  .workspace {
    width: 100%;
    height: 100%;
    background: #fff;
    color: #333;
  }

  .prop-manager {
    width: 300px;
    background: #0f0;
  }
</style>
