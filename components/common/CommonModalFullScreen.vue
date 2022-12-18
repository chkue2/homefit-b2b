<template>
  <div class="common-modal">
    <div class="modal__bg" @click="clickBackdrop"></div>
    <div class="modal__container">
      <div v-if="headerShow" class="modal__header">
        <i class="btn--close" @click="clickBackdrop" />
        <slot name="header"></slot>
        <i v-if="backShow" class="btn--back" @click="customBack" />
      </div>
      <div
        :id="modalId"
        class="modal__body"
        :class="{ none__header: !headerShow }"
      >
        <slot name="body"></slot>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'CommonModalFullScreen',
  props: {
    modalId: {
      type: String,
      default: 'common-modal',
    },
    headerShow: {
      type: Boolean,
      default: true,
    },
    backShow: {
      type: Boolean,
      default: false,
    },
  },
  mounted() {
    const html = document.querySelector('html')
    html.style.overflow = 'hidden'
  },
  beforeDestroy() {
    const html = document.querySelector('html')
    html.style.removeProperty('overflow')
  },
  methods: {
    clickBackdrop() {
      this.$emit('click-backdrop')
    },
    customBack() {
      this.$emit('custom-backdrop')
    },
  },
}
</script>
<style scoped lang="scss">
@import '~/assets/scss/_index.scss';
.common-modal {
  width: 100vw;
  height: 100vh;
  height: calc(var(--vh, 1vh) * 100);
  background-color: rgba(0, 0, 0, 0.7);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  .modal__bg {
    width: 100%;
    height: 100%;
  }
  .modal__container {
    width: 100%;
    height: 100%;
    max-width: 448px;
    max-height: 700px;
    background-color: #ffffff;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 12px;
    .modal__header {
      height: 60px;
      padding: 0px 24px;
      display: flex;
      flex-direction: row-reverse;
      justify-content: space-between;
      align-items: center;
      i {
        width: 24px;
        height: 24px;
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        cursor: pointer;
        &.btn--close {
          background-image: url(https://dcse8twossp9.cloudfront.net/static/img/common/header/close-24-px.svg);
        }
        &.btn--back {
          background-image: url(https://dcse8twossp9.cloudfront.net/static/partner/mendini/simplify_pay/ico/arrow-back-24-px.svg);
        }
      }
    }
    .modal__body {
      height: calc(100% - 60px);
      overflow-x: hidden;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      &.none__header {
        height: 100%;
        border-radius: 12px;
      }
    }
  }
}

@media all and (max-width: 768px) {
  .common-modal {
    .modal__container {
      top: 0;
      left: 0;
      transform: unset;
      max-height: unset;
      animation: slideUp 0.5s forwards linear;
      opacity: 0;
      border-radius: 0;
      .modal__body {
        &.none__header {
          border-radius: 0;
        }
      }
    }
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
