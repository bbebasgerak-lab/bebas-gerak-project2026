import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { buttonVariants } from "@/components/ui/button";
import { getViewer } from "@/lib/auth";
import { getContent } from "@/lib/content";
import { Logo } from "@/components/logo";

export async function SiteHeader() {
  const [viewer, c] = await Promise.all([getViewer(), getContent()]);
  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      {!viewer && (
        <div className="bg-primary text-primary-foreground text-center text-sm py-2 px-4">
          {c.pengumuman}{" "}
          <Link href="/masuk" className="font-bold underline underline-offset-4">Masuk di sini</Link>
        </div>
      )}
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-3 sm:gap-4">
        <Link href="/" className="flex items-center gap-2" aria-label={`${c.nama} — beranda`}>
          <Logo />
        </Link>
        <nav className="hidden lg:flex items-center gap-6 whitespace-nowrap text-base font-bold">
          <Link href="/program" className="hover:text-primary">Program</Link>
          <Link href="/tentang" className="hover:text-primary">Tentang Kami</Link>
          <Link href="/#tanya-jawab" className="hover:text-primary">Tanya Jawab</Link>
        </nav>
        <div className="flex items-center gap-2">
          {viewer ? (
            <>
              {viewer.isAdmin && (
                <Link href="/admin" className={buttonVariants({ variant: "outline" })}>Panel Admin</Link>
              )}
              <Link href="/latihan" className={buttonVariants()}>Latihan Saya</Link>
              <UserButton appearance={{ elements: { avatarBox: "size-10" } }} />
            </>
          ) : (
            <>
              <Link href="/masuk" className={buttonVariants({ variant: "ghost", className: "max-sm:hidden normal-case! font-sans! text-base! tracking-normal!" })}>Masuk</Link>
              <Link href="/daftar" className={buttonVariants({ variant: "outline" })}>Daftar<span className="max-sm:hidden">Gratis</span></Link>
            </>
          )}
        </div>
      </div>
      <nav className="lg:hidden flex flex-wrap justify-center gap-x-6 gap-y-1 border-t px-4 py-2 text-base font-bold">
        <Link href="/program">Program</Link>
        <Link href="/tentang">Tentang</Link>
        <Link href="/#tanya-jawab">Tanya Jawab</Link>
      </nav>
    </header>
  );
}
