<template>
  <div
    class="link-dot"
    @mousedown.left="startLinking"
    @mouseup.left="stopLinking"
  >
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'Link',
  props: ['id'],
  data () {
    return {
    }
  },
  mounted () {
    this.mountLinkPoint({
      id: this.id,
      $vue: this
    })
  },
  beforeDestroy () {
    this.dismountLinkPoint({
      id: this.id,
      $vue: this
    })
  },
  methods: {
    startLinking () {
      this.beginCreateLink({
        from: this.id
      })
    },
    stopLinking () {
      this.endCreateLink({
        to: this.id
      })
    },
    ...mapActions('documentLinks', [
      'mountLinkPoint',
      'dismountLinkPoint',
      'beginCreateLink',
      'endCreateLink'
    ])
  }
}
</script>

<style scoped>
  .link-dot {
    background: #fff;
    border-radius: 50%;
    width: 15px;
    height: 15px;
  }
</style>
