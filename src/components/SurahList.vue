<template>
  <div class="space-y-4 animate-slide-up">
    <div class="card p-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
      <div class="flex flex-col sm:flex-row gap-2 flex-1 w-full sm:w-auto">
        <div class="relative flex-1 min-w-0 max-w-xs">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            v-model="filterQuery"
            type="text"
            placeholder="Cari surah..."
            class="input pl-9 py-2 text-sm h-9"
          />
        </div>

        <div class="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1 gap-1 shrink-0">
          <button
            v-for="tab in tabs" :key="tab.key"
            @click="filterTab = tab.key"
            class="px-3 py-1 text-xs font-medium rounded-lg transition-all duration-200"
            :class="filterTab === tab.key
              ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 shadow-sm'
              : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'"
          >
            {{ tab.label }}
            <span class="ml-1 font-bold text-[10px]"
              :class="tab.key === 'done' ? 'text-primary-500' : 'text-slate-400'">
              {{ tab.count }}
            </span>
          </button>
        </div>
      </div>

      <div class="flex items-center gap-2 shrink-0">
        <button
          v-if="selected.size > 0"
          @click="selected.clear()"
          class="btn-ghost text-xs py-1.5"
        >Batal Pilih</button>

        <button
          @click="selectAllPending"
          class="btn-outline text-xs py-1.5"
          :disabled="pendingSurah.length === 0"
        >Pilih Semua Belum</button>

        <button
          @click="deleteMode = !deleteMode"
          class="btn-outline text-xs py-1.5"
          :class="deleteMode ? 'border-red-300 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20' : ''"
        >
          {{ deleteMode ? '✓ Mode Hapus ON' : '🗑 Mode Hapus' }}
        </button>
      </div>
    </div>

    <transition name="slide-down">
      <div
        v-if="selected.size > 0"
        class="card p-4 flex items-center justify-between gap-3
               bg-primary-50 dark:bg-primary-950/40
               border-primary-200 dark:border-primary-800"
      >
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 bg-primary-100 dark:bg-primary-900/60 rounded-xl flex items-center justify-center">
            <span class="text-primary-600 font-bold text-sm">{{ selected.size }}</span>
          </div>
          <p class="text-sm font-medium text-slate-700 dark:text-slate-200">
            Surah dipilih untuk disetorkan
          </p>
        </div>
        <button
          @click="$emit('simpan')"
          :disabled="submitting"
          class="btn-primary py-2 text-sm"
        >
          <span v-if="submitting" class="flex items-center gap-2">
            <svg class="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            Menyimpan...
          </span>
          <span v-else>💾 Simpan Setoran</span>
        </button>
      </div>
    </transition>

    <div class="card p-5">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h3 class="font-display text-base font-semibold text-slate-800 dark:text-slate-100">
            Daftar Surah
          </h3>
          <p class="text-xs text-slate-400 mt-0.5">
            {{ filteredSurah.length }} surah ditampilkan
            <span v-if="deleteMode" class="text-red-400 ml-2">• Hover card untuk tombol hapus</span>
          </p>
        </div>
        <div class="hidden sm:flex items-center gap-4">
          <div class="flex items-center gap-1.5">
            <div class="w-2.5 h-2.5 rounded-full bg-primary-400"></div>
            <span class="text-xs text-slate-400">Sudah setor</span>
          </div>
          <div class="flex items-center gap-1.5">
            <div class="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-600"></div>
            <span class="text-xs text-slate-400">Belum setor</span>
          </div>
          <div class="flex items-center gap-1.5">
            <div class="w-2.5 h-2.5 rounded-full bg-primary-300 ring-2 ring-primary-200"></div>
            <span class="text-xs text-slate-400">Dipilih</span>
          </div>
        </div>
      </div>

      <div v-if="filteredSurah.length === 0" class="py-16 text-center">
        <p class="text-4xl mb-3">🔍</p>
        <p class="text-slate-400 text-sm">Tidak ada surah yang cocok</p>
        <button @click="filterQuery = ''; filterTab = 'all'" class="btn-ghost text-xs mt-3">
          Reset filter
        </button>
      </div>

      <transition-group
        v-else
        name="list"
        tag="div"
        class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5"
      >
        <SurahCard
          v-for="surah in filteredSurah"
          :key="surah.id || surah.nomor"
          :surah="surah"
          :done="isDone(surah)"
          :is-selected="selected.has(surah.id || surah.id_surah || surah.nomor)"
          :highlighted="highlight.has(surah.id || surah.id_surah || surah.nomor)"
          :allow-delete="deleteMode && isDone(surah)"
          @toggle="toggleSelect"
          @delete="onDeleteOne"
        />
      </transition-group>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import SurahCard from './SurahCard.vue'

const props = defineProps({
  filteredSurah: { type: Array,  default: () => [] },
  doneSurah:     { type: Array,  default: () => [] },
  pendingSurah:  { type: Array,  default: () => [] },
  selected:      { type: Object, required: true },   // Set
  highlight:     { type: Object, required: true },   // Set
  submitting:    { type: Boolean, default: false },
  filterQuery:   { type: String,  default: '' },
  filterTab:     { type: String,  default: 'all' },
  isDone:        { type: Function, required: true },
})

const emit = defineEmits(['update:filterQuery', 'update:filterTab', 'toggle', 'simpan', 'delete'])

const deleteMode = ref(false)

const filterQuery = computed({
  get: () => props.filterQuery,
  set: v => emit('update:filterQuery', v),
})
const filterTab = computed({
  get: () => props.filterTab,
  set: v => emit('update:filterTab', v),
})

const tabs = computed(() => [
  { key: 'all',     label: 'Semua',   count: props.doneSurah.length + props.pendingSurah.length },
  { key: 'done',    label: '✓ Selesai', count: props.doneSurah.length },
  { key: 'pending', label: '○ Belum',  count: props.pendingSurah.length },
])

function toggleSelect(id) { emit('toggle', id) }

function selectAllPending() {
  props.pendingSurah.forEach(s => {
    const id = s.id || s.id_surah || s.nomor
    if (!props.selected.has(id)) emit('toggle', id)
  })
}

function onDeleteOne(surah) {
  emit('delete', [surah])
}
</script>
