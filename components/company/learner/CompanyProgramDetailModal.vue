<template>
  <Modal @close-modal="closeModal">
    <div id="companyProgramDetailModal" slot="body">
      <CoachImageSwiper
        id="imageSwiper"
        :images="coach.imageUrls"
        container-class="workout"
      />
      <div class="coach__container workout">
        <div class="coach__left">
          <div class="program__section">
            <div class="program__subsection">
              <p class="program__subtitle">코치 소개</p>
              <p class="program__subcontent" v-html="computedIntro"></p>
            </div>
            <div v-if="computedGenrder !== ''" class="program__subsection">
              <p class="program__subtitle">
                <i class="gender" />성별 및 본인 인증
              </p>
              <div class="program__subcontent pl24">
                <p class="subcontent__info">
                  홈핏에서 신분증 조회를 완료하였습니다. (성별 정보는 동일 성별
                  매칭을 위해 제공합니다.)
                </p>
                <ul>
                  <li>{{ computedGenrder }}</li>
                </ul>
              </div>
            </div>
            <div class="program__subsection">
              <p class="program__subtitle">
                <i class="career" />경력사항 및 활동내역
              </p>
              <div class="program__subcontent pl24">
                <p class="subcontent__info">
                  홈핏에서 아래 경력을 모두 확인하였습니다.
                </p>
                <ul>
                  <li v-for="(career, index) in coach.careers" :key="index">
                    {{ career }}
                  </li>
                </ul>
              </div>
            </div>
            <div class="program__subsection">
              <p class="program__subtitle"><i class="license" />보유 자격증</p>
              <div class="program__subcontent pl24">
                <p class="subcontent__info">
                  홈핏에서 아래 자격증을 모두 확인하였습니다.
                </p>
                <ul>
                  <li v-for="(license, index) in coach.licenses" :key="index">
                    {{ license }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Modal>
</template>
<script>
import { isEmpty } from 'lodash'
export default {
  name: 'CompanyProgramDetailModal',
  components: {
    Modal: () => import('~/components/company/common/CommonMiddleModal'),
    CoachImageSwiper: () => import('~/components/program/CoachImageSwiper'),
  },
  props: {
    coach: { type: Object, default: () => {} },
    program: { type: Object, default: () => {} },
  },
  computed: {
    computedGenrder() {
      return isEmpty(this.coach.gender)
        ? ''
        : `${this.coach.gender === 'F' ? '여성' : '남성'}(신분증)`
    },
    computedIntro() {
      return isEmpty(this.program)
        ? ''
        : this.program.introduce.replace(/\n/gi, '<br />')
    },
  },
  methods: {
    closeModal() {
      this.$emit('close-modal')
    },
  },
}
</script>
<style scoped lang="scss">
@import '~/assets/scss/coaches/coach_profile_modal.scss';
#companyProgramDetailModal {
  background-color: #ffffff;
  overflow-y: auto;
  border-radius: 8px;
  max-height: calc(var(--vh, 1vh) * 100 - 80px - 44px);
}
.coach__container {
  border-top: 12px solid #f8f8f8;
  padding-bottom: 0;
  border-radius: 8px;
  padding-top: 24px;
  .coach__left {
    .program__section {
      margin-bottom: 0;
    }
  }
}
</style>
