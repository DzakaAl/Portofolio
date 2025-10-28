# Deploy Portfolio ke GitHub Pages - Panduan Lengkap

## 📋 Persiapan (5 menit)

### 1. Install Git (jika belum)
Download dari: https://git-scm.com/download/win

Cek apakah sudah terinstall:
```powershell
git --version
```

### 2. Buat GitHub Repository
1. Buka https://github.com/new
2. Repository name: **dzaka-portfolio** (atau nama lain)
3. **Public** (harus public untuk GitHub Pages gratis)
4. **JANGAN** centang "Add README" atau "Add .gitignore"
5. Klik **Create repository**

---

## 🚀 Deployment Steps (10 menit)

### Step 1: Setup Git di Project

Buka PowerShell di folder project (`d:\Project\Portofolio\dzaka-react-portfolio`), lalu jalankan:

```powershell
# Initialize git repository
git init

# Set nama dan email (ganti dengan data Anda)
git config user.name "Your Name"
git config user.email "your-email@example.com"

# Add all files
git add .

# Commit pertama
git commit -m "Initial commit - Portfolio with Supabase"
```

### Step 2: Connect ke GitHub

**Ganti `YOUR_USERNAME` dan `YOUR_REPO_NAME` dengan yang sesuai!**

```powershell
# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Set main branch
git branch -M main

# Push ke GitHub
git push -u origin main
```

**CATATAN**: Jika diminta login:
- Username: GitHub username Anda
- Password: Gunakan **Personal Access Token** (bukan password biasa)
  - Buat token di: https://github.com/settings/tokens
  - Pilih: **Generate new token (classic)**
  - Centang: `repo` (full control)
  - Copy token dan paste sebagai password

### Step 3: Setup GitHub Pages

1. Buka repository Anda di GitHub: `https://github.com/YOUR_USERNAME/YOUR_REPO_NAME`
2. Klik tab **Settings**
3. Scroll ke **Pages** di sidebar kiri
4. Di **Source**, pilih: **GitHub Actions**
5. Selesai! (workflow sudah ada di `.github/workflows/deploy.yml`)

### Step 4: Trigger Deployment

Deployment akan otomatis berjalan setiap kali push ke branch `main`. 

**Cara manual trigger:**
1. Buka tab **Actions** di GitHub repository
2. Pilih workflow **Deploy to GitHub Pages**
3. Klik **Run workflow** > **Run workflow**

### Step 5: Tunggu Build Selesai (2-5 menit)

1. Buka tab **Actions** di GitHub
2. Lihat progress build (akan muncul centang hijau jika sukses)
3. Jika ada error merah, klik untuk lihat log

### Step 6: Akses Website Live! 🎉

Website Anda akan live di:
```
https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/
```

Contoh:
- `https://dzaka.github.io/dzaka-portfolio/`

---

## 🔐 Setup Environment Variables di GitHub

Untuk keamanan, simpan Supabase credentials sebagai GitHub Secrets:

1. Buka **Settings** > **Secrets and variables** > **Actions**
2. Klik **New repository secret**
3. Tambahkan 2 secrets:

   **Secret 1:**
   - Name: `VITE_SUPABASE_URL`
   - Value: `https://irlxthqbabvmpkwdbdva.supabase.co`

   **Secret 2:**
   - Name: `VITE_SUPABASE_ANON_KEY`
   - Value: (copy dari file `.env.local` Anda)

**PENTING**: Secrets ini akan otomatis di-inject saat build via GitHub Actions!

---

## 🔄 Update Website (Setiap Kali Ada Perubahan)

Setiap kali Anda edit kode dan ingin update website:

```powershell
# Add perubahan
git add .

# Commit dengan pesan yang jelas
git commit -m "Update: deskripsi perubahan"

# Push ke GitHub (otomatis trigger deployment)
git push
```

**Tunggu 2-5 menit**, website akan otomatis update!

---

## ⚡ Quick Deploy Script

Saya sudah buatkan script otomatis! Jalankan file `deploy-github.ps1`:

```powershell
# Jalankan deploy script
.\deploy-github.ps1
```

Script ini akan otomatis:
1. Build project
2. Add semua perubahan
3. Commit dengan timestamp
4. Push ke GitHub
5. Website otomatis update!

---

## 🛠️ Troubleshooting

### Error: "Build failed"
**Solusi:**
1. Cek tab **Actions** di GitHub untuk lihat error detail
2. Biasanya karena:
   - TypeScript error (fix dengan `npm run build` di lokal dulu)
   - Missing dependencies (pastikan `package.json` lengkap)

### Error: "Page not found" atau "404"
**Solusi:**
1. Pastikan file `public/404.html` ada
2. Cek `vite.config.ts` punya `base: './'`
3. Tunggu 5-10 menit (cache DNS)

### Error: "Cannot push to GitHub"
**Solusi:**
```powershell
# Set upstream
git push --set-upstream origin main

# Atau force push (hati-hati!)
git push -f origin main
```

### Website blank atau error saat load
**Solusi:**
1. Buka Console browser (F12)
2. Cek error
3. Biasanya karena Supabase credentials belum di-setup di GitHub Secrets
4. Atau base URL salah di `vite.config.ts`

### Gambar tidak muncul
**Solusi:**
1. Pastikan gambar ada di Supabase Storage bucket "images"
2. Bucket harus **Public**
3. RLS policy harus allow upload (lihat `FIX_STORAGE_RLS.md`)

---

## 📊 Monitoring & Analytics

### Cek Status Deployment
- **GitHub Actions**: `https://github.com/YOUR_USERNAME/YOUR_REPO_NAME/actions`
- **Website Live**: `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`

### Tambah Google Analytics (Opsional)
1. Buat akun di https://analytics.google.com
2. Get tracking ID
3. Tambahkan di `index.html`:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

---

## 🎯 Next Steps

Setelah deploy berhasil:

1. ✅ **Test semua fitur** di website live
2. ✅ **Upload project real** via admin panel
3. ✅ **Upload certificates** via admin panel
4. ✅ **Update About section** dengan info real
5. ✅ **Ganti CV** di `public/CV_M_Dzaka_Al_Fikri.pdf`
6. ✅ **Share link** di LinkedIn, resume, dll!

---

## 📝 File Checklist

Pastikan file-file ini ada sebelum deploy:

- ✅ `.github/workflows/deploy.yml` - Auto-deploy workflow
- ✅ `vite.config.ts` - Config dengan `base: './'`
- ✅ `public/404.html` - Fallback untuk SPA routing
- ✅ `.env.local` - Supabase credentials (lokal only)
- ✅ `package.json` - Dependencies lengkap
- ✅ `supabase-schema.sql` - Database schema (sudah dijalankan)

---

## 🎉 Selamat!

Website portfolio Anda sekarang **LIVE** dan bisa diakses dari mana saja!

**Share link Anda:**
```
🌐 https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/
```

**Tips:**
- Update portfolio secara rutin dengan project baru
- Backup database di Supabase Dashboard
- Monitor traffic via GitHub Insights
- Customize domain (opsional): Settings > Pages > Custom domain

---

**Need Help?**
- GitHub Pages Docs: https://docs.github.com/pages
- Vite Deployment: https://vitejs.dev/guide/static-deploy.html
- Supabase Docs: https://supabase.com/docs
