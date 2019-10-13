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

const drawArrow = (context, x1, y1, x2, y2) => {
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

const getPointFromLinkName = (linkName, self) => {
  const link = self.getLinkPoints.get(linkName)
  if (!link) {
    return null
  }
  const bbox = link.$el.getBoundingClientRect()
  const x = bbox.x + bbox.width / 2 - self.bbox.offsetX
  const y = bbox.y + bbox.height / 2 - self.bbox.offsetY
  return { x, y }
}

/**
 * Растояние между 2 точками.
 * @param a {Point} - Точка 1.
 * @param b {Point} - Точка 2.
 * @return {Number} - Растояние между точками.
 */
const rangeBetweenPoints = (a, b) => {
  return Math.pow(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2), 1 / 2)
}

/**
 * Растояние между 2 точками.
 * @param point {Point} - Точка 1.
 * @param lineA {Point} - Точка 2.
 * @param lineB {Point} - Точка 2.
 * @return {Number} - Растояние между точками.
 */
const rangeBetweenPointAndLine = (point, lineA, lineB) => {
  let dx = lineB.x - lineA.x
  let dy = lineB.y - lineA.y
  if ((dx === 0) && (dy === 0)) {
    dx = point.x - lineA.x
    dy = point.y - lineA.y
    return Math.pow(dx * dx + dy * dy, 1 / 2)
  }

  const t = ((point.x - lineA.x) * dx + (point.y - lineA.y) * dy) / (dx * dx + dy * dy)

  if (t < 0) {
    dx = point.x - lineA.x
    dy = point.y - lineA.y
  } else if (t > 1) {
    dx = point.x - lineB.x
    dy = point.y - lineB.y
  } else {
    dx = point.x - (lineA.x + t * dx)
    dy = point.y - (lineA.y + t * dy)
  }

  return Math.pow(dx * dx + dy * dy, 1 / 2)
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
      mousePositionLastRightClick: {
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
    window.addEventListener('mousedown', this.mousedown)
    window.addEventListener('mousemove', this.updateMousePosition)
    window.addEventListener('contextmenu', this.contextmenu)
  },
  beforeDestroy () {
    window.removeEventListener('mousedown', this.mousedown)
    window.removeEventListener('mousemove', this.updateMousePosition)
    window.removeEventListener('contextmenu', this.contextmenu)
    this.context.clearRect(0, 0, this.$el.width, this.$el.height)
  },
  methods: {
    mousedown (event) {
      this.mousePositionLastRightClick.x = event.clientX - this.bbox.offsetX
      this.mousePositionLastRightClick.y = event.clientY - this.bbox.offsetY
    },
    contextmenu (event) {
      const maxRange = 15
      const mousePoint = {
        x: event.clientX - this.bbox.offsetX,
        y: event.clientY - this.bbox.offsetY
      }
      if (
        this.mousePositionLastRightClick.x !== null &&
        this.mousePositionLastRightClick.y !== null &&
        rangeBetweenPoints(this.mousePositionLastRightClick, mousePoint) > maxRange
      ) {
        return false
      }
      for (let link of this.links) {
        const fromPoint = getPointFromLinkName(link.from, this)
        const toPoint = getPointFromLinkName(link.to, this)
        if (!fromPoint || !toPoint) {
          continue
        }
        if (rangeBetweenPointAndLine(mousePoint, fromPoint, toPoint) < maxRange) {
          this.$createContextMenu({
            event,
            list: [
              {
                title: 'Удалить',
                onClick: () => this.removeLinkConfig(link)
              }
            ]
          })
          return false
        }
      }
      return false
    },
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
      for (let link of this.links) {
        const fromPoint = getPointFromLinkName(link.from, this)
        const toPoint = getPointFromLinkName(link.to, this)
        if (!fromPoint || !toPoint) {
          continue
        }
        drawArrow(this.context, fromPoint.x, fromPoint.y, toPoint.x, toPoint.y)
      }
      if (this.createLinkConfig.enabled && this.createLinkConfig.from) {
        const fromPoint = getPointFromLinkName(this.createLinkConfig.from, this)
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
      'endCreateLink',
      'removeLinkConfig'
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
