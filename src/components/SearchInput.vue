<template>
  <div class="relative flex-1" ref="containerRef">
    <!-- Input -->
    <div class="relative">
      <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-100/50 pointer-events-none"
           viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
      </svg>
      <input
        ref="inputRef"
        v-model="query"
        type="text"
        :placeholder="placeholder"
        class="w-full bg-white/10 border border-white/30 rounded-xl py-2.5 pl-10 pr-10 text-sm text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/60 transition-all font-body"
        :disabled="disabled"
        @input="onInput"
        @keydown.enter="onEnter"
        @focus="updateDropdownPosition(); showDropdown = true"
        @blur="hideDropdownDelayed"
      />
      <!-- Clear button -->
      <button
        v-if="query"
        @click="clear"
        class="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/80 transition-colors"
      >
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>

    <!-- Dropdown di-teleport ke body agar selalu di atas -->
    <Teleport to="body">
      <transition name="fade">
        <ul
          v-if="showDropdown && suggestions.length > 0"
          :style="dropdownStyle"
          class="fixed z-[99999] mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl max-h-60 overflow-y-auto py-1"
          @mousedown.prevent
        >
          <li
            v-for="item in suggestions"
            :key="item.nim"
            @mousedown.prevent="selectItem(item)"
            class="px-4 py-2.5 flex items-center gap-3 cursor-pointer hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
          >
            <div class="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 font-bold text-xs shrink-0">
              {{ item.nim.slice(-2) }}
            </div>
            <div class="min-w-0">
              <p class="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">
                {{ item.nama || item.nim }}
              </p>
              <p class="text-[10px] text-slate-400 font-mono">
                {{ item.nim }}
              </p>
            </div>
          </li>
        </ul>
      </transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'

const props = defineProps({
  items:       { type: Array,  default: () => [] },
  placeholder: { type: String, default: 'Cari mahasiswa...' },
  disabled:    { type: Boolean, default: false },
})

const emit = defineEmits(['select', 'clear'])

const query = ref('')
const showDropdown = ref(false)
const containerRef = ref(null)
const inputRef = ref(null)
const dropdownStyle = ref({})

const suggestions = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return props.items.slice(0, 8)
  return props.items.filter(item =>
    item.nim.toLowerCase().includes(q) ||
    (item.nama || '').toLowerCase().includes(q)
  ).slice(0, 8)
})

function updateDropdownPosition() {
  nextTick(() => {
    if (!inputRef.value) return
    const rect = inputRef.value.getBoundingClientRect()
    dropdownStyle.value = {
      top: `${rect.bottom + 4}px`,
      left: `${rect.left}px`,
      width: `${rect.width}px`,
    }
  })
}

function onInput() {
  showDropdown.value = true
  updateDropdownPosition()
}

function onEnter() {
  if (suggestions.value.length === 1) {
    selectItem(suggestions.value[0])
  }
}

function selectItem(item) {
  query.value = ''
  showDropdown.value = false
  emit('select', item.nim)
}

function clear() {
  query.value = ''
  showDropdown.value = false
  emit('clear')
}

function hideDropdownDelayed() {
  setTimeout(() => {
    showDropdown.value = false
  }, 150)
}

// Update posisi saat window resize
if (typeof window !== 'undefined') {
  window.addEventListener('resize', updateDropdownPosition)
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>