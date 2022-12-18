<template>
  <div id="CompanyExpertSchedulePage" class="background-container">
    <div class="default-container">
      <CompanyHeader
        user-type="expert"
        now-page="calendar"
        :cs-corporate-id="csCorporateId"
      />
      <div class="schedule-outline" :class="{ 'outline--open': isOutlineOpen }">
        <CompanyCalendar
          :year-month="computedCalendarDataBySchedules"
          :schedules="schedules"
          user-type="expert"
          @fetch-schedules="fetchSchedules"
        />
        <div class="schedule-outline-container">
          <p class="schedule-outline-title">
            {{ computedSelectedDateChangeFormat }} 개요
          </p>
          <div class="schedule-outline-contents">
            <div class="outline-content">
              <div class="content-left">
                <p class="content-title">
                  {{ computedOutlineLeftText.title }}
                </p>
                <p class="content-subtitle">
                  {{ computedOutlineLeftText.subtitle }}
                </p>
              </div>
              <div
                class="content-right content-circle"
                :class="computedOutlineLeftCircle.theme"
              >
                <span class="circle-left">
                  <i
                    class="circle-bar"
                    :style="{
                      transform: computedOutlineLeftCircle.percent.left,
                    }"
                  ></i>
                </span>
                <span class="circle-right">
                  <i
                    class="circle-bar"
                    :style="{
                      transform: computedOutlineLeftCircle.percent.right,
                    }"
                  ></i>
                </span>
                <span class="circle-text">{{
                  computedOutlineLeftCircle.time
                }}</span>
              </div>
            </div>
            <div class="outline-content">
              <div class="content-left">
                <p class="content-title">
                  {{ computedOutlineRightText.ing.count }}/{{
                    computedOutlineRightText.reservation.count
                  }}/{{ computedOutlineRightText.totalCount }}
                </p>
                <p class="content-subtitle">완료/예정/전체</p>
              </div>
              <div class="content-right content-bar">
                <span class="bar-stick"
                  ><i
                    id="barStick1"
                    :style="{ width: computedOutlineRightText.ing.width }"
                  ></i
                ></span>
                <span class="bar-stick"
                  ><i
                    id="barStick2"
                    :style="{
                      width: computedOutlineRightText.reservation.width,
                    }"
                  ></i
                ></span>
                <span class="bar-stick"
                  ><i id="barStick3" style="width: 100%"></i
                ></span>
              </div>
            </div>
          </div>
        </div>
        <div class="schedule-double-line" @click="halderClickDoubleLine">
          <i></i>
        </div>
      </div>
      <div
        class="schedule-tab"
        :class="[
          { 'outline--open': isOutlineOpen },
          { 'outline--close': !isOutlineOpen },
        ]"
      >
        <p
          class="tab-item"
          :class="{ on: tab === '전체' }"
          @click="handlerClickTab('전체')"
        >
          전체
        </p>
        <p
          class="tab-item"
          :class="{ on: tab === '예정' }"
          @click="handlerClickTab('예정')"
        >
          예정
        </p>
        <p
          class="tab-item"
          :class="{ on: tab === '미처리' }"
          @click="handlerClickTab('미처리')"
        >
          미처리
        </p>
      </div>
      <div v-if="computedTodaySchedules.length > 0" class="schedule-list">
        <CompanyExpertBlock
          v-for="sc in computedTodaySchedules"
          :key="sc.id"
          :schedule="sc"
        />
      </div>
      <p v-if="computedTodaySchedules.length === 0" class="schedule-empty">
        {{ computedEmptyText }}
      </p>
    </div>
    <LoadingModal v-if="isLoading" />
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import moment from 'moment'
import { reduce, assign, isEmpty, filter, includes, merge, keys } from 'lodash'
import axios from 'axios'
import axiosCatchHelper from '~/assets/js/axiosCatchHelper'
import commonMixins from '~/assets/js/commonMixins'
export default {
  name: 'CompanyExpertSchedulePage',
  components: {
    LoadingModal: () => import('~/components/common/LoadingModal'),
    CompanyHeader: () => import('~/components/company/common/CompanyHeader'),
    CompanyCalendar: () =>
      import('~/components/company/common/CompanyCalendar'),
    CompanyExpertBlock: () =>
      import('~/components/company/expert/CompanyExpertBlock'),
  },
  mixins: [commonMixins],
  asyncData({ params }) {
    return {
      csCorporateId: params.csCorporateId,
    }
  },
  data: () => ({
    isTransitionEnd: true,
    nowTimeInterval: null,
    nowTime: moment(),
    tab: '전체',
    scrollTimer: null,
  }),
  computed: {
    ...mapState('company', ['selectedDate', 'isLoading']),
    ...mapState('company/expert', [
      'isOutlineOpen',
      'schedules',
      'todaySchedules',
    ]),
    computedCalendarDataBySchedules() {
      return Object.keys(this.schedules).sort(
        (d1, d2) => moment(d1, 'YYYY-MM') - moment(d2, 'YYYY-MM')
      )
    },
    computedAllSchedulesBySchedules() {
      return reduce(
        this.schedules,
        (result, key, value) => {
          result = assign(result, key)
          return result
        },
        {}
      )
    },
    computedSelectedDateChangeFormat() {
      let day
      switch (moment(this.selectedDate, 'YYYY-MM-DD').day()) {
        case 0:
          day = '일'
          break
        case 1:
          day = '월'
          break
        case 2:
          day = '화'
          break
        case 3:
          day = '수'
          break
        case 4:
          day = '목'
          break
        case 5:
          day = '금'
          break
        case 6:
          day = '토'
          break
        default:
          day = ''
          break
      }
      return `${moment(this.selectedDate, 'YYYY-MM-DD').format(
        'YYYY.M.D'
      )}(${day})`
    },
    computedOutlineLeftText() {
      if (isEmpty(this.todaySchedules)) {
        return {
          title: '',
          subtitle: '',
        }
      } else {
        const isBefore =
          this.nowTime.diff(moment(this.todaySchedules[0].start), 'minutes') < 0
        const isAfter =
          this.nowTime.diff(
            moment(this.todaySchedules[this.todaySchedules.length - 1].end),
            'minutes'
          ) > 0
        const startTime = moment(this.todaySchedules[0].start).format('HH:mm')
        const endTime = moment(
          this.todaySchedules[this.todaySchedules.length - 1].end
        ).format('HH:mm')
        return {
          title:
            !isBefore && !isAfter ? '수업중' : isBefore ? '수업전' : '수업종료',
          subtitle: `${startTime}~${endTime}`,
        }
      }
    },
    computedOutlineLeftCircle() {
      if (isEmpty(this.todaySchedules)) {
        return {
          time: '',
          percent: '',
        }
      } else {
        const startTime = moment(this.todaySchedules[0].start).format('HH:mm')
        const endTime = moment(
          this.todaySchedules[this.todaySchedules.length - 1].end
        ).format('HH:mm')

        const betweenTime = moment(endTime, 'HH:mm').diff(
          moment(startTime, 'HH:mm'),
          'minutes'
        )
        const betweenHour = this.fillZero(
          2,
          Math.floor(betweenTime / 60).toString()
        )
        const betweenMinite = this.fillZero(2, (betweenTime % 60).toString())

        const betweenTimeByNow = moment(endTime, 'HH:mm').diff(
          this.nowTime,
          'minutes'
        )
        const betweenHourNow = this.fillZero(
          2,
          Math.floor(betweenTimeByNow / 60).toString()
        )
        const betweenMiniteNow = this.fillZero(
          2,
          (betweenTimeByNow % 60).toString()
        )

        const calcBetweenTime = Math.round(
          (betweenTimeByNow / betweenTime) * 100
        )

        return {
          time:
            this.computedOutlineLeftText.title === '수업전'
              ? `${betweenHour}:${betweenMinite}`
              : this.computedOutlineLeftText.title === '수업종료'
              ? '0:00'
              : `${betweenHourNow}:${betweenMiniteNow}`,
          percent: {
            left:
              this.computedOutlineLeftText.title === '수업전'
                ? 'rotate(180deg)'
                : calcBetweenTime - 50 <= 0
                ? 'rotate(0deg)'
                : `rotate(${(((calcBetweenTime - 50) * 2) / 100) * 180}deg)`,
            right:
              this.computedOutlineLeftText.title === '수업전'
                ? 'rotate(180deg)'
                : calcBetweenTime >= 50
                ? `rotate(180deg)`
                : `rotate(${((calcBetweenTime * 2) / 100) * 180}deg)`,
          },
          theme:
            this.computedOutlineLeftText.title === '수업종료' ? 'gray' : '',
        }
      }
    },
    computedOutlineRightText() {
      if (isEmpty(this.todaySchedules)) {
        return {
          ing: {
            count: 0,
            width: '0%',
          },
          reservation: {
            count: 0,
            width: '0%',
          },
          totalCount: 0,
        }
      } else {
        const ingCount = filter(this.todaySchedules, (t) => {
          return includes(['수업 완료', '노쇼'], t.status)
        }).length
        const reservationCount = filter(this.todaySchedules, (t) => {
          return t.status !== '오픈'
        }).length
        const totalCount = this.todaySchedules.length

        return {
          ing: {
            count: ingCount,
            width: `${(ingCount / totalCount) * 100}%`,
          },
          reservation: {
            count: reservationCount,
            width: `${(reservationCount / totalCount) * 100}%`,
          },
          totalCount,
        }
      }
    },
    computedTodaySchedules() {
      if (isEmpty(this.todaySchedules)) {
        return []
      } else {
        switch (this.tab) {
          case '전체':
            return this.todaySchedules
          case '예정':
            return filter(this.todaySchedules, (t) => {
              return moment().diff(t.start) <= 0
            })
          case '미처리':
            return filter(this.todaySchedules, (t) => {
              return includes(['예약'], t.status)
            })
          default:
            return this.todaySchedules
        }
      }
    },
    computedEmptyText() {
      switch (this.tab) {
        case '전체':
          return '수업이 없습니다😶'
        case '예정':
          return '진행 예정인 수업이 없습니다😶'
        default:
          return '미처리 상태인 수업이 없습니다😶'
      }
    },
  },
  watch: {
    selectedDate: {
      handler() {
        this.setTodaySchedules(
          this.computedAllSchedulesBySchedules[this.selectedDate]
        )
      },
    },
    schedules: {
      handler() {
        this.setTodaySchedules(
          this.computedAllSchedulesBySchedules[this.selectedDate]
        )
        if (isEmpty(this.todaySchedules)) {
          const closeDate = keys(this.computedAllSchedulesBySchedules).filter(
            (d) => {
              return moment(d, 'YYYY-MM-DD').diff(moment(), 'day') > 0
            }
          )[0]
          this.setSelectedDate(closeDate)
        }
      },
    },
  },
  created() {
    this.setSelectedDate(moment().format('YYYY-MM-DD'))
  },
  mounted() {
    window.addEventListener('scroll', this.handlerScrollEvent)
    this.fetchSchedules({
      periodDirection: 'BOTH',
      baseDate: this.selectedDate,
    }).then(() => {
      this.$nextTick(() => {
        const el = document.createElement('fakeelement')
        const transitions = {
          transition: 'transitionend',
          OTransition: 'oTransitionEnd',
          MozTransition: 'transitionend',
          WebkitTransition: 'webkitTransitionEnd',
        }
        let transitionEvent = 'transitionend'
        for (const t in transitions) {
          if (el.style[t] !== undefined) {
            transitionEvent = transitions[t]
          }
        }
        const target = document.querySelector(
          '.schedule-outline .schedule-outline-container'
        )
        if (target !== null) {
          target.addEventListener(transitionEvent, (e) => {
            this.isTransitionEnd = true
          })
        }
      })
    })

    if (this.nowTimeInterval === null) {
      this.nowTimeInterval = setInterval(() => {
        this.nowTime = moment()
      }, 1000)
    }
  },
  beforeDestory() {
    window.removeEventListener('scroll', this.handlerScrollEvent)
  },
  methods: {
    ...mapActions('company', ['setSelectedDate', 'setLoading']),
    ...mapActions('company/expert', [
      'toggleOutlineOpen',
      'setSchedules',
      'setTodaySchedules',
    ]),
    fetchSchedules({ periodDirection, baseDate }) {
      this.setLoading(true)
      return new Promise((resolve, reject) => {
        axios
          .post('*path*', {
            _method: 'get',
            csCorporateId: this.csCorporateId,
            baseDate,
            periodDirection,
          })
          .then((response) => {
            if (periodDirection === 'BOTH') {
              this.setSchedules(response.data.schedules)
            } else {
              this.setSchedules(merge(this.schedules, response.data.schedules))
            }
          })
          .catch((e) => {
            axiosCatchHelper.alertIfHasMessage(e)
          })
          .finally(() => {
            this.setLoading(false)
            resolve()
          })
      })
    },
    handlerScrollEvent() {
      if (window.scrollY === 0 && this.isTransitionEnd === true) {
        this.isTransitionEnd = false
        this.toggleOutlineOpen(true)
      } else {
        this.toggleOutlineOpen(false)
      }
    },
    halderClickDoubleLine() {
      if (window.scrollY === 0) {
        this.toggleOutlineOpen(!this.isOutlineOpen)
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    },
    handlerClickTab(payload) {
      this.tab = payload
    },
  },
}
</script>
<style scoped lang="scss">
@import '~/assets/scss/company/index.scss';
.default-container {
  min-height: calc(var(--vh, 1vh) * 100);
  background-color: #f5f5f5;
  position: relative;
}
</style>
