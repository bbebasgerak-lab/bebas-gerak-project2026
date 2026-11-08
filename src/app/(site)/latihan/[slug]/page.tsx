import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, CheckCircle2, Circle } from "lucide-react";
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

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-10">
      <Link href="/latihan" className="inline-flex items-center gap-2 font-bold text-primary">
        <ArrowLeft className="size-5" aria-hidden /> Kembali ke Latihan Saya
      </Link>
      <h1 className="text-4xl font-semibold">{program.title}</h1>

      {!current ? (
        <p className="rounded-2xl bg-muted p-8 text-center text-lg">Video untuk program ini segera ditambahkan.</p>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
          <div className="space-y-5">
            <VideoFrame src={playbackUrl(current)} title={current.title} watermark={viewer.email} />
            <div className="space-y-2">
              <h2 className="text-3xl font-semibold">{current.title}</h2>
              {current.description && <p className="whitespace-pre-line text-lg text-muted-foreground">{current.description}</p>}
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <form action={toggleDone}>
                <input type="hidden" name="videoId" value={current.id} />
                <input type="hidden" name="done" value={isDone ? "1" : "0"} />
                <Button type="submit" size="lg" variant={isDone ? "outline" : "default"} className="w-full sm:w-auto">
                  {isDone ? "Batalkan tanda selesai" : "Tandai selesai"}
                </Button>
              </form>
              {next && (
                <Link href={`?v=${next.id}`} className={buttonVariants({ size: "lg", variant: "secondary" })}>Video berikutnya</Link>
              )}
            </div>
          </div>

          <ol className="h-fit divide-y overflow-hidden rounded-3xl border bg-card">
            {videos.map((x, i) => (
              <li key={x.id}>
                <Link
                  href={`?v=${x.id}`}
                  className={cn("flex items-center gap-3 p-4 hover:bg-muted", x.id === current.id && "bg-secondary")}
                  aria-current={x.id === current.id ? "true" : undefined}
                >
                  {doneSet.has(x.id) ? (
                    <CheckCircle2 className="size-6 shrink-0 text-primary" aria-label="Selesai" />
                  ) : (
                    <Circle className="size-6 shrink-0 text-muted-foreground" aria-label="Belum" />
                  )}
                  <span className="flex-1">
                    <span className="block font-bold">{i + 1}. {x.title}</span>
                    {x.duration_min && <span className="text-sm text-muted-foreground">{x.duration_min} menit</span>}
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
