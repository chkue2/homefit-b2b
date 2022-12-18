import { cloneDeep } from 'lodash'
export default {
  namespaced: true,
  state: () => ({
    isOutlineOpen: true,
    schedules: {},
    todaySchedules: [],
  }),
  mutations: {
    SETOUTLINEOPEN(state, payload) {
      state.isOutlineOpen = payload
    },
    SETSCHEDULES(state, payload) {
      state.schedules = cloneDeep(payload)
    },
    SETTODAYSCHEDULES(state, payload) {
      state.todaySchedules = cloneDeep(payload)
    },
  },
  actions: {
    toggleOutlineOpen(context, payload) {
      context.commit('SETOUTLINEOPEN', payload)
    },
    setSchedules(context, payload) {
      context.commit('SETSCHEDULES', payload)
    },
    setSelectedDate(context, payload) {
      context.commit('SETSELECTEDDATE', payload)
    },
    setTodaySchedules(context, payload) {
      context.commit('SETTODAYSCHEDULES', payload)
    },
  },
  getters: {},
}
