<template>
  <CommonTopModal @close-modal="toggleCompanyReservationList">
    <div slot="body" class="company-reservation-list">
      <CompanyReservationBlock
        v-for="reservation in computedMyReservations"
        :key="reservation.b2bTimetableReservationId"
        :reservation="reservation"
        :now-time="nowTime"
      />
    </div>
  </CommonTopModal>
</template>
<script>
import { mapState } from 'vuex'
import { concat } from 'lodash'
import moment from 'moment'
export default {
  name: 'CompanyReservationListModal',
  components: {
    CommonTopModal: () => import('~/components/company/common/CommonTopModal'),
    CompanyReservationBlock: () =>
      import('~/components/company/learner/CompanyReservationBlock'),
  },
  data: () => ({
    nowTime: moment(),
    nowTimeInterval: null,
  }),
  computed: {
    ...mapState('company/learner', ['myReservations']),
    computedMyReservations() {
      return concat(
        this.myReservations.myReservations,
        this.myReservations.myWaitings
      ).sort((a, b) => moment(a.start) - moment(b.start))
    },
  },
  watch: {
    myReservations: {
      deep: true,
      handler() {
        if (
          concat(
            this.myReservations.myReservations,
            this.myReservations.myWaitings
          ).length === 0
        ) {
          this.toggleCompanyReservationList()
        }
      },
    },
  },
  mounted() {
    if (this.nowTimeInterval === null) {
      this.nowTimeInterval = setInterval(() => {
        this.nowTime = moment()
      }, 1000)
    }
  },
  beforeDestroy() {
    clearInterval(this.nowTimeInterval)
    this.nowTimeInterval = null
  },
  methods: {
    toggleCompanyReservationList() {
      this.$emit('toggle-company-reservation-list', false)
    },
  },
}
</script>
<style scoped lang="scss">
@import '~/assets/scss/_index.scss';
.company-reservation-list {
  padding: 4px 0;
  background-color: #232323;
  max-height: calc(100vh - 80px);
  overflow-y: auto;
}
</style>
