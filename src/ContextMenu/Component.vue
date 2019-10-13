<template>
  <div
    class="context-menu"
    :style="{
      left: position.x + 'px',
      top: position.y + 'px'
    }"
  >
    <a
      v-for="(item, key) of list"
      :key="key"
      @click="item.onClick(), closeMenu()"
      class="button"
    >
      {{ item.title }}
    </a>
  </div>
</template>

<script>
export default {
  name: 'ContextMenu',
  props: ['position', 'list'],
  methods: {
    closeMenu () {
      this.$el.remove()
      this.$destroy()
    }
  }
}
</script>

<style scoped>
  .context-menu {
    position: fixed;
    background: #fff;
  }
  .button {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;

    padding: 6px 15px;
    user-select: none;
    color: #333;
    background: #f5f5f5;
    cursor: pointer;
  }
  .button:hover {
    color: #333;
    background: #ddd;
  }
</style>
