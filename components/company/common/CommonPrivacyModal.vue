<template>
  <CommonMiddleModal @close-modal="closeModal">
    <div slot="body" class="privacy-modal">
      <CommonTerms code="PRIVACY" />
    </div>
  </CommonMiddleModal>
</template>
<script>
export default {
  name: 'CTypeIntroModal',
  components: {
    CommonMiddleModal: () =>
      import('~/components/company/common/CommonMiddleModal'),
    CommonTerms: () => import('~/components/common/CommonTerms'),
  },
  methods: {
    closeModal() {
      this.$emit('toggle-privacy-modal', false)
    },
  },
}
</script>
<style scoped lang="scss">
@import '~/assets/scss/_index.scss';
.privacy-modal {
  background-color: #ffffff;
  height: 100%;
  max-height: calc(var(--vh, 1vh) * 100 - 140px);
  overflow-y: auto;
  padding: 24px 0;
  border-radius: 8px;
}
</style>
