<template>
  <LoadingScreen v-if="!isConnected" />
  <div v-else class="editor">
    <LeftPanel />
    <Workspace
      class="workspace"
      :rect="{
        width: 1600,
        height: 600
      }"
    />
    <component
      v-if="nodeConfigureComponent"
      :is="nodeConfigureComponent"
      :nodeId="nodeIdToConfigure"
      class="prop-manager"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import nodes from '@/nodes/index'
import Workspace from './Workspace'
import LeftPanel from './LeftPanel/LeftPanel'
import LoadingScreen from './LoadingScreen'

/**
 * @description Редактор схем. Основной компонент редактора.
 * @module editor/Editor
 * @vue-computed {String} nodeConfigureComponent - Имя компонента, редактора параметров нод.
 * @vue-computed {String} nodeIdToConfigure - ID ноды для редактирования параметров.
 * @vue-computed {Array<api/models/Node>} nodes - Список всех доступных нод.
 * @vue-computed {Boolean} isConnected - Наличие соединения с API.
 */
export default {
  name: 'Editor',
  components: {
    LeftPanel,
    Workspace,
    LoadingScreen
  },
  computed: {
    nodeConfigureComponent () {
      if (!this.nodeIdToConfigure) {
        return null
      }
      const node = this.nodes.find(node => node.id === this.nodeIdToConfigure)
      const nodeConf = nodes[node.type]
      if (!nodeConf) {
        return null
      }
      return nodeConf.configPanel
    },
    ...mapState('document', {
      nodes: state => state.nodeConfigs,
      isConnected: state => state.isConnected,
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
    color: #eee;
    background: #444;
  }
</style>
