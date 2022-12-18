<template>
  <div class="navigator">
    <div class="default-container">
      <div
        v-for="(item, index) in items"
        :key="index"
        class="item"
        :class="[
          { on: item.class === nowPage },
          { que_btn: item.class === 'talk' },
        ]"
        @click="movePage(item.url)"
      >
        <i :class="item.class"></i>
        <span>{{ item.text }}</span>
      </div>
    </div>
  </div>
</template>
<script>
import { isEmpty } from 'lodash'
export default {
  name: 'CommonNavigator',
  props: {
    nowPage: { type: String, default: '' },
  },
  data: () => ({
    items: [
      {
        class: 'home',
        text: '홈',
        url: '/f/',
      },
      {
        class: 'find',
        text: '찾기',
        url: '/f/find/',
      },
      {
        class: 'talk',
        text: '문의',
        url: '',
      },
      {
        class: 'my',
        text: '마이',
        url: '/f/user/mypage/',
      },
      {
        class: 'hamburge',
        text: '전체',
        url: '/f/menu/',
      },
    ],
  }),
  methods: {
    movePage(url) {
      if (!isEmpty(url)) {
        location.href = url
      }
    },
  },
}
</script>
<style scoped lang="scss">
@import '~/assets/scss/_index.scss';
.navigator {
  height: 52px;
  position: sticky;
  bottom: 0;
  background-color: #ffffff;
  border-top: 1px solid #e1e1e1;
  z-index: 11;
  .default-container {
    @include flexBox(row, space-between, center);
    height: 100%;
    padding: 0 24px;
  }
  .item {
    @include flexBox(column, center, center);
    width: calc(100% / 5);
    cursor: pointer;
    i {
      display: block;
      width: 24px;
      height: 24px;
      &.home {
        @include defaultIcon(
          'https://dcse8twossp9.cloudfront.net/static/img/v2/icon/home-gray.svg'
        );
      }

      &.find {
        @include defaultIcon(
          'https://dcse8twossp9.cloudfront.net/static/img/v2/icon/meet-gray.svg'
        );
      }

      &.talk {
        @include defaultIcon(
          'https://dcse8twossp9.cloudfront.net/static/img/v2/icon/talk-gray.svg'
        );
      }
      &.my {
        @include defaultIcon(
          'https://dcse8twossp9.cloudfront.net/static/img/v2/icon/my-gray.svg'
        );
      }
      &.hamburge {
        @include defaultIcon(
          'https://dcse8twossp9.cloudfront.net/static/img/v2/icon/menu-gray.svg'
        );
      }
    }
    span {
      font-size: 11px;
      text-align: center;
      line-height: 18px;
      color: #b9b9b9;
    }
    &.on {
      i {
        &.home {
          @include defaultIcon(
            'https://dcse8twossp9.cloudfront.net/static/img/v2/icon/home-black.svg'
          );
        }

        &.find {
          @include defaultIcon(
            'https://dcse8twossp9.cloudfront.net/static/img/v2/icon/meet-black.svg'
          );
        }

        &.talk {
          @include defaultIcon(
            'https://dcse8twossp9.cloudfront.net/static/img/v2/icon/talk-black.svg'
          );
        }
        &.my {
          @include defaultIcon(
            'https://dcse8twossp9.cloudfront.net/static/img/v2/icon/my-black.svg'
          );
        }
        &.hamburge {
          @include defaultIcon(
            'https://dcse8twossp9.cloudfront.net/static/img/v2/icon/menu-black.svg'
          );
        }
      }
      span {
        color: #000000;
      }
    }
  }
}
@media all and (max-width: 648px) {
  .navigator {
    .item {
      width: auto;
    }
  }
}
</style>
