# 🏗️ Arch Studio — Platform Company Profile Mitra Daya Kreasi

> Platform web company profile & manajemen konten untuk **Workshop Furniture Mitra Daya Kreasi**, mencakup portofolio desain, manajemen layanan, halaman karir, dan formulir kontak — dilengkapi dengan dashboard admin yang fully dynamic.

---

## 📋 Daftar Isi

- [Deskripsi Proyek](#deskripsi-proyek)
- [Tech Stack](#tech-stack)
- [Arsitektur Sistem](#arsitektur-sistem)
- [Struktur Folder](#struktur-folder)
- [Fitur Utama](#fitur-utama)
- [Cara Instalasi & Menjalankan](#cara-instalasi--menjalankan)
- [Environment Variables](#environment-variables)
- [Troubleshooting](#troubleshooting)
- [Kontributor](#kontributor)
- [Lisensi](#lisensi)

---

## 📖 Deskripsi Proyek

Arch Studio adalah platform **Company Profile berbasis web** yang dibangun untuk **Workshop Furniture Mitra Daya Kreasi**, sebuah produsen furniture custom dan interior yang berlokasi di Bogor, Jawa Barat.

Sistem ini terdiri dari dua bagian utama:
- **Halaman Klien (Public)**: Menampilkan informasi perusahaan, portofolio proyek, layanan, karir, dan formulir kontak secara dinamis.
- **Dashboard Admin (Private)**: Memungkinkan pengelola untuk melakukan operasi CRUD (Create, Read, Update, Delete) pada semua konten yang tampil di halaman publik tanpa perlu menyentuh kode.

---

## 🛠️ Tech Stack

### Frontend
| Teknologi | Versi | Keterangan |
|---|---|---|
| **React** | 19.x | Library utama UI |
| **TypeScript** | ~6.0 | Type safety |
| **Vite** | 8.x | Build tool & dev server |
| **Tailwind CSS** | 4.x | Utility-first CSS framework |
| **React Router DOM** | 7.x | Client-side routing |
| **TanStack Query** | 5.x | Server state management & caching |
| **Axios** | 1.x | HTTP client untuk API calls |
| **Zustand** | 5.x | Global state management (auth) |
| **Framer Motion** | 12.x | Animasi UI |
| **Lucide React** | 1.x | Ikon SVG |
| **Embla Carousel** | 8.x | Komponen carousel/slider |

### Backend
| Teknologi | Versi | Keterangan |
|---|---|---|
| **Java** | 21+ | Bahasa pemrograman utama |
| **Spring Boot** | 3.x | Framework backend |
| **Gradle** | - | Build & dependency tool |
| **Spring Data JPA** | - | ORM layer |
| **PostgreSQL / H2** | - | Database relasional |
| **Spring Security** | - | Autentikasi & otorisasi |

---

## 🔄 Arsitektur Sistem

```
┌─────────────────────────────────────────────────────────┐
│                   BROWSER / CLIENT                       │
│                                                         │
│   React 19 + TypeScript + Vite                          │
│   ┌──────────────┐    ┌──────────────────────────────┐  │
│   │  Halaman     │    │      Dashboard Admin         │  │
│   │  Publik      │    │  (Login Protected)           │  │
│   │  (Client)    │    │  CRUD: Banner, Portfolio,    │  │
│   │              │    │  Layanan, Karir, Pesan       │  │
│   └──────┬───────┘    └───────────┬──────────────────┘  │
└──────────┼────────────────────────┼────────────────────-┘
           │         AXIOS          │
           │   HTTP/REST API Calls  │
           ▼                        ▼
┌────────────────────────────────────────────────────────┐
│               BACKEND — Spring Boot                     │
│                                                        │
│   REST Controllers → Service Layer → Repository (JPA)  │
│                                                        │
│   Endpoints:                                           │
│   POST   /api/auth/login                               │
│   GET    /api/home | /api/services | /api/projects     │
│   GET    /api/about | /api/career | /api/messages      │
│   POST   /api/services/processes | /api/portfolio      │
│   PUT    /api/services/{id} | /api/about               │
│   DELETE /api/services/{id} | /api/projects/{id}       │
└───────────────────────────┬────────────────────────────┘
                            │   JPA / Hibernate ORM
                            ▼
┌────────────────────────────────────────────────────────┐
│               DATABASE — PostgreSQL                     │
│                                                        │
│   Tables: hero_banners, projects, services,            │
│           work_processes, about_info, messages,        │
│           career_settings, job_applications            │
└────────────────────────────────────────────────────────┘
```

**Alur Data:**
1. Pengguna membuka halaman web → React merender UI
2. React (via TanStack Query & Axios) mengirim HTTP request ke Spring Boot REST API
3. Spring Boot memproses request melalui Controller → Service → Repository
4. Repository mengambil/menyimpan data ke database PostgreSQL via JPA
5. Data dikembalikan ke frontend dalam format JSON dan dirender ke UI

---

## 📁 Struktur Folder

### Frontend (`arch-studio-frontend/`)

```
src/
├── App.tsx                    # Root routing & QueryClient setup
├── main.tsx                   # Entry point React
├── index.css                  # Global styles & design tokens
│
├── features/
│   ├── admin/                 # Fitur khusus halaman admin
│   │   ├── components/
│   │   │   ├── HeroBannerManager.tsx    # CRUD Hero Banner & Desain Terbaik
│   │   │   ├── ServiceManager.tsx       # CRUD Layanan & Metode Kerja
│   │   │   ├── PortfolioManager.tsx     # CRUD Portofolio Proyek
│   │   │   ├── AboutManager.tsx         # Edit halaman Tentang Kami
│   │   │   ├── CareerManager.tsx        # CRUD konten halaman Karir
│   │   │   ├── MessageManager.tsx       # Lihat & kelola pesan masuk
│   │   │   └── JobApplicationManager.tsx # Lihat lamaran kerja
│   │   └── pages/
│   │       └── AdminDashboard.tsx       # Layout & navigasi admin
│   │
│   └── client/                # Fitur khusus halaman publik
│       ├── api/
│       │   └── axiosClient.ts           # Konfigurasi Axios (baseURL, interceptors)
│       ├── components/
│       │   └── common/
│       │       ├── Navbar.tsx
│       │       ├── Footer.tsx
│       │       ├── CtaSection.tsx       # Seksi CTA dengan link WhatsApp
│       │       └── ContactSection.tsx   # Form kontak + info
│       └── pages/
│           ├── ClientHome.tsx           # Halaman utama (home)
│           ├── ServicesPage.tsx         # Halaman Layanan & Metode Kerja
│           ├── PortfolioPage.tsx        # Halaman Portofolio
│           ├── AboutPage.tsx            # Halaman Tentang Kami
│           ├── KarirPage.tsx            # Halaman Karir & Lowongan
│           └── LoginPage.tsx            # Halaman Login Admin
│
├── services/                  # Layer komunikasi dengan REST API
│   ├── homeService.ts         # API Hero Banner
│   ├── serviceService.ts      # API Layanan & Metode Kerja
│   ├── projectService.ts      # API Portofolio/Proyek
│   ├── aboutService.ts        # API Tentang Kami
│   ├── careerService.ts       # API Konten Karir
│   ├── messageService.ts      # API Pesan Masuk
│   └── jobApplicationService.ts # API Lamaran Kerja
│
├── types/
│   └── index.ts               # Seluruh TypeScript interface & type definitions
│
├── context/                   # React context (misalnya: AuthContext)
├── utils/                     # Helper functions
└── constants/                 # Konstanta global
```

---

## ✨ Fitur Utama

### Halaman Publik (Klien)
| Fitur | Keterangan |
|---|---|
| **Hero Banner Dinamis** | Judul, subjudul, dan background gambar bisa diganti dari admin |
| **Portofolio Proyek** | Galeri proyek lengkap dengan filter kategori, detail klien, lokasi, tahun, material, dan slideshow gambar |
| **Halaman Layanan** | Menampilkan daftar layanan dan proses kerja yang 100% dikelola dari admin |
| **Halaman Karir** | Daftar lowongan kerja dan form lamaran online dengan upload CV |
| **Form Kontak** | Pesan dari pengunjung tersimpan ke database dan bisa dibaca dari admin |
| **CTA WhatsApp** | Semua tombol "Hubungi Kami" langsung redirect ke WhatsApp |

### Dashboard Admin (Private)
| Fitur | Keterangan |
|---|---|
| **Autentikasi** | Login aman dengan JWT / session |
| **Kelola Home Banner** | Edit teks, gambar background hero, dan pilih proyek untuk "Desain Terbaik" |
| **Kelola Layanan & Metode Kerja** | CRUD lengkap dengan pemilihan ikon dari Lucide React |
| **Kelola Portofolio** | Tambah/edit/hapus proyek beserta galeri foto |
| **Kelola Karir** | Edit konten hero karir, potensi, budaya, dan buka/tutup lowongan |
| **Pesan Masuk** | Baca dan tandai pesan dari pengunjung |
| **Lamaran Kerja** | Kelola dan unduh file CV dari pelamar |

---

## 🚀 Cara Instalasi & Menjalankan

### Prasyarat
- **Node.js** v20+
- **Java** 21+
- **PostgreSQL** (atau gunakan H2 untuk development)
- **pnpm** (direkomendasikan) atau npm

---

### 1. Clone Repository

```bash
git clone https://github.com/username/arch-studio.git
cd arch-studio
```

---

### 2. Menjalankan Backend (Spring Boot)

```bash
# Masuk ke direktori backend
cd arch-studio-backend

# (Opsional) Sesuaikan konfigurasi database di:
# src/main/resources/application.properties

# Jalankan dengan Gradle Wrapper
./gradlew bootRun

# Backend akan berjalan di:
# http://localhost:8080
```

**Konfigurasi Database** (`application.properties`):
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/arch_studio_db
spring.datasource.username=postgres
spring.datasource.password=yourpassword
spring.jpa.hibernate.ddl-auto=update
```

---

### 3. Menjalankan Frontend (React + Vite)

```bash
# Masuk ke direktori frontend
cd arch-studio-frontend

# Install dependencies
pnpm install
# atau: npm install

# Jalankan dev server
pnpm dev
# atau: npm run dev

# Frontend akan berjalan di:
# http://localhost:5173
```

---

### 4. Build untuk Produksi

```bash
# Frontend
pnpm build

# File hasil build ada di: dist/
```

---

## ⚙️ Environment Variables

Buat file `.env` di direktori `arch-studio-frontend/`:

```env
VITE_API_BASE_URL=http://localhost:8080
```

---

## 🔧 Troubleshooting

| Masalah | Solusi |
|---|---|
| **CORS Error** di browser | Pastikan Spring Boot sudah dikonfigurasi `@CrossOrigin` atau via `CorsConfiguration` global |
| **400 Bad Request** saat upload gambar | Gambar terlalu besar. Frontend sudah mengompresi gambar secara otomatis, pastikan batas `spring.servlet.multipart.max-file-size` cukup |
| **Data tidak tampil** di halaman klien | Periksa apakah backend sudah berjalan di `localhost:8080` dan `VITE_API_BASE_URL` sudah benar |
| **Duplikat data layanan** | Frontend mendeteksi dan menghapus duplikat otomatis saat halaman dimuat pertama kali |
| **pnpm: command not found** | Install pnpm dulu: `npm install -g pnpm` |
| **Gradle build gagal** | Pastikan Java 21 sudah terinstal dan `JAVA_HOME` sudah diset dengan benar |

---

## 👥 Kontributor

| Nama | Role |
|---|---|
| [Nama Anda] | Full Stack Developer |
| [Nama Anggota] | Backend Developer |
| [Nama Anggota] | UI/UX Designer |

---

## 📄 Lisensi

Proyek ini bersifat **proprietary** dan merupakan milik **Workshop Furniture Mitra Daya Kreasi**.

Dilarang menyalin, mendistribusikan, atau memodifikasi kode ini tanpa izin tertulis dari pemilik.

---

> Dibuat dengan ❤️ untuk Mitra Daya Kreasi — *Wujudkan Ruang Impian Menjadi Kenyataan.*
