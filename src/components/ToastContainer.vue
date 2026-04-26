<template>
  <teleport to="body">
    <div class="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
      <transition-group name="toast-list">
        <div
          v-for="t in toasts"
          :key="t.id"
          class="pointer-events-auto"
          :class="t.leaving ? 'animate-toast-out' : 'animate-toast-in'"
        >
          <div :class="[
            t.type === 'success' ? 'toast-success' :
            t.type === 'error'   ? 'toast-error'   : 'toast-info'
          ]">
            <span class="text-xl shrink-0 mt-0.5">
              {{ t.type === 'success' ? '✅' : t.type === 'error' ? '❌' : 'ℹ️' }}
            </span>
            <div class="flex-1 min-w-0">
              <p class="font-semibold text-sm leading-tight">{{ t.title }}</p>
              <p v-if="t.message" class="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">{{ t.message }}</p>
            </div>
            <button
              @click="dismiss(t.id)"
              class="shrink-0 text-slate-300 hover:text-slate-500 dark:hover:text-slate-300 transition-colors ml-1"
            >
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        </div>
      </transition-group>
    </div>
  </teleport>
</template>

<script setup>
import { useToast } from '../composables/useToast.js'
const { toasts, dismiss } = useToast()
</script>

<style scoped>
.toast-list-enter-active { animation: toastIn .35s cubic-bezier(.34,1.56,.64,1); }
.toast-list-leave-active { animation: toastOut .25s ease-in forwards; position: absolute; }
.toast-list-move { transition: transform .25s ease; }

@keyframes toastIn  { from { opacity:0; transform:translateX(110%); } to { opacity:1; transform:translateX(0); } }
@keyframes toastOut { from { opacity:1; transform:translateX(0); }    to { opacity:0; transform:translateX(110%); } }
</style>
