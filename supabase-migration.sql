-- Migration Script untuk Update Schema
-- Jalankan di Supabase SQL Editor setelah menjalankan supabase-schema.sql

-- 1. Tambahkan kolom baru di tech_stack table (tanpa color)
ALTER TABLE tech_stack 
ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- Update comment untuk kolom icon
COMMENT ON COLUMN tech_stack.icon IS 'Menyimpan kode SVG lengkap, bukan URL';

-- Hapus kolom color jika ada (opsional, jika sudah ada sebelumnya)
-- ALTER TABLE tech_stack DROP COLUMN IF EXISTS color;

-- 2. Tambahkan kolom baru di certificates table (tanpa date_issued)
ALTER TABLE certificates 
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS verification_url TEXT,
ADD COLUMN IF NOT EXISTS skills TEXT,
ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- Update comment untuk kolom date
COMMENT ON COLUMN certificates.date IS 'Format string untuk display dan sorting (e.g., "Jan 2024", "January 2024", "2024-01")';

-- 3. Buat index untuk performa yang lebih baik
CREATE INDEX IF NOT EXISTS idx_certificates_created_at ON certificates(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tech_stack_display_order ON tech_stack(display_order ASC);

-- 4. Update data yang sudah ada (jika ada)
-- Jika ada data lama dengan icon berupa URL, Anda perlu menggantinya dengan SVG code secara manual

-- Contoh: Set default SVG untuk tech stack yang ada (opsional)
-- UPDATE tech_stack 
-- SET icon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/></svg>'
-- WHERE icon IS NULL OR icon = '';

-- Selesai!
-- Sekarang:
-- 1. tech_stack akan menyimpan kode SVG (bukan URL)
-- 2. certificates akan diurutkan berdasarkan parsing date string (client-side sorting)
