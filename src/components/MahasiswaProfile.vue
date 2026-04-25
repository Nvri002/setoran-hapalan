<template>
  <transition name="slide-up">
    <div v-if="info" class="card p-6 relative overflow-hidden transition-all duration-700"
         :class="setoranInfo.pct === 100 ? 'ring-2 ring-gold-400 shadow-xl shadow-gold-500/20' : ''">
      
      <div class="absolute -top-10 -right-10 w-48 h-48 rounded-full blur-3xl pointer-events-none transition-colors duration-700"
           :class="setoranInfo.pct === 100 ? 'bg-gold-400/10' : 'bg-primary-400/8'"></div>
      <div class="absolute -bottom-8 -left-8 w-36 h-36 rounded-full blur-2xl pointer-events-none transition-colors duration-700"
           :class="setoranInfo.pct === 100 ? 'bg-yellow-400/10' : 'bg-emerald-400/8'"></div>

      <div v-if="setoranInfo.pct === 100" class="absolute top-4 right-4 z-10">
        <span class="flex h-4 w-4 relative">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-4 w-4 bg-gold-500 shadow-sm"></span>
        </span>
      </div>

      <div class="relative flex flex-col md:flex-row items-center md:items-start gap-6 z-10">
        
        <div class="relative shrink-0 flex items-center justify-center">
          <svg class="w-[100px] h-[100px] transform -rotate-90 absolute">
            <circle cx="50" cy="50" r="46" stroke="currentColor" stroke-width="4" fill="transparent" 
                    class="text-slate-100 dark:text-slate-800" />
            <circle cx="50" cy="50" r="46" stroke="currentColor" stroke-width="4" fill="transparent"
                    :stroke-dasharray="289.02" 
                    :stroke-dashoffset="289.02 - (289.02 * setoranInfo.pct) / 100"
                    stroke-linecap="round" 
                    class="transition-all duration-1000 ease-out"
                    :class="setoranInfo.pct === 100 ? 'text-gold-400' : 'text-primary-500'" />
          </svg>

          <div class="w-[72px] h-[72px] rounded-2xl flex items-center justify-center shadow-lg relative z-10 transition-colors duration-700"
               :style="setoranInfo.pct === 100 ? 'background: linear-gradient(135deg, #fbbf24, #d97706)' : 'background: linear-gradient(135deg, #10b981, #059669)'">
            <span class="text-white font-display text-2xl font-bold select-none">{{ initials }}</span>
          </div>
          
          <span class="absolute bottom-3 right-3 w-4 h-4 rounded-full border-2 border-white dark:border-slate-900 animate-pulse-ring z-20"
                :class="setoranInfo.pct === 100 ? 'bg-gold-400' : 'bg-primary-400'"></span>
        </div>

        <div class="flex-1 min-w-0 text-center md:text-left w-full">
          <div class="flex items-center justify-center md:justify-start gap-2">
            <h2 class="font-display text-2xl font-bold text-slate-800 dark:text-slate-100 leading-tight truncate">
              {{ info.nama }}
            </h2>
            <span v-if="setoranInfo.pct === 100" class="text-2xl drop-shadow-md" title="Khatam!">🏆</span>
          </div>
          
          <p class="text-sm text-slate-400 dark:text-slate-500 font-mono mt-1">
            NIM: <span class="text-slate-600 dark:text-slate-300 font-semibold">{{ info.nim }}</span>
          </p>
          
          <div class="flex flex-wrap items-center justify-center md:justify-start gap-2 mt-3">
            <button
             @click="copyReport"
               class="btn-outline py-1 px-3 text-[10px] uppercase font-bold tracking-wider rounded-lg border-primary-200 text-primary-600 hover:bg-primary-50 dark:border-primary-900/50 dark:text-primary-400 dark:hover:bg-primary-900/20 shadow-sm"
              >
              📲 Salin Laporan WA
            </button>
            <span v-if="info.angkatan" class="badge-gray">📅 {{ info.angkatan }}</span>
            <span v-if="info.kelas"    class="badge-gray">🏫 Kelas {{ info.kelas }}</span>
            <span v-if="info.prodi"    class="badge-green text-[11px]">{{ info.prodi }}</span>
          </div>
        </div>
      </div>

      <div class="relative mt-8">
        <div class="flex items-end justify-between mb-2.5">
          <div>
            <p class="text-sm font-bold text-slate-700 dark:text-slate-200">Progress Hafalan</p>
            <p class="text-xs font-medium text-slate-400 dark:text-slate-500 mt-0.5">
              {{ setoranInfo.done }} dari {{ setoranInfo.total }} surah
            </p>
          </div>
          <span
            class="font-display text-4xl font-black tabular-nums leading-none tracking-tight transition-colors duration-700"
            :class="setoranInfo.pct === 100 ? 'text-gold-500' : setoranInfo.pct >= 50 ? 'text-primary-600 dark:text-primary-400' : 'text-slate-600 dark:text-slate-300'"
          >{{ setoranInfo.pct }}<span class="text-xl font-body font-bold text-slate-400">%</span></span>
        </div>

        <div class="progress-track h-3 bg-slate-100 dark:bg-slate-800/80 p-0.5 rounded-full">
          <div class="progress-bar-fill rounded-full" 
               :style="{ 
                 width: barWidth, 
                 background: setoranInfo.pct === 100 ? 'linear-gradient(90deg, #f59e0b, #fbbf24, #fcd34d)' : 'linear-gradient(90deg, #059669, #10b981, #34d399)',
                 boxShadow: setoranInfo.pct === 100 ? '0 0 10px rgba(251,191,36,.5)' : '0 0 10px rgba(16,185,129,.4)'
               }">
          </div>
        </div>

        <div class="flex justify-between mt-2 px-1">
          <span class="text-[10px] font-bold text-slate-300">0%</span>
          <span
            v-for="m in [25,50,75,100]" :key="m"
            class="text-[10px] font-bold transition-colors"
            :class="setoranInfo.pct >= m ? (setoranInfo.pct === 100 ? 'text-gold-500' : 'text-primary-500') : 'text-slate-300 dark:text-slate-600'"
          >{{ m }}%</span>
        </div>
      </div>

      <div v-if="info.dosen_pa" class="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800/50 flex items-center gap-3">
        <div class="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
          🎓
        </div>
        <div>
          <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Dosen Pembimbing Akademik</p>
          <p class="text-sm font-bold text-slate-700 dark:text-slate-200">{{ info.dosen_pa }}</p>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useToast } from '../composables/useToast.js'

const props = defineProps({
  info:        { type: Object, default: null },
  setoranInfo: { type: Object, default: () => ({ total: 0, done: 0, pct: 0 }) },
})

// Fungsi asli dipertahankan
const barWidth = ref('0%')
function animateBar() {
  barWidth.value = '0%'
  requestAnimationFrame(() => {
    setTimeout(() => { barWidth.value = `${props.setoranInfo.pct}%` }, 80)
  })
}

// Fungsi pembuat inisial asli dipertahankan
const initials = computed(() => {
  const n = props.info?.nama || ''
  return n.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase() || 'M'
})

watch(() => props.info, v => { if (v) animateBar() })
onMounted(() => { if (props.info) animateBar() })

const toast = useToast()
function copyReport() {
  if (!props.info) return
  
  const progress = `${props.setoranInfo.done}/${props.setoranInfo.total} Surah (${props.setoranInfo.pct}%)`
  const text = `*LAPORAN PROGRES SETORAN*\n\n` +
               `Nama: ${props.info.nama}\n` +
               `NIM: ${props.info.nim}\n` +
               `Progres: ${progress}\n` +
               `Dosen PA: ${props.info.dosen_pa}\n\n` +
               `_Dikirim via Dashboard Setoran_`

  navigator.clipboard.writeText(text)
    .then(() => {
      toast.success('Berhasil Disalin', 'Laporan siap di-paste ke WhatsApp')
    })
    .catch(() => {
      toast.error('Gagal Menyalin', 'Silakan coba lagi')
    })
}

</script>

<style scoped>
.progress-bar-fill {
  height: 100%;
  transition: width 1.2s cubic-bezier(0.34, 1.56, 0.64, 1); /* Efek bouncy saat animasi jalan */
}
</style>