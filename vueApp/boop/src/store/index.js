import Vue from 'vue'
import Vuex from 'vuex'
import router from '@/router'


Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    appTitle: 'Boop.io',
    user: null,
    error: null,
    loading: false
  },
  mutations: {
    setUser (state, payload) {
        state.user = payload
      },
    setError (state, payload) {
      state.error = payload
    },
    setLoading (state, payload) {
      state.loading = payload
    }
  },
  actions: {},
  getters: {}
})