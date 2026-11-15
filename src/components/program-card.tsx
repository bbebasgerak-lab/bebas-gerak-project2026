import Link from "next/link";
import { Armchair, Check } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { SiteImage } from "@/components/site-image";
import { accessLabel, rupiah } from "@/lib/data";
import type { Program } from "@/lib/supabase";
import { cn } from "@/lib/utils";

// Foto diatur dari Panel Admin → Program & Video. Tanpa foto, tampil kotak gelap berikon kursi.
export function ProgramCard({ program, photo }: { program: Program; photo?: string }) {
  const featured = program.kind === "membership";
  return (
    <article
      className={cn(
        "relative flex flex-col rounded-3xl bg-card transition duration-300 hover:-translate-y-1.5 hover:shadow-xl",
        featured && "outline-2 outline-foreground md:-translate-y-2 md:hover:-translate-y-3.5",
      )}
    >
      {featured && (
        <span className="tag absolute -top-4 left-7 z-10">
          Paling lengkap
        </span>
      )}
      <div className="relative aspect-[4/3] overflow-hidden rounded-t-3xl bg-band">
        {photo ? (
          <SiteImage src={photo} alt="" fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
        ) : (
          <span className="flex size-full items-center justify-center text-band-muted">
            <Armchair className="size-16" aria-hidden />
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-5 p-7">
        <div className="space-y-2">
          {program.level && <p className="eyebrow">{program.level}</p>}
          <h3 className="text-3xl leading-tight">{program.title}</h3>
          {program.tagline && <p className="text-muted-foreground">{program.tagline}</p>}
        </div>
        <ul className="space-y-2">
          {[
            featured ? "Semua program & video baru" : "Video latihan terpandu",
            accessLabel(program),
            "Tonton di HP, tablet, atau TV",
          ].map((t) => (
            <li key={t} className="flex gap-2">
              <Check className="mt-1 size-5 shrink-0" aria-hidden /> {t}
            </li>
          ))}
        </ul>
        <div className="mt-auto space-y-4">
          <p className="font-heading text-4xl">{rupiah(program.price)}</p>
          <Link
            href={`/program/${program.slug}`}
            className={buttonVariants({ size: "lg", variant: featured ? "default" : "outline", className: "w-full" })}
          >
            Lihat program
          </Link>
        </div>
      </div>
    </article>
  );
}
