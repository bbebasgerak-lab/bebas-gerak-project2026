---
version: 2
name: Bebas Gerak
description: Sistem desain web fitness lansia bergaya editorial-enerjik, terinspirasi template Wix "Kinetically" (Fitness Blog, Energetic). Kanvas abu-krem, tinta hampir hitam, judul Anton yang padat, label monospace dalam kapsul, garis grid vertikal tipis, dan foto besar bersudut bulat. Semua ukuran disesuaikan untuk mata dan jari usia 60+.

colors:
  canvas: "#eeefe9"           # latar default
  ink: "#131313"              # teks, tombol, garis, pita gelap — 16.1:1 di kanvas
  card: "#d5dadc"             # kartu artikel/program — ink di atasnya 13.2:1
  surface: "#ffffff"          # input, modal, popover
  muted: "#e2e4dd"            # latar kotak kosong / zona tenang
  muted-foreground: "#3d3d3a" # teks sekunder — 9.4:1 di kanvas, 7.7:1 di kartu
  primary: "#131313"          # tombol utama (isi hitam)
  on-primary: "#eeefe9"
  primary-hover: "#3a3a38"
  band: "#131313"             # pita gelap & footer bar atas
  on-band: "#eeefe9"          # 16.1:1
  on-band-soft: "#b9bcb4"     # teks sekunder di pita gelap — 9.7:1
  line: "#131313"             # garis grid & border (gaya editorial, tegas)
  error: "#c82014"            # 4.9:1 di kanvas, 5.7:1 di putih
  focus-ring: "#131313"       # di pita gelap: "#eeefe9"

typography:
  # Anton (Google Fonts) = font display template. Hanya bobot 400 — jangan diberi font-bold.
  # JetBrains Mono = label teknis template. Hanya untuk teks pendek huruf kapital.
  # Atkinson Hyperlegible = pengganti Alliance No.2 (berbayar) dan dirancang untuk low-vision. Semua teks bacaan.
  display:   { fontFamily: Anton, fontSize: 96px, mobile: 52px, fontStyle: italic, lineHeight: 1.0 }   # judul hero SAJA yang miring
  heading-1: { fontFamily: Anton, fontSize: 64px, mobile: 44px, lineHeight: 1.05 }
  heading-2: { fontFamily: Anton, fontSize: 48px, mobile: 36px, lineHeight: 1.1 }
  heading-3: { fontFamily: Anton, fontSize: 32px, mobile: 28px, lineHeight: 1.15 }
  card-title:{ fontFamily: Anton, fontSize: 30px, lineHeight: 1.15 }
  lead:      { fontFamily: Atkinson Hyperlegible, fontSize: 22px, lineHeight: 1.6 }
  body:      { fontFamily: Atkinson Hyperlegible, fontSize: 20px, lineHeight: 1.6 }
  body-sm:   { fontFamily: Atkinson Hyperlegible, fontSize: 18px, lineHeight: 1.6 }   # batas bawah teks bacaan
  label:     { fontFamily: JetBrains Mono, fontSize: 17.5px, fontWeight: 500, textTransform: uppercase, letterSpacing: 0.04em }
  button:    { fontFamily: JetBrains Mono, fontSize: 18px, fontWeight: 700, textTransform: uppercase, letterSpacing: 0.04em }
  caption:   { fontFamily: Atkinson Hyperlegible, fontSize: 16px }                     # minimum mutlak

rounded:
  md: 12px     # input
  lg: 24px     # kartu
  xl: 32px     # panel hero / foto besar
  full: 9999px # tombol, kapsul label

spacing: { xs: 8px, sm: 12px, md: 16px, lg: 24px, xl: 32px, 2xl: 48px, 3xl: 64px, 4xl: 96px }

sizing:
  touch-min: 48px
  control-height: 55px
  content-max: 1152px   # max-w-6xl

components:
  button-primary:  { backgroundColor: "{colors.ink}", textColor: "{colors.on-primary}", typography: "{typography.button}", rounded: "{rounded.full}", height: "{sizing.control-height}" }
  button-outline:  { backgroundColor: transparent, textColor: "{colors.ink}", borderColor: "{colors.ink}", borderWidth: 2px, typography: "{typography.button}", rounded: "{rounded.full}" }
  button-on-dark:  { backgroundColor: "{colors.canvas}", textColor: "{colors.ink}", typography: "{typography.button}", rounded: "{rounded.full}" }
  label-pill:      { borderColor: currentColor, borderWidth: 1.5px, typography: "{typography.label}", rounded: "{rounded.full}", padding: "4px 16px" }
  tag-pill:        { backgroundColor: "{colors.ink}", textColor: "{colors.on-band}", typography: "{typography.label}", rounded: "{rounded.full}" }
  card:            { backgroundColor: "{colors.card}", textColor: "{colors.ink}", rounded: "{rounded.lg}", padding: "{spacing.xl}", border: none }
  hero-panel:      { backgroundColor: "{colors.ink}", rounded: "{rounded.xl}", overlayCard: "{colors.card}" }
  text-input:      { backgroundColor: "{colors.surface}", borderColor: "{colors.ink}", borderWidth: 2px, typography: "{typography.body}", rounded: "{rounded.md}", height: "{sizing.control-height}" }
  grid-lines:      { color: "{colors.line}", width: 1px, columns: 3, visibleFrom: 1024px }
---

# Bebas Gerak — Design System (v2, gaya Kinetically)

> **Update 2026-11-09:** atas permintaan pemilik, ukuran dasar diturunkan dari 20px ke **16px** (`html { font-size: 100% }`). Karena semua ukuran memakai rem, angka ukuran teks, tombol, dan jarak di dokumen ini sekarang tampil ±80% dari yang tertulis (contoh: teks bacaan 20px → 16px, tombol 55px → ±44px).

## Ringkasan

Web harus terasa **enerjik, tegas, dan modern** — seperti majalah olahraga — tapi tetap **nyaman dibaca orang usia 60+**. Gaya visual diambil dari template Wix "Kinetically" (fitness blog, varian *Energetic*); yang diambil hanya bahasa desainnya, bukan nama, foto, atau teks template.

**Ciri khas yang dipakai:**
- Kanvas abu-krem `#eeefe9` dengan tinta hampir hitam `#131313`. Tidak ada warna merek lain.
- Judul **Anton** yang padat dan besar. Judul hero dibuat *miring* untuk kesan bergerak.
- Label **monospace kapital** di dalam kapsul bergaris (`label-pill`) atau kapsul hitam (`tag-pill`).
- **Garis grid vertikal** hitam tipis yang membagi halaman jadi kolom di layar lebar.
- **Panel hero gelap besar** bersudut bulat dengan kartu abu-abu yang menumpang di pojoknya.
- Kartu program/artikel berwarna abu-biru `#d5dadc`, sudut 24px, tanpa bayangan.

**Yang diubah dari template demi lansia:**
- Teks template 11–14px → teks bacaan **20px**, minimum mutlak 16px.
- Miring hanya untuk judul hero; judul lain tegak.
- Teks bacaan memakai Atkinson Hyperlegible, bukan font sempit atau monospace.
- Monospace hanya untuk label dan tombol pendek (≤ 3 kata), ukuran ≥ 17.5px.
- Foto pelari muda yang blur → nantinya foto lansia Indonesia sungguhan yang tajam dan terang.

## Prinsip untuk Lansia

1. **Besar dulu.** Teks 20px, tombol dan input tinggi 55px, target sentuh ≥ 48px.
2. **Satu tombol isi-hitam per layar** untuk aksi utama. Aksi lain memakai tombol outline.
3. **Kontras tinggi.** Teks utama 16:1, teks sekunder ≥ 7.7:1 (AAA).
4. **Kata, bukan simbol.** Ikon selalu berlabel; tidak ada aksi yang hanya muncul saat hover.
5. **Tenang meski enerjik.** Tidak ada carousel otomatis atau animasi panjang; `prefers-reduced-motion` dihormati.
6. **Pemaaf.** Konfirmasi sebelum aksi berisiko; pesan error jelas dengan teks, tidak hanya warna.

## Warna

| Token | Hex | Pakai untuk |
|---|---|---|
| canvas | `#eeefe9` | Latar halaman |
| ink | `#131313` | Teks, tombol utama, garis, pita gelap |
| card | `#d5dadc` | Kartu program, kartu overlay hero, FAQ |
| surface | `#ffffff` | Input, modal |
| muted-foreground | `#3d3d3a` | Teks sekunder |
| on-band-soft | `#b9bcb4` | Teks sekunder di pita gelap |
| error | `#c82014` | Pesan dan border error |

**Kontras terverifikasi:** ink/canvas 16.1 · ink/card 13.2 · muted/canvas 9.4 · muted/card 7.7 · canvas/ink 16.1 · on-band-soft/ink 9.7 · error/canvas 4.9.

Tidak ada warna aksen. Penekanan dibentuk dengan **ukuran, isi hitam, dan garis**, bukan warna.

## Tipografi

- **Anton** untuk semua judul (h1–h3, judul kartu, harga, angka besar). Bobotnya hanya 400 — jangan pakai `font-bold`/`font-semibold` (browser akan menebalkan palsu). Huruf biasa (Title Case), bukan kapital semua, kecuali logo.
- **JetBrains Mono** kapital untuk label kapsul, tombol, dan judul kolom footer.
- **Atkinson Hyperlegible** untuk paragraf, daftar, menu navigasi, dan form.
- Panjang baris maksimal ~68 karakter, rata kiri.

## Tata Letak

- **Kontainer** 1152px (`max-w-6xl`), padding samping 16px.
- **Garis grid:** tiga kolom bergaris hitam 1px di belakang konten, hanya di layar ≥ 1024px. Kartu dan pita menutupi garis — itu disengaja.
- **Hero:** judul Anton miring besar di tengah → baris berisi paragraf pengantar di kiri dan tombol outline di kanan → panel gelap besar dengan kartu overlay di pojok kanan bawah.
- **Ritme section:** kanvas → kanvas berkolom bergaris → **pita hitam** (langkah-langkah) → kanvas → pita hitam ajakan → footer.
- **Mobile:** satu kolom, tombol utama lebar penuh, garis grid disembunyikan.

## Komponen

- **Tombol primary:** pil hitam, teks mono kapital krem. Hover `#3a3a38`.
- **Tombol outline:** pil transparan, border 2px hitam, teks mono kapital hitam. Dipakai untuk CTA header (gaya template) dan aksi sekunder.
- **Tombol on-dark:** pil krem di atas pita hitam.
- **label-pill (`.eyebrow`):** kapsul bergaris tipis, teks mono kapital. Dipakai di atas judul section.
- **tag-pill:** kapsul hitam, teks mono krem. Dipakai untuk "Paling lengkap", level program.
- **Kartu program:** latar `#d5dadc`, sudut 24px, judul Anton, harga Anton besar. Kartu unggulan diberi border hitam 2px dan tag-pill.
- **Panel hero:** latar hitam, sudut 32px, ilustrasi/foto di dalamnya, kartu `#d5dadc` menumpang di pojok berisi ajakan coba video gratis.
- **Input:** latar putih, border hitam 2px, tinggi 55px, label di atas.
- **Fokus:** outline 3px hitam, offset 3px. Di pita hitam outline berwarna krem.
- **Footer:** kolom-kolom dipisah garis vertikal, judul kolom mono kapital, nomor WhatsApp besar.

## Foto

- Foto lansia Indonesia sungguhan sedang bergerak (senam kursi, jalan pagi, peregangan), tajam dan terang — bukan blur gerak.
- Sudut 24–32px. Setiap gambar wajib punya `alt` deskriptif.
- Panel hero memakai `public/images/hero-senam.jpg` (Khanh Do, Unsplash License). Ganti dengan foto asli member/instruktur kalau sudah ada.
- Hanya pakai foto berlisensi bebas (Unsplash non-Plus, Pexels) atau milik client. Jangan ambil sembarang foto dari hasil Google Images.
- Label yang menumpang di atas foto diberi latar hitam 85% agar tetap terbaca.

## Lakukan & Hindari

**Lakukan:** pakai Anton untuk judul dan angka besar · biarkan garis grid dan ruang kosong bekerja · satu tombol hitam per layar · tulis bahasa sehari-hari yang sopan ("Bapak/Ibu").

**Hindari:** teks < 16px · miring di luar judul hero · monospace untuk paragraf · warna aksen baru · `font-bold` pada Anton · nama, foto, atau teks template Kinetically.

## Pemetaan ke Kode

| Variabel (`src/app/globals.css`) | Nilai |
|---|---|
| `--background` | `#eeefe9` |
| `--foreground` | `#131313` |
| `--card` | `#d5dadc` |
| `--popover` | `#ffffff` |
| `--primary` / `--primary-foreground` / `--primary-hover` | `#131313` / `#eeefe9` / `#3a3a38` |
| `--secondary` | `#eeefe9` (tombol on-dark) |
| `--muted` / `--muted-foreground` | `#e2e4dd` / `#3d3d3a` |
| `--accent` | `#d5dadc` |
| `--border`, `--input`, `--ring` | `#131313` |
| `--band` / `--band-foreground` / `--band-muted` | `#131313` / `#eeefe9` / `#b9bcb4` |

Font di `src/app/layout.tsx`: `Anton` → `--font-display` (`font-heading`), `JetBrains_Mono` → `--font-code` (`font-mono`), `Atkinson_Hyperlegible` → `--font-body` (`font-sans`). Utilitas `.eyebrow` dan `.tag` ada di `globals.css`.
