// src/composables/useDarkMode.js
import { ref, watch, onMounted } from 'vue'

const dark = ref(false)

export function useDarkMode() {
  function apply(val) {
    document.documentElement.classList.toggle('dark', val)
    localStorage.setItem('sh_dark', val ? '1' : '0')
  }

  function toggle() {
    dark.value = !dark.value
  }

  onMounted(() => {
    const saved = localStorage.getItem('sh_dark')
    dark.value = saved !== null
      ? saved === '1'
      : window.matchMedia('(prefers-color-scheme: dark)').matches
    apply(dark.value)
  })

  watch(dark, apply)

  return { dark, toggle }
}
