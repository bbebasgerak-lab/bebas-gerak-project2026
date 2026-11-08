import { db, type Order, type Program } from "./supabase";
import { computeExpiry } from "./access";
import { paymentOutcome, verifySignature, type MidtransNotification } from "./midtrans-core";

const SERVER_KEY = () => process.env.MIDTRANS_SERVER_KEY!;
const PROD = () => process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === "true";
const authHeader = () => "Basic " + Buffer.from(SERVER_KEY() + ":").toString("base64");

/** Buat transaksi Snap, kembalikan token untuk pop-up pembayaran. */
export async function createSnapToken(order: Order, program: Program, name: string) {
  const res = await fetch(`https://app${PROD() ? "" : ".sandbox"}.midtrans.com/snap/v1/transactions`, {
    method: "POST",
    headers: { Authorization: authHeader(), "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      transaction_details: { order_id: order.id, gross_amount: order.amount },
      item_details: [{ id: program.id, price: order.amount, quantity: 1, name: program.title.slice(0, 50) }],
      customer_details: { first_name: name, email: order.email ?? undefined },
    }),
  });
  const body = await res.json();
  if (!res.ok || !body.token) throw new Error(`Midtrans: ${JSON.stringify(body.error_messages ?? body)}`);
  return body.token as string;
}

/** Tanya status langsung ke Midtrans (dipakai saat member balik ke web, kalau webhook belum masuk). */
export async function fetchStatus(orderId: string): Promise<MidtransNotification> {
  const res = await fetch(`https://api${PROD() ? "" : ".sandbox"}.midtrans.com/v2/${encodeURIComponent(orderId)}/status`, {
    headers: { Authorization: authHeader(), Accept: "application/json" },
    cache: "no-store",
  });
  return res.json();
}

/**
 * Proses notifikasi/status Midtrans: verifikasi, cek nominal, tandai pesanan, buka akses.
 * Aman dipanggil berkali-kali untuk pesanan yang sama.
 */
export async function applyPayment(n: MidtransNotification) {
  if (!verifySignature(n, SERVER_KEY())) return { ok: false, reason: "bad signature" } as const;

  const supabase = db();
  const { data: order } = await supabase.from("orders").select("*, programs(*)").eq("id", n.order_id!).maybeSingle();
  if (!order) return { ok: false, reason: "unknown order" } as const;
  if (Math.round(Number(n.gross_amount)) !== order.amount) return { ok: false, reason: "amount mismatch" } as const;

  const outcome = paymentOutcome(n);
  if (outcome === "failed") {
    await supabase.from("orders").update({ status: "failed", raw: n }).eq("id", order.id).eq("status", "pending");
    return { ok: true, status: "failed" } as const;
  }
  if (outcome !== "paid") return { ok: true, status: "pending" } as const;

  // Hanya satu proses yang berhasil mengubah pending -> paid; sisanya dianggap duplikat.
  const { data: claimed } = await supabase
    .from("orders")
    .update({ status: "paid", paid_at: new Date().toISOString(), payment_type: n.payment_type ?? null, raw: n })
    .eq("id", order.id)
    .neq("status", "paid")
    .select("id");
  if (!claimed?.length) return { ok: true, status: "paid", duplicate: true } as const;

  await grantAccess(order.user_id, order.email, order.programs as Program, "purchase");
  return { ok: true, status: "paid", accessGranted: true } as const;
}

export async function grantAccess(userId: string, email: string | null, program: Program, source: "purchase" | "manual") {
  const supabase = db();
  const { data: existing } = await supabase
    .from("access").select("expires_at").eq("user_id", userId).eq("program_id", program.id).maybeSingle();
  // Sudah punya akses selamanya -> tetap selamanya.
  if (existing && existing.expires_at == null) return;
  const expires = computeExpiry(existing?.expires_at ? new Date(existing.expires_at) : null, program.access_days, new Date());
  const { error } = await supabase.from("access").upsert({
    user_id: userId,
    program_id: program.id,
    email,
    source,
    expires_at: expires?.toISOString() ?? null,
    granted_at: new Date().toISOString(),
  });
  if (error) throw error;
}
