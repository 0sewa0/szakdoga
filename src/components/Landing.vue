<template>
  <v-container fluid>
    <v-card style="max-width: 1400px; margin: auto;">
      <v-parallax src="/static/simpleufo.jpg">
       <v-layout row wrap>
        <v-flex xs12 class="text-xs-center" mt-5>
          <h1>Welcome to {{appTitle}}</h1>
        </v-flex>
          <v-flex xs12 sm6 offset-sm3 mt-3>
            <blockquote class="blockquote text-xs-center">
              It's a basic 2D arena game, where up to 12 players can play againts each other. <br>
              Test you skill in defeating the other players while not getting hit in the process. <br>
              There are NO teams, no friends to back you up, <br>
              everyone has the same powers, and the same goal, being the first on the server leaderboard.
            </blockquote>
          </v-flex>
          <v-flex  xs12 sm6 offset-sm3 mt-3 class="text-xs-center">
            <v-flex v-show="notAuthorized">
              <v-alert type="error" dismissible v-model="alert">
                  {{ error }}
              </v-alert>
            </v-flex>
            <v-btn  color="secondary" to="/game" v-show="notAuthorized">Play as a Guest</v-btn>
          </v-flex>
        </v-layout>
      </v-parallax>
    </v-card>
<br>
    <v-card style="max-width: 1400px; margin: auto;" v-show="notAuthorized">
      <v-card-media src="/static/diff.png" height="250px">
      </v-card-media>
      <v-layout row wrap>
        <v-flex xs12 class="text-xs-center" mt-5>
          <h1>Sign Up for AWESOME features</h1>
        </v-flex>
        <v-flex xs12 sm6 offset-sm3 mt-3>
          <v-card-text>
              When you sign up you will be able to:
              <ul>
                <li>Set yor name that wil be displayed on the leaderboard.</li>
                <li>Gain access to the special skin that you can turn on or off.</li>
              </ul>
          </v-card-text>
          <v-flex class="text-xs-center">
          <v-btn color="primary" to="/signup" v-show="notAuthorized">Sign Up</v-btn>
          <v-btn color="secondary" to="/signin" v-show="notAuthorized">Sign In</v-btn>
          </v-flex>
        </v-flex>
      </v-layout>
    </v-card>
    <br>
    <v-card style="max-width: 1400px; margin: auto;">
      <v-parallax src="/static/sign.png" height="600">
      <v-container fluid grid-list-md>
       <v-layout row wrap>
        <v-flex xs12 class="text-xs-center" mt-5>
          <h1>Controls/Abilities</h1>
          </v-flex>
          <v-card style="max-width: 400px; margin: auto;">
            <v-card-title><h2>Movement</h2></v-card-title>
            <v-card-media
                height="300px"
                src="/static/move.png"
              >
              </v-card-media>
            <v-card-text>You can move using <b>WASD</b>. Up <b>W</b>, down <b>S</b>, left <b>A</b>, right <b>D</b></v-card-text>
          </v-card>
          <v-card style="max-width: 400px; margin: auto;">
            <v-card-title><h2>Aim/Fire</h2></v-card-title>
            <v-card-media
                height="300px"
                src="/static/shoot.png"
              >
              </v-card-media>
            <v-card-text>You aim with the mouse and can fire your weapon using your <b>left mouse button</b>. You can only fire once in short period of time.</v-card-text>
          </v-card>
          <v-card style="max-width: 400px; margin: auto;">
            <v-card-title><h2>Shield</h2></v-card-title>
            <v-card-media
                height="300px"
                src="/static/shield.png"
              >
              </v-card-media>
            <v-card-text>You can become immune to attacks for a brief period, by holding down the <b>SPACEBAR</b>. It will recharge slowly.</v-card-text>
          </v-card>
        </v-layout>
        </v-container>
      </v-parallax>
    </v-card>
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