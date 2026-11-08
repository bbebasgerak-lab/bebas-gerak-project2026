import Link from "next/link";
import { Armchair, Footprints, HeartHandshake, MonitorPlay, MousePointerClick, Wallet } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { HeroArt } from "@/components/hero-art";
import { ProgramCard } from "@/components/program-card";
import { VideoFrame } from "@/components/video-frame";
import { firstPreview, publishedPrograms } from "@/lib/data";
import { playbackUrl } from "@/lib/video";
import { site } from "@/lib/site";

const faq = [
  ["Apakah aman untuk lutut dan punggung?", "Hampir semua gerakan dilakukan sambil duduk atau berpegangan pada kursi. Ada pilihan gerakan lebih ringan di setiap video. Jika punya kondisi kesehatan khusus, konsultasikan dulu dengan dokter."],
  ["Perlu alat apa saja?", "Cukup kursi kokoh tanpa roda. Beberapa latihan memakai botol air sebagai beban ringan — tidak wajib."],
  ["Bagaimana cara membayar?", "Bisa lewat QRIS, transfer bank (virtual account), GoPay, ShopeePay, atau kartu. Setelah bayar, program langsung terbuka di menu Latihan Saya."],
  ["Bisa ditonton di TV?", "Bisa. Buka website ini di HP atau tablet, lalu tampilkan ke TV (cast/screen mirroring). Bisa juga dibuka langsung dari browser Smart TV."],
  ["Saya sering lupa password, bagaimana?", "Tidak perlu password. Saat masuk, cukup tulis email, lalu kami kirim kode ke email Anda."],
  ["Kalau bingung, bisa minta bantuan?", "Tentu. Tekan tombol WhatsApp di bagian bawah halaman, tim kami siap membantu."],
];

export default async function Home() {
  const [programs, preview] = await Promise.all([publishedPrograms(), firstPreview()]);

  return (
    <>
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-14 md:grid-cols-2 md:py-20">
        <div className="space-y-6">
          <p className="font-bold uppercase tracking-widest text-accent">Senam kursi untuk usia 50+</p>
          <h1 className="text-5xl font-semibold leading-[1.05] md:text-6xl">
            Tubuh lebih kuat. Langkah lebih mantap.
          </h1>
          <p className="max-w-prose text-xl text-muted-foreground">
            Latihan pelan dan terpandu yang bisa Anda ikuti dari rumah, cukup dengan sebuah kursi. Bangun kekuatan,
            jaga keseimbangan, dan tetap mandiri melakukan hal-hal yang Anda sukai.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/program" className={buttonVariants({ size: "lg" })}>Lihat program</Link>
            {preview && (
              <Link href="#coba" className={buttonVariants({ size: "lg", variant: "outline" })}>Coba video gratis</Link>
            )}
          </div>
        </div>
        <HeroArt />
      </section>

      <section className="border-y bg-secondary/50">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-3">
          {[
            [Armchair, "Kekuatan", "Otot kaki dan lengan lebih kuat untuk berdiri, naik tangga, dan membawa belanjaan."],
            [Footprints, "Keseimbangan", "Melatih kestabilan tubuh supaya lebih percaya diri dan risiko jatuh berkurang."],
            [HeartHandshake, "Semangat", "Pelatih yang sabar dan ramah, bergerak pelan bersama Anda di setiap video."],
          ].map(([Icon, title, text]) => {
            const I = Icon as typeof Armchair;
            return (
              <div key={title as string} className="flex gap-4">
                <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                  <I className="size-7" aria-hidden />
                </span>
                <div>
                  <h2 className="text-xl font-semibold">{title as string}</h2>
                  <p className="text-muted-foreground">{text as string}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-10 max-w-2xl space-y-3">
          <p className="font-bold uppercase tracking-widest text-accent">Pilih program</p>
          <h2 className="text-4xl font-semibold">Mulai dari program yang paling cocok untuk Anda</h2>
        </div>
        {programs.length ? (
          <div className="grid gap-8 pt-4 md:grid-cols-3">
            {programs.map((p) => <ProgramCard key={p.id} program={p} />)}
          </div>
        ) : (
          <p className="rounded-2xl bg-muted p-8 text-center text-lg text-muted-foreground">Program segera hadir.</p>
        )}
      </section>

      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="mb-10 text-4xl font-semibold">Semudah tiga langkah</h2>
          <ol className="grid gap-8 md:grid-cols-3">
            {[
              [MousePointerClick, "Pilih program", "Lihat isi tiap program dan tonton video contohnya dulu."],
              [Wallet, "Bayar dengan mudah", "QRIS, transfer bank, GoPay, ShopeePay, atau kartu."],
              [MonitorPlay, "Latihan kapan saja", "Buka menu Latihan Saya dari HP, tablet, atau TV."],
            ].map(([Icon, title, text], i) => {
              const I = Icon as typeof Wallet;
              return (
                <li key={title as string} className="space-y-3">
                  <span className="flex items-center gap-3">
                    <span className="flex size-12 items-center justify-center rounded-full bg-primary-foreground font-heading text-2xl font-semibold text-primary">{i + 1}</span>
                    <I className="size-7 opacity-80" aria-hidden />
                  </span>
                  <h3 className="text-2xl font-semibold">{title as string}</h3>
                  <p className="text-primary-foreground/85">{text as string}</p>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {preview && (
        <section id="coba" className="mx-auto max-w-4xl scroll-mt-28 px-4 py-16">
          <div className="mb-8 space-y-3 text-center">
            <p className="font-bold uppercase tracking-widest text-accent">Video gratis</p>
            <h2 className="text-4xl font-semibold">Coba satu latihan sekarang</h2>
            <p className="text-lg text-muted-foreground">Siapkan kursi, putar videonya, dan ikuti gerakannya pelan-pelan.</p>
          </div>
          <VideoFrame src={playbackUrl(preview)} title={preview.title} />
        </section>
      )}

      <section id="tanya-jawab" className="mx-auto max-w-3xl scroll-mt-28 px-4 py-16">
        <h2 className="mb-8 text-4xl font-semibold">Tanya jawab</h2>
        <div className="divide-y rounded-3xl border bg-card">
          {faq.map(([q, a]) => (
            <details key={q} className="group p-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-bold">
                {q}
                <span className="text-2xl text-primary transition group-open:rotate-45" aria-hidden>+</span>
              </summary>
              <p className="mt-3 text-muted-foreground">{a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20">
        <div className="flex flex-col items-start gap-6 rounded-[2.5rem] bg-accent p-10 text-accent-foreground md:flex-row md:items-center md:justify-between md:p-14">
          <div className="space-y-2">
            <h2 className="text-4xl font-semibold">Tidak ada kata terlambat untuk mulai bergerak.</h2>
            <p className="text-lg opacity-90">Bergabunglah dengan {site.name} hari ini.</p>
          </div>
          <Link href="/program" className={buttonVariants({ size: "lg", variant: "secondary", className: "shrink-0" })}>Pilih program</Link>
        </div>
      </section>
    </>
  );
}
