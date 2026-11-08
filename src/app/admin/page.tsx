import { db } from "@/lib/supabase";
import { rupiah } from "@/lib/data";
import { OrdersTable } from "./orders-table";

export default async function AdminHome() {
  const supabase = db();
  const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
  const nowIso = new Date().toISOString();
  const [{ data: paid }, { data: members }, { data: recent }] = await Promise.all([
    supabase.from("orders").select("amount, paid_at").eq("status", "paid"),
    supabase.from("access").select("user_id").or(`expires_at.is.null,expires_at.gt.${nowIso}`),
    supabase.from("orders").select("*, programs(title)").order("created_at", { ascending: false }).limit(10),
  ]);

  const total = (paid ?? []).reduce((s, o) => s + o.amount, 0);
  const month = (paid ?? []).filter((o) => o.paid_at && o.paid_at >= monthStart).reduce((s, o) => s + o.amount, 0);
  const stats = [
    ["Pendapatan bulan ini", rupiah(month)],
    ["Total pendapatan", rupiah(total)],
    ["Pesanan dibayar", String(paid?.length ?? 0)],
    ["Member aktif", String(new Set((members ?? []).map((m) => m.user_id)).size)],
  ];

  return (
    <>
      <h1 className="text-4xl font-semibold">Ringkasan</h1>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(([label, value]) => (
          <div key={label} className="rounded-2xl border bg-card p-6">
            <p className="text-muted-foreground">{label}</p>
            <p className="font-heading text-3xl font-semibold">{value}</p>
          </div>
        ))}
      </div>
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Pesanan terbaru</h2>
        <OrdersTable orders={recent ?? []} />
      </section>
    </>
  );
}
