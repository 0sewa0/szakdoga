<template>
  <v-container fluid>
    <v-layout row wrap>
      <v-flex xs12 class="text-xs-center" mt-5>
        <h1>Welcome to {{appTitle}}</h1>
      </v-flex>
      <v-flex xs12 sm6 offset-sm3 mt-3>
        <blockquote class="blockquote text-xs-center">
          It's a basic 2D arena game, where up to 12 players can play againts each other. <br>
          Test you skill in defeating the other players while not getting hit in the process. <br>
        </blockquote>
      </v-flex>
      <v-flex xs12 sm6 offset-sm3 class="text-xs-center" mt-5>
        <v-btn color="primary" to="/signup" v-show="notAuthorized">Sign Up</v-btn>
        <v-btn color="secondary" to="/signin" v-show="notAuthorized">Sign In</v-btn>
        <v-flex v-show="notAuthorized">
          <v-alert type="error" dismissible v-model="alert">
              {{ error }}
          </v-alert>
        </v-flex>
        <v-btn  color="secondary" to="/game" v-show="notAuthorized">Play as a Guest</v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data(){
        return {
            alert: false
        }
  },
  computed: {
    appTitle() {
        return this.$store.state.appTitle
    },
    notAuthorized() { return !this.$store.getters.isAuthenticated },
    error () {
            if(this.$store.state.error) {
                this.alert = true;
            }
            return this.$store.state.error
        },
  },
  watch: {
    alert (value) {
      if (!value) {
        this.$store.commit('setError', null)
      }
    }
  }
}
</script>