<template>
  <div id="companyCalculatePage" class="background-container">
    <div class="default-container">
      <CompanyHeader
        user-type="expert"
        now-page="calculate"
        :cs-corporate-id="csCorporateId"
      />
      <div class="table-container">
        <table>
          <tbody>
            <tr class="table-top">
              <th class="table-left--none w32"></th>
              <th class="table-left--bold w90">수업일</th>
              <th class="w40">전체</th>
              <th class="w40">예약</th>
              <th class="w40">노쇼</th>
              <th class="w40">불가<br />(전문가 사정)</th>
              <th class="w40">수업 완료</th>
              <th class="w40">미진행</th>
              <th>정산(예정)액</th>
              <th class="table-right--none w55">정산여부</th>
            </tr>
            <tr v-for="(c, index) in calculation" :key="c.lessonAt">
              <th class="table-left--none">{{ index + 1 }}</th>
              <td class="table-left--bold">{{ changeDateFormat(c) }}</td>
              <td>{{ c.totalCount }}</td>
              <td>{{ c.reservationCount }}</td>
              <td>{{ c.noShowCount }}</td>
              <td>{{ c.closeByExpertCount }}</td>
              <td>{{ c.doneCount }}</td>
              <td>{{ c.openCount }}</td>
              <td>{{ changePayFormat(c) }}</td>
              <td class="table-right--none">
                {{ changeCalculateResultFormat(c) }}
              </td>
            </tr>
            <tr class="table-bottom">
              <th class="table-left--none">{{ calculation.length + 1 }}</th>
              <td class="table-left--bold">
                {{ computedTotalLessonMonth }}month
              </td>
              <td>{{ computedTotalCountSumByCalculation }}</td>
              <td>{{ computedReservationCountSumByCalculation }}</td>
              <td>{{ computedNoShowCountSumByCalculation }}</td>
              <td>{{ computedCloseCountSumByCalculation }}</td>
              <td>{{ computedDoneCountSumByCalculation }}</td>
              <td>{{ computedOpenCountSumByCalculation }}</td>
              <td>{{ computedSumCalculationAmountByCalculation }}</td>
              <td class="table-right--none"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <LoadingModal v-if="isLoading" />
  </div>
</template>
<script>
import { cloneDeep, isEmpty, reduce } from 'lodash'
import moment from 'moment'
import axios from 'axios'
import axiosCatchHelper from '~/assets/js/axiosCatchHelper'
export default {
  name: 'CompanyExpertCalculatePage',
  components: {
    LoadingModal: () => import('~/components/common/LoadingModal'),
    CompanyHeader: () => import('~/components/company/common/CompanyHeader'),
  },
  asyncData({ params }) {
    return {
      csCorporateId: params.csCorporateId,
    }
  },
  data: () => ({
    isLoading: false,
    calculation: [],
  }),
  computed: {
    computedTotalCountSumByCalculation() {
      if (isEmpty(this.calculation)) {
        return 0
      } else {
        return reduce(
          this.calculation,
          (sum, calc) => {
            if (Number(calc.totalCount) > 0) {
              return Number(sum) + Number(calc.totalCount)
            }

            return sum
          },
          0
        )
      }
    },
    computedOpenCountSumByCalculation() {
      if (isEmpty(this.calculation)) {
        return 0
      } else {
        return reduce(
          this.calculation,
          (sum, calc) => {
            if (Number(calc.openCount) > 0) {
              return Number(sum) + Number(calc.openCount)
            }

            return sum
          },
          0
        )
      }
    },
    computedReservationCountSumByCalculation() {
      if (isEmpty(this.calculation)) {
        return 0
      } else {
        return reduce(
          this.calculation,
          (sum, calc) => {
            if (Number(calc.reservationCount) > 0) {
              return Number(sum) + Number(calc.reservationCount)
            }

            return sum
          },
          0
        )
      }
    },
    computedNoShowCountSumByCalculation() {
      if (isEmpty(this.calculation)) {
        return 0
      } else {
        return reduce(
          this.calculation,
          (sum, calc) => {
            if (Number(calc.noShowCount) > 0) {
              return Number(sum) + Number(calc.noShowCount)
            }

            return sum
          },
          0
        )
      }
    },
    computedCloseCountSumByCalculation() {
      if (isEmpty(this.calculation)) {
        return 0
      } else {
        return reduce(
          this.calculation,
          (sum, calc) => {
            if (Number(calc.closeByExpertCount) > 0) {
              return Number(sum) + Number(calc.closeByExpertCount)
            }

            return sum
          },
          0
        )
      }
    },
    computedDoneCountSumByCalculation() {
      if (isEmpty(this.calculation)) {
        return 0
      } else {
        return reduce(
          this.calculation,
          (sum, calc) => {
            if (Number(calc.doneCount) > 0) {
              return Number(sum) + Number(calc.doneCount)
            }

            return sum
          },
          0
        )
      }
    },
    computedSumCalculationAmountByCalculation() {
      if (isEmpty(this.calculation)) {
        return 0
      } else {
        return reduce(
          this.calculation,
          (sum, calc) => {
            if (Number(calc.sumCalculationAmount) > 0) {
              return Number(sum) + Number(calc.sumCalculationAmount)
            }

            return sum
          },
          0
        ).toLocaleString()
      }
    },
    computedTotalLessonMonth() {
      if (isEmpty(this.calculation)) {
        return 0
      } else {
        const s = moment(this.calculation[0].lessonAt, 'YYYY-MM-DD')
        const e = moment(
          this.calculation[this.calculation.length - 1].lessonAt,
          'YYYY-MM-DD'
        )

        return Math.ceil(e.diff(s, 'months', true))
      }
    },
  },
  created() {
    this.fetchCalculation()
  },
  methods: {
    fetchCalculation() {
      this.isLoading = true
      axios
        .post('*path*', {
          _method: 'get',
          csCorporateId: this.csCorporateId,
        })
        .then((response) => {
          this.calculation = cloneDeep(response.data.calculation)
        })
        .catch((e) => {
          axiosCatchHelper.alertIfHasMessage(e)
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    changeDateFormat({ lessonAt }) {
      return moment(lessonAt, 'YYYY-MM-DD').format('YY.M.D')
    },
    changePayFormat({ sumCalculationAmount }) {
      return sumCalculationAmount.toLocaleString()
    },
    changeCalculateResultFormat({ isCalculated }) {
      return isCalculated === true ? '〇' : ''
    },
  },
}
</script>
<style scoped lang="scss">
@import '~/assets/scss/company/index.scss';
.default-container {
  min-height: calc(var(--vh, 1vh) * 100);
}
.table-container {
  max-height: calc(var(--vh, 1vh) * 100 - 48px);
  overflow: auto;
}
table {
  width: auto;
  table-layout: fixed;
  border-collapse: separate;
  border-spacing: 0;
  white-space: nowrap;
  th {
    font-size: 12px;
    background-color: #f5f5f5;
  }
  td {
    font-size: 14px;
  }
  th,
  td {
    text-align: center;
    height: 24px;
    vertical-align: middle;
    border: 1px solid #e1e1e1;
  }
  .table-top {
    position: sticky;
    top: 0;
    th {
      border-bottom: 2px solid #e1e1e1;
      border-top: none;
    }
  }
  .table-bottom {
    position: sticky;
    bottom: 0;
    border-bottom: 1px solid #e1e1e1;
    border-top: 2px solid #e1e1e1;
    td {
      background-color: #ffffff;
    }
  }
  .table-left--none {
    border-left: none;
  }
  .table-right--none {
    border-right: none;
  }
  .table-left--bold {
    border-left: 2px solid #e1e1e1;
  }
  .table-right--bold {
    border-right: 2px solid #e1e1e1;
  }
  .w32 {
    width: 50px;
  }
  .w40 {
    width: 80px;
  }
  .w55 {
    width: 100px;
  }
  .w90 {
    width: 90px;
  }
}
@media all and (max-width: 648px) {
  table {
    .w32 {
      width: 32px;
    }
    .w40 {
      width: 40px;
    }
    .w55 {
      width: 55px;
    }
    .w90 {
      width: 65px;
    }
  }
}
</style>
