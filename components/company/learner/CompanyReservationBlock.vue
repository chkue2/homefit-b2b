<template>
  <div
    class="reservation-block"
    :class="{ 'block--waiting': computedIsWaiting }"
  >
    <p class="reservation-title">
      {{ computedReservationTitle }}
    </p>
    <p class="reservation-date">{{ computedReservationTime }}</p>
    <div class="reservation-bottom">
      <CompanyCommonButton
        v-if="!computedIsWaiting"
        :obj="{
          text: computedLessonDdayChangeFormat,
          value: '',
        }"
        size="button-small"
        theme="gra"
        :is-side-text-show="false"
      />
      <CompanyCommonButton
        v-if="computedLessonDdayChangeFormat !== '수업중'"
        :obj="{
          text: `${computedIsWaiting ? '대기 취소' : '예약 취소'}`,
          value: '',
        }"
        size="button-small"
        theme="dark-gray"
        :is-side-text-show="false"
        :callback="
          () => {
            if (computedIsWaiting === true) {
              openWaitingCancelEither(reservation)
            } else {
              openReservationCancelEither(reservation)
            }
          }
        "
      />
    </div>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import moment from 'moment'
import commonMixins from '~/assets/js/commonMixins'
export default {
  name: 'CompanyReservationBlock',
  components: {
    CompanyCommonButton: () =>
      import('~/components/company/common/CompanyCommonButton'),
  },
  mixins: [commonMixins],
  props: {
    reservation: { type: Object, default: () => {} },
    nowTime: { type: Object },
  },
  computed: {
    computedReservationTitle() {
      return `${this.reservation.programTitle} (${this.reservation.expertName})`
    },
    computedReservationTime() {
      return `${moment(this.reservation.start).format(
        'YYYY-MM-DD'
      )}(${this.changeDayFormat(
        moment(this.reservation.start).days()
      )}) ${moment(this.reservation.start).format('HH:mm')} ~ ${moment(
        this.reservation.end
      ).format('HH:mm')}`
    },
    computedLessonDdayChangeFormat() {
      const diffDay = moment(this.reservation.start).diff(this.nowTime, 'days')
      const diffHour = moment(this.reservation.start).diff(
        this.nowTime,
        'hours'
      )
      const diffMinute =
        moment(this.reservation.start).diff(this.nowTime, 'minutes') % 60
      const diffSecond =
        (moment(this.reservation.start).diff(this.nowTime, 'seconds') % 60) % 60

      return diffDay > 0
        ? `${diffDay}일 후`
        : moment(this.reservation.start).diff(this.nowTime, 'seconds') < 0
        ? '수업중'
        : `${diffHour}:${diffMinute}:${this.fillZero(2, diffSecond.toString())}`
    },
    computedIsWaiting() {
      return this.reservation.waitingNumber > 0
    },
  },
  methods: {
    ...mapActions('company', [
      'setLoading',
      'setEmojiEitherConfig',
      'toggleEmojiEither',
    ]),
    ...mapActions('company/learner', [
      'requestLessonCancel',
      'fetchLessonChangeData',
      'fetchMyReservations',
    ]),
    requestLessonCancelCall({
      start,
      end,
      b2bTimetableReservationId,
      b2bTimetableId,
    }) {
      const dataSet = {
        start,
        end,
        id: b2bTimetableId,
        b2bTimetableReservationId,
      }
      this.setLoading(true)
      this.requestLessonCancel(dataSet).then(() => {
        this.fetchMyReservations().finally(() => {
          this.fetchLessonChangeData(dataSet).finally(() => {
            this.setLoading(false)
          })
        })
      })
    },
    openReservationCancelEither(reservation) {
      this.setEmojiEitherConfig({
        emoji: '🤔',
        title: '예약을 취소하시겠어요?',
        content:
          '예약 대기자가 있는 경우에는<br>취소 후 재예약이 불가할 수 있습니다.',
        left: {
          content: '네, 취소합니다',
          callback: () => {
            this.requestLessonCancelCall(reservation)
            this.toggleEmojiEither(false)
          },
        },
        right: {
          content: '아니요',
          callback: () => {
            this.toggleEmojiEither(false)
          },
        },
      })
      this.toggleEmojiEither(true)
    },
    openWaitingCancelEither(reservation) {
      this.setEmojiEitherConfig({
        emoji: '🤔',
        title: '예약 대기를<br>취소하시겠어요?',
        content:
          '취소 후 다른 예약 대기자가 발생할 경우,<br>재예약이 불가할 수 있습니다.',
        left: {
          content: '네, 취소합니다',
          callback: () => {
            this.requestLessonCancelCall(reservation)
            this.toggleEmojiEither(false)
          },
        },
        right: {
          content: '아니요',
          callback: () => {
            this.toggleEmojiEither(false)
          },
        },
      })
      this.toggleEmojiEither(true)
    },
    changeDayFormat(day) {
      switch (day) {
        case 0:
          return '일'
        case 1:
          return '월'
        case 2:
          return '화'
        case 3:
          return '수'
        case 4:
          return '목'
        case 5:
          return '금'
        case 6:
          return '토'
        default:
          return ''
      }
    },
  },
}
</script>
<style scoped lang="scss">
@import '~/assets/scss/_index.scss';
.reservation-block {
  padding: 12px 16px;
  &.block--waiting {
    .reservation-title {
      color: #7d7d7d;
    }
    .reservation-date {
      color: #7d7d7d;
    }
  }
}
.reservation-title {
  font-weight: $bold;
  color: #ffffff;
}
.reservation-date {
  font-size: 14px;
  color: #ffffff;
  margin: 4px 0 12px;
}
.reservation-bottom {
  @include flexBox(row, flex-start, center);
  gap: 6px;
}
</style>
