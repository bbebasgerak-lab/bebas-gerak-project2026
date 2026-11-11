import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { SiteImage } from "@/components/site-image";
import { getContent } from "@/lib/content";

export const metadata = { title: "Tentang Kami" };

// Teks & foto diatur dari Panel Admin → Pengaturan Web.
export default async function AboutPage() {
  const c = await getContent();
  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 lg:grid-cols-[1fr_400px] lg:gap-16">
      <div className="space-y-8">
        <p className="eyebrow">{c.tentang_label}</p>
        <h1 className="text-[2.6rem] leading-[1.05] md:text-6xl">{c.tentang_judul}</h1>
        <div className="max-w-prose space-y-5 text-lg">
          {c.tentang_isi.split(/\n\s*\n/).map((p) => <p key={p}>{p}</p>)}
        </div>
        <Link href="/program" className={buttonVariants({ size: "lg" })}>Lihat program</Link>
      </div>
      <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-card lg:sticky lg:top-32 lg:self-start">
        <SiteImage
          src={c.tentang_foto}
          alt={c.tentang_foto_alt}
          fill
          sizes="(min-width: 1024px) 400px, 100vw"
          className="object-cover object-[50%_60%]"
        />
      </div>
    </div>
  );
}
