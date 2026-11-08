import { ProgramCard } from "@/components/program-card";
import { publishedPrograms } from "@/lib/data";

export const metadata = { title: "Program Latihan" };

export default async function ProgramsPage() {
  const programs = await publishedPrograms();
  return (
    <div className="mx-auto max-w-6xl px-4 py-14">
      <div className="mb-12 max-w-2xl space-y-3">
        <h1 className="text-5xl font-semibold">Program latihan</h1>
        <p className="text-xl text-muted-foreground">
          Setiap program bisa diikuti dari kursi di rumah. Tonton video contohnya dulu sebelum membeli.
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
