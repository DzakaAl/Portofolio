# Portfolio Fullstack (Next.js + MySQL + Socket.IO)

Website portfolio fullstack berbasis Next.js App Router dengan:

- Halaman publik (hero, about, portfolio, chat, contact)
- Admin panel untuk mengelola konten
- API route internal Next.js (tanpa backend terpisah)
- Realtime chat via Socket.IO pada custom server
- Penyimpanan data di MySQL

## Fitur Utama

### Publik

- Welcome/Hero section dinamis
- About, projects, certificates, tech stack
- Contact form ke database
- Realtime chat (Google OAuth)

### Admin

- Login admin berbasis JWT
- CRUD hero, about, projects, certificates, tech stack
- Kelola pesan masuk
- Visitor analytics
- Upload file (gambar/PDF)

## Stack Teknologi

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS + shadcn/ui
- NextAuth (Google provider)
- Socket.IO
- MySQL (mysql2)
- Framer Motion

## Struktur Proyek

```
.
├── server.js                # Custom Next.js server + Socket.IO
├── src/
│   ├── app/
│   │   ├── page.tsx         # Landing page
│   │   ├── admin/           # Admin pages
│   │   └── api/             # API routes (hero, projects, dll)
│   ├── components/
│   │   ├── sections/        # Public sections
│   │   ├── admin/           # Admin components
│   │   ├── reactbits/       # Animated components
│   │   └── ui/              # shadcn/ui primitives
│   ├── lib/
│   │   ├── db.ts            # MySQL connection pool
│   │   ├── auth.ts          # NextAuth options
│   │   ├── server-auth.ts   # JWT admin helper
│   │   ├── api.ts           # Frontend API client
│   │   └── socket.ts        # Socket client
│   └── types/
└── public/uploads/          # Runtime uploaded files
```

## Prasyarat

- Node.js 18+
- MySQL 8+

## Setup Lokal

1. Install dependency:

```bash
npm install
```

2. Siapkan file environment:

```bash
cp .env.example .env.local
```

Di Windows PowerShell:

```powershell
Copy-Item .env.example .env.local
```

3. Buat database MySQL:

```sql
CREATE DATABASE portofolio CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

4. Jalankan app:

```bash
npm run dev
```

5. Buka browser di:

http://localhost:3000

## Environment Variables

Semua variabel sudah disiapkan di file .env.example.

| Variable | Wajib | Keterangan |
| --- | --- | --- |
| DB_HOST | Ya | Host MySQL |
| DB_USER | Ya | User MySQL |
| DB_PASSWORD | Ya | Password MySQL |
| DB_NAME | Ya | Nama database (default: portofolio) |
| DB_PORT | Tidak | Port MySQL (default: 3306) |
| NEXTAUTH_URL | Ya | URL aplikasi (misal: http://localhost:3000) |
| NEXTAUTH_SECRET | Ya | Secret NextAuth |
| GOOGLE_CLIENT_ID | Ya (untuk chat login) | OAuth client id |
| GOOGLE_CLIENT_SECRET | Ya (untuk chat login) | OAuth client secret |
| JWT_SECRET | Ya | Secret token admin |
| JWT_EXPIRE | Tidak | Masa berlaku token (default: 24h) |
| ADMIN_USERNAME | Ya | Username admin |
| ADMIN_PASSWORD | Ya | Password admin |
| NEXT_PUBLIC_API_URL | Tidak | Default sudah /api |
| NEXT_PUBLIC_SOCKET_URL | Tidak | URL socket server |
| HOSTNAME | Tidak | Host server (default: localhost) |
| PORT | Tidak | Port server (default: 3000) |
| UPLOAD_DIR | Tidak | Lokasi file upload |
| ALLOWED_ORIGINS | Tidak | Daftar origin CORS (pisahkan dengan koma) |

## Tabel Database yang Dipakai

Pastikan tabel berikut tersedia:

- hero_content
- about_content
- projects
- certificates
- tech_stack
- contact_info
- messages
- visitor_stats
- chat_messages

## Login Admin Default

Jika variabel env belum diisi, fallback login ada di API:

- Username: admin
- Password: admin123

Sebaiknya selalu override via .env.local sebelum deploy/upload.

## Script NPM

- npm run dev: jalankan custom server untuk development
- npm run build: build Next.js
- npm run start: jalankan production server
- npm run lint: lint project

## Panduan Upload ke GitHub

1. Pastikan file rahasia tidak ikut commit:

- .env
- .env.local
- file upload runtime di public/uploads

2. Cek status file sebelum commit:

```bash
git status
```

3. Jika file rahasia pernah terlanjur ter-track:

```bash
git rm --cached .env .env.local
git rm --cached -r public/uploads
```

4. Commit dan push:

```bash
git add .
git commit -m "docs: improve README and github upload guidance"
git branch -M main
git remote add origin https://github.com/USERNAME/REPO.git
git push -u origin main
```

## Catatan Deploy

- Project ini menggunakan custom server + MySQL + Socket.IO.
- Arsitektur ini tidak cocok untuk GitHub Pages static hosting.
- Workflow [.github/workflows/deploy.yml](.github/workflows/deploy.yml) saat ini masih pola build static lama (Vite/GitHub Pages). Sesuaikan atau nonaktifkan jika tidak dipakai.
