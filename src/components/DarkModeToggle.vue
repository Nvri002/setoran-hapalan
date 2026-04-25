<template>
  <button
    @click="toggle"
    class="btn-icon group relative overflow-hidden"
    :title="dark ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
    aria-label="Toggle dark mode"
  >
    <transition name="toggle-icon" mode="out-in">
      <span v-if="dark" key="sun" class="text-yellow-400 text-base leading-none">☀️</span>
      <span v-else      key="moon" class="text-slate-500 text-base leading-none">🌙</span>
    </transition>
  </button>
</template>

<script setup>
import { useDarkMode } from '../composables/useDarkMode.js'
const { dark, toggle } = useDarkMode()
</script>

<style scoped>
.toggle-icon-enter-active, .toggle-icon-leave-active {
  transition: all .22s cubic-bezier(.34,1.56,.64,1);
}
.toggle-icon-enter-from { opacity: 0; transform: rotate(-90deg) scale(.5); }
.toggle-icon-leave-to   { opacity: 0; transform: rotate( 90deg) scale(.5); }
</style>
