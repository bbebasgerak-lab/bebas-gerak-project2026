# Rencana — Bugar Lansia (nama sementara)

Website jual video olahraga untuk lansia. Referensi struktur: growyoungfitness.com (desain, teks, dan foto dibuat original).

## Keputusan

| Hal | Pilihan | Alasan |
|---|---|---|
| Web | Next.js 16 (App Router) di Vercel | Gratis, API & webhook ikut jadi Vercel Functions |
| Login | Clerk, satu pintu login | Setelah login: admin -> `/admin`, member -> `/latihan`. Role = `publicMetadata.role = "admin"` di Clerk |
| Database | Supabase, diakses **hanya dari server** (service role key) | RLS dinyalakan tanpa policy = kunci anon gak bisa baca apa pun. Gak perlu integrasi JWT Clerk-Supabase |
| Pembayaran | Midtrans Snap (pop-up) | Webhook POST + verifikasi `signature_key` (SHA512) + cek nominal. Fallback cek status ke API Midtrans saat member balik ke `/latihan?order=...` |
| Video | YouTube dulu (sementara), nanti Bunny Stream | Semua "ambil link video" ada di `src/lib/video.ts`. Ganti provider = ubah file itu + isi `provider`/`video_ref` di tabel `videos` |
| Membership | Paket waktu (bayar sekali, akses N hari), tanpa tagihan otomatis | Program `kind = membership` membuka semua program. Beli lagi saat masih aktif = diperpanjang dari tanggal habis |
| Desain | Hangat & terpercaya: krem, hijau tua, aksen terakota. Font judul Fraunces, isi Atkinson Hyperlegible (dirancang untuk penglihatan lemah). Teks dasar 18px, tombol besar | Target pengguna lansia |

## Halaman

- Umum: `/` beranda, `/program`, `/program/[slug]` (video contoh gratis + tombol Beli), `/tentang`, `/masuk`, `/daftar`
- Member: `/latihan` (program saya), `/latihan/[slug]` (pemutar + tandai selesai)
- Admin: `/admin` (ringkasan), `/admin/program` (+ edit & video), `/admin/member` (akses, pesanan, beri akses manual)
- API: `/api/checkout`, `/api/webhook/midtrans`

## Database (supabase/schema.sql)

`programs`, `videos`, `orders`, `access`, `progress`.

## Ditunda

Toko suplemen, DVD, aplikasi native, dark mode, testimoni (tunggu testimoni asli dari client), tagihan langganan otomatis.

## Langkah manual user

1. Clerk: buat application, aktifkan login "Email verification code", set role admin.
2. Supabase: buat project, jalankan `supabase/schema.sql` di SQL Editor, salin URL + service role key.
3. Midtrans: daftar, ambil Server Key & Client Key (Sandbox dulu).
4. Deploy ke Vercel, pasang URL webhook di Midtrans: `https://<domain>/api/webhook/midtrans`.
