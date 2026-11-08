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
