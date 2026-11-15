import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { db, type Program } from "@/lib/supabase";
import { accessLabel, rupiah } from "@/lib/data";
import { ProgramForm } from "./program-form";

export default async function AdminPrograms() {
  const { data } = await db().from("programs").select("*, videos(count)").order("sort");
  const programs = (data ?? []) as (Program & { videos: { count: number }[] })[];

  return (
    <>
      <h1 className="text-4xl md:text-5xl">Program & Video</h1>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {programs.map((p) => (
          <Link key={p.id} href={`/admin/program/${p.id}`} className="space-y-2 rounded-3xl bg-card p-6 transition duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div className="flex items-start justify-between gap-2">
              <h2 className="text-2xl">{p.title}</h2>
              <Badge variant={p.is_published ? "default" : "secondary"}>{p.is_published ? "Tampil" : "Disembunyikan"}</Badge>
            </div>
            <p className="text-muted-foreground">
              {rupiah(p.price)} · {accessLabel(p)} · {p.kind === "membership" ? "Membership" : `${p.videos[0]?.count ?? 0} video`}
            </p>
            <p className="font-bold underline-offset-4 hover:underline">Atur program & video →</p>
          </Link>
        ))}
      </div>
      <section className="space-y-4">
        <h2 className="text-3xl">Tambah program baru</h2>
        <ProgramForm />
      </section>
    </>
  );
}
