<template>
  <div class="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
    <!-- Header -->
    <header class="sticky top-0 z-40 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl
                   border-b border-slate-200/80 dark:border-slate-800/80 shadow-sm transition-colors duration-300">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
        <div class="flex items-center gap-3 min-w-0">
          <div class="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30 shrink-0"
               style="background: linear-gradient(135deg,#10b981,#047857)">
            <span class="text-base leading-none text-white">📖</span>
          </div>
          <div class="min-w-0">
            <h1 class="font-display text-sm font-bold text-slate-800 dark:text-slate-100 leading-tight truncate tracking-tight">
              Setoran Hafalan <span class="text-emerald-500">v2</span>
            </h1>
            <p class="text-[10px] text-slate-400 dark:text-slate-500 hidden sm:block">TIF UIN Suska Riau</p>
          </div>
        </div>

        <div class="flex items-center gap-2 shrink-0">
          <button
            v-if="data"
            @click="handleClearData"
            class="btn-ghost py-1.5 text-xs hidden sm:flex hover:bg-slate-100 dark:hover:bg-slate-800"
            title="Cari mahasiswa lain"
          >
            ↩ Ganti NIM
          </button>

          <button
            @click="logout"
            class="btn-ghost py-1.5 text-xs hover:bg-slate-100 dark:hover:bg-slate-800"
            title="Logout"
          >
            🚪 Keluar
          </button>

          <DarkModeToggle />
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <div class="flex-1 flex justify-center">
      <div class="flex w-full max-w-7xl gap-6 px-4 sm:px-6 py-8">
        <main class="flex-1 min-w-0 space-y-6">
<!-- Card Pencarian Hijau -->
<div class="card p-5 bg-gradient-to-br from-emerald-600 to-teal-700 border-none shadow-xl shadow-emerald-500/20 text-white relative">
  <h2 class="font-display text-xl font-bold mb-1">
    Cek Progress Setoran
  </h2>
  <p class="text-sm text-emerald-100/80 mb-4">
    Masukkan NIM atau nama mahasiswa untuk melihat data hafalan
  </p>

  <div class="flex flex-col sm:flex-row gap-3">
    <SearchInput
      :items="mahasiswaList"
      placeholder="Ketik NIM atau nama mahasiswa..."
      :disabled="loading"
      @select="onNimSelected"
    />
    <button
      @click="onSearch()"
      :disabled="loading || !nim.trim()"
      class="bg-white text-emerald-700 font-bold px-5 py-2.5 rounded-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100 shadow-md whitespace-nowrap"
    >
      <span v-if="loading" class="flex items-center gap-2">
        <svg class="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
        Mencari...
      </span>
      <span v-else>🔍 Cari Data</span>
    </button>
  </div>
</div>

          <!-- Error -->
          <transition name="scale">
            <div
              v-if="error"
              class="card px-5 py-4 flex items-start gap-3
                     bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800"
            >
              <span class="text-red-400 text-xl shrink-0 mt-0.5">⚠️</span>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-bold text-red-700 dark:text-red-400">Terjadi Kesalahan</p>
                <p class="text-sm text-red-500 dark:text-red-500 mt-0.5">{{ error }}</p>
              </div>
              <button @click="error = null" class="text-red-300 hover:text-red-500 transition-colors shrink-0">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
          </transition>

          <!-- Loading Skeleton -->
          <div v-if="loading" class="mt-6">
            <SkeletonLoader />
          </div>

          <!-- Data Mahasiswa -->
          <template v-else-if="data">
            <!-- Statistik -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 animate-slide-up">
              <div class="card p-5 group hover:border-emerald-400 transition-all cursor-default relative overflow-hidden">
                <p class="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Total Wajib</p>
                <h3 class="text-3xl font-black text-slate-700 dark:text-white mt-1">{{ setoranInfo.total }}</h3>
                <div class="absolute -right-2 -bottom-2 text-6xl opacity-5 group-hover:opacity-10 transition-opacity">📚</div>
              </div>
              
              <div class="card p-5 group border-emerald-500/20 bg-emerald-500/[0.03] relative overflow-hidden">
                <p class="text-emerald-500 text-[10px] font-bold uppercase tracking-wider">Sudah Setor</p>
                <h3 class="text-3xl font-black text-emerald-600 mt-1">{{ setoranInfo.done }}</h3>
                <div class="absolute -right-2 -bottom-2 text-6xl opacity-10 text-emerald-500">✅</div>
              </div>
              
              <div class="card p-5 group hover:border-orange-400 transition-all relative overflow-hidden">
                <p class="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Belum Setor</p>
                <h3 class="text-3xl font-black text-slate-700 dark:text-white mt-1">{{ setoranInfo.total - setoranInfo.done }}</h3>
                <div class="absolute -right-2 -bottom-2 text-6xl opacity-5 group-hover:opacity-10 transition-opacity">⏳</div>
              </div>
            </div>

            <!-- Profil Mahasiswa -->
            <MahasiswaProfile :info="info" :setoran-info="setoranInfo" class="mt-6" />

            <!-- Daftar Surah -->
            <SurahList
              class="mt-6"
              :filtered-surah="filteredSurah"
              :done-surah="doneSurah"
              :pending-surah="pendingSurah"
              :selected="selected"
              :highlight="highlight"
              :submitting="submitting"
              :filter-query="filterQuery"
              :filter-tab="filterTab"
              :is-done="isDone"
              @update:filterQuery="filterQuery = $event"
              @update:filterTab="filterTab = $event"
              @toggle="toggleSelect"
              @simpan="onSimpan"
              @delete="onDeleteRequest"
            />

            <!-- Tombol Ganti Mahasiswa -->
            <div class="flex justify-center pt-8 pb-4">
              <button @click="handleClearData" class="btn-ghost text-xs gap-2 rounded-full bg-slate-100 dark:bg-slate-800">
                <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="1 4 1 10 7 10"/>
                  <path d="M3.51 15a9 9 0 1 0 .49-3.5"/>
                </svg>
                Cari Mahasiswa Lain
              </button>
            </div>
          </template>

          <!-- State Awal (sebelum cari) -->
          <div v-else-if="!searched" class="text-center py-20">
            <div class="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/20 rounded-3xl flex items-center justify-center mx-auto mb-5 animate-float border border-emerald-100 dark:border-emerald-800/30">
              <span class="text-4xl">📚</span>
            </div>
            <p class="font-display text-lg font-bold text-slate-700 dark:text-slate-200 mb-2">
              Mulai Cek Hafalan
            </p>
            <p class="text-sm text-slate-500 max-w-xs mx-auto leading-relaxed">
              Masukkan NIM mahasiswa di atas untuk melihat progress setoran hafalan Al-Qur'an
            </p>
          </div>
        </main>

        <!-- Side Panel Kanan -->
        <SidePanel
          :history="searchHistory"
          :dosen-info="dosenInfo"
          @search="searchFromHistory"
          @clear-history="clearHistory"
        />
      </div>
    </div>

    <!-- Footer -->
    <footer class="py-6 text-center border-t border-slate-200/50 dark:border-slate-800/50 bg-white/30 dark:bg-slate-950/30 mt-auto">
      <p class="text-[10px] font-medium text-slate-400 uppercase tracking-widest">
        © {{ new Date().getFullYear() }} TIF UIN Suska Riau
      </p>
    </footer>

    <!-- Modal Konfirmasi -->
    <ConfirmModal
      :show="confirmModal.show"
      :title="confirmModal.title"
      :message="confirmModal.message"
      confirm-label="Batalkan Setoran"
      :loading="deleting"
      @confirm="onConfirmDelete"
      @cancel="confirmModal.show = false"
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useSetoran } from '../composables/useSetoran.js'
import { useToast }   from '../composables/useToast.js'
import { authService } from '../services/auth.js'
import { dosenApi } from '../services/api.js'

import DarkModeToggle   from './DarkModeToggle.vue'
import SkeletonLoader   from './SkeletonLoader.vue'
import MahasiswaProfile from './MahasiswaProfile.vue'
import SurahList        from './SurahList.vue'
import ConfirmModal     from './ConfirmModal.vue'
import SidePanel        from './SidePanel.vue'
import SearchInput      from './SearchInput.vue'

/* ── Toast ── */
const toast = useToast()

/* ── Setoran ── */
const {
  nim, data, loading, submitting, deleting, error, searched,
  selected, highlight, filterQuery, filterTab,
  info, setoranInfo, filteredSurah, doneSurah, pendingSurah,
  isDone, fetch, simpanSetoran, batalkanSetoran, clearData, toggleSelect,
} = useSetoran(toast)

/* ── Riwayat Pencarian ── */
const searchHistory = ref([])

function saveHistory(nimToSave) {
  const nama = info.value?.nama || ''
  searchHistory.value = searchHistory.value.filter(h => h.nim !== nimToSave)
  searchHistory.value.unshift({ nim: nimToSave, nama })
  if (searchHistory.value.length > 10) searchHistory.value.pop()
}

function clearHistory() {
  searchHistory.value = []
}

function searchFromHistory(nimHistory) {
  nim.value = nimHistory
  onSearch(nimHistory)
}

function handleClearData() {
  if (data.value && nim.value) {
    saveHistory(nim.value)
  }
  clearData()
}

/* ── Logout ── */
function logout() {
  authService.clear()
  window.location.reload()
}

/* ── Daftar Mahasiswa dari API ── */
const daftarMahasiswa = ref([])

const dosenInfo = ref({ nama: '', nip: '', email: '' })

async function fetchMahasiswaPa() {
  try {
    const res = await dosenApi.getPaSaya()
    if (res.response && res.data) {
      // Simpan data dosen
      dosenInfo.value = {
        nama: res.data.nama || '',
        nip: res.data.nip || '',
        email: res.data.email || ''
      }

      // Simpan daftar mahasiswa
      if (res.data.info_mahasiswa_pa?.daftar_mahasiswa) {
        daftarMahasiswa.value = res.data.info_mahasiswa_pa.daftar_mahasiswa.map(m => ({
          nim: m.nim,
          nama: m.nama,
          angkatan: m.angkatan,
          infoSetoran: m.info_setoran
        }))
      } else {
        daftarMahasiswa.value = []
      }
    } else {
      throw new Error('Data tidak valid')
    }
  } catch (e) {
    console.error('Gagal memuat data dosen & mahasiswa:', e)
    toast.error('Gagal memuat data', 'Silakan refresh halaman')
  }
}

/* ── Gabungan daftar mahasiswa (API + riwayat) ── */
const mahasiswaList = computed(() => {
  const map = new Map()
  daftarMahasiswa.value.forEach(m => map.set(m.nim, { nim: m.nim, nama: m.nama }))
  searchHistory.value.forEach(h => {
    if (!map.has(h.nim)) map.set(h.nim, { nim: h.nim, nama: h.nama || '' })
  })
  return Array.from(map.values())
})

/* ── Pencarian ── */
async function onSearch(nimValue) {
  const targetNim = typeof nimValue === 'string' ? nimValue.trim() : nim.value.trim()
  if (!targetNim) return
  selected.value.clear()
  try {
    await fetch(targetNim)
    if (!error.value) saveHistory(targetNim)
  } catch (e) {
    // error sudah ditangani di useSetoran
  }
}

function onNimSelected(selectedNim) {
  nim.value = selectedNim
  onSearch(selectedNim)
}

function onSimpan() {
  simpanSetoran()
}

/* ── Modal Konfirmasi Hapus ── */
const confirmModal = reactive({
  show: false, title: '', message: '', items: [],
})

function onDeleteRequest(surahItems) {
  const names = surahItems.map(s => s.nama_latin || s.nama || `Surah ${s.id}`).join(', ')
  confirmModal.title   = 'Batalkan Setoran?'
  confirmModal.message = `Setoran untuk "${names}" akan dibatalkan. Tindakan ini tidak dapat diurungkan.`
  confirmModal.items   = surahItems
  confirmModal.show    = true
}

async function onConfirmDelete() {
  await batalkanSetoran(confirmModal.items)
  confirmModal.show = false
  confirmModal.items = []
}

/* ── Mount ── */
onMounted(() => {
  fetchMahasiswaPa()
})
</script>