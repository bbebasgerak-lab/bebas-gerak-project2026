import Link from "next/link";
import { MonitorPlay, MousePointerClick, Wallet } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { HeroArt } from "@/components/hero-art";
import { SiteImage } from "@/components/site-image";
import { ProgramCard } from "@/components/program-card";
import { VideoFrame } from "@/components/video-frame";
import { AppShowcase } from "@/components/app-showcase";
import { firstPreview, publishedPrograms, rupiah } from "@/lib/data";
import { playbackUrl } from "@/lib/video";
import { getContent } from "@/lib/content";

// Semua teks & foto di halaman ini diatur dari Panel Admin → Pengaturan Web (daftarnya di src/lib/content-fields.ts).

export default async function Home() {
  const [programs, preview, c] = await Promise.all([publishedPrograms(), firstPreview(), getContent()]);

  return (
    <>
      <section className="mx-auto max-w-6xl px-4 pt-10 pb-12 md:pt-16">
        <h1 className="text-center text-[2.6rem] italic leading-[1] sm:text-6xl lg:text-[4.8rem]">
          {c.hero_judul_1}
          <br />
          {c.hero_judul_2}
        </h1>
        <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-md space-y-3">
            <p className="eyebrow">{c.hero_label}</p>
            <p className="text-lg">{c.hero_teks}</p>
          </div>
          <Link href="/program" className={buttonVariants({ size: "lg", variant: "outline", className: "max-md:w-full" })}>Lihat program</Link>
        </div>
        <div className="mt-8">
          <HeroArt photo={c.hero_foto} alt={c.hero_foto_alt} badges={[c.hero_badge_1, c.hero_badge_2]}>
            {preview ? (
              <div className="space-y-4">
                <p className="tag">{c.video_label}</p>
                <h2 className="text-[1.7rem] leading-tight md:text-3xl">{c.video_judul}</h2>
                <p className="text-muted-foreground">{c.video_teks}</p>
                <Link href="#coba" className={buttonVariants({ size: "lg", className: "w-full" })}>Putar video</Link>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="tag">{c.hero_kartu_label}</p>
                <h2 className="text-[1.7rem] leading-tight md:text-3xl">{c.hero_kartu_judul}</h2>
                <Link href="/program" className={buttonVariants({ size: "lg", className: "w-full" })}>Pilih program</Link>
              </div>
            )}
          </HeroArt>
        </div>
      </section>

      <section className="border-y">
        <div className="mx-auto grid max-w-6xl md:grid-cols-3 md:divide-x">
          {([1, 2, 3] as const).map((n) => (
            <div key={n} className="space-y-4 border-b px-4 py-10 last:border-b-0 md:border-b-0 md:px-8">
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-card">
                <SiteImage src={c[`manfaat_${n}_foto`]} alt={c[`manfaat_${n}_foto_alt`]} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
              </div>
              <h2 className="text-3xl">{c[`manfaat_${n}_judul`]}</h2>
              <p className="text-muted-foreground">{c[`manfaat_${n}_teks`]}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl space-y-4">
            <p className="eyebrow">{c.program_label}</p>
            <h2 className="text-4xl md:text-5xl">{c.program_judul}</h2>
          </div>
          <Link href="/program" className={buttonVariants({ variant: "outline", className: "self-start md:self-auto" })}>Semua program</Link>
        </div>
        {programs.length ? (
          <div className="grid gap-8 pt-4 md:grid-cols-3">
            {programs.map((p) => <ProgramCard key={p.id} program={p} />)}
          </div>
        ) : (
          <p className="rounded-3xl bg-card p-8 text-center text-lg">Program segera hadir.</p>
        )}
      </section>

      <section className="bg-band text-band-foreground">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="mb-10 text-4xl md:text-5xl">{c.langkah_judul}</h2>
          <ol className="grid md:grid-cols-3 md:divide-x md:divide-band-foreground/30">
            {([1, 2, 3] as const).map((n) => {
              const I = [MousePointerClick, Wallet, MonitorPlay][n - 1];
              return (
                <li key={n} className="space-y-3 py-6 md:px-8 md:py-0 md:first:pl-0">
                  <span className="flex items-center gap-3">
                    <span className="flex size-14 items-center justify-center rounded-full bg-band-foreground font-heading text-3xl text-band">{n}</span>
                    <I className="size-7 text-band-muted" aria-hidden />
                  </span>
                  <h3 className="text-3xl">{c[`langkah_${n}_judul`]}</h3>
                  <p className="text-band-muted">{c[`langkah_${n}_teks`]}</p>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      <AppShowcase
        text={{ name: c.nama, label: c.tampilan_label, title1: c.tampilan_judul_1, title2: c.tampilan_judul_2, text: c.tampilan_teks }}
        programs={programs.slice(0, 3).map((p) => ({ title: p.title, level: p.level, price: rupiah(p.price) }))} />

      {preview && (
        <section id="coba" className="mx-auto max-w-4xl scroll-mt-28 px-4 py-16">
          <div className="mb-8 space-y-4 text-center">
            <p className="eyebrow">{c.video_label}</p>
            <h2 className="text-4xl md:text-5xl">{c.video_judul}</h2>
            <p className="text-lg text-muted-foreground">{c.video_teks}</p>
          </div>
          <VideoFrame src={playbackUrl(preview)} title={preview.title} />
        </section>
      )}

      <section id="tanya-jawab" className="mx-auto max-w-3xl scroll-mt-28 px-4 py-16">
        <p className="eyebrow mb-4">{c.faq_label}</p>
        <h2 className="mb-8 text-4xl md:text-5xl">{c.faq_judul}</h2>
        <div className="divide-y divide-foreground/20 rounded-3xl bg-card">
          {c.faq.map(({ q, a }) => (
            <details key={q} className="group p-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-bold">
                {q}
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full border-2 border-foreground text-2xl transition group-open:rotate-45" aria-hidden>+</span>
              </summary>
              <p className="mt-3 text-muted-foreground">{a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20">
        <div className="flex flex-col items-start gap-6 rounded-[2rem] bg-band p-10 text-band-foreground md:flex-row md:items-center md:justify-between md:p-14">
          <div className="space-y-3">
            <h2 className="text-4xl italic md:text-5xl">{c.ajakan_judul}</h2>
            <p className="text-lg text-band-muted">{c.ajakan_teks}</p>
          </div>
          <Link href="/program" className={buttonVariants({ size: "lg", variant: "secondary", className: "shrink-0" })}>Pilih program</Link>
        </div>
      </section>
    </>
  );
}
