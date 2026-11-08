import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, Lock, PlayCircle } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { BuyButton } from "@/components/buy-button";
import { VideoFrame } from "@/components/video-frame";
import { getViewer } from "@/lib/auth";
import { accessLabel, programBySlug, rupiah, userCanWatch, videosOf } from "@/lib/data";
import { playbackUrl } from "@/lib/video";

export async function generateMetadata({ params }: PageProps<"/program/[slug]">) {
  const program = await programBySlug((await params).slug);
  return { title: program?.title ?? "Program" };
}

export default async function ProgramDetail({ params }: PageProps<"/program/[slug]">) {
  const program = await programBySlug((await params).slug);
  if (!program || !program.is_published) notFound();

  const [videos, viewer] = await Promise.all([videosOf(program.id), getViewer()]);
  const owned = viewer ? await userCanWatch(viewer.id, program.id) : false;
  const preview = videos.find((v) => v.is_preview);
  const membership = program.kind === "membership";

  return (
    <div className="mx-auto grid max-w-6xl gap-12 px-4 py-14 lg:grid-cols-[1fr_380px]">
      <div className="space-y-8">
        <div className="space-y-3">
          {program.level && <p className="font-bold uppercase tracking-widest text-accent">{program.level}</p>}
          <h1 className="text-5xl font-semibold">{program.title}</h1>
          {program.tagline && <p className="text-xl text-muted-foreground">{program.tagline}</p>}
        </div>

        {preview && (
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold">Video contoh gratis</h2>
            <VideoFrame src={playbackUrl(preview)} title={preview.title} />
          </div>
        )}

        {program.description && <p className="max-w-prose whitespace-pre-line text-lg">{program.description}</p>}

        {!membership && videos.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Isi program ({videos.length} video)</h2>
            <ol className="divide-y rounded-3xl border bg-card">
              {videos.map((v, i) => {
                const open = owned || v.is_preview;
                return (
                  <li key={v.id} className="flex items-center gap-4 p-5">
                    <span className="w-8 text-center font-heading text-xl text-muted-foreground">{i + 1}</span>
                    <span className="flex-1">
                      <span className="block font-bold">{v.title}</span>
                      {v.duration_min && <span className="text-sm text-muted-foreground">{v.duration_min} menit</span>}
                    </span>
                    {open ? <PlayCircle className="size-6 text-primary" aria-label="Bisa ditonton" /> : <Lock className="size-5 text-muted-foreground" aria-label="Terkunci" />}
                  </li>
                );
              })}
            </ol>
          </div>
        )}
      </div>

      <aside className="lg:sticky lg:top-32 h-fit space-y-5 rounded-3xl border-2 border-primary bg-card p-7 shadow-lg">
        <p className="font-heading text-4xl font-semibold">{rupiah(program.price)}</p>
        <ul className="space-y-2">
          {[
            membership ? "Semua program & video baru" : `${videos.length} video latihan terpandu`,
            accessLabel(program),
            "Tonton di HP, tablet, atau TV",
            "Bantuan lewat WhatsApp",
          ].map((t) => (
            <li key={t} className="flex gap-2"><Check className="mt-1 size-5 shrink-0 text-primary" aria-hidden />{t}</li>
          ))}
        </ul>
        {owned && !membership ? (
          <Link href={`/latihan/${program.slug}`} className={buttonVariants({ size: "lg", className: "w-full" })}>Mulai latihan</Link>
        ) : (
          <BuyButton programId={program.id} slug={program.slug} signedIn={!!viewer} label={owned ? "Perpanjang membership" : "Beli sekarang"} />
        )}
        <p className="text-center text-sm text-muted-foreground">QRIS · Transfer bank · GoPay · ShopeePay · Kartu</p>
      </aside>
    </div>
  );
}
