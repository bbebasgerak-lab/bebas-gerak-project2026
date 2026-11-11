import { cache } from "react";
import { unstable_cache } from "next/cache";
import { db } from "./supabase";
import { dbReady } from "./data";
import { mergeContent, type Content } from "./content-fields";

// Isi web (teks, alamat foto, tanya jawab) disimpan sebagai satu file JSON di Supabase Storage,
// di bucket publik yang sama dengan foto unggahan. Tidak perlu tabel baru di database.
export const BUCKET = "web";
export const CONTENT_FILE = "konten.json";
export const CONTENT_TAG = "konten";

export const storageBase = () =>
  process.env.SUPABASE_URL ? `${process.env.SUPABASE_URL}/storage/v1/object/public/${BUCKET}/` : "";

// Disimpan di cache Next sampai admin menekan Simpan (lihat saveContent), jadi halaman tidak
// mengunduh file ini setiap kali dibuka. Kalau gagal diunduh, error dilempar supaya tidak ikut ter-cache.
const readSaved = unstable_cache(
  async (): Promise<unknown> => {
    const { data, error } = await db().storage.from(BUCKET).download(CONTENT_FILE);
    if (error) {
      if (/not.?found/i.test(`${error.name} ${error.message} ${JSON.stringify(error)}`)) return {}; // belum pernah disimpan
      throw error;
    }
    return JSON.parse(await data.text());
  },
  [CONTENT_TAG],
  { tags: [CONTENT_TAG] },
);

/** Isi web saat ini. Kalau Supabase bermasalah, web tetap tampil dengan isi awal. */
export const getContent = cache(async (): Promise<Content> => {
  if (!dbReady()) return mergeContent(null);
  try {
    return mergeContent(await readSaved());
  } catch (e) {
    console.error("Gagal membaca isi web dari Supabase, memakai isi awal:", e);
    return mergeContent(null);
  }
});
