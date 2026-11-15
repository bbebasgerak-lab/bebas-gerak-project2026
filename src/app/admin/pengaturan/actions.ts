"use server";

import { revalidatePath, updateTag } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { CONTENT_FILE, CONTENT_TAG, put, putJson, storageBase } from "@/lib/content";
import { allFields, isAllowedImage } from "@/lib/content-fields";

export async function saveContent(fd: FormData) {
  await requireAdmin();
  const data: Record<string, unknown> = {};
  for (const f of allFields) {
    let v = String(fd.get(f.key) ?? "").replace(/\r\n/g, "\n").trim(); // browser mengirim baris baru sebagai \r\n
    if (f.key === "whatsapp" && v) {
      v = v.replace(/\D/g, "").replace(/^0/, "62"); // "0812-3456…" atau "+62 812…" → "62812…"
      if (!/^\d{8,15}$/.test(v)) return { error: "Nomor WhatsApp tidak dikenali. Contoh: 6281234567890" };
    }
    if (!v || v === f.def) continue; // kosong / sama dengan isi awal: tidak perlu disimpan
    if (f.kind === "image" && !isAllowedImage(v, storageBase())) return { error: `${f.label} tidak dikenali. Coba unggah ulang fotonya.` };
    data[f.key] = v;
  }

  const answers = fd.getAll("faq_a").map((a) => String(a).replace(/\r\n/g, "\n").trim());
  const faq = fd.getAll("faq_q").map((q, i) => ({ q: String(q).trim(), a: answers[i] ?? "" })).filter((x) => x.q || x.a);
  const half = faq.findIndex((x) => !x.q || !x.a);
  if (half >= 0) return { error: `Tanya jawab nomor ${half + 1} belum lengkap. Isi pertanyaan dan jawabannya, atau hapus.` };
  if (faq.length) data.faq = faq;

  // Testimoni selalu disimpan (boleh kosong = bagian testimoni disembunyikan).
  const names = fd.getAll("testi_nama").map((v) => String(v).trim());
  const alts = fd.getAll("testi_alt").map((v) => String(v).replace(/\r\n/g, "\n").trim());
  const testimoni = fd.getAll("testi_img").map((v, i) => ({ img: String(v).trim(), nama: names[i] ?? "", alt: alts[i] ?? "" }));
  const noImg = testimoni.findIndex((x) => !x.img);
  if (noImg >= 0) return { error: `Testimoni nomor ${noImg + 1} belum ada gambarnya. Pilih gambar, atau hapus.` };
  if (testimoni.some((x) => !isAllowedImage(x.img, storageBase()))) return { error: "Ada gambar testimoni yang tidak dikenali. Coba unggah ulang." };
  data.testimoni = testimoni;

  const error = await putJson(CONTENT_FILE, data);
  if (error) return { error: `Gagal menyimpan: ${error}` };
  updateTag(CONTENT_TAG);
  revalidatePath("/", "layout");
}

/** Unggah satu foto (sudah diperkecil di browser). Mengembalikan alamat publiknya. */
export async function uploadImage(fd: FormData): Promise<{ url: string } | { error: string }> {
  await requireAdmin();
  const file = fd.get("file");
  if (!(file instanceof Blob) || file.type !== "image/jpeg") return { error: "File foto tidak terbaca. Coba pilih foto lain." };
  if (file.size > 900_000) return { error: "Foto terlalu besar. Coba foto lain." };
  // Nama unik per unggahan, jadi boleh disimpan lama oleh CDN. Foto lama tidak dihapus (ukurannya kecil).
  const path = `foto/${Date.now()}-${crypto.randomUUID().slice(0, 8)}.jpg`;
  const error = await put(path, file, { contentType: "image/jpeg", cacheControl: "31536000" });
  if (error) return { error: `Gagal mengunggah foto: ${error}` };
  return { url: storageBase() + path };
}
