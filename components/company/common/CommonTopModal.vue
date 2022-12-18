<template>
  <div class="common-top-modal">
    <div class="modal-background" @click="closeModal"></div>
    <div class="modal-container">
      <slot name="body"> </slot>
      <div class="modal-close" @click="closeModal">닫기</div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'CommonTopModal',
  mounted() {
    document.querySelector('html').style.overflow = 'hidden'
  },
  beforeDestroy() {
    document.querySelector('html').style.removeProperty('overflow')
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
.common-top-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
}
.modal-background {
  background-color: rgba(0, 0, 0, 0.6);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
.modal-container {
  width: 100%;
  max-width: 648px;
  max-height: calc(100vh - 80px);
  position: fixed;
  top: 0;
  left: 50%;
  transform: translate(-50%, -100%);
  animation: openModal 0.3s ease forwards;
  will-change: auto;
}
.modal-close {
  @include flexBox(row, center, center);
  width: 64px;
  height: 32px;
  border-radius: 16px;
  margin: 12px auto 0;
  cursor: pointer;
  background-color: rgba(255, 255, 255, 0.3);
  font-size: 14px;
  font-weight: $medium;
  color: #ffffff;
  gap: 4px;
  &::before {
    content: '';
    width: 16px;
    height: 16px;
    @include defaultIcon(
      'https://dcse8twossp9.cloudfront.net/static/img/icon/close-white.svg'
    );
  }
}

@keyframes openModal {
  0% {
    transform: translate(-50%, -100%);
  }
  100% {
    transform: translate(-50%, 0);
  }
}
</style>
