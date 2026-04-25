<template>
  <aside class="hidden xl:block w-72 shrink-0 space-y-5">
    <!-- Profil Dosen -->
    <div
      v-if="dosenInfo && dosenInfo.nama"
      class="card p-5 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/20 border-emerald-200 dark:border-emerald-800 animate-fade-in"
    >
      <div class="flex items-center gap-3 mb-4">
        <div
          class="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white font-bold text-lg shadow-md"
        >
          {{ dosenInfo.nama.charAt(0).toUpperCase() }}
        </div>
        <div>
          <h3 class="font-display text-sm font-semibold text-emerald-800 dark:text-emerald-200 truncate">
            {{ dosenInfo.nama }}
          </h3>
          <p class="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">
            NIP: {{ dosenInfo.nip || '–' }}
          </p>
        </div>
      </div>
      <div class="text-xs text-slate-500 dark:text-slate-400 space-y-1">
        <div class="flex items-center gap-2">
          <span>📧</span>
          <span class="truncate">{{ dosenInfo.email || '–' }}</span>
        </div>
      </div>
    </div>

    <!-- Riwayat Pencarian -->
    <div class="card p-5">
      <div class="flex items-center justify-between mb-4">
        <h3 class="font-display text-sm font-semibold text-slate-700 dark:text-slate-200">
          📋 Riwayat Pencarian
        </h3>
        <button
          v-if="history.length"
          @click="$emit('clear-history')"
          class="text-[10px] text-slate-400 hover:text-red-500 transition-colors uppercase font-bold"
        >
          Hapus
        </button>
      </div>

      <div v-if="history.length === 0" class="py-6 text-center">
        <p class="text-xs text-slate-400">Belum ada riwayat</p>
      </div>

      <ul v-else class="space-y-2 max-h-60 overflow-y-auto pr-1">
        <li
          v-for="(item, i) in history"
          :key="i"
          @click="$emit('search', item.nim)"
          class="flex items-center gap-3 p-2 rounded-xl cursor-pointer
                 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group"
        >
          <div class="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 font-bold text-xs shrink-0">
            {{ item.nim.slice(-2) }}
          </div>
          <div class="min-w-0 flex-1">
            <p class="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">
              {{ item.nama || item.nim }}
            </p>
            <p class="text-[10px] text-slate-400 font-mono">
              {{ item.nim }}
            </p>
          </div>
          <span class="text-[10px] text-slate-300 group-hover:text-emerald-500 transition-colors">🔍</span>
        </li>
      </ul>
    </div>

    <!-- Tips -->
    <div class="card p-5 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200 dark:border-amber-800">
      <h3 class="font-display text-sm font-semibold text-amber-800 dark:text-amber-200 mb-3 flex items-center gap-2">
        💡 Tips
      </h3>
      <ol class="text-xs text-amber-700 dark:text-amber-300 space-y-2 list-decimal list-inside leading-relaxed">
        <li>Masukkan NIM atau nama mahasiswa di kolom pencarian.</li>
        <li>Centang surah yang <strong>belum</strong> disetor, lalu klik <strong>Simpan Setoran</strong>.</li>
        <li>Gunakan <strong>Mode Hapus</strong> untuk membatalkan setoran.</li>
        <li>Klik nama/NIM di riwayat untuk melihat kembali.</li>
      </ol>
    </div>
  </aside>
</template>

<script setup>
defineProps({
  history:    { type: Array, default: () => [] },
  dosenInfo:  { type: Object, default: null }
})
defineEmits(['search', 'clear-history'])
</script>