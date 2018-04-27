<template>
<v-container fluid>
  <v-card style="max-width: 400px; margin: auto;">
      <v-container fluid >
        <v-layout row wrap>
          <v-flex xs12 class="text-xs-center">
                <form @submit.prevent="startGame">
                    <v-layout column>
                        <v-flex>
                            <v-alert type="error" dismissible v-model="alert">
                                {{ error }}
                            </v-alert>
                        </v-flex>
                        <v-text-field
                            color ='secondary'
                            id = "dname"
                            name="displayName"
                            label="Display Name"
                            v-model="displayName"
                            required>
                        </v-text-field>
                        <v-switch
                          label="Minimal"
                          v-model="minimal"
                          color="accent"
                          hide-details
                        ></v-switch>
                        <v-btn color="primary" type="submit"> Start game </v-btn>
                    </v-layout>
                </form>
          </v-flex>
        </v-layout>
    </v-container>
  </v-card>
</v-container>
</template>

<script>
export default {
    data(){
        return {
            displayName: this.$store.getters.getUserName.email.split('@')[0],
            minimal:this.$store.getters.getMinimal,
            alert: false
        }
    },
    computed: {
        error () {
            if(this.$store.state.error) {
                this.alert = true;
            }
            return this.$store.state.error
        },
    },
    methods: {
        startGame() {
            this.$store.commit('setLoading', true);
            this.$store.commit('setMinimal', this.minimal);
            this.$store.dispatch('startGame',{displayName: this.displayName})
        }
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