<template>
  <div id="companyMyPage" class="background-container">
    <div class="default-container">
      <CompanyHeader
        user-type="learner"
        now-page="my"
        @toggle-company-reservation-list="toggleCompanyReservationList"
      />
      <div class="my-welcome">
        <p class="welcome-intro">
          반가워요, {{ computedGetNicknameByEmail }}님😃
        </p>
        <p class="welcome-email">{{ myPage.loggedInUser.email }}</p>
      </div>
      <div v-if="computedBarCaption !== ''" class="my-quantity">
        <p class="quantity-title">
          {{ computedBarCaption }}
        </p>
        <p class="quantity-bar">
          <i
            :class="{ active: isActive }"
            :style="{ transform: computedBarContents.percent }"
          ></i>
        </p>
        <p class="quantity-caption">가까울수록 우리 회사 상위권↗</p>
        <div class="quantity-block">
          <div class="block-item item--color">
            <div class="item-contents">
              <p class="contents-top">{{ myPage.lessonTime }}</p>
              <p class="contents-bottom">총 운동</p>
            </div>
          </div>
          <div
            v-for="lesson in myPage.myLessons"
            :key="lesson.programType"
            class="block-item item--gray"
          >
            <div class="item-contents">
              <p class="contents-top">{{ lesson.lessonCount }}회</p>
              <p></p>
              <p class="contents-bottom">{{ lesson.programTypeCaption }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="my-menus">
        <div class="my-menu" @click="handlerClickOpenPrivateLesson">
          <p class="menu-title">개인 수업</p>
        </div>
        <div class="my-menu" @click="togglePasswordChangeModal(true)">
          <p class="menu-title">비밀번호 변경</p>
        </div>
        <div class="my-menu" @click="togglePrivacyModal(true)">
          <p class="menu-title">개인정보 이용방침</p>
        </div>
        <div class="my-menu" @click="handlerClickLogout">
          <p class="menu-title title--gray">로그아웃</p>
        </div>
      </div>
    </div>
    <CompanyPasswordChangeModal
      v-if="isPasswordChangeModal"
      @toggle-password-change-modal="togglePasswordChangeModal"
      @toggle-loading="setLoading"
    />
    <CommonPrivacyModal
      v-if="isPrivacyModal"
      @toggle-privacy-modal="togglePrivacyModal"
    />
    <CompanyReservationListModal
      v-if="isCompanyReservationListModal"
      @toggle-company-reservation-list="toggleCompanyReservationList"
      @set-loading="setLoading"
    />
    <LoadingModal v-if="isLoading" />
    <CommonEmojiEither
      v-if="isEmojiEither"
      :config="emojiEitherConfig"
      @close-alert="toggleEmojiEither(false)"
    />
  </div>
</template>
<script>
import { cloneDeep, isEmpty } from 'lodash'
import { mapState, mapActions } from 'vuex'
import axios from 'axios'
import axiosCatchHelper from '~/assets/js/axiosCatchHelper'
export default {
  name: 'CompanyMyPage',
  components: {
    LoadingModal: () => import('~/components/common/LoadingModal'),
    CommonEmojiEither: () => import('~/components/common/CommonEmojiEither'),
    CompanyHeader: () => import('~/components/company/common/CompanyHeader'),
    CompanyPasswordChangeModal: () =>
      import('~/components/company/learner/CompanyPasswordChangeModal'),
    CommonPrivacyModal: () =>
      import('~/components/company/common/CommonPrivacyModal'),
    CompanyReservationListModal: () =>
      import('~/components/company/learner/CompanyReservationListModal'),
  },
  data: () => ({
    isActive: false,
    isPasswordChangeModal: false,
    isPrivacyModal: false,
    isCompanyReservationListModal: false,
    myPage: {
      loggedInUser: {
        email: '',
      },
      maxCoworkerLessonCount: 0,
      myLessonCount: 0,
      lessonTime: '0:00',
      myLessons: [],
    },
  }),
  computed: {
    ...mapState('company', ['isLoading', 'isEmojiEither', 'emojiEitherConfig']),
    computedGetNicknameByEmail() {
      if (isEmpty(this.myPage.loggedInUser)) {
        return ''
      } else {
        return this.myPage.loggedInUser.email.split('@')[0]
      }
    },
    computedBarContents() {
      return {
        percent: `translateX(${
          isEmpty(this.myPage)
            ? '-100%'
            : this.myPage.myLessonCount / this.myPage.maxCoworkerLessonCount ===
              1
            ? 0
            : `${
                (this.myPage.myLessonCount /
                  this.myPage.maxCoworkerLessonCount) *
                  100 -
                100
              }%`
        })`,
      }
    },
    computedBarCaption() {
      const percent = isEmpty(this.myPage)
        ? 0
        : this.myPage.myLessonCount === 0
        ? 0
        : (this.myPage.myLessonCount / this.myPage.maxCoworkerLessonCount) * 100
      return percent === 0
        ? ''
        : percent >= 1 && percent <= 10
        ? `${this.computedGetNicknameByEmail}님, 이제부터 홈핏으로 몸과 마음의 건강을 챙겨봐요🥺`
        : percent >= 11 && percent <= 30
        ? `${this.computedGetNicknameByEmail}님, 좀 더 노력하면 몸의 변화가 느껴질거에요🤗`
        : percent >= 31 && percent <= 70
        ? `${this.computedGetNicknameByEmail}님의 몸과 마음이 점점 더 건강해지고 있어요💪🏻`
        : percent >= 71 && percent <= 90
        ? `일도 건강도 확실히 챙기는 ${this.computedGetNicknameByEmail}님을 응원해요👍`
        : `사내 건강 관리 1등 ${this.computedGetNicknameByEmail}님, 앞으로도 꾸준히 해봐요🤩`
    },
  },
  mounted() {
    this.fetchMyPage()
    this.$nextTick(() => {
      this.isActive = true
    })
  },
  methods: {
    ...mapActions('company', ['setLoading', 'toggleEmojiEither']),
    fetchMyPage() {
      this.setLoading(true)
      axios
        .post('*path*', {
          _method: 'get',
        })
        .then((response) => {
          this.myPage = cloneDeep(response.data.myPage)
        })
        .catch((e) => {
          location.href = '/'
          axiosCatchHelper.alertIfHasMessage(e)
        })
        .finally(() => {
          this.setLoading(false)
        })
    },
    togglePasswordChangeModal(payload) {
      this.isPasswordChangeModal = payload
    },
    togglePrivacyModal(payload) {
      this.isPrivacyModal = payload
    },
    toggleCompanyReservationList(payload) {
      this.isCompanyReservationListModal = payload
    },
    handlerClickOpenPrivateLesson() {
      window.open('/f/user/mypage/')
    },
    handlerClickLogout() {
      location.href = '/user/logout/'
    },
  },
}
</script>
<style scoped lang="scss">
@import '~/assets/scss/company/index.scss';
.default-container {
  min-height: calc(var(--vh, 1vh) * 100);
  background-color: #f5f5f5;
}
.my-welcome {
  padding: 24px 16px;
  border-bottom: 1px solid #e1e1e1;
  background-color: #ffffff;
  .welcome-intro {
    font-weight: $medium;
    line-height: 18px;
    margin-bottom: 8px;
  }
  .welcome-email {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    height: 28px;
    gap: 4px;
    padding: 0 6px;
    background-color: #f5f5f5;
    border-radius: 8px;
    font-size: 12px;
    &::before {
      content: '';
      width: 16px;
      height: 16px;
      @include defaultIcon(
        'https://dcse8twossp9.cloudfront.net/static/img/v2/icon/badge-violet.svg'
      );
    }
  }
}
.my-quantity {
  padding: 24px 16px;
  background-color: #ffffff;
  border-bottom: 1px solid #e1e1e1;
  .quantity-title {
    font-weight: $medium;
    margin-bottom: 12px;
  }
  .quantity-bar {
    width: 100%;
    height: 12px;
    border-radius: 6px;
    overflow: hidden;
    background-color: #e1e1e1;
    position: relative;
    i {
      width: 100%;
      height: 12px;
      transform: translateX(-100%);
      background-image: linear-gradient(to right, #03dcc8 0%, #6400f0);
      border-radius: 6px;
      position: absolute;
      left: 0;
      top: 0;
      transition: transform 1s ease-out;
      will-change: auto;
      &.active {
        transform: translateX(0);
      }
    }
  }
  .quantity-caption {
    margin: 4px 0 12px;
    font-size: 10px;
    text-align: right;
    color: #7d7d7d;
  }
  .quantity-block {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-gap: 8px;
    .block-item {
      padding-bottom: 100%;
      position: relative;
      border-radius: 12px;
      &.item--color {
        background-color: #ffffff;
        .item-contents {
          border-image: linear-gradient(to right, #03dcc8 0%, #6400f0) 0 0;
          background-image: linear-gradient(to bottom, #fff, #fff),
            linear-gradient(to right, #03dcc8 0%, #6400f0);
          background-origin: border-box;
          background-clip: content-box, border-box;
          border-width: 1px;
          border-style: solid;
          border-radius: 12px;
        }
      }
      &.item--gray {
        background-color: #f5f5f5;
      }
      .item-contents {
        @include flexBox(column, center, center);
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        gap: 4px;
        .contents-top {
          font-weight: $bold;
        }
        .contents-bottom {
          font-size: 12px;
          color: #7d7d7d;
        }
      }
    }
  }
}
.my-menus {
  @include flexBox(column);
  .my-menu {
    @include flexBox(row, space-between, center);
    width: 100%;
    height: 60px;
    padding: 0 24px;
    background-color: #ffffff;
    cursor: pointer;
    &::after {
      content: '';
      width: 24px;
      height: 24px;
      @include defaultIcon(
        'https://dcse8twossp9.cloudfront.net/static/img/v2/icon/expand-more-right-gray.svg'
      );
    }
    & + .my-menu {
      border-top: 1px solid #e1e1e1;
    }
  }
  .menu-title {
    font-size: 15px;
    &.title--gray {
      font-size: 15px;
      color: #7d7d7d;
    }
  }
}
</style>
