// src/composables/useToast.js
import { reactive } from 'vue'

const toasts = reactive([])
let _id = 0

export function useToast() {
  function add(type, title, message = '', duration = 4000) {
    const id = ++_id
    toasts.push({ id, type, title, message, leaving: false })

    setTimeout(() => dismiss(id), duration)
    return id
  }

  function dismiss(id) {
    const item = toasts.find(t => t.id === id)
    if (!item) return
    item.leaving = true
    setTimeout(() => {
      const idx = toasts.findIndex(t => t.id === id)
      if (idx !== -1) toasts.splice(idx, 1)
    }, 280)
  }

  const success = (title, msg, dur)  => add('success', title, msg, dur)
  const error   = (title, msg, dur)  => add('error',   title, msg, dur)
  const info    = (title, msg, dur)  => add('info',    title, msg, dur)

  return { toasts, success, error, info, dismiss }
}
