<template>
  <div
    class="company-expert-block"
    :class="{ 'expert-complete': computedBlockStatus.isComplete }"
  >
    <p class="expert-time">{{ computedTimeText }}</p>
    <p class="expert-name">{{ computedBlockStatus.text }}</p>
    <div v-if="computedBlockStatus.buttons.length > 0" class="expert-buttons">
      <p
        v-for="(button, index) in computedBlockStatus.buttons"
        :key="index"
        class="expert-button"
        :class="[{ 'button--check': button.isCheck }, button.theme]"
        @click="button.callback"
      >
        {{ button.text }}
      </p>
    </div>
  </div>
</template>
<script>
import { reduce, isEmpty } from 'lodash'
import moment from 'moment'
import { mapState, mapActions } from 'vuex'
import axios from 'axios'
import axiosCatchHelper from '~/assets/js/axiosCatchHelper'
export default {
  name: 'CompanyExpertBlock',
  props: {
    schedule: { type: Object, default: () => {} },
  },
  computed: {
    ...mapState('company/expert', ['schedules']),
    computedTimeText() {
      return `${moment(this.schedule.start).format('HH:mm')} ~ ${moment(
        this.schedule.end
      ).format('HH:mm')}`
    },
    computedBlockStatus() {
      let text = ''
      let isComplete = false
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
            text = '예약 없음'
            isComplete = false
          }
          break
        case '수업 완료':
          text = this.changeLessonCompleteEmailFormat()
          isComplete = true
          buttons = [
            {
              text: '정상 진행함 (취소)',
              callback: () => {
                this.requestChangeStatus('예약')
              },
              isCheck: true,
              theme: 'button--black',
            },
          ]
          break
        case '예약':
          text = this.changeEmailFormat()
          isComplete = false
          if (isLessonStartAndEndBetweenTime) {
            buttons = [
              {
                text: '수업 불가 통보하기',
                callback: () => {
                  this.requestChangeStatus('전문가_사정_불가')
                },
                isCheck: false,
                theme: 'button--gray',
              },
              {
                text: '알림 보내기',
                callback: () => {
                  this.requestInformTime()
                },
                isCheck: false,
                theme: 'button--black',
              },
            ]
          } else if (isLessonStartAndAfterTime) {
            buttons = [
              {
                text: '노쇼',
                callback: () => {
                  this.requestChangeStatus('노쇼')
                },
                isCheck: false,
                theme: 'button--black',
              },
              {
                text: '정상 진행',
                callback: () => {
                  this.requestChangeStatus('수업_완료')
                },
                isCheck: false,
                theme: 'button--violet',
              },
            ]
          } else {
            buttons = [
              {
                text: '수업 불가 통보하기',
                callback: () => {
                  this.requestChangeStatus('전문가_사정_불가')
                },
                isCheck: false,
                theme: 'button--gray',
              },
            ]
          }
          break
        case '노쇼':
          text = this.changeEmailFormat()
          isComplete = true
          buttons = [
            {
              text: '노쇼 (취소)',
              callback: () => {
                this.requestChangeStatus('예약')
              },
              isCheck: true,
              theme: 'button--black',
            },
          ]
          break
        case '전문가 사정 불가':
          text = `전문가 사정으로 수업 미진행`
          isComplete = true
          buttons = [
            {
              text: '수업 불가 통보',
              callback: () => {},
              isCheck: true,
              theme: 'button--black',
            },
          ]
          break
      }
      return {
        text,
        isComplete,
        buttons,
      }
    },
  },
  methods: {
    ...mapActions('company', ['setLoading']),
    ...mapActions('company/expert', ['setSchedules']),
    requestChangeStatus(status) {
      if (status === '노쇼' && confirm('회원님이 노쇼를 하셨나요?') === false) {
        return
      } else if (
        status === '전문가_사정_불가' &&
        confirm('수업 불가 처리 할까요? 처리후 철회 불가 합니다.') === false
      ) {
        return
      }

      this.setLoading(true)
      axios
        .post('*path*', {
          _method: 'put',
          b2bTimetableId: this.schedule.id,
          status,
        })
        .then(() => {
          this.changeStatusData(status)
        })
        .catch((e) => {
          axiosCatchHelper.alertIfHasMessage(e)
        })
        .finally(() => {
          this.setLoading(false)
        })
    },
    requestInformTime() {
      this.setLoading(true)
      axios
        .post('*path*', {
          _method: 'post',
          b2bTimetableId: this.schedule.id,
        })
        .then(() => {
          alert(
            isEmpty(this.schedule.reservation)
              ? '수업 예약자에게 알림을 보냈습니다!'
              : `${
                  this.schedule.reservation.email.split('@')[0]
                }님에게 알림을 보냈습니다!`
          )
        })
        .catch((e) => {
          axiosCatchHelper.alertIfHasMessage(e)
        })
        .finally(() => {
          this.setLoading(false)
        })
    },
    changeStatusData(status) {
      const startYearMonth = moment(this.schedule.start).format('YYYY-MM')
      const fullDate = moment(this.schedule.start).format('YYYY-MM-DD')
      const changed = status.replace(/_/gi, ' ')
      this.setSchedules({
        ...this.schedules,
        [startYearMonth]: {
          ...this.schedules[startYearMonth],
          [fullDate]: reduce(
            this.schedules[startYearMonth][fullDate],
            (result, key, value) => {
              if (key.id === this.schedule.id) {
                result.push({ ...key, status: changed })
              } else {
                result.push(key)
              }
              return result
            },
            []
          ),
        },
      })
    },
    changeLessonCompleteEmailFormat() {
      return isEmpty(this.schedule.reservation)
        ? '수업 완료'
        : `${this.schedule.reservation.email.split('@')[0]}님 수업 완료`
    },
    changeEmailFormat() {
      return isEmpty(this.schedule.reservation) &&
        isEmpty(this.schedule.waiting)
        ? ''
        : isEmpty(this.schedule.waiting)
        ? `${this.schedule.reservation.email.split('@')[0]}님 예약`
        : `${this.schedule.reservation.email.split('@')[0]}님 예약, ${
            this.schedule.waiting.email.split('@')[0]
          }님 대기`
    },
  },
}
</script>
<style lang="scss" scoped>
@import '~/assets/scss/_index.scss';
.company-expert-block {
  width: 100%;
  padding: 12px;
  border-radius: 18px;
  background-color: #ffffff;
  &.expert-complete {
    .expert-time {
      color: #b9b9b9;
    }
    .expert-name {
      color: #b9b9b9;
    }
  }
}
.expert-time {
  font-weight: $bold;
}
.expert-name {
  font-size: 12px;
}
.expert-buttons {
  @include flexBox(row, center, center);
  margin-top: 12px;
  gap: 6px;
  .expert-button {
    @include flexBox(row, center, center);
    flex: 1;
    height: 32px;
    gap: 2px;
    border-radius: 12px;
    border: 1px solid;
    cursor: pointer;
    font-size: 14px;
    font-weight: $medium;
    &.button--check {
      &::before {
        content: '';
        width: 16px;
        height: 16px;
        @include defaultIcon(
          'https://dcse8twossp9.cloudfront.net/static/img/v2/icon/check-black.svg'
        );
      }
    }
    &.button--black {
      border-color: #000000;
      color: #000000;
    }
    &.button--violet {
      border-color: $office-violet;
      color: $office-violet;
    }
    &.button--gray {
      border-color: #e1e1e1e1;
      color: #000000;
    }
  }
}
</style>
