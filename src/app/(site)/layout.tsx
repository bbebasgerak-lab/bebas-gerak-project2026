import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      {/* Garis grid vertikal editorial (DESIGN.md) — dekorasi di belakang konten, hanya layar lebar. */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 hidden lg:block">
        <div className="mx-auto grid h-full max-w-6xl grid-cols-3 border-x">
          <div className="border-r" />
          <div className="border-r" />
        </div>
      </div>
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </>
  );
}
