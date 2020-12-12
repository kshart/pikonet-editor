<template>
  <div
    class="link-dot"
    @mousedown.left="startLinking"
    @mouseup.left="stopLinking"
  >
  </div>
</template>

<script lang="ts">
import { mapActions } from 'vuex'
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component({
  methods: {
    ...mapActions('document/links', [
      'mountLinkPoint',
      'dismountLinkPoint',
      'beginCreateLink',
      'endCreateLink'
    ])
  }
})
export default class Link extends Vue {
  @Prop(String) readonly id!: string
  mounted () {
    this.mountLinkPoint({
      id: this.id,
      $vue: this
    })
  }

  beforeDestroy () {
    window.removeEventListener('mouseup', this.abortLinking)
    this.dismountLinkPoint({
      id: this.id,
      $vue: this
    })
  }

  startLinking () {
    window.addEventListener('mouseup', this.abortLinking)
    this.beginCreateLink({
      from: this.id
    })
  }

  abortLinking () {
    this.endCreateLink()
  }

  stopLinking () {
    this.endCreateLink({
      to: this.id
    })
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
