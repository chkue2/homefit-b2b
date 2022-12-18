<template>
  <div class="company-calendar">
    <div
      id="calendarList"
      class="company-calendar-list"
      @scroll="handlerScrollXEvent($event)"
    >
      <div
        v-for="(ym, index) in yearMonth"
        :key="index"
        class="calendar-wrapper"
      >
        <p class="calendar-year-month">{{ ym }}</p>
        <div class="calendar-box">
          <CompanyCalendarItem
            v-for="s in computedFullDateBySchedules[ym]"
            :key="s.id"
            :schedule="s"
            :user-type="userType"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { keys, reduce, concat, values, isEmpty } from 'lodash'
import { mapState } from 'vuex'
import moment from 'moment'
import CompanyCalendarItem from '~/components/company/common/CompanyCalendarItem'
export default {
  name: 'CompanyCalendar',
  components: {
    CompanyCalendarItem,
  },
  props: {
    yearMonth: { type: Array, default: () => [] },
    schedules: { type: Object, default: () => {} },
    userType: { type: String, default: 'learner' },
  },
  data: () => ({
    calendarInterval: null,
  }),
  computed: {
    ...mapState('company', ['selectedDate', 'isLoading']),
    computedFullDateBySchedules() {
      return reduce(
        this.schedules,
        (result, key, value) => {
          result[value] = keys(key).sort(
            (a, b) => moment(a, 'YYYY-MM-DD') - moment(b, 'YYYY-MM-DD')
          )
          return result
        },
        {}
      )
    },
    computedDateFullArray() {
      return values(
        reduce(
          this.computedFullDateBySchedules,
          (result, key, value) => {
            result = concat(result, key)
            return result
          },
          []
        )
      ).sort((a, b) => new Date(a) - new Date(b))
    },
  },
  watch: {
    schedules: {
      deep: true,
      handler() {
        this.$nextTick(() => {
          if (
            !isEmpty(this.computedDateFullArray) &&
            document.querySelector('.company-calendar').clientWidth >=
              document.querySelector('#calendarList').scrollWidth
          ) {
            this.fetchSchedules(
              'AFTER',
              this.computedDateFullArray[this.computedDateFullArray.length - 1]
            )
          }
        })
      },
    },
  },
  mounted() {
    this.$nextTick(() => {
      if (this.calendarInterval === null) {
        this.calendarInterval = setInterval(() => {
          const target = document.querySelector(
            `#calendar-${this.selectedDate}`
          )
          if (target !== null) {
            this.initCalendarPosition()
            clearInterval(this.calendarInterval)
            this.calendarInterval = null
          }
        })
      }
    })
  },
  methods: {
    fetchSchedules(periodDirection, baseDate) {
      this.$emit('fetch-schedules', { periodDirection, baseDate })
    },
    handlerScrollXEvent(e) {
      const scroll = e.target.scrollLeft
      const endScrollPoint = e.target.scrollWidth - e.target.offsetWidth

      if (this.isLoading === false) {
        if (scroll === 0) {
          this.fetchSchedules('BEFORE', this.computedDateFullArray[0])
        } else if (scroll >= endScrollPoint) {
          this.fetchSchedules(
            'AFTER',
            this.computedDateFullArray[this.computedDateFullArray.length - 1]
          )
        }
      }
    },
    initCalendarPosition() {
      // const todayPosition = document.querySelector(
      //   `#calendar-${this.selectedDate}`
      // ).offsetLeft
      // const containerWidth =
      //   document.querySelector('.company-calendar').clientWidth

      // const scrollPosition =
      //   this.userType === 'learner'
      //     ? todayPosition - 24
      //     : todayPosition + 24 - containerWidth

      // console.log(scrollPosition)

      // document
      //   .querySelector('#calendarList')
      //   .scrollTo({ left: scrollPosition <= 0 ? 0 : scrollPosition })

      document.querySelector(`#calendar-${this.selectedDate}`).scrollIntoView({
        inline: this.userType === 'learner' ? 'start' : 'end',
      })
    },
  },
}
</script>
<style scoped lang="scss">
@import '~/assets/scss/_index.scss';
.company-calendar {
  width: 100%;
  height: 99px;
  padding: 12px 16px;
  background-color: #ffffff;
}
.calendar-year-month {
  font-size: 12px;
  font-weight: $medium;
  margin-bottom: 8px;
}
.company-calendar-list {
  overflow-y: hidden;
  overflow-x: auto;
  white-space: nowrap;
  display: flex;
  gap: 8px;
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
}
.calendar-box {
  display: flex;
  gap: 8px;
}
</style>
