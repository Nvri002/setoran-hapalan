<template>
  <LoginPage v-if="!loggedIn" @logged-in="onLoggedIn" />
  <template v-else>
    <Dashboard />
    <ToastContainer />
  </template>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import LoginPage from './components/LoginPage.vue'
import Dashboard from './components/Dashboard.vue'
import ToastContainer from './components/ToastContainer.vue'
import { authService } from './services/auth.js'

const loggedIn = ref(false)

async function checkAuth() {
  const token = authService.getToken()
  if (!token) {
    loggedIn.value = false
    return
  }

  // Cek apakah token sudah expired
  const expiry = parseInt(localStorage.getItem('sh_token_expiry') || '0')
  if (Date.now() >= expiry) {
    // Token expired – coba refresh
    try {
      await authService.refresh()
      loggedIn.value = true
    } catch {
      // Refresh gagal, paksa logout
      authService.clear()
      loggedIn.value = false
    }
  } else {
    loggedIn.value = true
  }
}

function onLoggedIn() {
  loggedIn.value = true
}

onMounted(() => {
  checkAuth()
})
</script>