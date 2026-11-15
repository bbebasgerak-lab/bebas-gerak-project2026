import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, PartyPopper } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { VideoFrame } from "@/components/video-frame";
import { requireUser } from "@/lib/auth";
import { programBySlug, userCanWatch, videosOf } from "@/lib/data";
import { db } from "@/lib/supabase";
import { playbackUrl } from "@/lib/video";
import { cn } from "@/lib/utils";
import { toggleDone } from "../actions";

export default async function Player({ params, searchParams }: PageProps<"/latihan/[slug]">) {
  const viewer = await requireUser();
  const { slug } = await params;
  const program = await programBySlug(slug);
  if (!program) notFound();
  if (!(await userCanWatch(viewer.id, program.id))) redirect(`/program/${slug}`);

  const videos = await videosOf(program.id);
  const { data: done } = await db().from("progress").select("video_id").eq("user_id", viewer.id).in("video_id", videos.map((v) => v.id));
  const doneSet = new Set((done ?? []).map((d) => d.video_id));

  const { v } = await searchParams;
  const current = videos.find((x) => x.id === v) ?? videos.find((x) => !doneSet.has(x.id)) ?? videos[0];
  const next = current ? videos[videos.indexOf(current) + 1] : undefined;
  const isDone = current ? doneSet.has(current.id) : false;
  const position = current ? videos.indexOf(current) + 1 : 0;
  const allDone = videos.length > 0 && videos.every((x) => doneSet.has(x.id));

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-10 md:py-14">
      <Link href="/latihan" className="inline-flex items-center gap-2 text-lg font-bold underline-offset-4 hover:underline">
        <ArrowLeft className="size-5" aria-hidden /> Kembali ke Latihan Saya
      </Link>
      <div className="space-y-3">
        {program.level && <p className="eyebrow">{program.level}</p>}
        <h1 className="text-[2.4rem] leading-[1.05] md:text-6xl">{program.title}</h1>
      </div>

      {!current ? (
        <p className="rounded-3xl bg-card p-10 text-center text-xl">Video untuk program ini segera ditambahkan.</p>
      ) : (
        <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <div className="rounded-[2rem] bg-foreground p-2 shadow-lg">
              <VideoFrame src={playbackUrl(current)} title={current.title} watermark={viewer.email} />
            </div>

            {allDone && (
              <p className="flex items-center gap-3 rounded-3xl bg-band p-6 text-lg font-bold text-band-foreground" role="status">
                <PartyPopper className="size-7 shrink-0" aria-hidden /> Hebat! Semua video di program ini sudah selesai.
              </p>
            )}

            <div className="space-y-3">
              <p className="font-mono text-sm font-bold uppercase tracking-wide text-muted-foreground">
                Video {position} dari {videos.length}{current.duration_min ? ` · ${current.duration_min} menit` : ""}
              </p>
              <h2 className="text-3xl leading-tight md:text-4xl">{current.title}</h2>
              {current.description && <p className="max-w-prose whitespace-pre-line text-lg text-muted-foreground">{current.description}</p>}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <form action={toggleDone} className="sm:flex-1">
                <input type="hidden" name="videoId" value={current.id} />
                <input type="hidden" name="done" value={isDone ? "1" : "0"} />
                <Button type="submit" size="lg" variant={isDone ? "outline" : "default"} className="w-full">
                  <Check aria-hidden /> {isDone ? "Sudah selesai (batalkan)" : "Tandai selesai"}
                </Button>
              </form>
              {next && (
                <Link href={`?v=${next.id}`} className={buttonVariants({ size: "lg", variant: isDone ? "default" : "outline", className: "sm:flex-1" })}>
                  Video berikutnya <ArrowRight aria-hidden />
                </Link>
              )}
            </div>
          </div>

          <section aria-labelledby="daftar-video" className="h-fit overflow-hidden rounded-3xl bg-card">
            <div className="flex items-center justify-between gap-3 border-b border-foreground/15 p-5">
              <h2 id="daftar-video" className="text-2xl">Daftar video</h2>
              <span className="font-mono text-sm font-bold">{videos.filter((x) => doneSet.has(x.id)).length}/{videos.length} selesai</span>
            </div>
            <ol className="divide-y divide-foreground/10">
              {videos.map((x, i) => {
                const active = x.id === current.id;
                const finished = doneSet.has(x.id);
                return (
                  <li key={x.id}>
                    <Link
                      href={`?v=${x.id}`}
                      className={cn("flex items-center gap-4 p-4 transition", active ? "bg-band text-band-foreground" : "hover:bg-background")}
                      aria-current={active ? "true" : undefined}
                    >
                      <span
                        className={cn(
                          "flex size-10 shrink-0 items-center justify-center rounded-full border-2 font-mono font-bold",
                          finished ? "border-transparent bg-foreground text-background" : "border-current",
                          active && finished && "bg-band-foreground text-band",
                        )}
                        aria-label={finished ? "Selesai" : `Video ${i + 1}`}
                      >
                        {finished ? <Check className="size-5" aria-hidden /> : i + 1}
                      </span>
                      <span className="flex-1">
                        <span className="block font-bold leading-snug">{x.title}</span>
                        {x.duration_min && <span className={cn("text-sm", active ? "text-band-muted" : "text-muted-foreground")}>{x.duration_min} menit</span>}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ol>
          </section>
        </div>
      )}
    </div>
  );
}
