import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { buttonVariants } from "@/components/ui/button";
import { getViewer } from "@/lib/auth";
import { site } from "@/lib/site";
import { Logo } from "@/components/logo";

export async function SiteHeader() {
  const viewer = await getViewer();
  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      {!viewer && (
        <div className="bg-primary text-primary-foreground text-center text-sm py-2 px-4">
          Sudah jadi member? Latihan Anda sudah menunggu.{" "}
          <Link href="/masuk" className="font-bold underline underline-offset-4">Masuk di sini</Link>
        </div>
      )}
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2" aria-label={`${site.name} — beranda`}>
          <Logo />
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-base font-bold">
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
              <Link href="/masuk" className={buttonVariants({ variant: "ghost", className: "hidden sm:inline-flex" })}>Masuk</Link>
              <Link href="/daftar" className={buttonVariants()}>Daftar Gratis</Link>
            </>
          )}
        </div>
      </div>
      <nav className="md:hidden flex justify-center gap-6 border-t px-4 py-2 text-base font-bold">
        <Link href="/program">Program</Link>
        <Link href="/tentang">Tentang</Link>
        <Link href="/#tanya-jawab">Tanya Jawab</Link>
      </nav>
    </header>
  );
}
