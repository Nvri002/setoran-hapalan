# 📖 Setoran Hafalan v2 — TIF UIN Suska Riau

Dashboard hafalan mahasiswa berbasis **Vue 3 + Vite + Tailwind CSS** dengan fitur lengkap GET / POST / DELETE dan Dark Mode.

---

## 🚀 Cara Menjalankan

```bash
cd setoran-hafalan-v2
npm install
npm run dev
# → http://localhost:3000
```

---

## 📁 Struktur Proyek

```
setoran-hafalan-v2/
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── package.json
└── src/
    ├── main.js
    ├── App.vue
    ├── style.css
    ├── services/
    │   ├── auth.js          ← Keycloak login/refresh (password & refresh_token grant)
    │   └── api.js           ← Axios instance + interceptor 401-retry queue
    ├── composables/
    │   ├── useAuth.js       ← Auto-login state saat app dibuka
    │   ├── useSetoran.js    ← GET / POST / DELETE + semua state
    │   ├── useToast.js      ← Global toast notification manager
    │   └── useDarkMode.js   ← Dark mode toggle + localStorage persist
    └── components/
        ├── Dashboard.vue        ← Layout utama + orchestrator
        ├── MahasiswaProfile.vue ← Card profil + animated progress bar
        ├── SurahList.vue        ← Grid surah + filter + selection bar
        ├── SurahCard.vue        ← Card individual surah (done/pending/selected)
        ├── ConfirmModal.vue     ← Modal konfirmasi sebelum DELETE
        ├── DarkModeToggle.vue   ← Tombol toggle dark/light
        ├── SkeletonLoader.vue   ← Skeleton loading state
        └── ToastContainer.vue   ← Toast notification overlay
```

---

## ✨ Fitur Lengkap

| Fitur | Detail |
|---|---|
| 🔐 Auto Login | Login otomatis ke Keycloak saat pertama buka |
| 🔄 Auto Refresh Token | Proaktif refresh 15 detik sebelum expired |
| 🚦 Interceptor Queue | Request antre saat refresh, retry setelah token baru |
| 📊 GET Data | Fetch profil mahasiswa + progres setoran |
| 💾 POST Setoran | Pilih beberapa surah → klik Simpan → auto-refresh |
| 🗑 DELETE Setoran | Mode hapus → hover card → konfirmasi modal → auto-refresh |
| 🔍 Filter & Search | Cari nama surah, filter tab Semua/Selesai/Belum |
| 🌙 Dark Mode | Toggle + simpan preferensi di localStorage |
| 💀 Skeleton Loading | Skeleton card saat fetch berlangsung |
| 🍞 Toast Notifications | Success / Error toast dengan auto-dismiss |
| ✨ Micro Interactions | Hover effect, progress animation, highlight flash |
| 📱 Responsive | Mobile-first, grid adaptif 2→5 kolom |

---

## 🔧 API yang Digunakan

### Auth (Keycloak)
```
POST https://id.tif.uin-suska.ac.id/realms/dev/protocol/openid-connect/token
```
- `grant_type: password` → untuk login awal
- `grant_type: refresh_token` → untuk perpanjang sesi

### API Utama
```
Base: https://api.tif.uin-suska.ac.id/setoran-dev/v1

GET    /mahasiswa/setoran/:nim  → data mahasiswa + progress
POST   /mahasiswa/setoran/:nim  → simpan setoran surah
DELETE /mahasiswa/setoran/:nim  → batalkan setoran surah
```

---

## 🛡️ Penanganan Error

| Kode | Penanganan |
|---|---|
| 401 | Auto refresh token → retry request (via interceptor queue) |
| 403 | Tampilkan pesan "Akses ditolak" |
| 404 | Tampilkan pesan "NIM tidak ditemukan" |
| 422 | Tampilkan detail validasi dari server |
| 5xx | Tampilkan pesan server error |
| Network | Tampilkan pesan koneksi gagal |
