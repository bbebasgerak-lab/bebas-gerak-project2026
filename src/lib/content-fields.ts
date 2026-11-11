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
];

export const faqHeading = {
  label: t("faq_label", "Label kecil", "Tanya jawab"),
  judul: t("faq_judul", "Judul", "Yang sering ditanyakan"),
};

export type Faq = { q: string; a: string };
export const defaultFaq: Faq[] = [
  { q: "Apakah aman untuk lutut dan punggung?", a: "Hampir semua gerakan dilakukan sambil duduk atau berpegangan pada kursi. Ada pilihan gerakan lebih ringan di setiap video. Jika punya kondisi kesehatan khusus, konsultasikan dulu dengan dokter." },
  { q: "Perlu alat apa saja?", a: "Cukup kursi kokoh tanpa roda. Beberapa latihan memakai botol air sebagai beban ringan — tidak wajib." },
  { q: "Bagaimana cara membayar?", a: "Bisa lewat QRIS, transfer bank (virtual account), GoPay, ShopeePay, atau kartu. Setelah bayar, program langsung terbuka di menu Latihan Saya." },
  { q: "Bisa ditonton di TV?", a: "Bisa. Buka website ini di HP atau tablet, lalu tampilkan ke TV (cast/screen mirroring). Bisa juga dibuka langsung dari browser Smart TV." },
  { q: "Saya sering lupa password, bagaimana?", a: "Paling mudah masuk dengan akun Google, jadi tidak perlu mengingat password. Kalau memakai email, tekan \"Lupa kata sandi?\" di halaman Masuk untuk membuat kata sandi baru." },
  { q: "Kalau bingung, bisa minta bantuan?", a: "Tentu. Tekan tombol WhatsApp di bagian bawah halaman, tim kami siap membantu." },
];

export type ContentKey = (typeof groups)[number]["fields"][number]["key"] | "faq_label" | "faq_judul";
export type FieldDef = { key: ContentKey; label: string; def: string; kind: Kind; hint?: string };
export const allFields: FieldDef[] = [...groups.flatMap((g) => g.fields as FieldDef[]), faqHeading.label, faqHeading.judul];
export type Content = Record<ContentKey, string> & { faq: Faq[] };

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
  return out;
}

/** Foto hanya boleh dari folder bawaan web atau dari penyimpanan foto web ini. Alamat lain ditolak. */
export const isAllowedImage = (url: string, storageBase: string) =>
  /^\/images\/[\w.-]+$/.test(url) || (storageBase !== "" && url.startsWith(storageBase) && !url.includes(".."));

export const waLink = (number: string, text = "Halo, saya mau tanya tentang program latihan.") =>
  /^\d{8,15}$/.test(number) ? `https://wa.me/${number}?text=${encodeURIComponent(text)}` : null;
