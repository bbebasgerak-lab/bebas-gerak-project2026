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
      <h1 className="text-4xl font-semibold">Program & Video</h1>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {programs.map((p) => (
          <Link key={p.id} href={`/admin/program/${p.id}`} className="space-y-2 rounded-2xl border bg-card p-6 hover:border-primary">
            <div className="flex items-start justify-between gap-2">
              <h2 className="text-xl font-semibold">{p.title}</h2>
              <Badge variant={p.is_published ? "default" : "secondary"}>{p.is_published ? "Tampil" : "Disembunyikan"}</Badge>
            </div>
            <p className="text-muted-foreground">
              {rupiah(p.price)} · {accessLabel(p)} · {p.kind === "membership" ? "Membership" : `${p.videos[0]?.count ?? 0} video`}
            </p>
            <p className="font-bold text-primary">Atur program & video →</p>
          </Link>
        ))}
      </div>
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Tambah program baru</h2>
        <ProgramForm />
      </section>
    </>
  );
}
