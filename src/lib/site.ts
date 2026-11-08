// Nama brand sementara. Ganti di sini saja kalau client sudah punya nama.
export const site = {
  name: "Bugar Lansia",
  tagline: "Latihan kursi yang aman, pelan, dan menyenangkan dari rumah",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "", // format 628xxxxxxxxxx
};

export const waLink = (text = "Halo, saya mau tanya tentang program latihan.") =>
  site.whatsapp ? `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}` : null;
