<template>
  <div id="companyHeader" class="company-header">
    <div class="header-left">
      <i
        v-if="userType === 'expert'"
        class="header-close"
        @click="handlerClickBackButton"
      ></i>
      <img class="header-logo" :src="company.iconUrl" alt />
    </div>
    <div class="header-menu">
      <span
        v-if="computedFirstLessonDday !== ''"
        class="header-timer"
        @click="toggleCompanyReservationList"
        >{{ computedFirstLessonDday }}</span
      >
      <i
        class="header-icon icon--calendar"
        :class="{ on: nowPage === 'calendar' }"
        @click="
          moveToPage(
            `/f/company/${userType}/schedule/${
              userType === 'expert' ? `${csCorporateId}/` : ''
            }`
          )
        "
      ></i>
      <!-- <i
        class="header-icon icon--notifications"
        :class="{ on: nowPage === 'notifications' }"
        @click="
          moveToPage(
            `/f/company/${userType}/notifications/${
              userType === 'expert' ? `${csCorporateId}/` : ''
            }`
          )
        "
      ></i> -->
      <i
        v-if="userType === 'learner'"
        class="header-icon icon--my"
        :class="{ on: nowPage === 'my' }"
        @click="moveToPage(`/f/company/${userType}/my/`)"
      ></i>
      <i
        v-if="userType === 'expert'"
        class="header-icon icon--table"
        :class="{ on: nowPage === 'calculate' }"
        @click="moveToPage(`/f/company/expert/calculate/${csCorporateId}/`)"
      ></i>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import { isEmpty, concat } from 'lodash'
import moment from 'moment'
import axios from 'axios'
import axiosCatchHelper from '~/assets/js/axiosCatchHelper'
import commonMixins from '~/assets/js/commonMixins'
export default {
  name: 'CompanyHeader',
  mixins: [commonMixins],
  props: {
    userType: { type: String, default: 'learner' },
    nowPage: { type: String, default: '' },
    csCorporateId: { type: String, default: '' },
  },
  data: () => ({
    timer: null,
    time: moment(),
    company: {
      name: '',
      iconUrl: '',
    },
    shouldBlockRepeatCall: false,
  }),
  computed: {
    ...mapState('company', ['isLoading']),
    ...mapState('company/learner', ['myReservations']),
    computedFirstLessonDday() {
      if (isEmpty(this.myReservations.myReservations)) {
        return ''
      } else {
        const diffDay = moment(
          this.myReservations.myReservations[0].start
        ).diff(this.time, 'days')
        const diffHour = moment(
          this.myReservations.myReservations[0].start
        ).diff(this.time, 'hours')
        const diffMinute =
          moment(this.myReservations.myReservations[0].start).diff(
            this.time,
            'minutes'
          ) % 60
        const diffSecond =
          (moment(this.myReservations.myReservations[0].start).diff(
            this.time,
            'seconds'
          ) %
            60) %
          60

        return diffDay > 0
          ? `${diffDay}일 후`
          : moment(this.myReservations.myReservations[0].start).diff(
              this.time,
              'seconds'
            ) < 0
          ? '수업중'
          : `${diffHour}:${diffMinute}:${this.fillZero(
              2,
              diffSecond.toString()
            )}`
      }
    },
    computedReservationsAndWaitings() {
      return concat(
        this.myReservations.myReservations,
        this.myReservations.myWaitings
      ).sort((a, b) => moment(a.start) - moment(b.start))
    },
  },
  mounted() {
    this.fetchCompanyInfo()
    if (this.userType === 'learner') {
      this.setTimer()
      this.fetchMyReservations()
    }
  },
  methods: {
    ...mapActions('company', ['setLoading']),
    ...mapActions('company/learner', [
      'fetchMyReservations',
      'fetchLessonChangeData',
    ]),
    fetchCompanyInfo() {
      axios
        .post('*path*', {
          _method: 'get',
          csCorporateId:
            this.csCorporateId === ''
              ? window.homefit.user.csCorporateId
              : this.csCorporateId,
        })
        .then((response) => {
          this.company = response.data.company
        })
        .catch((e) => {
          axiosCatchHelper.alertIfHasMessage(e)
        })
    },
    moveToPage(url) {
      this.$router.push(url)
    },
    setTimer() {
      if (this.timer === null) {
        this.timer = setInterval(() => {
          this.time = moment()
          if (!isEmpty(this.myReservations.myReservations)) {
            const diffSecond = moment(
              this.myReservations.myReservations[0].end
            ).diff(this.time, 'seconds')
            if (diffSecond < 0 && this.shouldBlockRepeatCall === false) {
              this.deleteTimeoutFirstLesson()
              this.shouldBlockRepeatCall = true
            } else if (diffSecond > 0) {
              this.shouldBlockRepeatCall = false
            }
          }
        }, 1000)
      }
    },
    toggleCompanyReservationList() {
      this.$emit('toggle-company-reservation-list', true)
    },
    deleteTimeoutFirstLesson() {
      if (this.isLoading === false) {
        this.setLoading(true)
        const dataSet = {
          start: this.computedReservationsAndWaitings[0].start,
          end: this.computedReservationsAndWaitings[0].end,
          id: this.computedReservationsAndWaitings[0].b2bTimetableId,
          b2bTimetableReservationId:
            this.computedReservationsAndWaitings[0].b2bTimetableReservationId,
        }
        this.fetchMyReservations().finally(() => {
          this.fetchLessonChangeData(dataSet).finally(() => {
            this.setLoading(false)
          })
        })
      }
    },
    handlerClickBackButton() {
      if (document.referrer === '') {
        location.href = '/'
      } else {
        history.back()
      }
    },
  },
}
</script>
<style scoped lang="scss">
@import '~/assets/scss/_index.scss';
.company-header {
  width: 100%;
  height: 48px;
  @include flexBox(row, space-between, center);
  position: sticky;
  top: 0;
  background-color: #ffffff;
  z-index: 11;
  border-bottom: 1px solid #e1e1e1;
  padding: 0 16px;
}
.header-left {
  @include flexBox(row, flex-start, center);
  gap: 8px;
  .header-close {
    display: block;
    width: 24px;
    height: 24px;
    cursor: pointer;
    @include defaultIcon(
      'https://dcse8twossp9.cloudfront.net/static/img/v2/icon/arrow-back-black.svg'
    );
  }
}
.header-logo {
  width: auto;
  height: 24px;
}
.header-menu {
  @include flexBox(row, flex-end, center);
  gap: 16px;
}
.header-icon {
  display: block;
  width: 24px;
  height: 24px;
  cursor: pointer;
  &.icon--calendar {
    @include defaultIcon(
      'https://dcse8twossp9.cloudfront.net/static/img/v2/icon/calendar-off.svg'
    );
    &.on {
      @include defaultIcon(
        'https://dcse8twossp9.cloudfront.net/static/img/v2/icon/calendar-on.svg'
      );
    }
  }
  &.icon--notifications {
    @include defaultIcon(
      'https://dcse8twossp9.cloudfront.net/static/img/v2/icon/notifications-off.svg'
    );
    &.on {
      @include defaultIcon(
        'https://dcse8twossp9.cloudfront.net/static/img/v2/icon/notifications-on.svg'
      );
    }
  }
  &.icon--my {
    @include defaultIcon(
      'https://dcse8twossp9.cloudfront.net/static/img/v2/icon/my-off.svg'
    );
    &.on {
      @include defaultIcon(
        'https://dcse8twossp9.cloudfront.net/static/img/v2/icon/my-on.svg'
      );
    }
  }
  &.icon--table {
    @include defaultIcon(
      'https://dcse8twossp9.cloudfront.net/static/img/v2/icon/table-off.svg'
    );
    &.on {
      @include defaultIcon(
        'https://dcse8twossp9.cloudfront.net/static/img/v2/icon/table-on.svg'
      );
    }
  }
}
.header-timer {
  width: 56px;
  height: 24px;
  @include flexBox(row, center, center);
  font-size: 12px;
  font-weight: $medium;
  border-radius: 12px;
  border: 1px solid #ffffff;
  border-image: linear-gradient(to right, #03dcc8 0%, #6400f0) 0 0;
  background-image: linear-gradient(to bottom, #fff, #fff),
    linear-gradient(to right, #03dcc8 0%, #6400f0);
  background-origin: border-box;
  background-clip: content-box, border-box;
  cursor: pointer;
}
</style>
