<template>
  <div
    :id="`calendar-${schedule}`"
    class="calendar-item"
    :class="[
      { selected: computedIsSelectedItem },
      { enabled: computedIsEnabled },
    ]"
    @click="handlerClickItem"
  >
    <p class="calendar-date">{{ computedDateText }}</p>
    <p
      class="calendar-day"
      :class="{ 'day--dot': computedIsEnabled && userType === 'expert' }"
    >
      {{ computedDayText }}
    </p>
  </div>
</template>
<script>
import moment from 'moment'
import { filter } from 'lodash'
import { mapState, mapActions } from 'vuex'
export default {
  name: 'CompanyCalendarItem',
  props: {
    selected: { type: Boolean, default: false },
    schedule: { type: String, default: '' },
    userType: { type: String, default: 'learner' },
  },
  computed: {
    ...mapState('company', ['selectedDate']),
    ...mapState('company/expert', ['schedules']),
    computedDateText() {
      return moment(this.schedule, 'YYYY-MM-DD').format('D')
    },
    computedIsSelectedItem() {
      return this.selectedDate === this.schedule
    },
    computedDayText() {
      if (moment().format('YYYY-MM-DD') === this.schedule) {
        return '오늘'
      } else {
        switch (moment(this.schedule, 'YYYY-MM-DD').day()) {
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
      }
    },
    computedIsEnabled() {
      if (this.userType === 'learner') {
        return true
      } else {
        return (
          filter(
            this.schedules[
              moment(this.schedule, 'YYYY-MM-DD').format('YYYY-MM')
            ][this.schedule],
            (s) => {
              return s.status === '예약'
            }
          ).length > 0
        )
      }
    },
  },
  methods: {
    ...mapActions('company', ['setSelectedDate']),
    handlerClickItem() {
      this.setSelectedDate(this.schedule)
    },
  },
}
</script>
<style scoped lang="scss">
@import '~/assets/scss/_index.scss';
.calendar-item {
  width: 42px;
  height: 52px;
  @include flexBox(column, center, center);
  gap: 2px;
  border-radius: 12px;
  border: 1px solid #e1e1e1;
  cursor: pointer;
  &.enabled {
    .calendar-date {
      color: #000000;
    }
    .calendar-day {
      color: #000000;
    }
  }
  &.selected {
    background-color: $office-violet;
    border-color: $office-violet;
    .calendar-date {
      color: #ffffff;
    }
    .calendar-day {
      color: #ffffff;
    }
  }
}
.calendar-date {
  font-weight: $bold;
  color: #b9b9b9;
}
.calendar-day {
  font-size: 12px;
  font-weight: $medium;
  color: #b9b9b9;
  &.day--dot::after {
    content: '*';
    font-size: 12px;
    color: #ff0032;
    font-weight: $medium;
  }
}
</style>
