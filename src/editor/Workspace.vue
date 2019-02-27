<template>
  <div
    class="workspace-box"
    @mouseenter="mouseEnter"
    @mouseleave="mouseLeave"
    @mousedown.right="mouseDown"
    @contextmenu.capture.prevent
  >
    <svg v-if="showGrid" class="grid" :viewBox="`0 0 ${rect.width} ${rect.height}`" :style="gridPosition">
      <line
        v-for="(item, key) in grid"
        class="grid-line"
        :key="key"
        :x1="item.x1"
        :y1="item.y1"
        :x2="item.x2"
        :y2="item.y2"
      />
    </svg>
    <Document
      ref="document"
      class="document"
      preserveAspectRatio="none"
      :style="documentStyle"
      @click.native="click"
    />
  </div>
</template>

<script>
import Document from './Document/Document'

export default {
  name: 'Workspace',
  components: {
    Document
  },
  props: {
    rect: Object
  },
  data () {
    return {
      mouseOver: false,
      showGrid: false,
      offset: null,
      zoom: 1,
      aspectRatio: 1,
      position: {
        x: 0,
        y: 0
      }
    }
  },
  computed: {
    documentStyle () {
      return {
        // transform: `translate(${this.position.x - this.rect.width / 2}px, ${this.position.y - this.rect.height / 2}px)`,
        transform: `translate(${this.position.x + this.rect.width / 2}px, ${this.position.y + this.rect.height / 2}px) scale(${this.zoom})`
      }
    },
    grid () {
      const result = []
      for (let x = 0; x < 120; ++x) {
        result.push({
          x1: 0,
          x2: 2000,
          y1: x * 15,
          y2: x * 15
        })
      }
      for (let y = 0; y < 140; ++y) {
        result.push({
          x1: y * 15,
          x2: y * 15,
          y1: 0,
          y2: 2000
        })
      }
      return result
    },
    gridPosition () {
      return {
        transform: `translate(${this.position.x % 20 - 9}px, ${this.position.y % 20 - 9}px)`
      }
    }
  },
  mounted () {
    window.addEventListener('wheel', this.wheel)
    const bbox = this.getBox()
    this.aspectRatio = bbox.width / bbox.height
    this.position.x = -bbox.width / 2
    this.position.y = -bbox.height / 2
  },
  beforeDestroy () {
    window.removeEventListener('mousemove', this.mouseMove)
    window.removeEventListener('mouseup', this.mouseUp)
    window.removeEventListener('wheel', this.wheel)
  },
  methods: {
    mouseDown (e, item) {
      const bbox = this.getBox()
      this.offset = {
        x: e.clientX - bbox.x + (this.rect.width / 2),
        y: e.clientY - bbox.y + (this.rect.height / 2)
      }
      this.$nextTick(vue => {
        window.addEventListener('mousemove', this.mouseMove)
        window.addEventListener('mouseup', this.mouseUp)
      })
    },
    mouseMove (e) {
      const bbox = this.$el.getBoundingClientRect()
      this.position.x = (e.clientX - bbox.x) - this.offset.x
      this.position.y = (e.clientY - bbox.y) - this.offset.y
    },
    mouseUp (e) {
      window.removeEventListener('mousemove', this.mouseMove)
    },
    mouseEnter (e) {
      this.mouseOver = true
    },
    mouseLeave (e) {
      this.mouseOver = false
    },
    click (e) {
      // if (e.target.__vue__) {
      //   this.selectItem({
      //     object: e.target.__vue__.object
      //   })
      // }
    },
    wheel (e) {
      if (this.mouseOver) {
        // this.zoom += e.deltaY / 2 / 1000
        // if (this.zoom < 0.1) {
        //   this.zoom = 0.1
        // } else if (this.zoom > 100) {
        //   this.zoom = 100
        // }
      }
    },
    getBox () {
      return this.$refs.document ? this.$refs.document.$el.getBoundingClientRect() : {}
    },
    getViewport () {
      return this.$refs.document.$el.viewBox.baseVal
    }
  }
}
</script>

<style scoped>
  .workspace-box {
    position: relative;
    user-select: none;
    overflow: scroll;
    background: #444;
    color: #eee;
  }

  .workspace-box::-webkit-scrollbar {
    background: #292929;
    width: auto;
    height: auto;
  }
  .workspace-box::-webkit-scrollbar-button {
    display: none;
  }
  .workspace-box::-webkit-scrollbar-thumb {
    background: #555;
  }
  .workspace-box::-webkit-scrollbar-thumb:hover {
    background: #5a5a5a;
  }
  .document {
    position: absolute;
    /* transition: transform 1ms ease; */
  }
  .grid {
    width: 100%;
    height: 100%;
    position: absolute;
  }
  .grid-line {
    stroke-width: 1;
    stroke: #555;
  }
</style>
