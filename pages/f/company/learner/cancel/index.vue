<template>
  <div id="companyLearnerCancel">
    <CommonEmojiEither v-if="isEmojiEither" :config="emojiEitherConfig" />
    <LoadingModal v-if="isLoading" />
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import axios from 'axios'
import helpers from '~/assets/js/helpers'
import axiosCatchHelper from '~/assets/js/axiosCatchHelper'
export default {
  name: 'CompanyLearnerCancel',
  components: {
    LoadingModal: () => import('~/components/common/LoadingModal'),
    CommonEmojiEither: () => import('~/components/common/CommonEmojiEither'),
  },
  data: () => ({
    isLoading: true,
    encryptedB2bTimetableReservationId: '',
  }),
  computed: {
    ...mapState('company', ['emojiEitherConfig', 'isEmojiEither']),
  },
  mounted() {
    this.encryptedB2bTimetableReservationId =
      helpers.getQueryParameter().encryptedB2bTimetableReservationId
    this.$nextTick(() => {
      this.setEmojiEitherConfig({
        emoji: '🤔',
        title: '예약을 취소하시겠어요?',
        content:
          '예약 대기자가 있는 경우에는<br>취소 후 재예약이 불가할 수 있습니다.',
        left: {
          content: '네, 취소합니다',
          callback: () => {
            this.callbackYes()
          },
        },
        right: {
          content: '아니요',
          callback: () => {
            this.redirectTo()
          },
        },
      })
      this.isLoading = false
      this.toggleEmojiEither(true)
    })
  },
  methods: {
    ...mapActions('company', ['setEmojiEitherConfig', 'toggleEmojiEither']),
    callbackYes() {
      this.isLoading = true
      axios
        .post('*path*', {
          _method: 'put',
          encryptedB2bTimetableReservationId:
            this.encryptedB2bTimetableReservationId,
        })
        .then(() => {
          alert('예약이 취소되었습니다.')
          this.redirectTo()
        })
        .catch((e) => {
          axiosCatchHelper.alertIfHasMessage(e)
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    redirectTo() {
      if (window.homefit.user.csCoperationId > 0) {
        location.replace('/f/company/learner/schedule/')
      } else {
        location.replace('/f/')
      }
    },
  },
}
</script>
<style scoped lang="scss">
@import '~/assets/scss/_index.scss';
</style>
