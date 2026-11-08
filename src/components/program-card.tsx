import Link from "next/link";
import { Check } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { accessLabel, rupiah } from "@/lib/data";
import type { Program } from "@/lib/supabase";
import { cn } from "@/lib/utils";

export function ProgramCard({ program }: { program: Program }) {
  const featured = program.kind === "membership";
  return (
    <article
      className={cn(
        "relative flex flex-col gap-5 rounded-3xl border bg-card p-7 shadow-sm",
        featured && "border-primary border-2 shadow-lg md:-translate-y-2",
      )}
    >
      {featured && (
        <span className="absolute -top-4 left-7 rounded-full bg-accent px-4 py-1 text-sm font-bold text-accent-foreground">
          Paling lengkap
        </span>
      )}
      <div className="space-y-2">
        {program.level && <p className="text-sm font-bold uppercase tracking-wider text-primary">{program.level}</p>}
        <h3 className="text-2xl font-semibold">{program.title}</h3>
        {program.tagline && <p className="text-muted-foreground">{program.tagline}</p>}
      </div>
      <ul className="space-y-2">
        {[
          featured ? "Semua program & video baru" : "Video latihan terpandu",
          accessLabel(program),
          "Tonton di HP, tablet, atau TV",
        ].map((t) => (
          <li key={t} className="flex gap-2">
            <Check className="mt-1 size-5 shrink-0 text-primary" aria-hidden /> {t}
          </li>
        ))}
      </ul>
      <div className="mt-auto space-y-4">
        <p className="font-heading text-3xl font-semibold">{rupiah(program.price)}</p>
        <Link
          href={`/program/${program.slug}`}
          className={buttonVariants({ size: "lg", variant: featured ? "default" : "outline", className: "w-full" })}
        >
          Lihat program
        </Link>
      </div>
    </article>
  );
}
