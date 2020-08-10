<template>
  <div class="document">
    <div class="components-layer">
      <component
        v-for="(nodeConfig, key) of document.nodeConfigs"
        :key="key"
        :is="nodeConfig.type + 'Shape'"
        :nodeConfig="nodeConfig"
        :style="{
          transform: `translateX(${nodeConfig.view.position.x}px) translateY(${nodeConfig.view.position.y}px)`
        }"
        :ref="'nodeConfig' + nodeConfig.id"
        class="item"
        @select="documentSelectNodeToConfigure(nodeConfig.id)"
        @startDrag="mouseDown($event, nodeConfig.id)"
        @mousedown.native.left.alt="mouseDown($event, nodeConfig.id)"
      >
      </component>
    </div>
    <LinksLayer class="links-layer" :bbox="bbox" />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import items from '@/nodes/index'
import LinksLayer from './LinksLayer'

const componentItems = {}
for (const key in items) {
  const item = items[key]
  componentItems[key + 'Shape'] = item.shape
}

export default {
  name: 'Document',
  components: {
    ...componentItems,
    LinksLayer
  },
  data () {
    return {
      /**
       * ID ноды для drag&drop
       */
      selectedNodeConfigId: null,

      /**
       * Отступ для drag&drop
       * @member {?Point}
       */
      offset: null,
      bbox: {
        x: null,
        y: null,
        width: null,
        height: null
      }
    }
  },
  computed: {
    ...mapState(['document'])
  },
  mounted () {
    setTimeout(() => this.$nextTick(() => {
      this.updateBBox()
    }), 100)
  },
  beforeDestroy () {
    window.removeEventListener('mousemove', this.mouseMove)
    window.removeEventListener('mouseup', this.mouseUp)
  },
  methods: {
    updateBBox () {
      let x = null
      let y = null
      let x2 = null
      let y2 = null
      for (const nodeConfig of this.document.nodeConfigs) {
        if (this.$refs['nodeConfig' + nodeConfig.id]) {
          const $vue = this.$refs['nodeConfig' + nodeConfig.id][0]
          const nodeBbox = $vue.$el.getBoundingClientRect()
          if (x === null || nodeBbox.x < x) {
            x = nodeBbox.x
          }
          if (y === null || nodeBbox.y < y) {
            y = nodeBbox.y
          }
          if (x2 === null || (nodeBbox.x + nodeBbox.width) > x2) {
            x2 = nodeBbox.x + nodeBbox.width
          }
          if (y2 === null || (nodeBbox.y + nodeBbox.height) > y2) {
            y2 = nodeBbox.y + nodeBbox.height
          }
        }
      }
      const elBBox = this.$el.getBoundingClientRect()
      this.bbox = {
        offsetX: x,
        offsetY: y,
        x: x - elBBox.x,
        y: y - elBBox.y,
        width: x2 - x,
        height: y2 - y
      }
    },
    mouseDown (event, nodeConfigId) {
      this.selectedNodeConfigId = nodeConfigId
      const bbox = this.$el.getBoundingClientRect()
      this.offset = {
        x: bbox.x,
        y: bbox.y
      }
      if (this.$refs['nodeConfig' + nodeConfigId]) {
        const itemBbox = this.$refs['nodeConfig' + nodeConfigId][0].$el.getBoundingClientRect()
        this.offset.x += event.clientX - itemBbox.x
        this.offset.y += event.clientY - itemBbox.y
      }
      this.$nextTick(vue => {
        window.addEventListener('mousemove', this.mouseMove)
        window.addEventListener('mouseup', this.mouseUp)
        document.documentElement.style.pointerEvents = 'none'
      })
    },
    mouseMove (event) {
      if (!this.selectedNodeConfigId || !this.offset) {
        return
      }
      this.documentUpdateNodeConfig({
        id: this.selectedNodeConfigId,
        callback: nodeConfig => {
          const align = 25
          const x = event.clientX - this.offset.x
          const y = event.clientY - this.offset.y
          nodeConfig.view.position.x = Math.round(x / align) * align
          nodeConfig.view.position.y = Math.round(y / align) * align
          this.updateBBox()
        }
      })
      event.preventDefault()
      event.stopPropagation()
    },
    mouseUp (event) {
      this.selectedNodeConfigId = null
      document.documentElement.style.pointerEvents = 'all'
      window.removeEventListener('mousemove', this.mouseMove)
      this.updateBBox()
    },
    ...mapMutations({
      documentUpdateNodeConfig: 'document/UPDATE_NODE_CONFIG',
      documentSelectNodeToConfigure: 'document/SELECT_NODE_TO_CONFIGURE'
    })
  },
  watch: {
    'document.nodeConfigs' () {
      this.$nextTick(() => this.updateBBox())
    }
  }
}
</script>

<style scoped>
  .document {
    background: #00f;
    position: absolute;
    /* width: 100px;
    height: 100px; */
  }
  .item {
    z-index: -1;
    position: absolute;
  }
  .components-layer {
    z-index: 1;
  }
  .links-layer {
    z-index: 2;
  }
</style>
