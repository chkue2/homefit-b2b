<template>
  <Modal
    modal-id="companyPasswordChangeModal"
    :header-show="false"
    @click-backdrop="closeModal"
  >
    <div slot="body" class="modal-header">
      <i class="modal-back" @click="closeModal"></i>
    </div>
    <p slot="body" class="modal-title">비밀번호 변경</p>
    <form slot="body" class="modal-form">
      <input
        id="nowPassword"
        v-model="form.nowPassword"
        type="password"
        placeholder="현재 비밀번호"
        autocomplete="off"
      />
      <input
        id="changePassword"
        v-model="form.changePassword"
        type="password"
        placeholder="변경할 비밀번호"
        autocomplete="off"
      />
      <input
        id="changePasswordConfirm"
        v-model="form.changePasswordConfirm"
        type="password"
        placeholder="변경할 비밀번호 확인"
        autocomplete="off"
      />
      <p
        class="form-button"
        :class="{ on: comptuedSuccess }"
        @click="requestChangePassword"
      >
        비밀번호 변경하기
      </p>
    </form>
  </Modal>
</template>
<script>
import axios from 'axios'
import axiosCatchHelper from '~/assets/js/axiosCatchHelper'
import customTooltip from '~/assets/js/customTooltip'
export default {
  name: 'CompanyPasswordChangeModal',
  components: {
    Modal: () => import('~/components/common/CommonModalFullScreen'),
  },
  data: () => ({
    form: {
      nowPassword: '',
      changePassword: '',
      changePasswordConfirm: '',
    },
  }),
  computed: {
    comptuedSuccess() {
      return (
        this.form.nowPassword.length >= 6 &&
        this.form.changePassword.length >= 6 &&
        this.form.changePasswordConfirm.length >= 6 &&
        this.form.changePassword === this.form.changePasswordConfirm
      )
    },
  },
  methods: {
    requestChangePassword() {
      if (!this.comptuedSuccess) {
        if (this.form.nowPassword.length < 6) {
          customTooltip.setTooltipShow(
            'nowPassword',
            '현재 비밀번호를 다시 입력해주세요.'
          )
        } else if (this.form.changePassword.length < 6) {
          customTooltip.setTooltipShow(
            'changePassword',
            '변경할 비밀번호를 다시 입력해주세요.'
          )
        } else if (this.form.changePasswordConfirm.length < 6) {
          customTooltip.setTooltipShow(
            'changePasswordConfirm',
            '비밀번호 확인을 다시 입력해주세요.'
          )
        } else if (
          this.form.changePassword !== this.form.changePasswordConfirm
        ) {
          customTooltip.setTooltipShow(
            'changePasswordConfirm',
            '비밀번호가 다릅니다. 다시 입력해주세요.'
          )
        }

        return
      }

      this.$emit('toggle-loading', true)
      axios
        .post('*path*', {
          _method: 'put',
          newPassword: this.form.changePassword,
          nowPassword: this.form.nowPassword,
        })
        .then((response) => {
          if (response.data.result === false) {
            alert(response.data.message)
          } else {
            alert('비밀번호가 변경되었습니다.')
            this.$emit('toggle-loading', false)
            this.resetForm()
            this.closeModal()
          }
        })
        .catch((e) => {
          axiosCatchHelper.alertIfHasMessage(e)
        })
        .finally(() => {
          this.$emit('toggle-loading', false)
        })
    },
    resetForm() {
      this.form.nowPassword = ''
      this.form.changePassword = ''
      this.form.changePasswordConfirm = ''
    },
    closeModal() {
      this.$emit('toggle-password-change-modal', false)
    },
  },
}
</script>
<style scoped lang="scss">
@import '~/assets/scss/_index.scss';
.modal-header {
  width: 100%;
  height: 48px;
  padding: 0 16px;
  @include flexBox(row, flex-start, center);
  border-bottom: 1px solid #e1e1e1;
  .modal-back {
    width: 24px;
    height: 24px;
    @include defaultIcon(
      'https://dcse8twossp9.cloudfront.net/static/img/v2/icon/arrow-back-black.svg'
    );
    cursor: pointer;
  }
}
.modal-title {
  padding: 24px 16px 12px;
}
.modal-form {
  @include flexBox(column);
  padding: 0 16px 24px;
  gap: 8px;
  input {
    width: 100%;
    line-height: 52px;
    border-radius: 8px;
    background-color: #f5f5f5;
    padding: 0 12px;
    font-size: 14px;
    cursor: auto;
  }
  .form-button {
    width: 100%;
    line-height: 52px;
    border-radius: 8px;
    background-color: #e1e1e1;
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
}
</style>
