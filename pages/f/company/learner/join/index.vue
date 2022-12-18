<template>
  <div id="learnerJoinPage" class="background-container">
    <div class="default-container">
      <div class="join-header">
        <i class="join-back" @click="handlerClickBackButton"></i>
      </div>
      <p class="join-title">계정 만들기</p>
      <form
        class="join-form"
        action="/user/register/email/"
        method="post"
        @submit="requestJoin"
      >
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
        <div class="form-column">
          <input
            v-model="form.phone"
            :class="{ error: !formCheck.isPhone }"
            type="tel"
            name="phone"
            placeholder="휴대전화 번호 (숫자만 입력, 예약 알림 목적)"
            autocomplete="off"
            @keyup="formCheck.isPhone = true"
          />
          <p v-if="!formCheck.isPhone" class="form-error">
            휴대전화 번호를 다시 확인해주세요.
          </p>
        </div>
        <div class="form-column">
          <input
            v-model="form.password"
            :class="{ error: !formCheck.isPassword }"
            type="password"
            name="pw1"
            placeholder="새로운 비밀번호 생성 (6자 이상)"
            autocomplete="off"
            @keyup="formCheck.isPassword = true"
          />
          <p v-if="!formCheck.isPassword" class="form-error">
            비밀번호를 다시 확인해주세요.
          </p>
        </div>
        <div class="form-column">
          <input
            v-model="form.passwordConfirm"
            :class="{ error: !formCheck.isPasswordConfirm }"
            type="password"
            name="confirm-password"
            placeholder="새로운 비밀번호 확인"
            autocomplete="off"
            @keyup="formCheck.isPasswordConfirm = true"
          />
          <p v-if="!formCheck.isPasswordConfirm" class="form-error">
            새로운 비밀번호와 다릅니다. 다시 확인해주세요.
          </p>
        </div>
        <label
          class="agree-box box-container"
          :class="{ on: agree.isAgreeAll }"
        >
          <input
            v-model="agree.isAgreeAll"
            type="checkbox"
            name="isAgreeAll"
            @change="handlerClickAgreeAll"
          />
          <i></i>
          <span>모두 동의하기</span>
        </label>
        <p class="agree-box">
          <label>
            <input
              v-model="agree.isAgreePrivate"
              type="checkbox"
              name="isAgreePrivate"
            />
            <i></i>
          </label>
          <span
            >(필수) <u @click="openTermsModal('member')">이용약관</u> 및
            <u @click="openTermsModal('privacy')">개인정보취급방침</u>
            동의하기</span
          >
        </p>
        <p class="agree-box">
          <label>
            <input
              v-model="agree.isAgreeMarketing"
              type="checkbox"
              name="isAgreeMarketing"
            />
            <i></i>
          </label>
          <span
            >(필수)
            <u @click="openTermsModal('advertising')"
              >할인쿠폰 및 각종 혜택 정보 수신</u
            >
            동의하기</span
          >
        </p>
        <button class="form-button" :class="{ on: comptuedSuccess }">
          가입하기
        </button>
      </form>
    </div>
    <Modal
      v-if="isTermsModalShow"
      :modal-id="'memberTerms'"
      @close-modal="isTermsModalShow = false"
    >
      <div slot="body" class="terms-container">
        <CommonTerms v-if="isTerms === 'member'" code="PLATFORM_USAGE" />
        <CommonTerms v-if="isTerms === 'privacy'" code="PRIVACY" />
        <CommonTerms v-if="isTerms === 'advertising'" code="ADVERTISING" />
      </div>
    </Modal>
    <LoadingModal v-if="isLoading" />
  </div>
</template>
<script>
import commonMixins from '~/assets/js/commonMixins'
import helpers from '~/assets/js/helpers'
export default {
  name: 'LearnerJoinPage',
  components: {
    Modal: () => import('~/components/company/common/CommonMiddleModal'),
    LoadingModal: () => import('~/components/common/LoadingModal'),
  },
  mixins: [commonMixins],
  data: () => ({
    isLoading: false,
    isTermsModalShow: false,
    isTerms: '',
    encryptedCsCorporateId: '',
    form: {
      email: '',
      phone: '',
      password: '',
      passwordConfirm: '',
    },
    agree: {
      isAgreeAll: false,
      isAgreePrivate: false,
      isAgreeMarketing: false,
    },
    formCheck: {
      isEmail: true,
      isPhone: true,
      isPassword: true,
      isPasswordConfirm: true,
    },
  }),
  computed: {
    computedEmailCheck() {
      return (
        this.checkValidateEmail(this.form.email) && this.form.email.length >= 4
      )
    },
    computedPhoneCheck() {
      return this.form.phone.length >= 10
    },
    computedPasswordCheck() {
      return this.form.password.length >= 6
    },
    computedPasswordConfirmCheck() {
      return (
        this.form.passwordConfirm.length >= 6 &&
        this.form.password === this.form.passwordConfirm
      )
    },
    comptuedSuccess() {
      return (
        this.computedEmailCheck &&
        this.computedPhoneCheck &&
        this.computedPasswordCheck &&
        this.computedPasswordConfirmCheck &&
        this.agree.isAgreePrivate &&
        this.agree.isAgreeMarketing
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
    requestJoin(e) {
      if (this.comptuedSuccess) {
        this.isLoading = true
        window.$.ajax({
          url: '/user/register/email/',
          type: 'post',
          data: {
            mode: 'preval',
            email: this.form.email,
            phone: this.form.phone,
            pw1: this.form.password,
            encryptedCsCorporateId: this.encryptedCsCorporateId,
          },
          async: false,
          success: (data) => {
            if (data === 'DUP_EMAIL' || data === 'DUP_SNS') {
              e.preventDefault()
              alert('이미 가입된 이메일입니다.')
            } else if (data === 'INACTIVE_ACCOUNT') {
              e.preventDefault()
              alert('휴면 계정입니다. 로그인 후 휴면 해제 해주세요.')
              location.href = '/login/'
            } else if (data === 'INV_PWD') {
              e.preventDefault()
              alert('비밀번호는 6자 이상 입력해주세요.')
            }
          },
          complete: () => {
            this.isLoading = false
          },
        })
      } else {
        e.preventDefault()
        if (!this.computedEmailCheck) {
          this.formCheck.isEmail = false
        }
        if (!this.computedPhoneCheck) {
          this.formCheck.isPhone = false
        }
        if (!this.computedPasswordCheck) {
          this.formCheck.isPassword = false
        }
        if (!this.computedPasswordConfirmCheck) {
          this.formCheck.isPasswordConfirm = false
        }
        if (!this.agree.isAgreeAll) {
          window.UIkit.notification('필수 약관에 동의해주세요.', {
            pos: 'bottom-center',
            status: 'danger',
          })
        }
      }
    },
    handlerClickBackButton() {
      location.href = `/f/company/learner/login/?encryptedCsCorporateId=${this.encryptedCsCorporateId}`
    },
    handlerClickAgreeAll() {
      this.agree.isAgreePrivate = this.agree.isAgreeAll
      this.agree.isAgreeMarketing = this.agree.isAgreeAll
    },
    openTermsModal(type) {
      this.isTerms = type
      this.isTermsModalShow = true
    },
  },
}
</script>
<style scoped lang="scss">
@import '~/assets/scss/_index.scss';
.default-container {
  min-height: calc(var(--vh, 1vh) * 100);
  background-color: #ffffff;
  position: relative;
}
.join-header {
  width: 100%;
  height: 48px;
  padding: 0 16px;
  @include flexBox(row, flex-start, center);
  border-bottom: 1px solid $blk-225;
  .join-back {
    width: 24px;
    height: 24px;
    @include defaultIcon(
      'https://dcse8twossp9.cloudfront.net/static/img/v2/icon/arrow-back-black.svg'
    );
    cursor: pointer;
  }
}
.join-title {
  padding: 24px 16px 12px;
}
.join-form {
  @include flexBox(column);
  padding: 0 16px 24px;
  gap: 8px;
  input {
    width: 100%;
    line-height: 52px;
    border-radius: 8px;
    background-color: $blk-245;
    padding: 0 12px;
    font-size: 14px;
    cursor: auto;
    border: 1px solid $blk-245;
    &.error {
      border-color: #ff0032;
    }
  }
  .form-button {
    width: 100%;
    line-height: 52px;
    border-radius: 8px;
    background-color: $blk-225;
    text-align: center;
    font-size: 14px;
    color: #ffffff;
    font-weight: $medium;
    transition: background-color 0.3s ease;
    will-change: auto;
    cursor: pointer;
    &.on {
      background-color: $office-violet;
    }
  }
  .form--hidden {
    display: none;
  }
}
.agree-box {
  width: 100%;
  height: 52px;
  @include flexBox(row, flex-start, center);
  padding: 0 12px;
  cursor: pointer;
  &.box-container {
    border: 1px solid $blk-225;
    border-radius: 8px;
    &.on {
      border-color: $office-violet;
    }
    input[type='checkbox'] {
      & + i {
        @include defaultIcon(
          'https://dcse8twossp9.cloudfront.net/static/img/v2/icon/check-circle-gray.svg'
        );
      }
      &:checked {
        & + i {
          @include defaultIcon(
            'https://dcse8twossp9.cloudfront.net/static/img/v2/icon/check-circle-violet.svg'
          );
        }
      }
    }
  }
  input[type='checkbox'] {
    display: none;
    & + i {
      display: block;
      width: 22px;
      height: 22px;
      @include defaultIcon(
        'https://dcse8twossp9.cloudfront.net/static/img/v2/icon/check-gray.svg'
      );
    }
    &:checked {
      & + i {
        @include defaultIcon(
          'https://dcse8twossp9.cloudfront.net/static/img/v2/icon/check-violet.svg'
        );
      }
    }
  }
  span {
    font-size: 14px;
    margin-left: 8px;
  }
}
.form-column {
  width: 100%;
  @include flexBox(column);
  gap: 4px;
}
.form-error {
  font-size: 12px;
  color: #ff0032;
}

.terms-container {
  background-color: #ffffff;
  overflow-y: auto;
  border-radius: 8px;
  max-height: calc(var(--vh, 1vh) * 100 - 80px - 44px);
}
</style>
