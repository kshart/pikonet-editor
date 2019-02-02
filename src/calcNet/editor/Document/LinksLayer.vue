<template>
  <canvas
    class="links-layer" :style="{
      transform: `translateX(${bbox.x}px) translateY(${bbox.y}px)`
    }"
  >
  </canvas>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'

function drawArrow (context, x1, y1, x2, y2) {
  const headlen = 10
  const angle = Math.atan2(y2 - y1, x2 - x1)

  context.beginPath()
  context.moveTo(x1, y1)
  context.lineTo(x2, y2)
  context.stroke()

  context.beginPath()
  context.moveTo(x2, y2)
  context.lineTo(x2 - headlen * Math.cos(angle - Math.PI / 7), y2 - headlen * Math.sin(angle - Math.PI / 7))
  context.lineTo(x2 - headlen * Math.cos(angle + Math.PI / 7), y2 - headlen * Math.sin(angle + Math.PI / 7))
  context.lineTo(x2, y2)
  context.lineTo(x2 - headlen * Math.cos(angle - Math.PI / 7), y2 - headlen * Math.sin(angle - Math.PI / 7))
  context.stroke()
  context.fill()
}

export default {
  name: 'LinksLayer',
  props: ['bbox'],
  computed: {
    ...mapState('document/links', {
      links: state => state.items
    }),
    ...mapGetters('document/links', ['getLinkPoints'])
  },
  mounted () {
    this.updateContext()
    this.updateLines()
  },
  beforeDestroy () {
    this.context.clearRect(0, 0, this.$el.width, this.$el.height)
  },
  methods: {
    updateContext () {
      if (!this.$el) {
        return
      }
      if (!this.context) {
        this.context = this.$el.getContext('2d')
      }
      this.$el.width = this.bbox.width
      this.$el.height = this.bbox.height
    },
    updateLines () {
      if (!this.context) {
        return
      }
      this.context.clearRect(0, 0, this.$el.width, this.$el.height)
      this.context.fillStyle = '#0f0'
      this.context.strokeStyle = '#0f0'
      this.context.lineWidth = 2.5
      this.context.lineCap = 'round'

      for (let link of this.links) {
        const from = this.getLinkPoints.get(link.from)
        const to = this.getLinkPoints.get(link.to)
        if (!from || !to) {
          continue
        }
        const fromBBox = from.$el.getBoundingClientRect()
        const toBBox = to.$el.getBoundingClientRect()
        const x1 = fromBBox.x + fromBBox.width / 2 - this.bbox.offsetX
        const y1 = fromBBox.y + fromBBox.height / 2 - this.bbox.offsetY
        const x2 = toBBox.x + toBBox.width / 2 - this.bbox.offsetX
        const y2 = toBBox.y + toBBox.height / 2 - this.bbox.offsetY
        drawArrow(this.context, x1, y1, x2, y2)
      }
    },
    ...mapActions('document/links', [
      'mountLink',
      'dismountLink',
      'beginCreateLink',
      'endCreateLink'
    ])
  },
  watch: {
    bbox () {
      this.updateContext()
      this.updateLines()
    },
    links () {
      this.updateLines()
    }
  }
}
</script>

<style scoped>
  .links-layer {
    position: absolute;
    pointer-events: none;
  }
</style>
