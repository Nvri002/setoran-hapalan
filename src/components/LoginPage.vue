<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 transition-colors">
    <div class="w-full max-w-sm">
      <!-- Logo / Judul -->
      <div class="text-center mb-8">
        <div class="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20"
             style="background: linear-gradient(135deg, #10b981, #047857)">
          <span class="text-2xl text-white">📖</span>
        </div>
        <h1 class="mt-4 font-display text-2xl font-bold text-slate-800 dark:text-white">Setoran Hafalan</h1>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">Login untuk melanjutkan</p>
      </div>

      <!-- Card Form -->
      <div class="card p-6 space-y-5">
        <!-- Error -->
        <transition name="fade">
          <div v-if="error" class="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl p-3 flex items-start gap-2 text-red-700 dark:text-red-400">
            <span class="text-sm">⚠️</span>
            <p class="text-sm flex-1">{{ error }}</p>
            <button @click="error = null" class="text-red-400 hover:text-red-600 transition-colors shrink-0">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        </transition>

        <!-- Form -->
        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label for="username" class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Username</label>
            <input
              id="username"
              v-model="username"
              type="text"
              placeholder="misal: nama@uin-suska.ac.id"
              class="input"
              :disabled="loading"
              autocomplete="username"
            />
          </div>
          <div>
            <label for="password" class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Password</label>
            <input
              id="password"
              v-model="password"
              type="password"
              placeholder="••••••••"
              class="input"
              :disabled="loading"
              autocomplete="current-password"
            />
          </div>
          <button
            type="submit"
            :disabled="loading || !username || !password"
            class="btn-primary w-full py-3 text-sm font-bold"
          >
            <span v-if="loading" class="flex items-center justify-center gap-2">
              <svg class="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              Memproses...
            </span>
            <span v-else>🔐 Masuk</span>
          </button>
        </form>

        <!-- Info -->
        <p class="text-[10px] text-slate-400 text-center">
          Gunakan akun Keycloak dev.tif.uin-suska.ac.id
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { authService } from '../services/auth.js'

const emit = defineEmits(['logged-in'])

const username = ref('')
const password = ref('')
const loading = ref(false)
const error = ref(null)

async function handleLogin() {
  if (!username.value || !password.value) {
    error.value = 'Username dan password harus diisi.'
    return
  }

  loading.value = true
  error.value = null

  try {
    await authService.login(username.value, password.value)
    emit('logged-in')
  } catch (e) {
    console.error('Login error:', e)
    const status = e.response?.status
    const message = e.response?.data?.error_description || e.response?.data?.message || ''

    if (status === 401) {
      error.value = 'Username atau password salah. Silakan coba lagi.'
    } else if (status === 400) {
      if (message.includes('invalid_grant')) {
        error.value = 'Username atau password salah.'
      } else {
        error.value = 'Permintaan tidak valid. Periksa kembali data yang dimasukkan.'
      }
    } else if (status >= 500) {
      error.value = 'Server autentikasi sedang bermasalah. Coba beberapa saat lagi.'
    } else {
      error.value = 'Gagal menghubungi server. Periksa koneksi internet Anda.'
    }
  } finally {
    loading.value = false
  }
}
</script>