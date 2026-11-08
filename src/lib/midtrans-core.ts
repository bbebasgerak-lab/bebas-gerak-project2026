// Aturan pembayaran Midtrans. Sengaja tanpa import Next/Supabase supaya bisa dites langsung.
import { createHash, timingSafeEqual } from "node:crypto";

export type MidtransNotification = {
  order_id?: string;
  status_code?: string;
  gross_amount?: string;
  signature_key?: string;
  transaction_status?: string;
  fraud_status?: string;
  payment_type?: string;
};

/** Notifikasi asli dari Midtrans? signature = SHA512(order_id + status_code + gross_amount + server key). */
export function verifySignature(n: MidtransNotification, serverKey: string) {
  if (!n.signature_key || !n.order_id || !n.status_code || !n.gross_amount) return false;
  const expected = createHash("sha512").update(n.order_id + n.status_code + n.gross_amount + serverKey).digest();
  const given = Buffer.from(n.signature_key, "hex");
  return given.length === expected.length && timingSafeEqual(given, expected);
}

export function paymentOutcome(n: MidtransNotification): "paid" | "failed" | "pending" {
  const s = n.transaction_status;
  if (s === "settlement" || (s === "capture" && n.fraud_status === "accept")) return "paid";
  if (s === "deny" || s === "cancel" || s === "expire" || s === "failure") return "failed";
  return "pending";
}
