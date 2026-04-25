// src/services/api.js
import axios from 'axios'
import { authService } from './auth.js'

const BASE = 'https://api.tif.uin-suska.ac.id/setoran-dev/v1'

export const http = axios.create({ baseURL: BASE, timeout: 20_000 })

http.interceptors.request.use(
  async (config) => {
    try {
      const token = await authService.getValidToken()
      if (token) config.headers.Authorization = `Bearer ${token}`
    } catch (e) {
      console.error('[API] Could not get valid token:', e.message)
    }
    return config
  },
  (err) => Promise.reject(err)
)


let isRefreshing = false
let waitQueue = []   

function drainQueue(token, err) {
  waitQueue.forEach(p => err ? p.reject(err) : p.resolve(token))
  waitQueue = []
}

http.interceptors.response.use(
  (res) => res,
  async (err) => {
    const orig = err.config

    if (err.response?.status !== 401 || orig._retry) {
      return Promise.reject(err)
    }

    orig._retry = true

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        waitQueue.push({ resolve, reject })
      }).then(token => {
        orig.headers.Authorization = `Bearer ${token}`
        return http(orig)
      })
    }

    isRefreshing = true
    try {
      const data  = await authService.refresh()
      const token = data.access_token || authService.getToken()
      drainQueue(token, null)
      orig.headers.Authorization = `Bearer ${token}`
      return http(orig)
    } catch (refreshErr) {
      drainQueue(null, refreshErr)
      return Promise.reject(refreshErr)
    } finally {
      isRefreshing = false
    }
  }
)


export const setoranApi = {
  async get(nim) {
    const { data } = await http.get(`/mahasiswa/setoran/${nim}`)
    return data
  },

  async post(nim, payload) {
    const { data } = await http.post(`/mahasiswa/setoran/${nim}`, payload)
    return data
  },

  async delete(nim, payload) {
    const { data } = await http.delete(`/mahasiswa/setoran/${nim}`, { data: payload })
    return data
  },
}
export const dosenApi = {
  async getPaSaya() {
    const { data } = await http.get('/dosen/pa-saya')
    return data
  }
}