import { ProgramCard } from "@/components/program-card";
import { publishedPrograms } from "@/lib/data";
import { getContent } from "@/lib/content";

export const metadata = { title: "Program Latihan" };

export default async function ProgramsPage() {
  const [programs, c] = await Promise.all([publishedPrograms(), getContent()]);
  return (
    <div className="mx-auto max-w-6xl px-4 py-14">
      <div className="mb-12 max-w-2xl space-y-3">
        <h1 className="text-[2.6rem] leading-[1.05] md:text-6xl">{c.halprogram_judul}</h1>
        <p className="text-xl text-muted-foreground">
          {c.halprogram_teks}
        </p>
      </div>
      {programs.length ? (
        <div className="grid gap-8 pt-4 md:grid-cols-3">
          {programs.map((p) => <ProgramCard key={p.id} program={p} />)}
        </div>
      ) : (
        <p className="rounded-2xl bg-muted p-8 text-center text-lg text-muted-foreground">Program segera hadir.</p>
      )}
    </div>
  );
}
