import Link from "next/link";
import { site, waLink } from "@/lib/site";
import { Logo } from "@/components/logo";

export function SiteFooter() {
  const wa = waLink();
  return (
    <footer className="mt-auto border-t bg-secondary/60">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-3">
        <div className="space-y-3">
          <Logo />
          <p className="text-muted-foreground">{site.tagline}.</p>
        </div>
        <nav className="flex flex-col gap-2 font-bold">
          <Link href="/program">Semua Program</Link>
          <Link href="/tentang">Tentang Kami</Link>
          <Link href="/masuk">Masuk Member</Link>
        </nav>
        <div className="space-y-2">
          <p className="font-bold">Butuh bantuan?</p>
          {wa ? (
            <a href={wa} className="inline-block rounded-full bg-primary px-5 py-3 font-bold text-primary-foreground" target="_blank" rel="noreferrer">
              Chat WhatsApp
            </a>
          ) : (
            <p className="text-muted-foreground">Nomor WhatsApp belum diatur.</p>
          )}
          <p className="text-sm text-muted-foreground">
            Konsultasikan dengan dokter sebelum memulai program latihan baru.
          </p>
        </div>
      </div>
      <p className="border-t py-4 text-center text-sm text-muted-foreground">© {new Date().getFullYear()} {site.name}</p>
    </footer>
  );
}
