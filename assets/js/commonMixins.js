export default {
  methods: {
    moveByServiceType(serviceType) {
      if (serviceType === 'group') {
        location.href = '/f/group/'
      } else if (this.returnToPaymentStatus(serviceType)) {
        location.href = `/${serviceType}/listings/`
      } else {
        location.href = `/${serviceType}/suggest/`
      }
    },
    returnToPaymentStatus(serviceType) {
      switch (serviceType) {
        case 'workout':
          return window.homefit.user.hasTrialPayCompleted
        case 'meditation':
          return window.homefit.user.meditation.hasPayCompleted
        case 'art':
          return window.homefit.user.art.hasPayCompleted
        case 'music':
          return window.homefit.user.music.hasPayCompleted
        default:
          return false
      }
    },

    changeServiceTypeKorByEng(serviceType) {
      switch (serviceType) {
        case 'all':
          return '전체'
        case 'WORKOUT':
          return '운동'
        case 'MEDITATION':
          return '요가명상'
        case 'ART':
          return '미술'
        case 'MUSIC':
          return '음악'
        default:
          return ''
      }
    },

    returnToServiceTypeEngByClassSimple(classSimple) {
      switch (classSimple) {
        case 'A':
        case 'B':
        case 'C':
          return 'workout'
        case 'D':
          return 'meditation'
        case 'E':
          return 'art'
        case 'F':
        case 'G':
          return 'music'
        default:
          return ''
      }
    },

    returnToPriceCeil(str) {
      const num = String(str).replace(/,/gi, '')
      return Math.ceil(Number(num) / 1000) * 1000
    },

    checkValidateEmail(email) {
      const regex = /^[A-Za-z0-9_\\.\\-]+@[A-Za-z0-9\\-]+\.[A-Za-z0-9\\-]+/
      return regex.test(email)
    },

    fillZero(width, str) {
      return str.length >= width
        ? str
        : new Array(width - str.length + 1).join('0') + str
    },
  },
}
