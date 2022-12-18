<template>
  <CommonMiddleModal @close-modal="closeModal">
    <div slot="body" class="c-type-intro-modal">
      <p class="intro-emoji">🧘‍♀️</p>
      <p class="intro-title">{{ computedProgram.title }}</p>
      <p class="intro-content">
        {{ computedProgram.content }}
      </p>
      <p class="intro-card"><b>구성:</b> {{ computedProgram.consist }}</p>
      <p class="intro-card"><b>전문가:</b> {{ computedProgram.expert }}</p>
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
          title: '근골격계 케어 프로그램',
          content:
            '업무를 하는 동안 피로도가 높아진 부위는 스트레칭, 이완해주고 잘못된 ' +
            '자세를 바로잡아주는 맞춤 케어를 진행합니다.\n\n' +
            '* 전문적인 재활의학 치료가 아닌 통증완화 및 기능회복 목적의 프로그램으로, ' +
            '만약 치료가 필요한 경우 병원 진료를 권장드립니다.',
          consist: '통증케어, 스트레칭, 근막이완',
          expert:
            '병원 근무 이력이 있고 운동 관련 자격증을 함께 보유한 물리치료사, 스포츠의학 전공자, 도수치료 전문가 등',
        },
        {
          type: 2,
          title: '단체 레슨',
          content: '단체 레슨 문구가 필요합니다.\n',
          consist: '단체 레슨 문구가 필요합니다.',
          expert: '단체 레슨 문구가 필요합니다.',
        },
        {
          type: 3,
          title: '힐링 테라피 프로그램',
          content:
            '긴장되어 있는 몸과 마음을 사운드(싱잉볼), 향(아로마) 등을 활용하여 ' +
            '편안하게 풀어주고 마음 챙김을 위한 힐링의 시간을 갖습니다.',
          consist: '사운드, 아로마향 테라피, 릴렉스 마사지',
          expert: '테라피 자격증, 명상 관련 자격증 보유 전문가 등',
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
