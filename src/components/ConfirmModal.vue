<template>
  <teleport to="body">
    <transition name="fade">
      <div
        v-if="show"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click.self="$emit('cancel')"
      >
        <div class="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm"></div>

        <transition name="scale">
          <div
            v-if="show"
            class="relative card p-6 max-w-sm w-full shadow-2xl animate-scale-in"
          >
            <div class="w-14 h-14 rounded-2xl bg-red-50 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
              <span class="text-3xl">⚠️</span>
            </div>

            <h3 class="font-display text-lg font-semibold text-center text-slate-800 dark:text-slate-100 mb-2">
              {{ title }}
            </h3>
            <p class="text-sm text-slate-500 dark:text-slate-400 text-center leading-relaxed mb-6">
              {{ message }}
            </p>

  
            <div class="flex gap-3">
              <button @click="$emit('cancel')" class="btn-outline flex-1">
                Batal
              </button>
              <button
                @click="$emit('confirm')"
                class="btn-danger flex-1"
                :disabled="loading"
              >
                <span v-if="loading" class="flex items-center gap-2">
                  <svg class="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Memproses...
                </span>
                <span v-else>{{ confirmLabel }}</span>
              </button>
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
defineProps({
  show:         { type: Boolean, default: false },
  title:        { type: String,  default: 'Konfirmasi' },
  message:      { type: String,  default: 'Apakah Anda yakin?' },
  confirmLabel: { type: String,  default: 'Ya, Lanjutkan' },
  loading:      { type: Boolean, default: false },
})
defineEmits(['confirm', 'cancel'])
</script>
