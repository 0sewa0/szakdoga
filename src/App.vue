<template>
  <v-app dark fluid>

    <v-toolbar app>
      <v-toolbar-title>
        <router-link to="/" tag="span" style="cursor: pointer">
          {{ appTitle }}
        </router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn
          flat
          v-for="item in menuItems"
          :key="item.title"
          :to="item.path">
          <v-icon left dark>{{ item.icon }}</v-icon>
          {{ item.title }}
        </v-btn>
        <v-btn flat v-if="isAuthenticated" @click="userSignOut">
          <v-icon left>exit_to_app</v-icon>
          Sign Out
          </v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-content>
      <v-layout center>
        <v-dialog v-model="loading" content-class="loading-dialog" max-width="100">
          <v-container fill-height>
            <v-layout justify-center align-center>
              <v-progress-circular indeterminate :size="70" :width="7" color="purple"></v-progress-circular>
            </v-layout>
          </v-container>
        </v-dialog>
      </v-layout>
      <v-fade-transition>
      <router-view v-show="!loading"></router-view>
      </v-fade-transition>
    </v-content>
  </v-app>
</template>

<script>
  export default {

    computed: {
      appTitle() {
        return this.$store.state.appTitle
      },
      isAuthenticated () {
        return this.$store.getters.isAuthenticated
      },
      menuItems () {
        if (this.isAuthenticated) {
          return [
            { title: 'Home', path: '/home', icon: 'home' }
          ]
        } else {
          return [
            { title: 'Sign Up', path: '/signup', icon: 'face' },
            { title: 'Sign In', path: '/signin', icon: 'lock_open' },
          ]
        }
      },
      loading() {
        return this.$store.state.loading;
      }
    },
    methods: {
      userSignOut () {
        this.$store.dispatch('userSignOut')
      },
    },
  }
</script>