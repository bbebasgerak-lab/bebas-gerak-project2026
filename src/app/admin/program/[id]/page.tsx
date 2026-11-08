import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ActionForm } from "@/components/action-form";
import { db, type Program, type Video } from "@/lib/supabase";
import { videosOf } from "@/lib/data";
import { deleteVideo, saveVideo } from "../../actions";
import { Field, ProgramForm, selectClass } from "../program-form";

export default async function EditProgram({ params }: PageProps<"/admin/program/[id]">) {
  const { id } = await params;
  const { data: program } = await db().from("programs").select("*").eq("id", id).maybeSingle<Program>();
  if (!program) notFound();
  const videos = await videosOf(program.id);

  return (
    <>
      <Link href="/admin/program" className="inline-flex items-center gap-2 font-bold text-primary">
        <ArrowLeft className="size-5" aria-hidden /> Semua program
      </Link>
      <h1 className="text-4xl font-semibold">{program.title}</h1>
      <ProgramForm program={program} />

      {program.kind === "program" && (
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Video ({videos.length})</h2>
          {videos.map((v) => (
            <details key={v.id} className="rounded-2xl border bg-card">
              <summary className="flex cursor-pointer items-center gap-3 p-5 font-bold">
                <span className="flex-1">{v.sort}. {v.title}</span>
                {v.is_preview && <Badge variant="secondary">Gratis</Badge>}
                <Badge variant="outline">{v.provider === "youtube" ? "YouTube" : "Bunny"}</Badge>
              </summary>
              <div className="space-y-4 border-t p-5">
                <VideoForm programId={program.id} video={v} />
                <ActionForm action={deleteVideo} success="Video dihapus">
                  <input type="hidden" name="id" value={v.id} />
                  <Button type="submit" variant="destructive">Hapus video ini</Button>
                </ActionForm>
              </div>
            </details>
          ))}
          <div className="space-y-3 rounded-2xl border-2 border-dashed p-5">
            <h3 className="text-xl font-semibold">Tambah video</h3>
            <VideoForm programId={program.id} nextSort={(videos.at(-1)?.sort ?? 0) + 1} />
          </div>
        </section>
      )}
    </>
  );
}

function VideoForm({ programId, video, nextSort }: { programId: string; video?: Video; nextSort?: number }) {
  return (
    <ActionForm action={saveVideo} success="Video tersimpan" className="grid gap-4 md:grid-cols-2">
      <input type="hidden" name="program_id" value={programId} />
      {video && <input type="hidden" name="id" value={video.id} />}
      <Field label="Judul video">
        <Input name="title" defaultValue={video?.title} required className="h-11 text-base" />
      </Field>
      <Field label="Link video" hint="Untuk YouTube: tempel link video (boleh link Unlisted).">
        <Input name="video_ref" defaultValue={video?.video_ref} required className="h-11 text-base" />
      </Field>
      <Field label="Tempat video">
        <select name="provider" defaultValue={video?.provider ?? "youtube"} className={selectClass}>
          <option value="youtube">YouTube</option>
          <option value="bunny">Bunny Stream (belum aktif)</option>
        </select>
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Durasi (menit)">
          <Input name="duration_min" type="number" min={1} defaultValue={video?.duration_min ?? ""} className="h-11 text-base" />
        </Field>
        <Field label="Urutan">
          <Input name="sort" type="number" defaultValue={video?.sort ?? nextSort ?? 0} className="h-11 text-base" />
        </Field>
      </div>
      <div className="md:col-span-2">
        <Field label="Keterangan (opsional)">
          <Textarea name="description" defaultValue={video?.description ?? ""} rows={2} className="text-base" />
        </Field>
      </div>
      <label className="flex items-center gap-3 font-bold md:col-span-2">
        <input type="checkbox" name="is_preview" defaultChecked={video?.is_preview ?? false} className="size-6 accent-primary" />
        Video contoh gratis (bisa ditonton tanpa membeli)
      </label>
      <div className="md:col-span-2">
        <Button type="submit">{video ? "Simpan video" : "Tambah video"}</Button>
      </div>
    </ActionForm>
  );
}
