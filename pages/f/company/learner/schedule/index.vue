<template>
  <div id="companySchedulePage" class="background-container">
    <div class="default-container">
      <CompanyHeader
        user-type="learner"
        now-page="calendar"
        @toggle-company-reservation-list="toggleCompanyReservationList"
      />
      <div class="schedule-search" :class="{ 'search--open': isCategoryOpen }">
        <div class="search--all">
          <CompanyCalendar
            :year-month="computedCalendarDataBySchedules"
            :schedules="schedules"
            @fetch-schedules="fetchSchedules"
          />
          <div class="schedule-category-container">
            <p class="schedule-category-title">프로그램</p>
            <div class="schedule-category">
              <CompanyCommonButton
                :obj="{
                  text: expertInfo.programTypeCaption,
                  value: expertInfo.programType,
                }"
                size="button-big"
                :theme="
                  expertInfo.programType === selectedData.programType
                    ? 'selected'
                    : ''
                "
                side-text="상세"
                :is-side-text-show="
                  expertInfo.programType === selectedData.programType
                "
                :callback="programCategoryReClick"
              />
            </div>
          </div>
          <div class="schedule-category-container border-radius">
            <p class="schedule-category-title">전문가</p>
            <div class="schedule-category">
              <CompanyCommonButton
                v-for="expert in expertInfo.programs"
                :key="expert.coachUserId"
                :obj="{
                  text: `${expert.expertName} 전문가`,
                  value: expert.coachUserId,
                }"
                size="button-big"
                :theme="
                  expert.coachUserId === selectedData.coachUserId
                    ? 'selected'
                    : ''
                "
                side-text="프로필"
                :is-side-text-show="
                  expert.coachUserId === selectedData.coachUserId
                "
                :callback="() => handlerClickCoachButton(expert)"
              />
            </div>
            <div class="schedule-double-line">
              <i @click="handlerClickDoubleLine"></i>
            </div>
          </div>
        </div>
        <div class="search--selected">
          <div class="schedule-category-container border-radius">
            <p class="schedule-category-title">지금 보고있는 프로그램</p>
            <div class="schedule-category">
              <CompanyCommonButton
                :obj="{ text: computedSelectedDateChangeFormat, value: '' }"
                size="button-big"
                theme="background"
                side-text="상세"
                :is-side-text-show="false"
                :callback="handlerClickDayButton"
              />
              <CompanyCommonButton
                :obj="{ text: selectedData.programTypeCaption, value: '' }"
                size="button-big"
                theme="selected"
                side-text="상세"
                :is-side-text-show="true"
                :callback="programCategoryReClick"
              />
              <CompanyCommonButton
                :obj="{
                  text: selectedData.expertName,
                  value: selectedData.coachUserId,
                }"
                size="button-big"
                theme="selected"
                side-text="프로필"
                :is-side-text-show="true"
                :callback="() => handlerClickCoachButton(selectedData)"
              />
            </div>
            <div class="schedule-double-line">
              <i @click="handlerClickDoubleLine"></i>
            </div>
          </div>
        </div>
      </div>
      <div
        class="schedule-tab"
        :class="[
          { 'tab--open': isCategoryOpen },
          { 'tab--close': !isCategoryOpen },
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
          :class="{ on: tab === '내 예약' }"
          @click="handlerClickTab('내 예약')"
        >
          내 예약
        </p>
        <p
          class="tab-item"
          :class="{ on: tab === '예약가능' }"
          @click="handlerClickTab('예약가능')"
        >
          예약가능
        </p>
      </div>
      <p v-if="computedTodaySchedules.length === 0" class="schedule-empty">
        {{ computedScheduleEmptyText }}
      </p>
      <div v-if="computedTodaySchedules.length > 0" class="schedule-list">
        <CompanyLearnerBlock
          v-for="sc in computedTodaySchedules"
          :key="sc.id"
          :schedule="sc"
          @set-loading="setLoading"
        />
      </div>
      <CompanyReservationListModal
        v-if="isCompanyReservationListModal"
        @toggle-company-reservation-list="toggleCompanyReservationList"
        @set-loading="setLoading"
      />
      <CTypeIntroModal
        v-if="isCTypeIntroModal"
        :program-type="expertInfo.programType"
        @toggle-c-type-intro-modal="toggleCTypeIntroModal"
      />
      <CompanyProgramDetailModal
        v-if="isCompanyProgramDetailModal"
        :coach="coach"
        :program="program"
        @close-modal="toggleCompanyProgramDetailModal(false)"
      />
      <LoadingModal v-if="isLoading" />
      <CommonEmojiAlert
        v-if="isEmojiAlert"
        :config="emojiAlertConfig"
        @close-alert="toggleEmojiAlert(false)"
      />
      <CommonEmojiEither
        v-if="isEmojiEither"
        :config="emojiEitherConfig"
        @close-alert="toggleEmojiEither(false)"
      />
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import {
  reduce,
  assign,
  isEmpty,
  filter,
  merge,
  cloneDeep,
  keys,
  includes,
} from 'lodash'
import moment from 'moment'
import axios from 'axios'
import axiosCatchHelper from '~/assets/js/axiosCatchHelper'
import commonMixins from '~/assets/js/commonMixins'
export default {
  name: 'CompanySchedulePage',
  components: {
    LoadingModal: () => import('~/components/common/LoadingModal'),
    CommonEmojiAlert: () => import('~/components/common/CommonEmojiAlert'),
    CommonEmojiEither: () => import('~/components/common/CommonEmojiEither'),
    CompanyHeader: () => import('~/components/company/common/CompanyHeader'),
    CompanyCalendar: () =>
      import('~/components/company/common/CompanyCalendar'),
    CompanyCommonButton: () =>
      import('~/components/company/common/CompanyCommonButton'),
    CompanyLearnerBlock: () =>
      import('~/components/company/learner/CompanyLearnerBlock'),
    CompanyReservationListModal: () =>
      import('~/components/company/learner/CompanyReservationListModal'),
    CTypeIntroModal: () =>
      import('~/components/company/learner/CTypeIntroModal'),
    CompanyProgramDetailModal: () =>
      import('~/components/company/learner/CompanyProgramDetailModal'),
  },
  mixins: [commonMixins],
  data: () => ({
    isCompanyReservationListModal: false,
    isCTypeIntroModal: false,
    isCompanyProgramDetailModal: false,
    isTransitionEnd: true,
    tab: '전체',
    coach: {},
    program: {},
  }),
  computed: {
    ...mapState('company', [
      'isCategoryOpen',
      'selectedDate',
      'isLoading',
      'isEmojiAlert',
      'emojiAlertConfig',
      'isEmojiEither',
      'emojiEitherConfig',
    ]),
    ...mapState('company/learner', [
      'schedules',
      'todaySchedules',
      'expertInfo',
      'selectedData',
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
    computedTodaySchedules() {
      if (isEmpty(this.todaySchedules)) {
        return []
      } else {
        switch (this.tab) {
          case '전체':
            return this.todaySchedules
          case '내 예약':
            return filter(this.todaySchedules, (t) => {
              return (
                (!isEmpty(t.reservation) && t.reservation.isMyReservation) ||
                (!isEmpty(t.waiting) && t.waiting.isMyReservation)
              )
            })
          case '예약가능':
            return filter(this.todaySchedules, (t) => {
              return t.status === '오픈' && moment(t.start).diff(moment()) > 0
            })
          default:
            return this.todaySchedules
        }
      }
    },
    computedSelectedDateChangeFormat() {
      let day
      if (moment().format('YYYY-MM-DD') === this.selectedDate) {
        day = '오늘'
      } else {
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
      }
      return isEmpty(this.selectedDate)
        ? ''
        : `${moment(this.selectedDate, 'YYYY-MM-DD').format('D')}(${day})`
    },
    computedScheduleEmptyText() {
      switch (this.tab) {
        case '내 예약':
          return '예약한 수업이 없습니다😶'
        case '예약가능':
          return '예약 가능한 수업이 없습니다😶'
        default:
          return '수업이 없습니다😶'
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

    this.fetchExpertInfo().then(() => {
      this.fetchSchedules({
        periodDirection: 'BOTH',
        baseDate: this.selectedDate,
      })

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
        const target = document.querySelector('.schedule-search .search--all')
        const target2 = document.querySelector(
          '.schedule-search .search--selected'
        )

        if (target !== null) {
          target.addEventListener(transitionEvent, () => {
            this.isTransitionEnd = true
          })
        }
        if (target2 !== null) {
          target2.addEventListener(transitionEvent, () => {
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
    ...mapActions('company', [
      'toggleCategoryOpen',
      'setSelectedDate',
      'setLoading',
      'toggleEmojiAlert',
      'toggleEmojiEither',
    ]),
    ...mapActions('company/learner', [
      'setSchedules',
      'setTodaySchedules',
      'setExpertInfo',
      'setSelectedData',
    ]),
    fetchSchedules({ periodDirection, baseDate }) {
      const dateFrom = moment(this.expertInfo.lessonPeriod.from).format(
        'YYYY-MM-DD'
      )
      const dateTo = moment(this.expertInfo.lessonPeriod.to).format(
        'YYYY-MM-DD'
      )

      if (
        (periodDirection === 'BEFORE' &&
          includes(keys(this.computedAllSchedulesBySchedules), dateFrom)) ||
        (periodDirection === 'AFTER' &&
          includes(keys(this.computedAllSchedulesBySchedules), dateTo))
      ) {
        return false
      } else {
        this.setLoading(true)
        axios
          .post('*path*', {
            _method: 'get',
            csCorporateId: window.homefit.user.csCorporateId,
            periodDirection,
            baseDate,
          })
          .then((response) => {
            if (periodDirection === 'BOTH') {
              this.setSchedules(response.data.schedules)
            } else {
              this.setSchedules(merge(this.schedules, response.data.schedules))
            }
          })
          .catch(() => {
            location.href = '/'
          })
          .finally(() => {
            this.setLoading(false)
          })
      }
    },
    fetchExpertInfo() {
      this.setLoading(true)
      return new Promise((resolve, reject) => {
        axios
          .post('*path*', {
            _method: 'get',
            csCorporateId: window.homefit.user.csCorporateId,
          })
          .then((response) => {
            this.setExpertInfo(response.data.baseInfo)
            this.setSelectedData({
              programType: this.expertInfo.programType,
              programTypeCaption: this.expertInfo.programTypeCaption,
              coachUserId: this.expertInfo.programs[0].coachUserId,
              expertName: this.expertInfo.programs[0].expertName,
              id: this.expertInfo.programs[0].id,
            })
          })
          .catch(() => {
            location.href = '/'
          })
          .finally(() => {
            this.setLoading(false)
            resolve()
          })
      })
    },
    fetchCoachProgram(programId) {
      this.setLoading(true)
      axios
        .post('*path*', {
          _method: 'get',
          programId,
        })
        .then((response) => {
          this.coach = cloneDeep(response.data.coach)
          this.program = cloneDeep(response.data.program)
          this.toggleCompanyProgramDetailModal(true)
        })
        .catch((e) => {
          axiosCatchHelper.alertIfHasMessage(e)
        })
        .finally(() => {
          this.setLoading(false)
        })
    },
    handlerScrollEvent() {
      if (window.scrollY === 0 && this.isTransitionEnd === true) {
        this.isTransitionEnd = false
        this.toggleCategoryOpen(true)
      } else {
        this.toggleCategoryOpen(false)
      }
    },
    toggleCompanyReservationList(payload) {
      this.isCompanyReservationListModal = payload
    },
    toggleCTypeIntroModal(payload) {
      this.isCTypeIntroModal = payload
    },
    toggleCompanyProgramDetailModal(payload) {
      this.isCompanyProgramDetailModal = payload
    },
    programCategoryReClick() {
      this.toggleCTypeIntroModal(true)
    },
    handlerClickDayButton() {
      if (window.scrollY === 0) {
        this.toggleCategoryOpen(true)
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    },
    handlerClickTab(tab) {
      this.tab = tab
    },
    handlerClickCoachButton(program) {
      if (this.selectedData.coachUserId === program.coachUserId) {
        this.fetchCoachProgram(program.id)
      } else {
        this.setSelectedData(program)
      }
    },
    handlerClickDoubleLine() {
      if (window.scrollY === 0) {
        this.toggleCategoryOpen(true)
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
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
