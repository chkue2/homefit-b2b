<template>
  <div
    class="learner-block"
    :class="[
      { 'learner-complete': computedBlockStatus.isComplete },
      { 'learner-my': computedBlockStatus.isMy },
      { 'learner-wait': computedBlockStatus.isWait },
    ]"
  >
    <p class="learner-time">{{ computedTimeText }}</p>
    <p class="learner-expert">
      {{ selectedData.programTypeCaption }} ({{ selectedData.expertName }})
    </p>
    <div class="learner-bottom">
      <p class="learner-caption">
        <i
          v-if="computedBlockStatus.isIng"
          class="caption-circle"
          :class="{ 'circle--my': computedBlockStatus.isMy }"
        ></i>
        <span class="caption-text">{{ computedBlockStatus.text }}</span>
      </p>
      <div v-if="computedBlockStatus.buttons.length > 0">
        <CompanyCommonButton
          v-for="(button, index) in computedBlockStatus.buttons"
          :key="index"
          :obj="{ text: button.text, value: '' }"
          size="button-small"
          :theme="button.theme"
          :is-side-text-show="false"
          :callback="button.callback"
        />
      </div>
    </div>
  </div>
</template>
<script>
import moment from 'moment'
import { mapState, mapActions } from 'vuex'
import { isEmpty } from 'lodash'
import axios from 'axios'
import axiosCatchHelper from '~/assets/js/axiosCatchHelper'
export default {
  name: 'CompanyLearnerBlock',
  components: {
    CompanyCommonButton: () =>
      import('~/components/company/common/CompanyCommonButton'),
  },
  props: {
    schedule: { type: Object, default: () => {} },
  },
  computed: {
    ...mapState('company/learner', ['selectedData', 'schedules']),
    computedTimeText() {
      return `${moment(this.schedule.start).format('HH:mm')} ~ ${moment(
        this.schedule.end
      ).format('HH:mm')}`
    },
    computedBlockStatus() {
      let text = ''
      let isComplete = false
      let isMy = false
      let isIng = false
      let isWait = false
      let buttons = []

      const isLessonStartAndAfterTime = moment().diff(this.schedule.start) > 0
      const isLessonStartAndEndBetweenTime = moment().isBetween(
        this.schedule.start,
        this.schedule.end
      )

      switch (this.schedule.status) {
        case '오픈':
          if (isLessonStartAndAfterTime) {
            text = '예약자 없이 수업 종료'
            isComplete = true
          } else {
            text = '서둘러 예약하세요🤪'
            isComplete = false
            buttons = [
              {
                text: '예약하기',
                callback: () => {
                  this.requestLessonReserve()
                },
                theme: 'violet',
              },
            ]
          }
          break
        case '예약':
          if (isLessonStartAndAfterTime && isEmpty(this.schedule.reservation)) {
            // 예약은 됐는데 데이터 꼬임 (수업 시간 후 완료처리 X)
            text = `수업 완료`
            isComplete = true
          }
          if (isEmpty(this.schedule.reservation)) {
            // 예약은 됐는데 데이터 꼬임 (수업 시간 전)
            text = `예약자 확인 안됨`
            isComplete = false
          } else if (
            isLessonStartAndEndBetweenTime &&
            this.schedule.reservation.isMyReservation === true
          ) {
            // 내 예약 (수업 시간 중 완료처리 X)
            text = `${this.changeMailFormat(
              this.schedule.reservation.email
            )}님(나) 수업 중`
            isComplete = false
            isMy = true
            isIng = true
          } else if (
            isLessonStartAndEndBetweenTime &&
            this.schedule.reservation.isMyReservation === false
          ) {
            // 내 예약 아님 (수업 시간 중 완료처리 X)
            text = `${this.changeMailFormat(
              this.schedule.reservation.email
            )}님 수업 중`
            isComplete = false
            isIng = true
          } else if (
            isLessonStartAndAfterTime &&
            this.schedule.reservation.isMyReservation === true
          ) {
            // 내 예약 (수업 시간 후 완료처리 X)
            text = `${this.changeMailFormat(
              this.schedule.reservation.email
            )}님(나) 수업 완료`
            isComplete = true
          } else if (
            isLessonStartAndAfterTime &&
            this.schedule.reservation.isMyReservation === false
          ) {
            // 내 예약 아님 (수업 시간 후 완료처리 X)
            text = `${this.changeMailFormat(
              this.schedule.reservation.email
            )}님 수업 완료`
            isComplete = true
          } else if (
            this.schedule.reservation.isMyReservation === true &&
            isEmpty(this.schedule.waiting)
          ) {
            // 내 예약이고 대기가 비어있음 (수업 전)
            text = `내 예약`
            isComplete = false
            isMy = true
            buttons = [
              {
                text: '예약취소',
                callback: () => {
                  this.openReservationCancelEither(
                    this.schedule.reservation.b2bTimetableReservationId
                  )
                },
                theme: 'gray',
              },
            ]
          } else if (
            this.schedule.reservation.isMyReservation === true &&
            !isEmpty(this.schedule.waiting)
          ) {
            // 내 예약이고 대기자가 있음 (수업 전)
            text = `내 예약, ${this.changeMailFormat(
              this.schedule.waiting.email
            )}님 대기`
            isComplete = false
            isMy = true
            buttons = [
              {
                text: '예약취소',
                callback: () => {
                  this.openReservationCancelEither(
                    this.schedule.reservation.b2bTimetableReservationId
                  )
                },
                theme: 'gray',
              },
            ]
          } else if (
            this.schedule.reservation.isMyReservation === false &&
            isEmpty(this.schedule.waiting)
          ) {
            // 내 예약아니고 대기자 없음 (수업 전)
            text = `${this.changeMailFormat(
              this.schedule.reservation.email
            )}님 예약`
            isComplete = false
            buttons = [
              {
                text: '대기하기',
                callback: () => {
                  this.requestLessonWaiting()
                },
                theme: 'black',
              },
            ]
          } else if (
            this.schedule.reservation.isMyReservation === false &&
            this.schedule.waiting.isMyReservation === true
          ) {
            // 내 예약아니고 내가 대기자
            text = `${this.changeMailFormat(
              this.schedule.reservation.email
            )}님 예약, 대기자 (나)`
            isComplete = false
            isWait = true
            buttons = [
              {
                text: '대기취소',
                callback: () => {
                  this.openWaitingCancelEither(
                    this.schedule.waiting.b2bTimetableReservationId
                  )
                },
                theme: 'black',
              },
            ]
          } else {
            // 내 예약아니고 대기자가 내가 아님
            text = `${this.changeMailFormat(
              this.schedule.reservation.email
            )}님 예약, ${this.changeMailFormat(
              this.schedule.waiting.email
            )}님 대기 `
            isComplete = false
          }
          break
        case '수업 완료':
          if (isEmpty(this.schedule.reservation)) {
            text = '수업 완료'
          } else if (this.schedule.reservation.isMyReservation === true) {
            text = `${this.changeMailFormat(
              this.schedule.reservation.email
            )}님(나) 수업 완료`
          } else {
            text = `${this.changeMailFormat(
              this.schedule.reservation.email
            )}님 수업 완료`
          }
          isComplete = true
          break
        case '노쇼':
          if (isEmpty(this.schedule.reservation)) {
            text = '수업 완료'
          } else {
            text = `${this.changeMailFormat(
              this.schedule.reservation.email
            )}님 ${
              this.schedule.reservation.isMyReservation === true ? '(나) ' : ''
            }수업 완료`
          }
          isComplete = true
          break
        case '전문가 사정 불가':
          text = `전문가 사정으로 수업 미진행`
          isComplete = true
          break
      }

      return {
        text,
        isComplete,
        isMy,
        isIng,
        isWait,
        buttons,
      }
    },
  },
  methods: {
    ...mapActions('company', [
      'setLoading',
      'setEmojiAlertConfig',
      'toggleEmojiAlert',
      'setEmojiEitherConfig',
      'toggleEmojiEither',
    ]),
    ...mapActions('company/learner', [
      'setSchedules',
      'requestLessonCancel',
      'fetchLessonChangeData',
      'fetchMyReservations',
    ]),
    requestLessonReserve() {
      const dataSet = {
        start: this.schedule.start,
        end: this.schedule.end,
        id: this.schedule.id,
      }
      this.setLoading(true)
      axios
        .post('*path*', {
          _method: 'post',
          b2bTimetableId: this.schedule.id,
        })
        .then(() => {
          this.setEmojiAlertConfig({
            emoji: '😍',
            title: '예약이 완료되었습니다!',
            content: `${this.selectedData.expertName} 전문가 수업 예약이 확정되었습니다.<br>예약 시간에 맞추어 방문해주세요!`,
          })
          this.toggleEmojiAlert(true)
        })
        .catch(() => {
          this.setEmojiAlertConfig({
            emoji: '😱',
            title: '다른 분이 이미 예약 중인 수업이에요',
            content:
              '다른 시간 대의 수업을 선택하거나<br>예약 대기를 신청해주세요!',
          })
          this.toggleEmojiAlert(true)
        })
        .finally(() => {
          this.fetchMyReservations().finally(() => {
            this.fetchLessonChangeData(dataSet).finally(() => {
              this.setLoading(false)
            })
          })
        })
    },
    requestLessonWaiting() {
      const dataSet = {
        start: this.schedule.start,
        end: this.schedule.end,
        id: this.schedule.id,
      }
      this.setLoading(true)
      axios
        .post('*path*', {
          _method: 'post',
          b2bTimetableId: this.schedule.id,
        })
        .then(() => {
          this.setEmojiAlertConfig({
            emoji: '🤗',
            title: '예약 대기 신청이<br>완료되었습니다!',
            content: '예약 취소가 발생할 경우<br>대기자님께 알려드립니다.',
          })
          this.toggleEmojiAlert(true)
        })
        .catch((e) => {
          axiosCatchHelper.alertIfHasMessage(e)
        })
        .finally(() => {
          this.fetchMyReservations().finally(() => {
            this.fetchLessonChangeData(dataSet).finally(() => {
              this.setLoading(false)
            })
          })
        })
    },
    requestLessonCancelCall(b2bTimetableReservationId) {
      const dataSet = {
        start: this.schedule.start,
        end: this.schedule.end,
        id: this.schedule.id,
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
    changeMailFormat(mail) {
      return mail.split('@')[0]
    },
    openReservationCancelEither(b2bTimetableReservationId) {
      this.setEmojiEitherConfig({
        emoji: '🤔',
        title: '예약을 취소하시겠어요?',
        content:
          '예약 대기자가 있는 경우에는<br>취소 후 재예약이 불가할 수 있습니다.',
        left: {
          content: '네, 취소합니다',
          callback: () => {
            this.requestLessonCancelCall(b2bTimetableReservationId)
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
    openWaitingCancelEither(b2bTimetableReservationId) {
      this.setEmojiEitherConfig({
        emoji: '🤔',
        title: '예약 대기를<br>취소하시겠어요?',
        content:
          '취소 후 다른 예약 대기자가 발생할 경우,<br>재예약이 불가할 수 있습니다.',
        left: {
          content: '네, 취소합니다',
          callback: () => {
            this.requestLessonCancelCall(b2bTimetableReservationId)
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
  },
}
</script>
<style scoped lang="scss">
@import '~/assets/scss/_index.scss';
.learner-block {
  width: 100%;
  border-radius: 18px;
  background-color: #ffffff;
  border: 1px solid #ffffff;
  &.learner-my {
    border-image: linear-gradient(to right, #03dcc8 0%, #6400f0) 0 0;
    background-image: linear-gradient(to bottom, #fff, #fff),
      linear-gradient(to right, #03dcc8 0%, #6400f0);
    background-origin: border-box;
    background-clip: content-box, border-box;
  }
  &.learner-complete {
    .learner-time {
      color: #b9b9b9;
    }
    .learner-expert {
      color: #b9b9b9;
    }
  }
  &.learner-wait {
    border-color: #000000;
  }
}
.learner-time {
  font-weight: $bold;
  padding: 12px 12px 0;
}
.learner-expert {
  font-size: 14px;
  padding: 0 12px;
}
.learner-bottom {
  @include flexBox(row, space-between, center);
  padding: 8px 12px;
}
.learner-caption {
  @include flexBox(row, flex-start, center);
  gap: 4px;
  .caption-circle {
    display: block;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: $office-violet;
    &.circle--my {
      background-color: #ff0032;
    }
  }
  .caption-text {
    font-size: 12px;
  }
}
</style>
