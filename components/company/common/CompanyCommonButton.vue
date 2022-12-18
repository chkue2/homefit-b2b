<template>
  <p class="common-button" :class="[theme, size]" @click="callback">
    <span class="button-text">{{ obj.text }}</span>
    <span v-if="isSideTextShow" class="button-side">{{ sideText }}</span>
  </p>
</template>
<script>
export default {
  name: 'CompanyCommonButton',
  props: {
    obj: { type: Object, default: () => {} },
    size: { type: String, default: '' },
    theme: { type: String, default: '' },
    sideText: { type: String, default: '' },
    isSideTextShow: { type: Boolean, default: false },
    callback: { type: Function, default: () => {} },
  },
}
</script>
<style scoped lang="scss">
@import '~/assets/scss/_index.scss';
.common-button {
  @include flexBox(row, center, center);
  padding: 0 13px;
  border-radius: 12px;
  cursor: pointer;
  border: 1px solid #e1e1e1;
  position: relative;
  .button-text {
    font-weight: $medium;
  }
  &.button-big {
    height: 36px;
    .button-text {
      font-size: 12px;
    }
  }
  &.button-small {
    min-width: 78px;
    height: 32px;
    .button-text {
      font-size: 14px;
    }
  }
  &.disabled {
    .button-text {
      color: #b9b9b9;
    }
  }
  &.selected {
    .button-text {
      color: $office-violet;
    }
    border-color: $office-violet;
  }
  &.background {
    background-color: $office-violet;
    .button-text {
      color: #ffffff;
    }
  }
  &.gra {
    border-image: linear-gradient(to right, #03dcc8 0%, #6400f0) 0 0;
    background-image: linear-gradient(to bottom, #232323, #232323),
      linear-gradient(to right, #03dcc8 0%, #6400f0);
    background-origin: border-box;
    background-clip: content-box, border-box;
    padding: 0;
    .button-text {
      color: #ffffff;
    }
  }
  &.dark-gray {
    background-color: #414141;
    border-color: #414141;
    .button-text {
      color: #ffffff;
    }
  }
  &.gray {
    border-color: #e1e1e1;
  }
  &.black {
    border-color: #000000;
    .button-text {
      color: #000000;
    }
  }
  &.violet {
    border-color: $office-violet;
    .button-text {
      color: $office-violet;
    }
  }
  .button-side {
    height: 20px;
    padding: 0 6px;
    @include flexBox(row, center, center);
    position: absolute;
    bottom: -6px;
    right: -6px;
    z-index: 2;
    border-radius: 18px;
    background-color: #ebebeb;
    font-size: 10px;
    color: #000000;
  }
}
</style>
