<template>
  <div class="loading__modal">
    <div class="loading__bg"></div>
    <div class="loading__container">
      <span class="loading"><i /></span>
    </div>
    <div class="loading__container">
      <span class="loading"><i /></span>
    </div>
    <div class="loading__container">
      <span class="loading"><i /></span>
    </div>
  </div>
</template>
<script>
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock'
export default {
  name: 'LoadingModal',
  props: {
    isScrollLock: { type: Boolean, default: true },
  },
  data() {
    return {
      bodyScrollLockTargetElement: null,
    }
  },
  mounted() {
    if (this.isScrollLock === true) {
      this.bodyScrollLockTargetElement =
        document.querySelector('.loading__modal')
      disableBodyScroll(this.bodyScrollLockTargetElement)

      const body = document.querySelector('body')
      body.style.overflow = 'hidden'
    }
  },
  beforeDestroy() {
    if (this.isScrollLock === true) {
      enableBodyScroll(this.bodyScrollLockTargetElement)
      const body = document.querySelector('body')
      body.style.removeProperty('overflow')
    }
  },
}
</script>
<style scoped lang="scss">
@import '~/assets/scss/_index.scss';
.loading__modal {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 99999;
  .loading__bg {
    width: 100%;
    height: 100%;
    position: relative;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.3);
  }
  .loading__container {
    display: inline-block;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    .loading {
      display: inline-block;
      width: 45px;
      height: 45px;
      position: relative;
      border-radius: 50%;
      border: 2px solid #ffffff;
      animation: loading 1.5s ease-in-out infinite,
        borderColor 6s ease-in-out infinite;
      will-change: auto;
      i {
        display: inline-block;
        width: 13px;
        height: 13px;
        position: absolute;
        top: 0;
        left: 0;
        background-color: #ffffff;
        border-radius: 50%;
        animation: background 6s ease-in-out infinite;
        will-change: auto;
      }
    }
    &:nth-child(2) {
      .loading {
        animation-delay: 0.1s;
        i {
          width: 11px;
          height: 11px;
          animation-delay: 0.1s;
        }
      }
    }

    &:nth-child(3) {
      .loading {
        animation-delay: 0.2s;
        i {
          width: 9px;
          height: 9px;
          animation-delay: 0.2s;
          top: 2px;
        }
      }
    }
  }
}

@keyframes loading {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
@keyframes background {
  0% {
    background-color: $workout-color;
  }
  25% {
    background-color: $art-color;
  }
  50% {
    background-color: $meditation-color;
  }
  75% {
    background-color: $music-color;
  }
  100% {
    background-color: $workout-color;
  }
}
@keyframes borderColor {
  0% {
    border-color: $workout-color;
  }
  25% {
    border-color: $art-color;
  }
  50% {
    border-color: $meditation-color;
  }
  75% {
    border-color: $music-color;
  }
  100% {
    border-color: $workout-color;
  }
}
</style>
