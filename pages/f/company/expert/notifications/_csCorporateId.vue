<template>
  <div id="companyNotificationsPage" class="background-container">
    <div class="default-container">
      <CompanyHeader
        user-type="expert"
        now-page="notifications"
        :cs-corporate-id="csCorporateId"
      />
      <CompanyNotificationsBlock v-for="i in 5" :key="i" />
    </div>
  </div>
</template>
<script>
export default {
  name: 'CompanyExpertNotificationsPage',
  components: {
    CompanyHeader: () => import('~/components/company/common/CompanyHeader'),
    CompanyNotificationsBlock: () =>
      import('~/components/company/expert/CompanyNotificationsBlock'),
  },
  asyncData({ params }) {
    return {
      csCorporateId: params.csCorporateId,
    }
  },
}
</script>
<style scoped lang="scss">
@import '~/assets/scss/company/index.scss';
.default-container {
  min-height: calc(var(--vh, 1vh) * 100);
}
</style>
