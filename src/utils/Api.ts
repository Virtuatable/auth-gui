import axios from 'axios'

export class Api {


  public get uri() {
    return process.env.VUE_APP_API_URI
  }

  public async createSession(username: string, password: string) {
    const payload: string = JSON.stringify({username, password})
    return await axios.post(`${this.uri}/sessions`, payload, {
      headers: { 'Content-Type': 'application/json'}
    })
  }
}

const api = new Api();

export default api;