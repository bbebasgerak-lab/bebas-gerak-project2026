import Link from "next/link";
import { CheckCircle2, Clock, XCircle } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { requireUser } from "@/lib/auth";
import { accessRows, dbReady, publishedPrograms } from "@/lib/data";
import { isActive } from "@/lib/access";
import { applyPayment, fetchStatus } from "@/lib/payment";
import { db, type Order } from "@/lib/supabase";

export const metadata = { title: "Latihan Saya" };

const tanggal = (iso: string) => new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });

// Saat member kembali dari pembayaran: kalau webhook belum masuk, tanya status langsung ke Midtrans.
async function orderStatus(orderId: string, userId: string) {
  const { data: order } = await db().from("orders").select("*").eq("id", orderId).eq("user_id", userId).maybeSingle<Order>();
  if (!order) return null;
  if (order.status !== "pending") return order.status;
  const result = await applyPayment(await fetchStatus(order.id));
  return "status" in result ? result.status : "pending";
}

export default async function MyTraining({ searchParams }: PageProps<"/latihan">) {
  const viewer = await requireUser();
  if (!dbReady()) return <p className="p-10 text-center">Database belum diatur.</p>;

  const { order } = await searchParams;
  const status = typeof order === "string" ? await orderStatus(order, viewer.id) : null;

  const now = new Date();
  const [rows, programs] = await Promise.all([accessRows(viewer.id), publishedPrograms()]);
  const active = rows.filter((r) => isActive(r, now));
  const membership = active.find((r) => r.kind === "membership");
  const mine = programs.filter((p) => p.kind === "program" && (membership || active.some((r) => r.program_id === p.id)));

  const ids = mine.map((p) => p.id);
  const supabase = db();
  const [{ data: vids }, { data: done }] = await Promise.all([
    supabase.from("videos").select("id, program_id").in("program_id", ids.length ? ids : ["00000000-0000-0000-0000-000000000000"]),
    supabase.from("progress").select("video_id").eq("user_id", viewer.id),
  ]);
  const doneSet = new Set((done ?? []).map((d) => d.video_id));

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-14">
      {status === "paid" && (
        <Banner icon={<CheckCircle2 className="size-7" />} tone="bg-primary text-primary-foreground">
          Pembayaran berhasil. Program Anda sudah terbuka — selamat berlatih!
        </Banner>
      )}
      {status === "pending" && (
        <Banner icon={<Clock className="size-7" />} tone="bg-secondary">
          Kami masih menunggu pembayaran Anda. Setelah selesai membayar, muat ulang halaman ini.
        </Banner>
      )}
      {status === "failed" && (
        <Banner icon={<XCircle className="size-7" />} tone="bg-destructive/10 text-destructive">
          Pembayaran gagal atau kedaluwarsa. Silakan coba beli lagi.
        </Banner>
      )}

      <div className="space-y-2">
        <h1 className="text-5xl font-semibold">Halo, {viewer.name}</h1>
        <p className="text-xl text-muted-foreground">Pilih program untuk mulai latihan hari ini.</p>
      </div>

      {membership && (
        <p className="rounded-2xl border bg-card p-5 text-lg">
          <strong>Member Bugar aktif</strong>
          {membership.expires_at ? ` sampai ${tanggal(membership.expires_at)}.` : " selamanya."} Semua program terbuka untuk Anda.
        </p>
      )}

      {mine.length ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mine.map((p) => {
            const list = (vids ?? []).filter((v) => v.program_id === p.id);
            const finished = list.filter((v) => doneSet.has(v.id)).length;
            const pct = list.length ? Math.round((finished / list.length) * 100) : 0;
            return (
              <Link key={p.id} href={`/latihan/${p.slug}`} className="group space-y-4 rounded-3xl border bg-card p-7 shadow-sm transition hover:border-primary hover:shadow-md">
                <h2 className="text-2xl font-semibold group-hover:text-primary">{p.title}</h2>
                <div className="space-y-2">
                  <div className="h-3 overflow-hidden rounded-full bg-muted" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
                    <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
                  </div>
                  <p className="text-muted-foreground">{finished} dari {list.length} video selesai</p>
                </div>
                <span className={buttonVariants({ className: "w-full" })}>{finished ? "Lanjutkan" : "Mulai"}</span>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="space-y-4 rounded-3xl bg-muted p-10 text-center">
          <p className="text-xl">Anda belum punya program.</p>
          <Link href="/program" className={buttonVariants({ size: "lg" })}>Lihat program</Link>
        </div>
      )}
    </div>
  );
}

function Banner({ icon, tone, children }: { icon: React.ReactNode; tone: string; children: React.ReactNode }) {
  return (
    <div className={`flex items-center gap-4 rounded-2xl p-5 text-lg font-bold ${tone}`} role="status">
      {icon}
      <p>{children}</p>
    </div>
  );
}
