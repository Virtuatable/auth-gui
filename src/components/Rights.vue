<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import api from '@/utils/Api'
import router from '@/router'

@Component
export default class Rights extends Vue {
  // Indicates whether the loading spinner should be shown or not
  private loading: boolean = true;

  private apiError: string = ''

  private application: any = {};

  public mounted() {
    api.checkApplication(this.application_id, this.redirect_uri)
      .then((response:any) => {
        this.application = response.application
      })
      .catch((error: any) => {
        this.apiError = `${error.response.data.field}.${error.response.data.error}`
      })
      .finally(() => {
        this.loading = false;
      })
    
    api.getSession(this.session_id)
      .catch((error: any) => {
        this.apiError = `${error.response.data.field}.${error.response.data.error}`
      })
  }

  public createAuthorization() {
    api.createAuthorization(this.application.id)
      .then((response: any) => {
        const uri: any = new URL(this.redirect_uri)
        uri.searchParams.append('authorization_code', response.data.code);
        window.location = uri.toString()
      });
  }

  public cancel() {
    localStorage.removeItem('session_id');
    router.push({name: 'sessions', query: this.$route.query})
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

  private get session_id(): string {
    return localStorage.getItem('session_id') || '';
  }

  private get response_type(): string {
    return this.param('response_type')
  }

  private param(name: string): string {
    return (this as any).$route.query[name];
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
            <v-alert v-else-if="response_type != 'code'" type="error">
              You must provide the response_type field with a value of "code"
            </v-alert>
            <v-alert v-else-if="session_id == ''" type="error">
              You must be logged in to access this page
            </v-alert>
            <v-alert v-else-if="apiError == 'session_id.unknown'" type="error">
              Your session token has not been found.
            </v-alert>
            <v-alert v-else-if="apiError == 'application_id.unknown'" type="error">
              You must provide an existing application UUID
            </v-alert>
            <v-alert v-else-if="apiError == 'redirect_uri.unknown'" type="error">
              This redirection URI is not declared in this application.
            </v-alert>

            <v-card v-else>
              <v-card-title>Rights</v-card-title>
              <v-card-text>
                The application {{ application.name }} wants to have access to your data.
              </v-card-text>
              <v-card-actions>
                <v-btn text color="primary" @click="createAuthorization">Agree</v-btn>
                <v-btn text color="red" @click="cancel">Cancel and logout</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </div>
</template>

<style scoped>
.full-height { height: 100vh; }
</style>