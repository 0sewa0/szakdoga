import Vue from 'vue'
import Vuex from 'vuex'
import router from '@/router'
import firebase from 'firebase'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    //App state
    appTitle: 'Boop.io',
    user: null,
    error: null,
    loading: false,

    //Game state
    displayName: null,
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
    },
    setDisplayName(state, payload) {
      state.displayName = payload
    }
  },
  actions: {
    userSignUp ({commit}, payload) {
      commit('setLoading', true)
      firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
      .then(firebaseUser => {
       commit('setUser', {email: firebaseUser.email})
       commit('setLoading', false)
       commit('setError', null)
       router.push('/home')
      })
      .catch(error => {
       commit('setError', error.message)
       commit('setLoading', false)
      })
    },
    userSignIn ({commit}, payload) {
      commit('setLoading', true)
      firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
      .then(firebaseUser => {
        commit('setUser', {email: firebaseUser.email})
        commit('setLoading', false)
        commit('setError', null)
        router.push('/home')
      })
      .catch(error => {
        commit('setError', error.message)
        commit('setLoading', false)
      })
    },
    autoSignIn ({commit}, payload) {
      commit('setUser', {email: payload.email})
    },
    userSignOut ({commit}) {
      firebase.auth().signOut()
      commit('setUser', null)
      router.push('/')
    },
    startGame({commit}, payload) {
        commit('setDisplayName', payload.displayName)
        router.push('/game')
    },
    goHome({commit}, payload) {
      console.log(payload);
      commit('setDisplayName', null)
      router.push('/home')
    }

  },
  getters: {
    //App
    isAuthenticated: (state) => state.user !== null && state.user !== undefined,
    getUserName: (state) => state.user,
    //Game
    getDisplayName: (state) => state.displayName,
  }
})