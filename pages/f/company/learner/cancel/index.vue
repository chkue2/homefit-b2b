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
        emoji: 'π€',
        title: 'μμ½μ μ·¨μνμκ² μ΄μ?',
        content:
          'μμ½ λκΈ°μκ° μλ κ²½μ°μλ<br>μ·¨μ ν μ¬μμ½μ΄ λΆκ°ν  μ μμ΅λλ€.',
        left: {
          content: 'λ€, μ·¨μν©λλ€',
          callback: () => {
            this.callbackYes()
          },
        },
        right: {
          content: 'μλμ',
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
          alert('μμ½μ΄ μ·¨μλμμ΅λλ€.')
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
