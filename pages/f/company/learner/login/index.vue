<template>
  <div id="companyLoginPage" class="background-container">
    <div class="default-container">
      <p class="login-intro">
        우리 회사로 찾아온<br /><b>홈핏 예약</b>하고,<br />전문가의 케어 받기
      </p>
      <img class="login-logo" :src="company.iconUrl" alt />
      <form
        class="login-form"
        method="POST"
        action="/user/login/email/"
        @submit="requestLogin"
      >
        <input
          id="email"
          v-model="form.email"
          type="email"
          name="email"
          placeholder="회사 이메일 (example@homefit.co.kr)"
        />
        <input
          id="password"
          v-model="form.pw"
          type="password"
          name="password"
          placeholder="비밀번호"
          autocomplete="off"
        />
        <button class="login-button" :class="{ on: computedLoginOn }">
          로그인
        </button>
      </form>
      <p class="login-text">또는</p>
      <p class="login-button gray" @click="moveToJoinPage">
        계정 생성이 필요해요
      </p>
      <p class="login-button gray" @click="moveToFindPasswordPage">
        비밀번호를 잊었어요
      </p>
    </div>
    <LoadingModal v-if="isLoading" />
  </div>
</template>
<script>
import { cloneDeep } from 'lodash'
import axios from 'axios'
import qs from 'qs'
import commonMixins from '~/assets/js/commonMixins'
import helpers from '~/assets/js/helpers'
import axiosCatchHelper from '~/assets/js/axiosCatchHelper'
import customTooltip from '~/assets/js/customTooltip'
export default {
  name: 'CompanyLoginPage',
  components: {
    LoadingModal: () => import('~/components/common/LoadingModal'),
  },
  mixins: [commonMixins],
  data: () => ({
    isLoading: false,
    encryptedCsCorporateId: '',
    form: {
      email: '',
      pw: '',
    },
    company: {
      name: '',
      iconUrl: '',
    },
  }),
  computed: {
    computedLoginOn() {
      return (
        this.checkValidateEmail(this.form.email) && this.form.pw.length >= 6
      )
    },
  },
  mounted() {
    this.encryptedCsCorporateId =
      helpers.getQueryParameter().encryptedCsCorporateId

    this.$nextTick(() => {
      if (window.homefit.user.csCorporateId !== 0) {
        this.$router.replace('/f/company/learner/my/')
      } else if (
        window.homefit.user.encryptedId !== '' &&
        window.homefit.user.csCorporateId === 0
      ) {
        location.href = '/'
      } else {
        this.fetchCompanyInfo()
      }
    })
  },
  methods: {
    fetchCompanyInfo() {
      this.isLoading = true
      axios
        .post('*path*', {
          _method: 'get',
          encryptedCsCorporateId: this.encryptedCsCorporateId,
        })
        .then((response) => {
          this.company = cloneDeep(response.data.company)
        })
        .catch((e) => {
          axiosCatchHelper.alertIfHasMessage(e)
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    requestLogin(e) {
      if (this.computedLoginOn) {
        e.preventDefault()
        axios
          .post(
            '*path*',
            qs.stringify({
              email: this.form.email,
              password: this.form.pw,
            })
          )
          .then((response) => {
            if (response.data.redirectTo) {
              window.location.replace(response.data.redirectTo)
            }
          })
          .catch((error) => {
            axiosCatchHelper.alertIfHasMessage(error)
          })
      } else {
        e.preventDefault()
        if (this.form.email.length === 0)
          customTooltip.setTooltipShow('email', '이메일을 입력해주세요.')
        else if (this.form.email.length <= 4)
          customTooltip.setTooltipShow('email', '이메일을 다시 입력해주세요.')
        else if (this.form.pw.length === 0)
          customTooltip.setTooltipShow('password', '비밀번호를 입력해주세요.')
        else if (this.form.pw.length < 6)
          customTooltip.setTooltipShow(
            'password',
            '비밀번호를 다시 입력해주세요.'
          )
      }
    },
    moveToJoinPage() {
      this.$router.push(
        `/f/company/learner/join/?encryptedCsCorporateId=${this.encryptedCsCorporateId}`
      )
    },
    moveToFindPasswordPage() {
      this.$router.push(
        `/f/company/learner/find/?encryptedCsCorporateId=${this.encryptedCsCorporateId}`
      )
    },
  },
}
</script>
<style scoped lang="scss">
@import '~/assets/scss/_index.scss';
.default-container {
  padding: 0 16px;
  min-height: calc(var(--vh, 1vh) * 100);
}
.login-intro {
  padding-top: 48px;
  font-size: 24px;
  font-weight: $light;
  b {
    font-weight: $medium;
  }
}
.login-logo {
  width: auto;
  height: 24px;
  margin: 12px 0 36px;
}
.login-form {
  @include flexBox(column, flex-start, flex-end);
  gap: 8px;
  margin-bottom: 12px;
  input {
    width: 100%;
    line-height: 52px;
    border-radius: 8px;
    background-color: $blk-245;
    padding: 0 12px;
    font-size: 14px;
  }
}
.login-info {
  font-size: 14px;
  font-weight: $medium;
  color: $blk-125;
  cursor: pointer;
  & + .login-info {
    margin-top: 8px;
  }
}
.login-button {
  width: 100%;
  line-height: 52px;
  cursor: pointer;
  background-color: $blk-225;
  border-radius: 8px;
  font-size: 14px;
  font-weight: $medium;
  color: #ffffff;
  text-align: center;
  transition: all 0.3s ease;
  &.on {
    background-color: $office-violet;
  }
  &.gray {
    border: 1px solid $blk-225;
    background-color: #ffffff;
    color: #000000;
  }
  & + .login-button {
    margin-top: 8px;
  }
}
.login-text {
  margin: 24px 0;
  font-size: 12px;
  color: $blk-125;
  text-align: center;
}
</style>
