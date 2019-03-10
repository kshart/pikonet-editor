<template>
  <div class="loading-screen">
    <div class="loading-screen__wrapper">
      <div class="loading-screen__title">Загрузка...</div>
      <transition name="fade">
        <div v-if="loadingRetryCount > 1" class="loading-screen__subtitle">
          Попытка подключения: {{ loadingRetryCount }}
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'LoadingScreen',
  computed: {
    ...mapState('document', {
      loadingRetryCount: state => state.loadingRetryCount
    })
  }
}

</script>

<style>
  .loading-screen {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #666;
  }
  .loading-screen__wrapper {
    user-select: none;
    color: #eee;
  }
  .loading-screen__title {
    font-size: 32px;
  }
  .loading-screen__subtitle {
    padding-top: 10px;
    font-size: 16px;
  }

  .fade-enter-active {
    animation: fade-in 1s;
  }
  .fade-leave-active {
    animation: fade-in 1s reverse;
  }
  @keyframes fade-in {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
</style>
