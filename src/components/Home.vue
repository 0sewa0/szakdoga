<template>
  <v-card style="max-width: 400px; margin: auto;">
      <v-container fluid >
        <v-layout row wrap>
          <v-flex xs12 class="text-xs-center">
                <form @submit.prevent="startGame">
                    <v-text-field
                        id = "dname"
                        name="displayName"
                        label="Display Name"
                        v-model="displayName"
                        required>
                    </v-text-field>
                    <v-btn color="primary" type="submit"> Start a game </v-btn>
                </form>
          </v-flex>
        </v-layout>
    </v-container>
  </v-card>
</template>

<script>
export default {
    data(){
        return {
            displayName: this.$store.getters.getUserName.email.split('@')[0]
        }
    },
    methods:{
        startGame() {
            this.$store.dispatch('startGame',{displayName: this.displayName})
        }
    }
}
</script>