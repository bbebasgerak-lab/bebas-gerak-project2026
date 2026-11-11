"use server";

import { revalidatePath, updateTag } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/supabase";
import { BUCKET, CONTENT_FILE, CONTENT_TAG, storageBase } from "@/lib/content";
import { allFields, isAllowedImage } from "@/lib/content-fields";

type PutOptions = { contentType: string; upsert?: boolean; cacheControl: string };

// Unggah ke Supabase Storage. Bucket dibuat otomatis kalau project Supabase-nya masih baru.
async function put(path: string, body: Blob | string, options: PutOptions) {
  const storage = db().storage;
  let { error } = await storage.from(BUCKET).upload(path, body, options);
  if (error && /bucket not found/i.test(error.message)) {
    await storage.createBucket(BUCKET, { public: true });
    ({ error } = await storage.from(BUCKET).upload(path, body, options));
  }
  return error?.message ?? null;
}

export async function saveContent(fd: FormData) {
  await requireAdmin();
  const data: Record<string, unknown> = {};
  for (const f of allFields) {
    let v = String(fd.get(f.key) ?? "").trim();
    if (f.key === "whatsapp" && v) {
      v = v.replace(/\D/g, "").replace(/^0/, "62"); // "0812-3456…" atau "+62 812…" → "62812…"
      if (!/^\d{8,15}$/.test(v)) return { error: "Nomor WhatsApp tidak dikenali. Contoh: 6281234567890" };
    }
    if (!v || v === f.def) continue; // kosong / sama dengan isi awal: tidak perlu disimpan
    if (f.kind === "image" && !isAllowedImage(v, storageBase())) return { error: `${f.label} tidak dikenali. Coba unggah ulang fotonya.` };
    data[f.key] = v;
  }

  const answers = fd.getAll("faq_a").map((a) => String(a).trim());
  const faq = fd.getAll("faq_q").map((q, i) => ({ q: String(q).trim(), a: answers[i] ?? "" })).filter((x) => x.q || x.a);
  const half = faq.findIndex((x) => !x.q || !x.a);
  if (half >= 0) return { error: `Tanya jawab nomor ${half + 1} belum lengkap. Isi pertanyaan dan jawabannya, atau hapus.` };
  if (faq.length) data.faq = faq;

  // cacheControl 0: file ini selalu ditimpa di alamat yang sama, jadi tidak boleh disimpan lama oleh CDN.
  const error = await put(CONTENT_FILE, JSON.stringify(data, null, 2), { contentType: "application/json", upsert: true, cacheControl: "0" });
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
