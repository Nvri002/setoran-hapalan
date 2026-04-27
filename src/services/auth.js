import axios from 'axios'

const AUTH_URL = 'https://id.tif.uin-suska.ac.id/realms/dev/protocol/openid-connect/token'
const CLIENT_ID = 'setoran-mobile-dev'
const CLIENT_SECRET = 'aqJp3xnXKudgC7RMOshEQP7ZoVKWzoSl'

const K = {
  ACCESS:  'sh_access_token',
  REFRESH: 'sh_refresh_token',
  EXPIRY:  'sh_token_expiry',
}

const authAxios = axios.create()

function toForm(obj) {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(obj)) {
    params.append(key, value)
  }
  return params
}

let _refreshPromise = null

export const authService = {
  async login(username, password) {
    const body = toForm({
      grant_type: 'password',
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      username,
      password,
      scope: 'openid profile email'   
    })

    console.log('[auth] login body:', body.toString())  

    const { data } = await authAxios.post(AUTH_URL, body, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    this._save(data)
    return data
  },

  async refresh() {
    if (_refreshPromise) return _refreshPromise

    _refreshPromise = (async () => {
      const rt = localStorage.getItem(K.REFRESH)
      if (rt) {
        try {
          const { data } = await authAxios.post(AUTH_URL, toForm({
            grant_type: 'refresh_token',
            refresh_token: rt,
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
          }), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
          this._save(data)
          return data
        } catch {       
         }
      }
      this.clear()
      throw new Error('Session expired')
    })()

    try {
      return await _refreshPromise
    } finally {
      _refreshPromise = null
    }
  },

  async getValidToken() {
    const expiry = parseInt(localStorage.getItem(K.EXPIRY) || '0')
    if (!this.getToken() || Date.now() >= expiry - 15_000) {
      await this.refresh()
    }
    return this.getToken()
  },

  getToken()   { return localStorage.getItem(K.ACCESS) },
  getRefresh() { return localStorage.getItem(K.REFRESH) },

  _save(data) {
    localStorage.setItem(K.ACCESS,  data.access_token)
    if (data.refresh_token) localStorage.setItem(K.REFRESH, data.refresh_token)
    const exp = Date.now() + (data.expires_in - 5) * 1000
    localStorage.setItem(K.EXPIRY, exp.toString())
  },

  clear() {
    Object.values(K).forEach(k => localStorage.removeItem(k))
  },
}