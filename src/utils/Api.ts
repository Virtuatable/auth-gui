import axios from 'axios'

export class Api {

  /**
   * 
   * @param username The nickname of the user currently authenticating.
   * @param password The password the user has entered in the cyphered field.
   * @returns 
   */
  public async createSession(username: string, password: string, client_id: string) {
    const uri: string = `/auth/sessions?_csrf=${this.csrf}`;
    const payload: string = JSON.stringify({
      username: username,
      password: password,
      client_id: client_id
    });
    return axios.post(uri, payload, { headers: this.headers })
      .then((response: any) => {
        localStorage.setItem('session_id', response.data.token);
        return response.data;
      })
  }

  public getSession(session_id: string) {
    return axios.get(`/auth/sessions/${session_id}`)
  }

  public createAuthorization(client_id: string) {
    const payload: string = JSON.stringify({
      client_id: client_id,
      session_id: localStorage.getItem('session_id') || ''
    })
    return axios.post(`/auth/authorizations?_csrf=${this.csrf}`, payload, {headers: this.headers})
  }

  /**
   * 
   * @param client_id the UUID of the application to check the existence
   * @param redirect_uri the redirection URI to check it belongs to the application
   */
  public checkApplication(client_id: string, redirect_uri: string) {
    const uri: string = `/auth/applications/${client_id}?_csrf=${this.csrf}&redirect_uri=${redirect_uri}`;
    return axios.get(uri, { headers: this.headers }).then((resp: any) => resp.data)
  }

  private get csrf(): string {
    return document
      ?.querySelector('input[name=_csrf]')
      ?.getAttribute('value') || '';
  }

  private get headers(): {[key: string]: string} {
    return { 'Content-Type': 'application/json'};
  }
}

const api = new Api();

export default api;