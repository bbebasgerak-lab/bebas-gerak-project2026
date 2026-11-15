// Daftar semua teks & foto yang bisa diubah dari Panel Admin → Pengaturan Web.
// Satu daftar ini dipakai dua kali: membuat form di admin, dan menjadi isi awal website.
// Menambah kolom baru = tambah satu baris di sini, lalu pakai `c.<kunci>` di halamannya.
// Nama brand & kalimat singkat bawaan. Bisa diganti dari admin tanpa menyentuh kode.
const site = {
  name: "Bebas Gerak",
  tagline: "Latihan kursi yang aman, pelan, dan menyenangkan dari rumah",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "", // format 628xxxxxxxxxx
};

type Kind = "text" | "area" | "image";
const make = (kind: Kind) => <K extends string>(key: K, label: string, def: string, hint?: string) => ({ key, label, def, kind, hint });
const t = make("text");
const area = make("area");
const img = make("image");
const alt = <K extends string>(key: K, def: string) =>
  t(key, "Keterangan foto", def, "Kalimat singkat isi foto, dibacakan untuk pengunjung yang penglihatannya lemah.");

export const groups = [
  {
    title: "Umum",
    note: "Dipakai di semua halaman.",
    fields: [
      t("nama", "Nama web", site.name),
      img("logo", "Logo", "/images/logo.png", "Paling bagus PNG berlatar transparan. Tampil di bagian atas dan bawah halaman."),
      t("judul_tab", "Judul di tab browser & Google", "Senam Kursi untuk Lansia", "Tampil setelah nama web."),
      t("tagline", "Kalimat singkat tentang web", site.tagline, "Tampil di bagian bawah halaman dan di hasil pencarian Google."),
      t("whatsapp", "Nomor WhatsApp bantuan", site.whatsapp, "Angka saja, diawali 62. Contoh: 6281234567890"),
      t("pengumuman", "Tulisan di pita paling atas", "Sudah jadi member? Latihan Anda sudah menunggu.", "Hanya tampil untuk pengunjung yang belum masuk."),
      t("catatan_footer", "Catatan di bagian bawah halaman", "Konsultasikan dengan dokter sebelum memulai program latihan baru."),
    ],
  },
  {
    title: "Beranda: bagian atas",
    fields: [
      t("hero_judul_1", "Judul besar, baris 1", "Tubuh Lebih Kuat,"),
      t("hero_judul_2", "Judul besar, baris 2", "Langkah Lebih Mantap"),
      t("hero_label", "Label kecil", "Senam kursi untuk usia 50+"),
      area("hero_teks", "Kalimat pembuka", "Latihan pelan dan terpandu yang bisa Anda ikuti dari rumah, cukup dengan sebuah kursi."),
      img("hero_foto", "Foto utama", "/images/hero-senam.jpg", "Paling bagus foto mendatar (lebar)."),
      alt("hero_foto_alt", "Sekelompok ibu-ibu lanjut usia senam bersama di taman, merentangkan kedua tangan sambil tersenyum"),
      t("hero_badge_1", "Label di atas foto, 1", "20 menit sehari"),
      t("hero_badge_2", "Label di atas foto, 2", "Aman untuk lutut"),
      t("hero_kartu_label", "Kartu di foto: label", "Mulai hari ini", "Kartu ini tampil kalau belum ada video gratis."),
      t("hero_kartu_judul", "Kartu di foto: judul", "Bangun kekuatan & jaga keseimbangan"),
    ],
  },
  {
    title: "Beranda: tiga manfaat",
    fields: [
      img("manfaat_1_foto", "Manfaat 1: foto", "/images/manfaat-kekuatan.jpg"),
      alt("manfaat_1_foto_alt", "Peserta kelas senam duduk di kursi sambil menarik karet latihan berwarna ke atas kepala"),
      t("manfaat_1_judul", "Manfaat 1: judul", "Kekuatan"),
      area("manfaat_1_teks", "Manfaat 1: penjelasan", "Otot kaki dan lengan lebih kuat untuk berdiri, naik tangga, dan membawa belanjaan."),
      img("manfaat_2_foto", "Manfaat 2: foto", "/images/manfaat-keseimbangan.jpg"),
      alt("manfaat_2_foto_alt", "Seorang ibu lanjut usia berdiri di samping kursi sambil merentangkan tangan menjaga keseimbangan"),
      t("manfaat_2_judul", "Manfaat 2: judul", "Keseimbangan"),
      area("manfaat_2_teks", "Manfaat 2: penjelasan", "Melatih kestabilan tubuh supaya lebih percaya diri dan risiko jatuh berkurang."),
      img("manfaat_3_foto", "Manfaat 3: foto", "/images/manfaat-semangat.jpg"),
      alt("manfaat_3_foto_alt", "Pasangan lanjut usia berdansa sambil tersenyum, ditonton teman-temannya"),
      t("manfaat_3_judul", "Manfaat 3: judul", "Semangat"),
      area("manfaat_3_teks", "Manfaat 3: penjelasan", "Pelatih yang sabar dan ramah, bergerak pelan bersama Anda di setiap video."),
    ],
  },
  {
    title: "Beranda: daftar program",
    note: "Isi program (judul, harga, video) diubah di menu Program & Video.",
    fields: [
      t("program_label", "Label kecil", "Pilih program"),
      t("program_judul", "Judul", "Mulai dari program yang paling cocok untuk Anda"),
    ],
  },
  {
    title: "Beranda: tiga langkah",
    fields: [
      t("langkah_judul", "Judul", "Semudah tiga langkah"),
      t("langkah_1_judul", "Langkah 1: judul", "Pilih program"),
      area("langkah_1_teks", "Langkah 1: penjelasan", "Lihat isi tiap program dan tonton video contohnya dulu."),
      t("langkah_2_judul", "Langkah 2: judul", "Bayar dengan mudah"),
      area("langkah_2_teks", "Langkah 2: penjelasan", "QRIS, transfer bank, GoPay, ShopeePay, atau kartu."),
      t("langkah_3_judul", "Langkah 3: judul", "Latihan kapan saja"),
      area("langkah_3_teks", "Langkah 3: penjelasan", "Buka menu Latihan Saya dari HP, tablet, atau TV."),
    ],
  },
  {
    title: "Beranda: contoh tampilan di HP",
    fields: [
      t("tampilan_label", "Label kecil", "Lihat tampilannya"),
      t("tampilan_judul_1", "Judul, baris 1", "Latihan Cukup dari HP"),
      t("tampilan_judul_2", "Judul, baris 2", "Semudah Buka WhatsApp"),
      area("tampilan_teks", "Penjelasan", "Bisa dibuka di HP, tablet, maupun komputer — tanpa perlu memasang aplikasi."),
    ],
  },
  {
    title: "Beranda: video gratis",
    note: "Tampil kalau ada video yang ditandai gratis di menu Program & Video.",
    fields: [
      t("video_label", "Label kecil", "Video gratis"),
      t("video_judul", "Judul", "Coba satu latihan sekarang"),
      area("video_teks", "Penjelasan", "Siapkan kursi, putar videonya, dan ikuti gerakannya pelan-pelan."),
    ],
  },
  {
    title: "Beranda: ajakan di bagian bawah",
    fields: [
      t("ajakan_judul", "Judul", "Tidak ada kata terlambat untuk mulai bergerak."),
      t("ajakan_teks", "Kalimat", `Bergabunglah dengan ${site.name} hari ini.`),
    ],
  },
  {
    title: "Halaman Program",
    fields: [
      t("halprogram_judul", "Judul", "Program latihan"),
      area("halprogram_teks", "Penjelasan", "Setiap program bisa diikuti dari kursi di rumah. Tonton video contohnya dulu sebelum membeli."),
    ],
  },
  {
    title: "Halaman Tentang Kami",
    fields: [
      t("tentang_label", "Label kecil", "Tentang kami"),
      t("tentang_judul", "Judul", "Bergerak dengan nyaman di usia berapa pun"),
      area(
        "tentang_isi",
        "Cerita",
        [
          `${site.name} lahir dari keyakinan sederhana: setiap orang berhak merasa kuat, mandiri, dan percaya diri, berapa pun usianya.`,
          "Banyak latihan di internet terlalu cepat atau terlalu berat untuk orang tua kita. Karena itu setiap video kami bergerak pelan, menjelaskan gerakan dengan jelas, dan selalu menyediakan pilihan yang lebih ringan.",
          "Tujuan kami: membantu Anda tetap aktif, lebih kuat setiap minggu, dan terus menikmati hidup yang sudah Anda bangun dengan kerja keras.",
        ].join("\n\n"),
        "Kosongkan satu baris untuk membuat paragraf baru.",
      ),
      img("tentang_foto", "Foto", "/images/tentang-taichi.jpg", "Paling bagus foto berdiri (tinggi)."),
      alt("tentang_foto_alt", "Seorang bapak lanjut usia berlatih tai chi dengan tenang di taman pada pagi hari"),
    ],
  },
  {
    title: "Halaman Syarat & Ketentuan",
    note: "Teks awal hanya contoh. Minta client membaca dan menyesuaikannya.",
    fields: [
      t("sk_judul", "Judul", "Syarat & Ketentuan"),
      t("sk_tanggal", "Terakhir diperbarui", "15 November 2026"),
      area("sk_isi", "Isi", [
          `Dengan mendaftar, membeli, atau memakai ${site.name}, Anda dianggap menyetujui ketentuan berikut.`,
          "## Akun",
          "Satu akun untuk satu orang. Jaga kerahasiaan kata sandi Anda. Akses program tidak boleh dipinjamkan, dijual kembali, atau dipakai bersama orang lain.",
          "## Pembelian dan pembayaran",
          "Harga yang berlaku adalah harga yang tertera saat Anda membayar. Pembayaran diproses oleh Midtrans melalui QRIS, transfer bank (virtual account), dompet digital, atau kartu. Akses program terbuka otomatis setelah pembayaran berhasil.",
          "## Masa akses",
          "Lama akses tertulis di setiap program, misalnya selamanya atau satu tahun. Setelah masa akses habis, video tidak bisa ditonton lagi sampai Anda membeli atau memperpanjang.",
          "## Kesehatan dan keselamatan",
          "Latihan di website ini bersifat umum dan bukan pengganti saran dokter. Konsultasikan dengan dokter sebelum memulai, terutama jika Anda punya penyakit jantung, tekanan darah tinggi, cedera, atau baru menjalani operasi. Gunakan kursi yang kokoh, berlatih pelan-pelan, dan hentikan latihan bila merasa pusing, sesak, atau nyeri.",
          "## Hak cipta",
          "Semua video, foto, dan tulisan di website ini milik kami. Dilarang merekam ulang, mengunduh, atau menyebarkannya tanpa izin tertulis.",
          "## Perubahan ketentuan",
          "Ketentuan ini dapat kami perbarui sewaktu-waktu. Tanggal pembaruan terakhir tercantum di bagian atas halaman ini.",
        ].join("\n\n"), "Kosongkan satu baris untuk paragraf baru. Awali baris dengan ## untuk membuat subjudul."),
    ],
  },
  {
    title: "Halaman Kebijakan Refund",
    note: "Teks awal hanya contoh. Pastikan aturan pengembalian dana sesuai keputusan client.",
    fields: [
      t("refund_judul", "Judul", "Kebijakan Pengembalian Dana"),
      t("refund_tanggal", "Terakhir diperbarui", "15 November 2026"),
      area("refund_isi", "Isi", [
          "Kami ingin Anda puas berlatih bersama kami. Berikut ketentuan pengembalian dana untuk program yang dibeli lewat website ini.",
          "## Kapan dana bisa dikembalikan",
          "Anda dapat meminta pengembalian dana penuh dalam 7 hari sejak pembayaran jika: pembayaran tertagih dua kali untuk pesanan yang sama, atau program tidak bisa dibuka karena kendala dari pihak kami dan tidak dapat kami perbaiki dalam 3 hari kerja.",
          "## Kapan dana tidak bisa dikembalikan",
          "Karena program berupa video digital yang langsung bisa ditonton, dana tidak dapat dikembalikan karena berubah pikiran setelah program dibuka, atau setelah masa akses berjalan lebih dari 7 hari.",
          "## Cara mengajukan",
          "Hubungi kami lewat WhatsApp atau email yang tertera di halaman Kontak. Sertakan nama, email akun, dan nomor pesanan (diawali BL-). Kami akan membalas paling lambat 2 hari kerja.",
          "## Proses pengembalian",
          "Jika disetujui, dana dikembalikan dalam 7–14 hari kerja melalui metode pembayaran yang sama atau transfer bank, dan akses program untuk pesanan tersebut akan ditutup.",
        ].join("\n\n"), "Kosongkan satu baris untuk paragraf baru. Awali baris dengan ## untuk membuat subjudul."),
    ],
  },
  {
    title: "Halaman Kontak",
    note: "Tombol WhatsApp memakai nomor di bagian Umum.",
    fields: [
      t("kontak_judul", "Judul", "Hubungi kami"),
      area("kontak_teks", "Kalimat pembuka", "Ada pertanyaan soal program, pembayaran, atau akun? Kami siap membantu."),
      t("kontak_email", "Email", "bbebasgerak@gmail.com"),
      t("kontak_jam", "Jam layanan", "Senin–Sabtu, 08.00–17.00 WIB"),
      area("kontak_alamat", "Alamat (opsional)", "", "Kosongkan kalau tidak ingin menampilkan alamat."),
    ],
  },
  {
    title: "Halaman Kebijakan Privasi",
    note: "Teks awal hanya contoh. Minta client membaca dan menyesuaikannya sebelum web dipakai untuk jualan.",
    fields: [
      t("privasi_judul", "Judul", "Kebijakan Privasi"),
      t("privasi_tanggal", "Terakhir diperbarui", "15 November 2026"),
      area("privasi_isi", "Isi", [
          `Halaman ini menjelaskan data apa yang dikumpulkan ${site.name} saat Anda memakai website ini, untuk apa data itu dipakai, dan bagaimana Anda bisa meminta data Anda dihapus.`,
          "## Data yang kami kumpulkan",
          "Saat Anda mendaftar atau masuk, kami menyimpan nama, alamat email, dan foto profil dari akun Google Anda (jika masuk dengan Google). Saat Anda membeli program, kami menyimpan riwayat pesanan: program yang dibeli, jumlah yang dibayar, waktu pembayaran, dan cara pembayaran. Saat Anda berlatih, kami mencatat video mana yang sudah Anda selesaikan.",
          "Kami tidak pernah melihat atau menyimpan nomor kartu, PIN, atau kata sandi bank Anda. Pembayaran diproses langsung oleh Midtrans.",
          "## Untuk apa data dipakai",
          "Data dipakai hanya untuk menjalankan layanan: membuka akses program yang sudah Anda beli, menyimpan kemajuan latihan, mengirim email yang berkaitan dengan akun Anda (misalnya kode masuk atau atur ulang kata sandi), dan membantu Anda saat menghubungi kami. Kami tidak menjual data Anda kepada siapa pun.",
          "## Layanan pihak ketiga",
          "Untuk menjalankan website ini kami memakai layanan berikut: Clerk dan Google (masuk akun), Supabase (penyimpanan data), Midtrans (pembayaran), Vercel (server website), dan YouTube (pemutaran video). Masing-masing hanya menerima data yang dibutuhkan untuk tugasnya.",
          "## Cookie",
          "Kami memakai cookie agar Anda tetap masuk ke akun selama memakai website. Kami tidak memakai cookie untuk iklan.",
          "## Menghapus data Anda",
          "Anda bisa meminta akun dan data Anda dihapus kapan saja dengan menghubungi kami lewat email bbebasgerak@gmail.com atau tombol WhatsApp di bagian bawah halaman. Permintaan akan kami proses paling lambat 14 hari kerja.",
          "## Perubahan kebijakan",
          "Kebijakan ini dapat kami perbarui sewaktu-waktu. Tanggal pembaruan terakhir tercantum di bagian atas halaman ini.",
        ].join("\n\n"), "Kosongkan satu baris untuk paragraf baru. Awali baris dengan ## untuk membuat subjudul."),
    ],
  },
];

export const faqHeading = {
  label: t("faq_label", "Label kecil", "Tanya jawab"),
  judul: t("faq_judul", "Judul", "Yang sering ditanyakan"),
};

export const testiHeading = {
  label: t("testi_label", "Label kecil", "Kata member"),
  judul: t("testi_judul", "Judul", "Mereka sudah merasakannya"),
  teks: t("testi_teks", "Kalimat di bawah judul", "Pesan asli dari member kami. Ketuk gambar untuk memperbesar."),
};

// Testimoni = screenshot pesan asli dari member. `alt` = isi pesannya, dibacakan untuk pengunjung yang penglihatannya lemah.
export type Testimoni = { img: string; nama: string; alt: string };
export const defaultTestimoni: Testimoni[] = [
  {
    img: "/images/testimoni-1.jpg",
    nama: "Renita, member",
    alt: "Pesan dari Renita: awalnya ragu dan takut latihan di gym, tapi bersama Coach Gilang olahraga jadi menyenangkan. Latihannya santai tapi serius soal teknik dan form yang benar, slow but sure.",
  },
  {
    img: "/images/testimoni-2.jpg",
    nama: "Renita, member (lanjutan)",
    alt: "Lanjutan pesan Renita: selalu ada kreativitas dan target baru yang bikin termotivasi. Bersyukur dipertemukan dengan Coach Gilang, bukan cuma belajar olahraga dengan benar tapi juga membangun kebiasaan baik.",
  },
  {
    img: "/images/testimoni-3.jpg",
    nama: "Evi, member 4 tahun",
    alt: "Pesan dari Evi: latihan aman, tidak ada kendala. Badan sudah beradaptasi, otot lebih kencang dan kuat setelah 4 tahun latihan. Semoga kalau sudah lansia masih bisa lincah. Terima kasih sudah menyemangati, programnya mantap.",
  },
];

export type Faq = { q: string; a: string };
export const defaultFaq: Faq[] = [
  { q: "Apakah aman untuk lutut dan punggung?", a: "Hampir semua gerakan dilakukan sambil duduk atau berpegangan pada kursi. Ada pilihan gerakan lebih ringan di setiap video. Jika punya kondisi kesehatan khusus, konsultasikan dulu dengan dokter." },
  { q: "Perlu alat apa saja?", a: "Cukup kursi kokoh tanpa roda. Beberapa latihan memakai botol air sebagai beban ringan — tidak wajib." },
  { q: "Bagaimana cara membayar?", a: "Bisa lewat QRIS, transfer bank (virtual account), GoPay, ShopeePay, atau kartu. Setelah bayar, program langsung terbuka di menu Latihan Saya." },
  { q: "Bisa ditonton di TV?", a: "Bisa. Buka website ini di HP atau tablet, lalu tampilkan ke TV (cast/screen mirroring). Bisa juga dibuka langsung dari browser Smart TV." },
  { q: "Saya sering lupa password, bagaimana?", a: "Paling mudah masuk dengan akun Google, jadi tidak perlu mengingat password. Kalau memakai email, tekan \"Lupa kata sandi?\" di halaman Masuk untuk membuat kata sandi baru." },
  { q: "Kalau bingung, bisa minta bantuan?", a: "Tentu. Tekan tombol WhatsApp di bagian bawah halaman, tim kami siap membantu." },
];

export type ContentKey =
  | (typeof groups)[number]["fields"][number]["key"]
  | "faq_label" | "faq_judul" | "testi_label" | "testi_judul" | "testi_teks";
export type FieldDef = { key: ContentKey; label: string; def: string; kind: Kind; hint?: string };
export const allFields: FieldDef[] = [
  ...groups.flatMap((g) => g.fields as FieldDef[]),
  faqHeading.label, faqHeading.judul,
  testiHeading.label, testiHeading.judul, testiHeading.teks,
];
export type Content = Record<ContentKey, string> & { faq: Faq[]; testimoni: Testimoni[] };

const isTesti = (x: unknown): x is Testimoni =>
  typeof x === "object" && x !== null && typeof (x as Testimoni).img === "string" && Boolean((x as Testimoni).img.trim()) &&
  typeof (x as Testimoni).nama === "string" && typeof (x as Testimoni).alt === "string";

const isFaq = (x: unknown): x is Faq =>
  typeof x === "object" && x !== null && typeof (x as Faq).q === "string" && typeof (x as Faq).a === "string" && Boolean((x as Faq).q.trim() && (x as Faq).a.trim());

/** Gabungkan isi tersimpan dengan isi awal. Kolom kosong, rusak, atau tidak dikenal kembali ke isi awal. */
export function mergeContent(saved: unknown): Content {
  const s = (typeof saved === "object" && saved !== null ? saved : {}) as Record<string, unknown>;
  const out = {} as Content;
  for (const f of allFields) {
    const v = s[f.key];
    out[f.key] = typeof v === "string" && v.trim() ? v.trim() : f.def;
  }
  const faq = Array.isArray(s.faq) ? s.faq.filter(isFaq) : [];
  out.faq = faq.length ? faq : defaultFaq;
  // Beda dengan tanya jawab: kalau admin sengaja menghapus semua testimoni, bagiannya disembunyikan.
  out.testimoni = Array.isArray(s.testimoni) ? s.testimoni.filter(isTesti) : defaultTestimoni;
  return out;
}

/** Foto per program: buang isi yang bukan teks. Alamatnya sudah diperiksa saat disimpan. */
export function cleanPhotoMap(saved: unknown): Record<string, string> {
  if (typeof saved !== "object" || saved === null || Array.isArray(saved)) return {};
  return Object.fromEntries(Object.entries(saved).filter(([, v]) => typeof v === "string" && v.trim() !== ""));
}

/** Foto hanya boleh dari folder bawaan web atau dari penyimpanan foto web ini. Alamat lain ditolak. */
export const isAllowedImage = (url: string, storageBase: string) =>
  /^\/images\/[\w.-]+$/.test(url) || (storageBase !== "" && url.startsWith(storageBase) && !url.includes(".."));

export const waLink = (number: string, text = "Halo, saya mau tanya tentang program latihan.") =>
  /^\d{8,15}$/.test(number) ? `https://wa.me/${number}?text=${encodeURIComponent(text)}` : null;
