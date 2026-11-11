import Link from "next/link";
import { getContent } from "@/lib/content";
import { waLink } from "@/lib/content-fields";
import { Logo } from "@/components/logo";

export async function SiteFooter() {
  const c = await getContent();
  const wa = waLink(c.whatsapp);
  return (
    <footer className="mt-auto border-t">
      <div className="mx-auto grid max-w-6xl md:grid-cols-3 md:divide-x">
        <div className="space-y-4 border-b px-4 py-10 md:border-b-0 md:pr-8">
          <Logo />
          <p className="text-muted-foreground">{c.tagline.replace(/\.$/, "")}.</p>
        </div>
        <nav className="space-y-4 border-b px-4 py-10 md:border-b-0 md:px-8" aria-label="Navigasi footer">
          <p className="font-mono text-sm font-bold uppercase tracking-wide">Navigasi</p>
          <div className="flex flex-col gap-3 text-lg">
            <Link href="/program" className="underline-offset-4 hover:underline">Semua Program</Link>
            <Link href="/tentang" className="underline-offset-4 hover:underline">Tentang Kami</Link>
            <Link href="/masuk" className="underline-offset-4 hover:underline">Masuk Member</Link>
          </div>
        </nav>
        <div className="space-y-4 px-4 py-10 md:pl-8">
          <p className="font-mono text-sm font-bold uppercase tracking-wide">Butuh bantuan?</p>
          {wa ? (
            <a href={wa} className="inline-flex h-14 items-center rounded-full bg-primary px-6 font-mono font-bold uppercase tracking-wide text-primary-foreground hover:bg-primary-hover" target="_blank" rel="noreferrer">
              Chat WhatsApp
            </a>
          ) : (
            <p className="text-muted-foreground">Nomor WhatsApp belum diatur.</p>
          )}
          <p className="text-base text-muted-foreground">
            {c.catatan_footer}
          </p>
        </div>
      </div>
      <p className="border-t px-4 py-4 text-center font-mono text-sm uppercase tracking-wide">© {new Date().getFullYear()} {c.nama}</p>
    </footer>
  );
}
