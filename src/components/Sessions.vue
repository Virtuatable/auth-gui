<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import api from '@/utils/Api'

/**
 * This form will prompt the user to provide its username and password to
 * authenticate in the application. If the application is premium, it will
 * then obtain an access code that can be transformed as an access token.
 * If the application is NOT premium, it will then be redirected to the
 * rights providing view where the user will be able to validate that it
 * gives the rights to the application.
 * 
 * @author Vincent Courtois <courtois.vincent@outlook.com>
 */
@Component
export default class Sessions extends Vue {

  // The username the user will input in the form.
  private username: string = '';
  // The password the user will input in the form.
  private password: string = '';

  /**
   * Submits the form by sending a request to the server as a POST /sessions.
   * Parameters :
   * - username : the nickname of the user
   * - password : the password of the user
   */
  public submit() {
    if (this.valid) {
      api.createSession(this.username, this.password)
    }
  }

  /**
   * Extracts the application UUID from the querystring
   * @return {String} the value of the application uniq identifier making requests.
   */
  private get application_id(): string {
    return this.param('application_id');
  }

  private get redirect_uri(): string {
    return this.param('redirect_uri');
  }

  private get csrf(): string {
    return document.querySelector('meta[name=csrf]')?.getAttribute('content') || '';
  }

  private param(name: string): string {
    return (this as any).$route.query[name];
  }

  private get valid(): boolean {
    return (this.$refs.loginForm as any).validate();
  }

  /**
   * Validation rules for the form attributes :
   * - :username MUST be given
   * - :username MUST be at least 6 characters
   * - :password MUST be given
   * 
   * @return {[key: string]: Array<Function>} the rules for the login form as a map of string
   *   to set of rules. each string key is the name of a field of the form, and the set of
   *   functions is the rules applied to this field.
   */
  private get rules(): {[key: string]: Array<Function>} {
    return {
      "username": [
        (v: string) => !!v || 'The username is required',
        (v: string) => v && v.length > 6 || 'The username must be at least 6 characters long'
      ],
      "password": [
        (v: string) => !!v || 'The password is required'
      ]
    }
  }
}
</script>

<template>
  <div class ="full-height d-flex flex-column">
    <div class="d-flex align-center flex-grow-1">
      <v-container>
        <v-row>
          <v-col cols="6" offset="3">
            <!-- The display of the errors when a parameter is missing -->
            <v-alert color="red" type="error" v-if="!application_id">
              You must provide the application_id field.
            </v-alert>
            <v-alert color="red" type="error" v-else-if="!redirect_uri">
              You must provide the redirect_uri field.
            </v-alert>

            <!-- The display of the form if all parameters are correctly given -->
            <v-form @submit.prevent="submit" ref="loginForm" v-else>
              <v-card>
                <v-card-title>Login</v-card-title>
                <v-card-text>
                  <v-text-field outlined v-model="username" label="Username" :rules="rules.username"></v-text-field>
                  <v-text-field outlined v-model="password" label="Password" type="password" :rules="rules.password"></v-text-field>
                </v-card-text>
                <v-card-actions>
                  <v-btn text color="primary" type="submit">Log in</v-btn>
                </v-card-actions>
              </v-card>
            </v-form>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </div>
</template>

<style scoped>
.full-height { height: 100vh; }
</style>