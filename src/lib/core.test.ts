// Jalankan: npm test
import { test } from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { computeExpiry, canWatch } from "./access.ts";
import { verifySignature, paymentOutcome } from "./midtrans-core.ts";
import { youtubeId } from "./youtube.ts";

const now = new Date("2026-01-10T00:00:00Z");
const days = (n: number) => n * 86_400_000;

test("computeExpiry: program selamanya", () => {
  assert.equal(computeExpiry(null, null, now), null);
});

test("computeExpiry: membership baru mulai dari sekarang", () => {
  assert.equal(computeExpiry(null, 30, now)?.toISOString(), new Date(now.getTime() + days(30)).toISOString());
});

test("computeExpiry: perpanjang dari tanggal habis kalau masih aktif", () => {
  const current = new Date(now.getTime() + days(5));
  assert.equal(computeExpiry(current, 30, now)?.toISOString(), new Date(current.getTime() + days(30)).toISOString());
});

test("computeExpiry: mulai dari sekarang kalau sudah habis", () => {
  const expired = new Date(now.getTime() - days(5));
  assert.equal(computeExpiry(expired, 30, now)?.toISOString(), new Date(now.getTime() + days(30)).toISOString());
});

test("computeExpiry: akses selamanya tidak berubah jadi terbatas", () => {
  // sudah punya akses selamanya (expires_at null di baris yang ada) ditangani pemanggil;
  // di sini: beli program selamanya saat punya akses terbatas -> jadi selamanya
  assert.equal(computeExpiry(new Date(now.getTime() + days(5)), null, now), null);
});

const prog = "p1";
const rows = (r: { program_id: string; kind: string; expires_at: string | null }[]) => r;

test("canWatch: punya akses program", () => {
  assert.equal(canWatch(rows([{ program_id: prog, kind: "program", expires_at: null }]), prog, now), true);
});

test("canWatch: akses kedaluwarsa ditolak", () => {
  const past = new Date(now.getTime() - 1000).toISOString();
  assert.equal(canWatch(rows([{ program_id: prog, kind: "program", expires_at: past }]), prog, now), false);
});

test("canWatch: membership aktif membuka semua program", () => {
  const future = new Date(now.getTime() + days(1)).toISOString();
  assert.equal(canWatch(rows([{ program_id: "m", kind: "membership", expires_at: future }]), prog, now), true);
});

test("canWatch: tanpa akses ditolak", () => {
  assert.equal(canWatch([], prog, now), false);
});

const KEY = "SB-Mid-server-test";
const sig = (o: string, s: string, g: string) => createHash("sha512").update(o + s + g + KEY).digest("hex");

test("verifySignature: tanda tangan benar diterima", () => {
  const n = { order_id: "BL-1", status_code: "200", gross_amount: "149000.00", signature_key: sig("BL-1", "200", "149000.00") };
  assert.equal(verifySignature(n, KEY), true);
});

test("verifySignature: tanda tangan palsu ditolak", () => {
  const n = { order_id: "BL-1", status_code: "200", gross_amount: "1.00", signature_key: sig("BL-1", "200", "149000.00") };
  assert.equal(verifySignature(n, KEY), false);
  assert.equal(verifySignature({ ...n, signature_key: undefined }, KEY), false);
});

test("paymentOutcome: status Midtrans", () => {
  assert.equal(paymentOutcome({ transaction_status: "settlement" }), "paid");
  assert.equal(paymentOutcome({ transaction_status: "capture", fraud_status: "accept" }), "paid");
  assert.equal(paymentOutcome({ transaction_status: "capture", fraud_status: "challenge" }), "pending");
  assert.equal(paymentOutcome({ transaction_status: "pending" }), "pending");
  for (const s of ["deny", "cancel", "expire", "failure"]) assert.equal(paymentOutcome({ transaction_status: s }), "failed");
});

test("youtubeId: berbagai bentuk link", () => {
  assert.equal(youtubeId("dQw4w9WgXcQ"), "dQw4w9WgXcQ");
  assert.equal(youtubeId("https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=10"), "dQw4w9WgXcQ");
  assert.equal(youtubeId("https://youtu.be/dQw4w9WgXcQ?si=abc"), "dQw4w9WgXcQ");
  assert.equal(youtubeId("https://www.youtube.com/shorts/dQw4w9WgXcQ"), "dQw4w9WgXcQ");
  assert.equal(youtubeId("https://www.youtube.com/embed/dQw4w9WgXcQ"), "dQw4w9WgXcQ");
  assert.equal(youtubeId("bukan link"), null);
});

// ---- Pengaturan Web ----
import { mergeContent, isAllowedImage, waLink, allFields, defaultFaq } from "./content-fields.ts";

test("mergeContent: tanpa isi tersimpan memakai isi awal", () => {
  const c = mergeContent(null);
  assert.equal(c.hero_judul_1, "Tubuh Lebih Kuat,");
  assert.deepEqual(c.faq, defaultFaq);
  for (const f of allFields) assert.equal(typeof c[f.key], "string");
});

test("mergeContent: isi tersimpan menimpa isi awal, kolom kosong/rusak kembali ke awal", () => {
  const c = mergeContent({ hero_judul_1: "  Halo  ", hero_judul_2: "   ", nama: 123, tidak_dikenal: "x" });
  assert.equal(c.hero_judul_1, "Halo");
  assert.equal(c.hero_judul_2, "Langkah Lebih Mantap");
  assert.equal(c.nama, "Bebas Gerak");
  assert.equal("tidak_dikenal" in c, false);
});

test("mergeContent: tanya jawab yang tidak lengkap dibuang", () => {
  assert.deepEqual(mergeContent({ faq: [{ q: "A?", a: "B" }, { q: "", a: "x" }, "rusak"] }).faq, [{ q: "A?", a: "B" }]);
  assert.deepEqual(mergeContent({ faq: [] }).faq, defaultFaq);
  assert.deepEqual(mergeContent({ faq: "rusak" }).faq, defaultFaq);
});

test("kunci kolom tidak ada yang kembar", () => {
  const keys = allFields.map((f) => f.key);
  assert.equal(new Set(keys).size, keys.length);
});

test("isAllowedImage: hanya foto bawaan atau dari penyimpanan web ini", () => {
  const base = "https://abc.supabase.co/storage/v1/object/public/web/";
  assert.equal(isAllowedImage("/images/hero-senam.jpg", base), true);
  assert.equal(isAllowedImage(base + "foto/1.jpg", base), true);
  assert.equal(isAllowedImage("https://jahat.example/x.jpg", base), false);
  assert.equal(isAllowedImage("/images/../rahasia", base), false);
  assert.equal(isAllowedImage(base + "../x", base), false);
  assert.equal(isAllowedImage("https://jahat.example/x.jpg", ""), false);
});

test("waLink: hanya untuk nomor yang berupa angka", () => {
  assert.equal(waLink(""), null);
  assert.equal(waLink("0812-3456"), null);
  assert.match(waLink("6281234567890")!, /^https:\/\/wa\.me\/6281234567890\?text=/);
});
