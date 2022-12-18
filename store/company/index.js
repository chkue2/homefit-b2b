import { cloneDeep } from 'lodash'
export default {
  namespaced: true,
  state: () => ({
    isLoading: false,
    isCategoryOpen: true,
    isEmojiAlert: false,
    isEmojiEither: false,
    selectedDate: '',
    emojiAlertConfig: {
      emoji: '',
      title: '',
      content: '',
    },
    emojiEitherConfig: {
      emoji: '',
      title: '',
      content: '',
      left: {
        content: '',
        callback: () => {},
      },
      right: {
        content: '',
        callback: () => {},
      },
    },
  }),
  mutations: {
    SETLOADING(state, payload) {
      state.isLoading = payload
    },
    SETCATEGORYOPEN(state, payload) {
      state.isCategoryOpen = payload
    },
    SETSELECTEDDATE(state, payload) {
      state.selectedDate = payload
    },
    SETEMOJIALERT(state, payload) {
      state.isEmojiAlert = payload
    },
    SETEMOJIEITHER(state, payload) {
      state.isEmojiEither = payload
    },
    SETEMOJIALERTCONFIG(state, payload) {
      state.emojiAlertConfig = cloneDeep(payload)
    },
    SETEMOJIEITHERCONFIG(state, payload) {
      state.emojiEitherConfig = cloneDeep(payload)
    },
  },
  actions: {
    setLoading(context, payload) {
      context.commit('SETLOADING', payload)
    },
    setEmojiAlertConfig(context, payload) {
      context.commit('SETEMOJIALERTCONFIG', payload)
    },
    setEmojiEitherConfig(context, payload) {
      context.commit('SETEMOJIEITHERCONFIG', payload)
    },
    setSelectedDate(context, payload) {
      context.commit('SETSELECTEDDATE', payload)
    },
    toggleCategoryOpen(context, payload) {
      context.commit('SETCATEGORYOPEN', payload)
    },
    toggleEmojiAlert(context, payload) {
      context.commit('SETEMOJIALERT', payload)
    },
    toggleEmojiEither(context, payload) {
      context.commit('SETEMOJIEITHER', payload)
    },
  },
  getters: {},
}
