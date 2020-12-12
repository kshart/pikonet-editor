<template>
  <div class="menu-item" @click="appendNodeConfig">
    Статическое значение
  </div>
</template>

<script lang="ts">
import { mapActions } from 'vuex'
import StaticValueNode from './StaticValueNode'
import { Component, Vue } from 'vue-property-decorator'

@Component({
  methods: {
    ...mapActions({
      documentAppendNodeConfig: 'document/appendNodeConfig'
    })
  }
})
export default class StaticValueNodeMenuItem extends Vue {
  appendNodeConfig () {
    // const nodeConfig = new StaticValueNode({
    //   title: 'StaticValueNode'
    // })
    // this.documentAppendNodeConfig(nodeConfig)
  }
}
</script>

<style scoped>
  .menu-item {
    padding: 5px 15px;
    transition: background 0.1s ease-out;
  }
  .menu-item:hover {
    cursor: pointer;
    background: #555;
    transition: background 0.1s ease-out;
  }
</style>
