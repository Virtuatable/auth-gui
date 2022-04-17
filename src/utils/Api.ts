import axios from 'axios'

export class Api {

  public get uri() {
    return process.env.VUE_APP_API_URI
  }

  /**
   * 
   * @param username The nickname of the user currently authenticating.
   * @param password The password the user has entered in the cyphered field.
   * @param application_id The UUID of the application trying to get the users rights.
   * @param redirect_uri The URI to redirect the user at the end of the authentication process.
   * @returns 
   */
  public async createSession(username: string, password: string, application_id: string, redirect_uri: string) {
    const uri: string = `${this.uri}/sessions?authenticity_token=${this.csrf}`;
    const payload: string = JSON.stringify({
      username: username,
      password: password,
      application_id: application_id,
      redirect_uri: redirect_uri
    });
    return axios.post(uri, payload, { headers: this.headers })
      .then((response: any) => {
        localStorage.setItem('session_id', response.data.session.id);
        return response.data;
      })
  }

  private get csrf(): string {
    return document
      ?.querySelector('meta[name=csrf]')
      ?.getAttribute('content') || '';
  }

  private get headers(): {[key: string]: string} {
    return { 'Content-Type': 'application/json'};
  }
}

const api = new Api();

export default api;