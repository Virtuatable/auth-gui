import axios from 'axios'

export class Api {

  /**
   * 
   * @param username The nickname of the user currently authenticating.
   * @param password The password the user has entered in the cyphered field.
   * @returns 
   */
  public async createSession(username: string, password: string, application_id: string) {
    const uri: string = `/sessions?authenticity_token=${this.csrf}`;
    const payload: string = JSON.stringify({
      username: username,
      password: password,
      application_id: application_id
    });
    return axios.post(uri, payload, { headers: this.headers })
      .then((response: any) => {
        localStorage.setItem('session_id', response.data.session.token);
        return response.data;
      })
  }

  public getSession(session_id: string) {
    return axios.get(`/sessions/${session_id}`)
  }

  public createAuthorization(application_id: string) {
    const payload: string = JSON.stringify({
      application_id: application_id,
      session_id: localStorage.getItem('session_id') || ''
    })
    return axios.post(`/authorizations?authenticity_token=${this.csrf}`, payload)
  }

  /**
   * 
   * @param application_id the UUID of the application to check the existence
   * @param redirect_uri the redirection URI to check it belongs to the application
   */
  public checkApplication(application_id: string, redirect_uri: string) {
    const uri: string = `/app-check?authenticity_token=${this.csrf}`;
    const payload: string = JSON.stringify({
      redirect_uri: redirect_uri,
      application_id: application_id
    });
    return axios.post(uri, payload, { headers: this.headers })
      .then((response: any) => response.data)
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