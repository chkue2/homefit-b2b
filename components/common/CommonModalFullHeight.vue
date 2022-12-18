<template>
  <div class="common-modal" :class="{ 'common-modal--open': isOpen }">
    <div class="common-modal__background" @click="closeModal"></div>
    <div :id="id" class="common-modal__container" data-aos="fade">
      <slot name="body"></slot>
    </div>
  </div>
</template>
<script>
import AOS from 'aos'
import 'aos/dist/aos.css'
export default {
  name: 'CommonModalFullHeight',
  props: {
    id: { type: String, default: 'commonModalFullHeight' },
    isOpen: { type: Boolean, default: false },
  },
  mounted() {
    const html = document.querySelector('html')
    html.style.overflow = 'hidden'
    AOS.init()
  },
  beforeDestroy() {
    const html = document.querySelector('html')
    html.style.removeProperty('overflow')
  },
  methods: {
    closeModal() {
      this.$emit('close-modal')
    },
  },
}
</script>
<style scoped lang="scss">
@import '~/assets/scss/_index.scss';
.common-modal {
  width: 100vw;
  min-height: 100vh;
  min-height: calc(var(--vh, 1vh) * 100);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
}
.common-modal__background {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.6);
}
.common-modal__container {
  width: 400px;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  position: fixed;
  top: 0;
  left: 50%;
  transform: translate(-50%, 0) !important;
  background-color: #ffffff;
}
@media all and (max-width: 648px) {
  .common-modal__container {
    width: 100%;
  }
}
</style>
