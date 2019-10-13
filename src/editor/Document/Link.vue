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
  mounted () {
    this.mountLinkPoint({
      id: this.id,
      $vue: this
    })
  },
  beforeDestroy () {
    window.removeEventListener('mouseup', this.abortLinking)
    this.dismountLinkPoint({
      id: this.id,
      $vue: this
    })
  },
  methods: {
    startLinking () {
      window.addEventListener('mouseup', this.abortLinking)
      this.beginCreateLink({
        from: this.id
      })
    },
    abortLinking () {
      this.endCreateLink()
    },
    stopLinking () {
      this.endCreateLink({
        to: this.id
      })
    },
    ...mapActions('document/links', [
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
