# 🚀 Portfolio — M. Dzaka Al Fikri

![React](https://img.shields.io/badge/React-18.2-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3-38bdf8?logo=tailwind-css)
![Vite](https://img.shields.io/badge/Vite-4.5-646cff?logo=vite)
![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?logo=supabase)

Sebuah website portofolio modern dan interaktif dibuat dengan React + TypeScript, Tailwind CSS, dan Supabase. Menyertakan panel admin untuk manajemen konten, inbox pesan bergaya Instagram, serta fitur CRUD untuk proyek, sertifikat, dan tech stack.

Live demo: https://dzakaal.github.io/Portofolio/

---

## ✨ Fitur utama

Untuk pengunjung:
- Tampilan responsif (mobile/tablet/desktop)
- Tema gelap (dark theme)
- Animasi halus dengan Framer Motion
- Menampilkan proyek, sertifikat, dan tech stack
- Form kontak dengan validasi dan pengiriman pesan

Untuk admin:
- Login aman (password berbasis env variable)
- Mode edit untuk memperbarui About, Portfolio, Contact secara real-time
- CRUD untuk proyek dan sertifikat (dengan upload gambar)
- Manajemen tech stack (ikon + warna + profisiensi)
- Inbox pesan bergaya Instagram dengan pencarian & filter
- Notifikasi (toast) dan dialog konfirmasi untuk operasi sensitif

---

## 🛠️ Teknologi

Frontend:
- React 18 + TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- Lucide (ikon)

Backend / Database:
- Supabase (Postgres, storage, RLS, realtime)

Dev & Tooling:
- ESLint, PostCSS
- GitHub Actions (CI/CD)
- GitHub Pages / Vercel / Netlify untuk deployment

---

## 📦 Persiapan & Instalasi (Singkat)

Sebelum mulai, pastikan Node.js ≥ 16 dan npm atau yarn sudah terpasang.

1. Clone repo
```bash
git clone https://github.com/DzakaAl/Portofolio.git
cd Portofolio
```

2. Install dependency
```bash
npm install
# atau
# yarn
```

3. Buat file `.env` di root (contoh minimal)
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_ADMIN_PASSWORD=your_admin_password
```
Jangan commit `.env` ke repository.

4. Jalankan development server
```bash
npm run dev
# atau
# yarn dev
```

5. Build untuk produksi
```bash
npm run build
# preview
npm run preview
```

---

## 🔧 Setup Supabase (singkat)

1. Buat project di https://supabase.com
2. Dari Project → API, salin URL & ANON KEY ke `.env`
3. Buat storage bucket `images` (public jika diperlukan) untuk menyimpan gambar proyek/sertifikat
4. Buat tabel sesuai kebutuhan: about_info, portfolio_projects, certificates, tech_stack, contact_info, contact_messages. Gunakan migration SQL atau dashboard SQL editor. Pastikan RLS policy dan role sesuai kalau menggunakan production.

Catatan: dokumentasi struktur tabel tersedia di folder `server/schema.sql` (jika ada). Jika menggunakan Supabase, gunakan UUID dan row-level security untuk production.

---

## 🗂️ Struktur proyek (ringkasan)
- public/ — aset statis (404.html, CV)
- src/
  - components/ — komponen React (About, Hero, Portfolio, AdminPanel, dll.)
  - config/ — konfigurasi Supabase
  - services/ — pemanggilan API / supabase
  - utils/ — utilitas (auth, image utils)
  - App.tsx, main.tsx
- server/ (opsional) — API backend / migration SQL
- .github/workflows/ — GitHub Actions deployment

---

## 🚀 Deployment

Pilihan deployment:
- GitHub Pages (dengan action yang ada): set `base` di `vite.config.ts` ke `/Portofolio/`
- Vercel / Netlify: atur environment variables di dashboard deployment

Contoh langkah singkat GitHub Pages:
1. Pastikan `vite.config.ts` berisi:
```ts
export default defineConfig({
  base: '/Portofolio/',
  // ...
})
```
2. Push ke `main` dan workflow akan build & deploy (jika workflow sudah terpasang).

---

## ✅ Petunjuk Admin singkat

- Login: klik ikon kunci di navbar → masukkan password yang sesuai `VITE_ADMIN_PASSWORD`
- Masuk ke Edit Mode → bisa mengubah konten langsung di UI → klik Save
- Kelola proyek/sertifikat melalui modal CRUD (upload gambar ke Supabase storage)

Catatan: Jangan gunakan password sederhana di production — gunakan sistem auth (JWT/Providers) untuk keamanan lebih baik.

---

## 💡 Tips & Troubleshooting

- Jika routing SPA di GitHub Pages bermasalah, pastikan `public/404.html` tersedia (redirect ke index.html).
- Jika gambar tidak muncul, periksa bucket storage & permission di Supabase.
- Cek console browser & network untuk error API.
- Untuk deployment CI, pastikan env variables ditambahkan pada Secrets repository.

---

## 📄 Lisensi

Project ini dilisensikan di bawah MIT License — lihat file LICENSE.

---

## 👤 Penulis

M. Dzaka Al Fikri  
- GitHub: https://github.com/DzakaAl  
- LinkedIn: https://www.linkedin.com/in/m-dzaka-al-fikri-7bba421a4/  
- Instagram: https://www.instagram.com/moredzl/  
- Email: dzakaal20@gmail.com

---

Jika Anda ingin, saya bisa:
- 1) Membuat versi README lengkap berbahasa Inggris juga, atau
- 2) Membuat file README yang berbeda untuk versi singkat / versi dokumentasi teknis, atau
- 3) Menyiapkan dan membuka PR yang menggantikan README.md di repo Anda dengan versi ini.

Beritahu saya mana yang Anda inginkan selanjutnya.
