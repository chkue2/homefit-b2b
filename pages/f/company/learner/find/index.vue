<template>
  <div id="learnerFindPasswordPage" class="background-container">
    <div class="default-container">
      <div class="form-header">
        <i class="form-back" @click="handlerClickBackButton"></i>
      </div>
      <p class="form-title">비밀번호 재발급</p>
      <form class="form-container" @submit="onFindPasswordSubmit">
        <input
          class="form--hidden"
          type="input"
          name="encryptedCsCorporateId"
          :value="encryptedCsCorporateId"
          readonly
        />
        <div class="form-column">
          <input
            v-model="form.email"
            :class="{ error: !formCheck.isEmail }"
            type="email"
            name="email"
            placeholder="회사 이메일 (example@homefit.co.kr)"
            autocomplete="off"
            @keyup="formCheck.isEmail = true"
          />
          <p v-if="!formCheck.isEmail" class="form-error">
            이메일을 다시 확인해주세요.
          </p>
        </div>
        <button
          class="form-button"
          :class="{ on: computedEmailCheck }"
          @click="requestFindPassword"
        >
          이메일로 링크 받기
        </button>
      </form>
    </div>
    <LoadingModal v-if="isLoading" />
  </div>
</template>
<script>
import axios from 'axios'
import qs from 'qs'
import commonMixins from '~/assets/js/commonMixins'
import helpers from '~/assets/js/helpers'
import axiosCatchHelper from '~/assets/js/axiosCatchHelper'
export default {
  name: 'LearnerFindPasswordPage',
  components: {
    LoadingModal: () => import('~/components/common/LoadingModal'),
  },
  mixins: [commonMixins],
  data: () => ({
    isLoading: false,
    encryptedCsCorporateId: '',
    form: {
      email: '',
    },
    formCheck: {
      isEmail: true,
    },
  }),
  computed: {
    computedEmailCheck() {
      return (
        this.checkValidateEmail(this.form.email) && this.form.email.length >= 4
      )
    },
  },
  watch: {
    'agree.isAgreePrivate': {
      deep: true,
      handler() {
        this.agree.isAgreeAll =
          this.agree.isAgreePrivate && this.agree.isAgreeMarketing
      },
    },
    'agree.isAgreeMarketing': {
      deep: true,
      handler() {
        this.agree.isAgreeAll =
          this.agree.isAgreePrivate && this.agree.isAgreeMarketing
      },
    },
  },
  mounted() {
    this.encryptedCsCorporateId =
      helpers.getQueryParameter().encryptedCsCorporateId
  },
  methods: {
    requestFindPassword(e) {
      if (this.computedEmailCheck) {
        this.isLoading = true
        axios
          .post('*path*', qs.stringify(this.form))
          .then(() => {
            alert(
              '비밀번호 재설정 메일이 발송 되었습니다. 메일을 확인 해주세요.'
            )
            this.handlerClickBackButton()
          })
          .catch(axiosCatchHelper.alertIfHasMessage)
          .finally(() => {
            this.isLoading = false
          })
      } else {
        e.preventDefault()
        if (!this.computedEmailCheck) {
          this.formCheck.isEmail = false
        }
      }
    },
    onFindPasswordSubmit(e) {
      try {
        e.preventDefault()
        // throw new Error(`Response Error`);
      } catch (error) {
        console.error(error)
      }
    },
    handlerClickBackButton() {
      location.href = `/f/company/learner/login/?encryptedCsCorporateId=${this.encryptedCsCorporateId}`
    },
  },
}
</script>
<style scoped lang="scss">
@import '~/assets/scss/company/form.scss';
</style>
