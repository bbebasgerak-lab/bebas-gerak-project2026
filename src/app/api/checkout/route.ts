import { randomBytes } from "node:crypto";
import { getViewer } from "@/lib/auth";
import { db, type Order, type Program } from "@/lib/supabase";
import { createSnapToken } from "@/lib/payment";

export async function POST(req: Request) {
  const viewer = await getViewer();
  if (!viewer) return Response.json({ error: "Silakan masuk dulu." }, { status: 401 });

  const { programId } = await req.json().catch(() => ({}));
  const supabase = db();
  const { data: program } = await supabase
    .from("programs").select("*").eq("id", String(programId ?? "")).eq("is_published", true).maybeSingle<Program>();
  if (!program) return Response.json({ error: "Program tidak ditemukan." }, { status: 404 });

  // Harga selalu diambil dari database, bukan dari browser.
  const order = {
    id: `BL-${Date.now()}-${randomBytes(3).toString("hex")}`,
    user_id: viewer.id,
    email: viewer.email,
    program_id: program.id,
    amount: program.price,
    status: "pending",
  };
  const { error } = await supabase.from("orders").insert(order);
  if (error) return Response.json({ error: "Gagal membuat pesanan." }, { status: 500 });

  try {
    const token = await createSnapToken(order as Order, program, viewer.name);
    return Response.json({ token, orderId: order.id });
  } catch (e) {
    console.error(e);
    return Response.json({ error: "Pembayaran sedang bermasalah, coba lagi sebentar." }, { status: 502 });
  }
}
