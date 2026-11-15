import Link from "next/link";
import { Armchair, CheckCircle2, Clock, PlayCircle, XCircle } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { SiteImage } from "@/components/site-image";
import { getProgramPhotos } from "@/lib/content";
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

  // ?order= dari pop-up pembayaran di web; ?order_id= dari Finish Redirect URL Midtrans (mis. setelah bayar di aplikasi GoPay).
  const { order, order_id } = await searchParams;
  const orderId = typeof order === "string" ? order : typeof order_id === "string" ? order_id : null;
  const status = orderId ? await orderStatus(orderId, viewer.id) : null;

  const now = new Date();
  const [rows, programs] = await Promise.all([accessRows(viewer.id), publishedPrograms()]);
  const active = rows.filter((r) => isActive(r, now));
  const membership = active.find((r) => r.kind === "membership");
  const mine = programs.filter((p) => p.kind === "program" && (membership || active.some((r) => r.program_id === p.id)));

  const ids = mine.map((p) => p.id);
  const supabase = db();
  const [{ data: vids }, { data: done }, photos] = await Promise.all([
    supabase.from("videos").select("id, program_id, title, sort").in("program_id", ids.length ? ids : ["00000000-0000-0000-0000-000000000000"]).order("sort"),
    supabase.from("progress").select("video_id").eq("user_id", viewer.id),
    getProgramPhotos(),
  ]);
  const doneSet = new Set((done ?? []).map((d) => d.video_id));

  return (
    <div className="mx-auto max-w-6xl space-y-12 px-4 py-12 md:py-16">
      {status === "paid" && (
        <Banner icon={<CheckCircle2 className="size-8 shrink-0" />} tone="bg-band text-band-foreground">
          Pembayaran berhasil. Program Anda sudah terbuka — selamat berlatih!
        </Banner>
      )}
      {status === "pending" && (
        <Banner icon={<Clock className="size-8 shrink-0" />} tone="bg-card">
          Kami masih menunggu pembayaran Anda. Setelah selesai membayar, muat ulang halaman ini.
        </Banner>
      )}
      {status === "failed" && (
        <Banner icon={<XCircle className="size-8 shrink-0" />} tone="bg-destructive/10 text-destructive">
          Pembayaran gagal atau kedaluwarsa. Silakan coba beli lagi.
        </Banner>
      )}

      <div className="space-y-4">
        <p className="eyebrow">Latihan saya</p>
        <h1 className="text-[2.6rem] leading-[1.05] md:text-6xl">Halo, {viewer.name}</h1>
        <p className="text-xl text-muted-foreground">Pilih program untuk mulai latihan hari ini. Pelan-pelan saja, yang penting rutin.</p>
      </div>

      {membership && (
        <div className="flex flex-col gap-3 rounded-3xl bg-band p-7 text-band-foreground sm:flex-row sm:items-center sm:justify-between md:p-9">
          <div className="space-y-2">
            <span className="tag bg-band-foreground text-band">Member aktif</span>
            <p className="text-lg">
              {membership.expires_at ? `Berlaku sampai ${tanggal(membership.expires_at)}.` : "Berlaku selamanya."} Semua program terbuka untuk Anda.
            </p>
          </div>
        </div>
      )}

      {mine.length ? (
        <div data-reveal-stagger className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {mine.map((p) => {
            const list = (vids ?? []).filter((v) => v.program_id === p.id);
            const finished = list.filter((v) => doneSet.has(v.id)).length;
            const pct = list.length ? Math.round((finished / list.length) * 100) : 0;
            const upNext = list.find((v) => !doneSet.has(v.id));
            const photo = photos[p.id];
            return (
              <Link
                key={p.id}
                href={`/latihan/${p.slug}`}
                className="group flex flex-col overflow-hidden rounded-3xl bg-card transition duration-300 hover:-translate-y-1.5 hover:shadow-xl"
              >
                <div className="relative aspect-[16/10] bg-band">
                  {photo ? (
                    <SiteImage src={photo} alt="" fill sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" className="object-cover" />
                  ) : (
                    <span className="flex size-full items-center justify-center text-band-muted"><Armchair className="size-14" aria-hidden /></span>
                  )}
                  {pct === 100 && <span className="tag absolute top-4 left-4">Selesai</span>}
                </div>
                <div className="flex flex-1 flex-col gap-5 p-7">
                  <div className="space-y-2">
                    {p.level && <p className="eyebrow">{p.level}</p>}
                    <h2 className="text-3xl leading-tight">{p.title}</h2>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 overflow-hidden rounded-full bg-background" role="progressbar" aria-label="Kemajuan latihan" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
                      <div className="h-full rounded-full bg-foreground transition-all" style={{ width: `${pct}%` }} />
                    </div>
                    <p className="text-muted-foreground">{finished} dari {list.length} video selesai</p>
                  </div>
                  {upNext && (
                    <p className="flex items-start gap-2 text-base">
                      <PlayCircle className="mt-0.5 size-5 shrink-0" aria-hidden />
                      <span><span className="font-bold">Berikutnya:</span> {upNext.title}</span>
                    </p>
                  )}
                  <span className={buttonVariants({ size: "lg", className: "mt-auto w-full" })}>
                    {finished === 0 ? "Mulai latihan" : pct === 100 ? "Ulangi latihan" : "Lanjutkan"}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="space-y-5 rounded-3xl bg-card p-10 text-center md:p-14">
          <Armchair className="mx-auto size-14" aria-hidden />
          <p className="text-2xl">Anda belum punya program.</p>
          <p className="text-lg text-muted-foreground">Pilih satu program, lalu latihannya muncul di sini.</p>
          <Link href="/program" className={buttonVariants({ size: "lg" })}>Lihat program</Link>
        </div>
      )}
    </div>
  );
}

function Banner({ icon, tone, children }: { icon: React.ReactNode; tone: string; children: React.ReactNode }) {
  return (
    <div className={`flex items-center gap-4 rounded-3xl p-6 text-lg font-bold ${tone}`} role="status">
      {icon}
      <p>{children}</p>
    </div>
  );
}
