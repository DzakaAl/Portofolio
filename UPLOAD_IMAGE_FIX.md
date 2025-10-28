# 🖼️ Cara Mengatasi Error Upload Gambar

## Masalah yang Mungkin Terjadi:

### 1️⃣ **Bucket 'images' Belum Dibuat**

**Error:** "Bucket not found" atau upload gagal

**Solusi:**

1. Buka Supabase Dashboard: https://app.supabase.com
2. Pilih project Anda (irlxthqbabvmpkwdbdva)
3. Klik **Storage** di sidebar kiri
4. Klik **New bucket**
5. Isi:
   - **Name:** `images`
   - **Public bucket:** ✅ **CENTANG INI** (penting!)
   - **File size limit:** 50 MB (atau sesuai kebutuhan)
6. Klik **Create bucket**

✅ **Selesai!** Upload gambar sekarang harusnya berfungsi.

---

### 2️⃣ **Bucket Tidak Public**

**Error:** Gambar ter-upload tapi tidak bisa diakses (403 Forbidden)

**Solusi:**

1. Di Supabase Storage, klik bucket `images`
2. Klik **Settings** (icon ⚙️)
3. Pastikan **Public bucket** = **ON**
4. Save

---

### 3️⃣ **Fallback ke Base64 (Temporary)**

Jika Supabase Storage belum ready, sistem otomatis pakai **base64** (gambar disimpan langsung di database).

**Cara kerja:**
- ✅ Gambar tetap bisa di-upload
- ⚠️ Gambar disimpan sebagai base64 string (ukuran lebih besar)
- ℹ️ Lihat console browser untuk pesan "Using base64 fallback"

**Untuk production:**
- Aktifkan Supabase Storage (buat bucket)
- Gambar akan tersimpan di cloud dengan URL public

---

### 4️⃣ **RLS (Row Level Security) Issue**

**Error:** "new row violates row-level security policy"

**Solusi:**

Jalankan di Supabase SQL Editor:

```sql
-- Allow public upload to storage bucket
CREATE POLICY "Allow public uploads"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'images');

-- Allow public read
CREATE POLICY "Allow public reads"
ON storage.objects
FOR SELECT
USING (bucket_id = 'images');
```

---

## 🔧 Quick Fix (Step-by-Step):

### **Opsi 1: Create Bucket (Recommended)**

1. **Buka:** https://app.supabase.com/project/irlxthqbabvmpkwdbdva/storage
2. **Klik:** New bucket
3. **Name:** images
4. **Public:** ✅ ON
5. **Create**

### **Opsi 2: Pakai Base64 (Temporary)**

Sistem sudah otomatis fallback ke base64 jika bucket belum dibuat. Tidak perlu action apapun, tapi untuk production sebaiknya pakai bucket.

---

## 🧪 Test Upload:

1. Refresh browser (Ctrl + Shift + R)
2. Login sebagai admin
3. Coba upload gambar di:
   - **About section** (profile image)
   - **Portfolio** (project image)
   - **Certificate** (certificate image)

---

## 📊 Monitoring Upload:

Buka **Browser Console** (F12) saat upload untuk lihat:
- ✅ "Uploaded successfully" = Berhasil ke Supabase
- ⚠️ "Using base64 fallback" = Fallback, buat bucket dulu
- ❌ Error message = Ada masalah, screenshot error untuk debug

---

## 🎯 Storage Limits (Free Tier):

- **Storage:** 1GB
- **Bandwidth:** 2GB/month
- **File size:** 50MB per file

Cukup untuk portfolio! 🎉

---

**Status Supabase Anda:**
- ✅ URL: Configured
- ✅ Key: Configured
- ⚠️ Bucket: Perlu dibuat manual (images)
