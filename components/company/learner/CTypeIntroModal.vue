<template>
  <CommonMiddleModal @close-modal="closeModal">
    <div slot="body" class="c-type-intro-modal">
      <p class="intro-emoji">๐งโโ๏ธ</p>
      <p class="intro-title">{{ computedProgram.title }}</p>
      <p class="intro-content">
        {{ computedProgram.content }}
      </p>
      <p class="intro-card"><b>๊ตฌ์ฑ:</b> {{ computedProgram.consist }}</p>
      <p class="intro-card"><b>์ ๋ฌธ๊ฐ:</b> {{ computedProgram.expert }}</p>
    </div>
  </CommonMiddleModal>
</template>
<script>
export default {
  name: 'CTypeIntroModal',
  components: {
    CommonMiddleModal: () =>
      import('~/components/company/common/CommonMiddleModal'),
  },
  props: {
    programType: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      programs: [
        {
          type: 1,
          title: '๊ทผ๊ณจ๊ฒฉ๊ณ ์ผ์ด ํ๋ก๊ทธ๋จ',
          content:
            '์๋ฌด๋ฅผ ํ๋ ๋์ ํผ๋ก๋๊ฐ ๋์์ง ๋ถ์๋ ์คํธ๋ ์นญ, ์ด์ํด์ฃผ๊ณ  ์๋ชป๋ ' +
            '์์ธ๋ฅผ ๋ฐ๋ก์ก์์ฃผ๋ ๋ง์ถค ์ผ์ด๋ฅผ ์งํํฉ๋๋ค.\n\n' +
            '* ์ ๋ฌธ์ ์ธ ์ฌํ์ํ ์น๋ฃ๊ฐ ์๋ ํต์ฆ์ํ ๋ฐ ๊ธฐ๋ฅํ๋ณต ๋ชฉ์ ์ ํ๋ก๊ทธ๋จ์ผ๋ก, ' +
            '๋ง์ฝ ์น๋ฃ๊ฐ ํ์ํ ๊ฒฝ์ฐ ๋ณ์ ์ง๋ฃ๋ฅผ ๊ถ์ฅ๋๋ฆฝ๋๋ค.',
          consist: 'ํต์ฆ์ผ์ด, ์คํธ๋ ์นญ, ๊ทผ๋ง์ด์',
          expert:
            '๋ณ์ ๊ทผ๋ฌด ์ด๋ ฅ์ด ์๊ณ  ์ด๋ ๊ด๋ จ ์๊ฒฉ์ฆ์ ํจ๊ป ๋ณด์ ํ ๋ฌผ๋ฆฌ์น๋ฃ์ฌ, ์คํฌ์ธ ์ํ ์ ๊ณต์, ๋์์น๋ฃ ์ ๋ฌธ๊ฐ ๋ฑ',
        },
        {
          type: 2,
          title: '๋จ์ฒด ๋ ์จ',
          content: '๋จ์ฒด ๋ ์จ ๋ฌธ๊ตฌ๊ฐ ํ์ํฉ๋๋ค.\n',
          consist: '๋จ์ฒด ๋ ์จ ๋ฌธ๊ตฌ๊ฐ ํ์ํฉ๋๋ค.',
          expert: '๋จ์ฒด ๋ ์จ ๋ฌธ๊ตฌ๊ฐ ํ์ํฉ๋๋ค.',
        },
        {
          type: 3,
          title: 'ํ๋ง ํ๋ผํผ ํ๋ก๊ทธ๋จ',
          content:
            '๊ธด์ฅ๋์ด ์๋ ๋ชธ๊ณผ ๋ง์์ ์ฌ์ด๋(์ฑ์๋ณผ), ํฅ(์๋ก๋ง) ๋ฑ์ ํ์ฉํ์ฌ ' +
            'ํธ์ํ๊ฒ ํ์ด์ฃผ๊ณ  ๋ง์ ์ฑ๊น์ ์ํ ํ๋ง์ ์๊ฐ์ ๊ฐ์ต๋๋ค.',
          consist: '์ฌ์ด๋, ์๋ก๋งํฅ ํ๋ผํผ, ๋ฆด๋ ์ค ๋ง์ฌ์ง',
          expert: 'ํ๋ผํผ ์๊ฒฉ์ฆ, ๋ช์ ๊ด๋ จ ์๊ฒฉ์ฆ ๋ณด์  ์ ๋ฌธ๊ฐ ๋ฑ',
        },
      ],
    }
  },
  computed: {
    computedProgram() {
      console.log(this.programType)
      return this.programs.find((p) => p.type === this.programType)
    },
  },
  methods: {
    closeModal() {
      this.$emit('toggle-c-type-intro-modal', false)
    },
  },
}
</script>
<style scoped lang="scss">
@import '~/assets/scss/_index.scss';
.c-type-intro-modal {
  background-color: #ffffff;
  padding: 23px 12px 12px;
  border-radius: 8px;
  p.intro-content {
    white-space: pre-line;
  }
}
.intro-emoji {
  font-size: 32px;
  line-height: 24px;
}
.intro-title {
  margin: 18px 0 8px;
  font-size: 18px;
  font-weight: $bold;
  line-height: 24px;
}
.intro-content {
  font-size: 14px;
  line-height: 24px;
  margin-bottom: 24px;
  word-break: keep-all;
}
.intro-card {
  padding: 12px;
  border-radius: 8px;
  background-color: #f5f5f5;
  font-size: 14px;
  font-weight: $light;
  word-break: keep-all;
  b {
    font-weight: $regular;
  }
  & + .intro-card {
    margin-top: 8px;
  }
}
</style>
