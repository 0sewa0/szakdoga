// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import { store } from './store'
import firebase from 'firebase'


Vue.use(Vuetify, {
  theme: {
    primary: "#222439",
    secondary: "#7986CB",
    accent: "#42A5F5"
  }
})


firebase.initializeApp({
  apiKey: "AIzaSyBRFn7cm0tzo86NwKp9UfigDqCrKTXPXbI",
  authDomain: "szakdolgozat-63359.firebaseapp.com",
  databaseURL: "https://szakdolgozat-63359.firebaseio.com",
  projectId: "szakdolgozat-63359",
  storageBucket: "szakdolgozat-63359.appspot.com",
  messagingSenderId: "663675571706"
})

Vue.config.productionTip = false

/* eslint-disable no-new */
const unsubscribe = firebase.auth()
.onAuthStateChanged((firebaseUser) => {
  new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App),
    created () {
      if (firebaseUser) {
        store.dispatch('autoSignIn', firebaseUser)
      }
    }
  });
  unsubscribe()
})
