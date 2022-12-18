<template>
  <div id="navigatorContainer" class="background-container">
    <div class="default-container">
      <slot name="body"></slot>
    </div>
    <CommonNavigator :now-page="nowPage" />
  </div>
</template>
<script>
export default {
  name: 'CommonNavigatorContainer',
  components: {
    CommonNavigator: () => import('~/components/common/CommonNavigator'),
  },
  props: {
    nowPage: { type: String, default: '' },
  },
}
</script>
<style scoped lang="scss">
@import '~/assets/scss/_index.scss';
</style>
