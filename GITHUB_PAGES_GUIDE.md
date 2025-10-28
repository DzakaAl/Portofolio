# 🚀 Panduan Deploy ke GitHub Pages

## Metode 1: Auto Deploy dengan GitHub Actions (RECOMMENDED)

### Setup Awal:

1. **Push ke GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/USERNAME/REPO-NAME.git
   git push -u origin main
   ```

2. **Aktifkan GitHub Pages di Repository Settings:**
   - Buka repository di GitHub
   - Klik **Settings** → **Pages**
   - Di **Source**, pilih **GitHub Actions**
   - Klik **Save**

3. **Deploy Otomatis:**
   - Setiap kali Anda push ke branch `main`, website akan otomatis di-deploy
   - Proses build & deploy memakan waktu 2-5 menit
   - URL website: `https://USERNAME.github.io/REPO-NAME/`

### Update Website:
```bash
git add .
git commit -m "Update portfolio"
git push
```

---

## Metode 2: Manual Deploy dengan gh-pages

### Setup Awal:

1. **Install gh-pages:**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Update vite.config.ts:**
   Ganti `base: './'` menjadi `base: '/REPO-NAME/'`

3. **Deploy:**
   ```bash
   npm run deploy
   ```

### Update Website:
```bash
npm run deploy
```

---

## ⚙️ Konfigurasi untuk Backend API

Karena GitHub Pages hanya untuk static files (frontend only), ada 2 opsi untuk backend:

### Opsi 1: Deploy Backend Terpisah
- Frontend di GitHub Pages (gratis)
- Backend di:
  - **Railway** (https://railway.app) - Gratis dengan limit
  - **Render** (https://render.com) - Gratis dengan limit
  - **Vercel** (untuk API) - Gratis
  - **Heroku** (berbayar)

Update `.env.production`:
```env
VITE_API_URL=https://your-backend-url.railway.app/api
```

### Opsi 2: Gunakan Mock Data (Tanpa Backend)
Untuk portfolio sederhana tanpa admin panel, Anda bisa hardcode data di frontend.

---

## 🔧 Troubleshooting

### 404 Error saat Refresh
Tambahkan file `public/404.html` yang sama dengan `index.html`:
```bash
cp public/index.html public/404.html
```

### Gambar Tidak Muncul
Pastikan semua path gambar menggunakan relative path:
```tsx
// ✅ Benar
<img src="./assets/image.png" />

// ❌ Salah
<img src="/assets/image.png" />
```

### Routing Tidak Bekerja
Jika menggunakan React Router, pastikan:
- Gunakan `HashRouter` (lebih mudah untuk GitHub Pages)
- Atau gunakan `BrowserRouter` dengan 404.html trick

---

## 📝 Checklist Deploy

- [ ] Push semua perubahan ke GitHub
- [ ] Aktifkan GitHub Pages di Settings
- [ ] Pilih "GitHub Actions" sebagai source
- [ ] Tunggu deployment selesai (cek tab Actions)
- [ ] Buka `https://USERNAME.github.io/REPO-NAME/`
- [ ] Test semua fitur
- [ ] Update README.md dengan URL live demo

---

## 🌐 Custom Domain (Opsional)

Jika punya domain sendiri (misal: dzaka.com):

1. Tambahkan file `public/CNAME` dengan isi:
   ```
   dzaka.com
   ```

2. Di DNS provider, tambahkan CNAME record:
   ```
   www.dzaka.com → USERNAME.github.io
   ```

3. Di GitHub Settings → Pages, masukkan custom domain

---

## 📊 Monitoring

- **Build Status:** Cek tab "Actions" di GitHub
- **Live URL:** https://USERNAME.github.io/REPO-NAME/
- **Analytics:** Tambahkan Google Analytics jika perlu

---

## 🔄 Update Workflow

1. Edit kode lokal
2. Test dengan `npm run dev`
3. Commit & push:
   ```bash
   git add .
   git commit -m "Update feature X"
   git push
   ```
4. Tunggu auto-deploy selesai (~2-5 menit)
5. Refresh website

---

**🎉 Selamat! Portfolio Anda sekarang live di internet!**
