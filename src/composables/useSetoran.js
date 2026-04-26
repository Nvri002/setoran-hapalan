// src/composables/useSetoran.js
import { ref, computed } from 'vue'
import { setoranApi } from '../services/api.js'

export function useSetoran(toast) {
  const nim         = ref('')
  const data        = ref(null)   
  const loading     = ref(false)
  const submitting  = ref(false)
  const deleting    = ref(false)
  const error       = ref(null)
  const searched    = ref(false)
  const selected    = ref(new Set())  
  const highlight   = ref(new Set())  
  const filterQuery = ref('')
  const filterTab   = ref('all')      
  const sortBy      = ref('nomor')    

  function isDone(s) {
    return s.sudah_setor === true || s.sudah_setor === 1 ||
           s.status === 'setor'   || s.status === true ||
           (s.info_setoran !== null && s.info_setoran !== undefined)
  }

  function getSurahById(id) {
    return allSurah.value.find(s => (s.id || s.id_surah || s.nomor) === id)
  }

  function flashHighlight(ids) {
    ids.forEach(id => highlight.value.add(id))
    setTimeout(() => ids.forEach(id => highlight.value.delete(id)), 2500)
  }

  const info = computed(() => {
    const d = data.value
    if (!d) return null

    let namaDosen = '—'
    const rawDosen = d.dosen_pa || d.info?.dosen_pa
    
    if (typeof rawDosen === 'object' && rawDosen !== null) {
      namaDosen = rawDosen.nama || '—'
    } else if (typeof rawDosen === 'string' && rawDosen.startsWith('{')) {
      try { 
        namaDosen = JSON.parse(rawDosen).nama 
      } catch { 
        namaDosen = rawDosen 
      }
    } else if (typeof rawDosen === 'string') {
      namaDosen = rawDosen
    }

    return {
      nama:    d.nama     || d.info?.nama     || '—',
      nim:     d.nim      || d.info?.nim      || nim.value,
      angkatan:d.angkatan || d.info?.angkatan || '',
      kelas:   d.kelas    || d.info?.kelas    || '',
      prodi:   d.prodi    || d.info?.prodi    || d.program_studi || '',
      email:   d.email    || d.info?.email    || '',
      dosen_pa:namaDosen,
    }
  })

  const allSurah = computed(() => {
    const det = data.value?.setoran?.detail
    return Array.isArray(det) ? det : []
  })

  const doneSurah = computed(() => allSurah.value.filter(s => isDone(s)))
  const pendingSurah = computed(() => allSurah.value.filter(s => !isDone(s)))

  const setoranInfo = computed(() => {
    const total = allSurah.value.length
    const done  = doneSurah.value.length
    const pct   = total > 0 ? Math.round((done / total) * 100) : 0

    return { total, done, pct }
  })

  const filteredSurah = computed(() => {
    let list = [...allSurah.value]

    if (filterTab.value === 'done')    list = list.filter(s => isDone(s))
    if (filterTab.value === 'pending') list = list.filter(s => !isDone(s))

    const q = filterQuery.value.trim().toLowerCase()
    if (q) list = list.filter(s =>
      (s.nama_latin || s.nama || '').toLowerCase().includes(q) ||
      (s.nama_arab  || '').includes(q) ||
      String(s.id || s.nomor || '').includes(q)
    )

    return list.sort((a, b) => {
      if (sortBy.value === 'nama') {
        const nameA = a.nama_latin || a.nama || ''
        const nameB = b.nama_latin || b.nama || ''
        return nameA.localeCompare(nameB)
      }
      if (sortBy.value === 'terbaru') {
        const dateA = new Date(a.info_setoran?.tgl_setoran || 0)
        const dateB = new Date(b.info_setoran?.tgl_setoran || 0)
        return dateB - dateA
      }
      return (parseInt(a.external_id || a.nomor || a.id) || 0) - (parseInt(b.external_id || b.nomor || b.id) || 0)
    })
  })

  const canPost = computed(() => selected.value.size > 0 && !submitting.value)

  async function fetch(nimVal) {
    const n = (nimVal || nim.value).trim()
    nim.value    = n
    loading.value = true
    error.value   = null
    searched.value = true
    selected.value.clear()
    try {
      const res     = await setoranApi.get(n)
      data.value    = res?.data || res
      } catch (e) {
    data.value  = null
    error.value = _errMsg(e)
    throw e   // 
  } finally {
    loading.value = false
  }
  }

  async function simpanSetoran() {
    if (!selected.value.size) return
    submitting.value = true
    const ids = [...selected.value]
    const payload = {
      data_setoran: ids.map(id => {
        const s = getSurahById(id)
        return {
          nama_komponen_setoran: s?.nama_latin || s?.nama || String(id),
          id_komponen_setoran: id
        }
      })
    }
    try {
      await setoranApi.post(nim.value, payload)
      toast?.success('Setoran Berhasil', `${ids.length} surah berhasil disimpan`)
      selected.value.clear()
      await fetch()
      flashHighlight(ids)
    } catch (e) {
      toast?.error('Gagal Menyimpan', _errMsg(e))
    } finally {
      submitting.value = false
    }
  }

  async function batalkanSetoran(surahItems) {
    if (!surahItems?.length) return

    deleting.value = true

    try {
      const detailSetoran = data.value?.setoran?.detail || []

      const payload = {
        data_setoran: surahItems.map(item => {
          const original = detailSetoran.find(d => d.id === item.id)

          if (!original) {
            console.warn("Data tidak ditemukan di API untuk:", item)
            return null
          }

          const uuidSetoran = original.info_setoran?.id;

          if (!uuidSetoran) {
             console.warn(`⚠️ UUID tidak ditemukan untuk ${original.nama}. Apakah surah ini sudah disetor?`, original);
             return null;
          }

          return {
            id: uuidSetoran,
            id_komponen_setoran: original.id,
            nama_komponen_setoran: original.nama
          }
        }).filter(Boolean)
      }

      if (!payload.data_setoran.length) {
        toast?.error("Gagal", "Tidak ada UUID setoran valid yang ditemukan untuk dihapus.")
        return
      }

      await setoranApi.delete(nim.value, payload)

      toast?.success(
        "Setoran Dibatalkan",
        `${payload.data_setoran.length} surah berhasil dibatalkan`
      )

      await fetch()
      flashHighlight(payload.data_setoran.map(s => s.id_komponen_setoran))

    } catch (e) {
      console.error("DELETE ERROR:", e.response?.data || e)
      toast?.error("Gagal Membatalkan", _errMsg(e))
    } finally {
      deleting.value = false
    }
  }

  const copyReport = () => {
    if (!info.value) return
    const text = `*LAPORAN PROGRES SETORAN*\n\nNama: ${info.value.nama}\nNIM: ${info.value.nim}\nProgres: ${setoranInfo.value.done}/${setoranInfo.value.total} Surah (${setoranInfo.value.pct}%)\nDosen PA: ${info.value.dosen_pa}\n\n_Dikirim via Dashboard Setoran_`
    navigator.clipboard.writeText(text)
    toast?.success('Berhasil Disalin', 'Laporan siap di-paste ke WhatsApp')
  }

  function clearData() {
    data.value = null; error.value = null
    nim.value = ''; searched.value = false
    selected.value.clear(); filterQuery.value = ''
    filterTab.value = 'all'
  }

  function toggleSelect(id) {
    if (selected.value.has(id)) selected.value.delete(id)
    else selected.value.add(id)
  }

  function _errMsg(e) {
    const status = e.response?.status
    const msg    = e.response?.data?.message || e.response?.data?.error || e.message
    if (status === 401) return 'Sesi berakhir. Mencoba refresh token...'
    if (status === 403) return 'Akses ditolak. Periksa hak akses akun Anda.'
    if (status === 404) return `Mahasiswa dengan NIM ${nim.value} tidak ditemukan.`
    if (status === 422) return `Data tidak valid: ${msg}`
    if (status >= 500)  return 'Server error. Silakan coba beberapa saat lagi.'
    return msg || 'Terjadi kesalahan. Silakan coba lagi.'
  }

  return {
    nim, data, loading, submitting, deleting, error, searched,
    selected, highlight, filterQuery, filterTab, sortBy,
    info, setoranInfo, allSurah, filteredSurah, doneSurah, pendingSurah, canPost,
    isDone, fetch, simpanSetoran, batalkanSetoran, copyReport, clearData, toggleSelect,
  }
}