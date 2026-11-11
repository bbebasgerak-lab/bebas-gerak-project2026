# Bebas Gerak

Website latihan kursi untuk usia 50 tahun ke atas. Pengunjung memilih program, membayar secara online, lalu menonton video latihan dari HP, tablet, atau TV. Pemilik web mengelola program, member, dan seluruh isi halaman dari panel admin tanpa menyentuh kode.

Versi live: https://bebas-gerak-one.vercel.app

## Fitur

**Untuk pengunjung**
- Beranda, daftar program, halaman detail program, dan halaman Tentang Kami.
- Video contoh gratis yang bisa ditonton sebelum membeli.
- Daftar dan masuk dengan akun Google atau email.
- Tampilan dirancang untuk pembaca lanjut usia: huruf besar, kontras tinggi, tombol lebar.

**Untuk member**
- Halaman Latihan Saya berisi semua program yang sudah dibeli.
- Pemutar video dengan penanda latihan yang sudah selesai.
- Akses selamanya atau berjangka (misalnya membership satu tahun).

**Untuk admin**
- Ringkasan pendapatan, pesanan, dan jumlah member aktif.
- Program & Video: tambah, ubah, atur harga, lama akses, dan urutan tampil.
- Member & Pesanan: lihat pesanan, beri atau cabut akses secara manual.
- Pengaturan Web: ubah tulisan, foto, tanya jawab, dan nomor WhatsApp. Perubahan langsung tampil tanpa deploy ulang.

## Teknologi

| Bagian | Yang dipakai |
| --- | --- |
| Kerangka | Next.js 16 (App Router), React 19, TypeScript |
| Tampilan | Tailwind CSS 4, komponen shadcn/ui |
| Login | Clerk |
| Database dan penyimpanan foto | Supabase |
| Pembayaran | Midtrans (QRIS, virtual account, e-wallet, kartu) |
| Video | YouTube, dengan pilihan pindah ke Bunny Stream |
| Hosting | Vercel |

## Menjalankan di komputer sendiri

Butuh Node.js 22 atau lebih baru.

1. Pasang dependensi.

   ```bash
   npm install
   ```

2. Salin `.env.example` menjadi `.env.local`, lalu isi kunci Clerk, Supabase, dan Midtrans. Petunjuk tiap kunci ada di dalam file tersebut.

3. Siapkan database: buka Supabase, masuk ke SQL Editor, tempel isi `supabase/schema.sql`, lalu jalankan.

4. Jadikan akunmu admin: di dashboard Clerk, buka Users, pilih akunmu, lalu isi Public metadata dengan `{"role": "admin"}`.

5. Jalankan web.

   ```bash
   npm run dev
   ```

   Buka http://localhost:3000. Panel admin ada di `/admin`.

## Perintah

| Perintah | Kegunaan |
| --- | --- |
| `npm run dev` | Menjalankan web di komputer sendiri |
| `npm run build` | Membuat versi produksi |
| `npm test` | Menjalankan tes (akses member, tanda tangan Midtrans, isi web) |
| `npm run lint` | Memeriksa kerapian kode |

## Susunan folder

```
src/app/(site)   Halaman publik dan area member
src/app/admin    Panel admin
src/app/api      Checkout dan webhook Midtrans
src/components   Komponen tampilan
src/lib          Logika: akses, pembayaran, video, isi web
supabase         Skema database
DESIGN.md        Panduan desain (warna, huruf, komponen)
```

## Mengubah isi web

Tulisan dan foto halaman publik diatur dari Panel Admin, menu Pengaturan Web. Isinya disimpan di Supabase Storage (bucket `web`), jadi tidak perlu deploy ulang setelah mengubahnya.

Daftar kolom yang bisa diubah ada di `src/lib/content-fields.ts`. Untuk membuat tulisan baru bisa diubah dari admin, tambahkan satu baris di file itu lalu pakai nilainya di halaman lewat `getContent()`.

Susunan halaman, warna, dan huruf tetap diatur di kode, mengikuti `DESIGN.md`.

## Keamanan

- File `.env.local` berisi kunci rahasia dan tidak pernah diunggah ke repo ini.
- Database hanya diakses dari server. Kunci publik tidak bisa membaca atau menulis data.
- Webhook pembayaran memeriksa tanda tangan Midtrans sebelum membuka akses.

## Status

Pembayaran Midtrans dan domain sendiri belum dipasang. Foto pada halaman publik masih foto contoh berlisensi bebas dari Unsplash dan akan diganti dengan foto asli.
