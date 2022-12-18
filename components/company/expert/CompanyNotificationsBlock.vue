<template>
  <div class="company-notifications-block">
    <p class="notifications-date">오늘 수업</p>
    <div class="notifications-card">
      <p class="notifications-content">
        2011.11.9(수)에 진행된 미처리 수업을 정산을 위해 확인 해주세요.
      </p>
      <p class="notifications-button button--red">해당일 캘린더로 이동</p>
    </div>
  </div>
</template>
<script>
export default {
  name: 'CompanyExpertNotificationsBlock',
}
</script>
<style scoped lang="scss">
@import '~/assets/scss/company/index.scss';
.company-notifications-block {
  padding: 24px 16px;
  & + .company-notifications-block {
    border-top: 1px solid #e1e1e1;
  }
}
.notifications-date {
  font-weight: $medium;
  margin-bottom: 12px;
}
.notifications-card {
  & + .notifications-card {
    margin-top: 24px;
  }
  .notifications-content {
    font-size: 14px;
    word-break: keep-all;
  }
  .notifications-button {
    width: 100%;
    line-height: 32px;
    text-align: center;
    cursor: pointer;
    background-color: #e1e1e1;
    border-radius: 12px;
    font-size: 14px;
    font-weight: $medium;
    margin-top: 8px;
    &.button--red {
      border: 1px solid #ff0032;
      color: #ff0032;
      background-color: #ffffff;
    }
  }
}
</style>
