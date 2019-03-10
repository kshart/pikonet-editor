<template>
  <canvas
    class="links-layer"
    :style="{
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
  data () {
    return {
      isCreateArrow: false,
      mousePosition: {
        x: null,
        y: null
      },
      arrowColor: '#f00'
    }
  },
  computed: {
    ...mapState('document/links', {
      links: state => state.items,
      createLinkConfig: state => state.createLink
    }),
    ...mapGetters('document/links', ['getLinkPoints'])
  },
  mounted () {
    this.updateContext()
    this.updateLines()
    window.addEventListener('mousemove', this.updateMousePosition)
  },
  beforeDestroy () {
    window.removeEventListener('mousemove', this.updateMousePosition)
    this.context.clearRect(0, 0, this.$el.width, this.$el.height)
  },
  methods: {
    updateMousePosition (event) {
      this.mousePosition.x = event.clientX - this.bbox.offsetX
      this.mousePosition.y = event.clientY - this.bbox.offsetY
    },
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
      this.context.fillStyle = this.arrowColor
      this.context.strokeStyle = this.arrowColor
      this.context.lineWidth = 2.5
      this.context.lineCap = 'round'
      const getPointFromLinkName = linkName => {
        const link = this.getLinkPoints.get(linkName)
        if (!link) {
          return null
        }
        const bbox = link.$el.getBoundingClientRect()
        const x = bbox.x + bbox.width / 2 - this.bbox.offsetX
        const y = bbox.y + bbox.height / 2 - this.bbox.offsetY
        return { x, y }
      }
      for (let link of this.links) {
        const fromPoint = getPointFromLinkName(link.from)
        const toPoint = getPointFromLinkName(link.to)
        if (!fromPoint || !toPoint) {
          continue
        }
        drawArrow(this.context, fromPoint.x, fromPoint.y, toPoint.x, toPoint.y)
      }
      if (this.createLinkConfig.enabled && this.createLinkConfig.from) {
        const fromPoint = getPointFromLinkName(this.createLinkConfig.from)
        drawArrow(this.context, fromPoint.x, fromPoint.y, this.mousePosition.x, this.mousePosition.y)
      }
    },
    onCreateLineUpdate () {
      if (this.createLinkConfig.enabled) {
        this.updateContext()
        this.updateLines()
        this.isCreateArrow = true
      } else if (this.isCreateArrow) {
        this.isCreateArrow = false
        this.updateContext()
        this.updateLines()
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
    },
    mousePosition: {
      deep: true,
      handler () {
        this.onCreateLineUpdate()
      }
    },
    createLinkConfig: {
      deep: true,
      handler () {
        this.onCreateLineUpdate()
      }
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
