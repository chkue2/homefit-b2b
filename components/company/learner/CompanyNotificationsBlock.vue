<template>
  <div class="company-notifications-block">
    <p class="notifications-date">오늘 수업</p>
    <div class="notifications-card">
      <p class="notifications-content">
        16:30 ~ 16:55 근골격계 케어 (채수한) 수업 대기의 예약 확정되었습니다.
      </p>
      <p class="notifications-button">예약 취소</p>
    </div>
  </div>
</template>
<script>
export default {
  name: 'CompanyLearnerNotificationsBlock',
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
  }
}
</style>
