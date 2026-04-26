<template>
  <div
    class="relative rounded-2xl border cursor-pointer select-none transition-all duration-300 group overflow-hidden"
    :class="[
      done    ? 'surah-done'    : 'surah-pending',
      isSelected && !done ? 'surah-selected' : '',
      highlighted ? 'ring-4 ring-gold-400/40 scale-105 z-10' : '',
      done && !allowDelete ? 'cursor-default' : 'hover:-translate-y-1 hover:shadow-lg',
    ]"
    @click="handleClick"
  >
    <transition name="fade">
      <div
        v-if="highlighted"
        class="absolute inset-0 bg-gradient-to-r from-gold-300/20 to-yellow-300/20 dark:from-gold-400/10 dark:to-yellow-400/10 pointer-events-none rounded-2xl"
      ></div>
    </transition>

    <div
      class="absolute -top-6 -right-6 w-16 h-16 rounded-full blur-2xl transition-opacity duration-500 opacity-0 group-hover:opacity-40"
      :class="done ? 'bg-emerald-400' : isSelected ? 'bg-primary-400' : 'bg-slate-400'"
    ></div>

    <div class="p-4 relative z-10">
      <div class="flex items-center justify-between mb-3">
        <span
          class="text-[11px] font-bold font-mono px-2.5 py-1 rounded-lg transition-colors"
          :class="done
            ? 'bg-emerald-100/80 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300'
            : isSelected
              ? 'bg-primary-200/80 dark:bg-primary-800/80 text-primary-800 dark:text-primary-100'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'"
        >{{ surah.id || surah.nomor || '?' }}</span>

        <transition name="scale" mode="out-in">
          <span v-if="done" class="text-emerald-500 dark:text-emerald-400 text-base font-bold drop-shadow-sm">✓</span>
          <span v-else-if="isSelected" class="text-primary-500 text-base drop-shadow-sm">☑</span>
          <span v-else class="text-slate-300 dark:text-slate-600 text-sm group-hover:text-slate-400 transition-colors">○</span>
        </transition>
      </div>

      <p
        class="text-sm font-semibold leading-tight truncate transition-colors"
        :class="done
          ? 'text-emerald-900 dark:text-emerald-100'
          : isSelected
            ? 'text-primary-900 dark:text-primary-100'
            : 'text-slate-700 dark:text-slate-300 group-hover:text-primary-600'"
      >{{ surah.nama_latin || surah.nama || surah.surah_nama || '—' }}</p>

      <p
        v-if="surah.nama_arab || surah.nama_surah_arab"
        class="text-xs font-arabic mt-1 truncate"
        :class="done ? 'text-emerald-600/70 dark:text-emerald-400/70' : 'text-slate-400 dark:text-slate-500'"
        dir="rtl"
      >{{ surah.nama_arab || surah.nama_surah_arab }}</p>

      <p v-if="done && tglSetor" class="text-[10px] font-medium text-emerald-600/60 dark:text-emerald-400/60 mt-2 font-body flex items-center gap-1">
        <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
        {{ tglSetor }}
      </p>
    </div>

    <button
      v-if="done && allowDelete"
      @click.stop="$emit('delete', surah)"
      class="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300
             w-7 h-7 bg-red-500 hover:bg-red-600 dark:bg-red-500/90 dark:hover:bg-red-500
             text-white rounded-full flex items-center justify-center text-xs shadow-lg shadow-red-500/30 z-20"
      title="Batalkan setoran"
    >✕</button>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  surah:       { type: Object,  required: true },
  done:        { type: Boolean, default: false },
  isSelected:  { type: Boolean, default: false },
  highlighted: { type: Boolean, default: false },
  allowDelete: { type: Boolean, default: false },
})

const emit = defineEmits(['toggle', 'delete'])

const tglSetor = computed(() => {
  const tgl = props.surah.tgl_setoran || props.surah.tanggal
  if (!tgl) return ''
  try {
    const date = new Date(tgl)
    if (isNaN(date.getTime())) return tgl 
    return date.toLocaleDateString('id-ID', {
      day: 'numeric', month: 'short', year: 'numeric'
    })
  } catch {
    return tgl
  }
})

function handleClick() {
  if (!props.done) emit('toggle', props.surah.id || props.surah.id_surah || props.surah.nomor)
}
</script>