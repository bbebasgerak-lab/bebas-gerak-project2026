import { applyPayment } from "@/lib/payment";

// URL ini dipasang di Midtrans: Settings -> Payment -> Notification URL.
export async function POST(req: Request) {
  const n = await req.json().catch(() => null);
  if (!n) return Response.json({ ok: false, reason: "bad body" }, { status: 400 });

  const result = await applyPayment(n);
  if ("reason" in result && result.reason === "bad signature") return Response.json(result, { status: 403 });
  // Pesanan tak dikenal (mis. tombol "Test notification" Midtrans) tetap dibalas 200 supaya tidak diulang terus.
  return Response.json(result);
}
