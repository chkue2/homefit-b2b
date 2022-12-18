<template>
  <div id="companyNotificationsPage" class="background-container">
    <div class="default-container">
      <CompanyHeader user-type="learner" now-page="notifications" />
      <CompanyNotificationsBlock v-for="i in 5" :key="i" />
    </div>
  </div>
</template>
<script>
export default {
  name: 'CompanyNotificationsPage',
  components: {
    CompanyHeader: () => import('~/components/company/common/CompanyHeader'),
    CompanyNotificationsBlock: () =>
      import('~/components/company/learner/CompanyNotificationsBlock'),
  },
}
</script>
<style scoped lang="scss">
@import '~/assets/scss/company/index.scss';
.default-container {
  min-height: calc(var(--vh, 1vh) * 100);
}
</style>
