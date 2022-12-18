<template>
  <div id="CompanyExpertPage" class="background-container">
    <div class="default-container">
      <div class="company-header">
        <i class="header-back" @click="handlerClickBackButton"></i>
        <span class="header-title">기업 수업</span>
        <i class="header-back hidden"></i>
      </div>
      <div class="company-list">
        <p
          v-for="company in companies"
          :key="company.csCorporateId"
          class="company-item"
          @click="moveToPage(company)"
        >
          {{ company.name }} ({{ changeDateForm(company) }})
        </p>
      </div>
    </div>
    <LoadingModal v-if="isLoading" />
  </div>
</template>
<script>
import { isEmpty } from 'lodash'
import moment from 'moment'
import axios from 'axios'
import axiosCatchHelper from '~/assets/js/axiosCatchHelper'
export default {
  name: 'CompanyExpertPage',
  components: {
    LoadingModal: () => import('~/components/common/LoadingModal'),
  },
  data: () => ({
    isLoading: false,
    companies: [],
  }),
  created() {
    this.fetchCompanies()
  },
  methods: {
    async fetchCompanies() {
      this.isLoading = true
      await axios
        .post('*path*', { _method: 'get' })
        .then((response) => {
          const companies = response.data.companies
          if (isEmpty(companies)) {
            alert('담당 기업이 없습니다.\n홈핏에 문의해주세요.')
            location.href = '/'
          } else if (companies.length === 1) {
            this.moveToPage(companies[0])
          } else {
            this.companies = companies
          }
        })
        .catch((e) => {
          axiosCatchHelper.alertIfHasMessage(e)
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    moveToPage({ csCorporateId }) {
      this.$router.push(`/f/company/expert/schedule/${csCorporateId}/`)
    },
    changeDateForm({ start, end }) {
      const s =
        start === null || start === '0000-00-00 00:00:00'
          ? ''
          : moment(start).format('YY년 M월')
      const e =
        end === null || end === '0000-00-00 00:00:00'
          ? ''
          : moment(end).format('YY년 M월')

      return s === '' && e === '' ? '' : `${s} ~ ${e}`
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
.default-container {
  min-height: calc(var(--vh, 1vh) * 100);
  background-color: #f5f5f5;
}
.company-header {
  width: 100%;
  height: 44px;
  background-color: #ffffff;
  border-bottom: 1px solid #e1e1e1;
  padding: 0 24px;
  @include flexBox(row, space-between, center);
  position: sticky;
  top: 0;
  z-index: 11;
  .header-back {
    display: block;
    width: 24px;
    height: 24px;
    @include defaultIcon(
      'https://dcse8twossp9.cloudfront.net/static/img/v2/icon/arrow-back-black.svg'
    );
    cursor: pointer;
    &.hidden {
      opacity: 0;
      visibility: hidden;
    }
  }
}
.company-item {
  @include flexBox(row, space-between, center);
  height: 48px;
  font-size: 15px;
  line-height: 22px;
  font-weight: $light;
  cursor: pointer;
  padding: 0 24px 0 27px;
  background-color: #ffffff;
  &::after {
    content: '';
    width: 24px;
    height: 24px;
    @include defaultIcon(
      'https://dcse8twossp9.cloudfront.net/static/img/v2/icon/expand-more-right-gray.svg'
    );
  }
  & + .company-item {
    border-top: 1px solid #e1e1e1;
  }
}
</style>
