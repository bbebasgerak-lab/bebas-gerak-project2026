# Ceklist Bebas Gerak

Diperbarui: 15 November 2026. Web live: https://bebasgerak.my.id

## Fitur yang sudah jadi

**Pengunjung**
- Beranda lengkap: hero, manfaat, program, langkah, contoh tampilan HP, video gratis, testimoni, tanya jawab, ajakan
- Halaman Program, detail program, Tentang Kami, Kontak, Syarat & Ketentuan, Kebijakan Refund, Kebijakan Privasi
- Testimoni screenshot WhatsApp asli + menu Testimoni
- Logo BGL, ikon tab, gambar pratinjau saat link dibagikan
- Animasi halus saat scroll, menu meluncur halus ke tujuan
- Tampilan ramah lansia: huruf besar, kontras tinggi, rapi di HP

**Member**
- Daftar/masuk lewat Google atau email (Clerk production)
- Latihan Saya: kartu berfoto, kemajuan, video berikutnya
- Pemutar video: tombol besar Tandai selesai / Video berikutnya, daftar video bernomor
- Akses selamanya atau berjangka

**Admin**
- Ringkasan pendapatan, pesanan, member aktif
- Program & Video (harga, lama akses, foto program)
- Member & Pesanan (beri/cabut akses manual)
- Pengaturan Web: semua teks, foto, logo, WhatsApp, tanya jawab, testimoni, dan halaman ketentuan

**Teknis**
- Domain + HTTPS, www dialihkan ke bebasgerak.my.id
- Login Google production dengan kunci sendiri
- Pembayaran Midtrans: dites di Sandbox, kunci Production + Notification/Finish URL terpasang
- Kode di GitHub

## Sudah beres
- [x] Desain & brand, database, login + admin
- [x] Pengaturan Web, foto per program
- [x] Domain + DNS + HTTPS + verifikasi email domain
- [x] Clerk production + login Google sendiri
- [x] Halaman Kebijakan Privasi, Syarat & Ketentuan, Kebijakan Refund, Kontak
- [x] Midtrans: Sandbox, kunci tanda tangan, kunci Production, URL notifikasi
- [x] Testimoni, logo, ikon tab, gambar pratinjau link
- [x] Animasi scroll + scroll halus
- [x] Latihan Saya & pemutar video desain baru
- [x] Panel admin desain baru
- [x] www dialihkan ke alamat utama
- [x] Data uji lama dibersihkan

## Belum

**Menunggu pihak lain**
- [ ] Aktivasi metode bayar Midtrans (3–4 hari kerja) → tes bayar Rp1.000 sungguhan

**Perlu dari client**
- [ ] Isi program asli: nama, harga, lama akses, video (sekarang masih contoh)
- [ ] Pilih hosting video: YouTube unlisted atau Bunny Stream
- [ ] Nomor WhatsApp bantuan (Pengaturan Web → Umum)
- [ ] Foto asli untuk 3 manfaat & halaman Tentang
- [ ] Baca & setujui teks Privasi, Syarat & Ketentuan, dan Refund (masih contoh)
- [ ] Izin Renita & Evi untuk testimoni
- [ ] Nama web: "Bebas Gerak" atau "Bebas Gerak Lansia"

**Pengaturan akun (pemilik)**
- [ ] Sambungkan Vercel ke GitHub (izinkan aplikasi Vercel di organisasi bbebasgerak-lab)
- [ ] Clerk: ganti nama aplikasi "My Application" → Bebas Gerak
- [ ] Ganti kunci rahasia yang sempat tertulis di chat (Google & Clerk)
- [ ] Repo GitHub jadi private
- [ ] Vercel Pro (~$20/bulan) — paket gratis bukan untuk jualan
- [ ] Hapus project Vercel lama di akun mus15
- [ ] Opsional: Meta Pixel
