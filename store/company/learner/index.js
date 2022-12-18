import { cloneDeep, reduce } from 'lodash'
import moment from 'moment'
import axios from 'axios'
import axiosCatchHelper from '~/assets/js/axiosCatchHelper'
const SELECTED_DATA = () => {
  return {
    programType: '',
    programTypeCaption: '',
    coachUserId: '',
    expertName: '',
    id: '',
  }
}
export default {
  namespaced: true,
  state: () => ({
    expertInfo: {},
    schedules: {},
    todaySchedules: [],
    selectedData: SELECTED_DATA(),
    myReservations: {
      myReservations: {},
      myWaitings: {},
    },
  }),
  mutations: {
    SETEXPERTINFO(state, payload) {
      state.expertInfo = cloneDeep(payload)
    },
    SETSCHEDULES(state, payload) {
      state.schedules = cloneDeep(payload)
    },
    SETTODAYSCHEDULES(state, payload) {
      state.todaySchedules = cloneDeep(payload)
    },
    SETSELECTEDDATA(state, payload) {
      state.selectedData = cloneDeep(payload)
    },
    SETMYRESERVATIONS(state, payload) {
      state.myReservations = cloneDeep(payload)
    },
  },
  actions: {
    fetchMyReservations(context) {
      return new Promise((resolve, reject) => {
        axios
          .post('*path*', { _method: 'get' })
          .then((response) => {
            context.commit('SETMYRESERVATIONS', response.data)
            resolve()
          })
          .catch((e) => {
            axiosCatchHelper.alertIfHasMessage(e)
          })
      })
    },
    requestLessonCancel(context, { b2bTimetableReservationId }) {
      return new Promise((resolve, reject) => {
        axios
          .post('*path*', {
            _method: 'put',
            b2bTimetableReservationId,
          })
          .then(() => {
            resolve()
          })
          .catch((e) => {
            axiosCatchHelper.alertIfHasMessage(e)
          })
      })
    },
    fetchLessonChangeData(context, { id, start }) {
      return new Promise((resolve, reject) => {
        axios
          .post('*path*', {
            _method: 'get',
            b2bTimetableId: id,
          })
          .then((response) => {
            const startYearMonth = moment(start).format('YYYY-MM')
            const fullDate = moment(start).format('YYYY-MM-DD')

            context.commit('SETSCHEDULES', {
              ...context.state.schedules,
              [startYearMonth]: {
                ...context.state.schedules[startYearMonth],
                [fullDate]: reduce(
                  context.state.schedules[startYearMonth][fullDate],
                  (result, key, value) => {
                    if (key.id === response.data.schedule.id) {
                      result.push({ ...key, ...response.data.schedule })
                    } else {
                      result.push(key)
                    }
                    return result
                  },
                  []
                ),
              },
            })
          })
          .catch((e) => {
            axiosCatchHelper.alertIfHasMessage(e)
          })
          .finally(() => {
            resolve()
          })
      })
    },
    setExpertInfo(context, payload) {
      context.commit('SETEXPERTINFO', payload)
    },
    setSchedules(context, payload) {
      context.commit('SETSCHEDULES', payload)
    },
    setTodaySchedules(context, payload) {
      context.commit('SETTODAYSCHEDULES', payload)
    },
    setSelectedData(context, payload) {
      context.commit('SETSELECTEDDATA', {
        ...context.state.selectedData,
        ...payload,
      })
    },
    setMyReservations(context, payload) {
      context.commit('SETMYRESERVATIONS', payload)
    },
  },
  getters: {},
}
