import { cache } from "react";
import { unstable_cache } from "next/cache";
import { db } from "./supabase";
import { dbReady } from "./data";
import { cleanPhotoMap, mergeContent, type Content } from "./content-fields";

// Isi web (teks, alamat foto, tanya jawab) dan foto tiap program disimpan sebagai file JSON di
// Supabase Storage, di bucket publik yang sama dengan foto unggahan. Tidak perlu tabel baru di database.
export const BUCKET = "web";
export const CONTENT_FILE = "konten.json";
export const PROGRAM_PHOTO_FILE = "program-foto.json"; // { "<id program>": "<alamat foto>" }
export const CONTENT_TAG = "konten";

export const storageBase = () =>
  process.env.SUPABASE_URL ? `${process.env.SUPABASE_URL}/storage/v1/object/public/${BUCKET}/` : "";

/** Unduh satu file JSON dari bucket. File yang belum pernah disimpan dianggap kosong. */
export async function downloadJson(file: string): Promise<unknown> {
  const { data, error } = await db().storage.from(BUCKET).download(file);
  if (error) {
    if (/not.?found/i.test(`${error.name} ${error.message} ${JSON.stringify(error)}`)) return {};
    throw error;
  }
  return JSON.parse(await data.text());
}

type PutOptions = { contentType: string; upsert?: boolean; cacheControl: string };

/** Unggah ke Supabase Storage. Bucket dibuat otomatis kalau project Supabase-nya masih baru. Mengembalikan pesan error atau null. */
export async function put(path: string, body: Blob | string, options: PutOptions) {
  const storage = db().storage;
  let { error } = await storage.from(BUCKET).upload(path, body, options);
  if (error && /bucket not found/i.test(error.message)) {
    await storage.createBucket(BUCKET, { public: true });
    ({ error } = await storage.from(BUCKET).upload(path, body, options));
  }
  return error?.message ?? null;
}

/** Tulis file JSON yang selalu ditimpa di alamat yang sama, jadi tidak boleh disimpan lama oleh CDN. */
export const putJson = (file: string, data: unknown) =>
  put(file, JSON.stringify(data, null, 2), { contentType: "application/json", upsert: true, cacheControl: "0" });

// Disimpan di cache Next sampai admin menyimpan (updateTag CONTENT_TAG), jadi halaman tidak
// mengunduh file ini setiap kali dibuka. Kalau gagal diunduh, error dilempar supaya tidak ikut ter-cache.
const readSaved = unstable_cache(() => downloadJson(CONTENT_FILE), [CONTENT_TAG], { tags: [CONTENT_TAG] });
const readProgramPhotos = unstable_cache(() => downloadJson(PROGRAM_PHOTO_FILE), [PROGRAM_PHOTO_FILE], { tags: [CONTENT_TAG] });

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

/** Foto tiap program, per id program. Kalau Supabase bermasalah, kartu program tampil tanpa foto. */
export const getProgramPhotos = cache(async (): Promise<Record<string, string>> => {
  if (!dbReady()) return {};
  try {
    return cleanPhotoMap(await readProgramPhotos());
  } catch (e) {
    console.error("Gagal membaca foto program dari Supabase:", e);
    return {};
  }
});
