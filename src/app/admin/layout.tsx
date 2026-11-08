import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { LayoutDashboard, PlaySquare, Users, Globe } from "lucide-react";
import { Logo } from "@/components/logo";
import { requireAdmin } from "@/lib/auth";
import { dbReady } from "@/lib/data";

export const metadata = { title: "Panel Admin" };

const nav = [
  ["/admin", "Ringkasan", LayoutDashboard],
  ["/admin/program", "Program & Video", PlaySquare],
  ["/admin/member", "Member & Pesanan", Users],
] as const;

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  await requireAdmin();
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <aside className="border-b bg-sidebar md:w-64 md:shrink-0 md:border-r md:border-b-0">
        <div className="flex items-center justify-between p-5">
          <Link href="/admin"><Logo /></Link>
          <span className="md:hidden"><UserButton /></span>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-col">
          {nav.map(([href, label, Icon]) => (
            <Link key={href} href={href} className="flex shrink-0 items-center gap-3 rounded-xl px-3 py-3 font-bold hover:bg-sidebar-accent">
              <Icon className="size-5" aria-hidden /> {label}
            </Link>
          ))}
          <Link href="/" className="flex shrink-0 items-center gap-3 rounded-xl px-3 py-3 font-bold text-muted-foreground hover:bg-sidebar-accent">
            <Globe className="size-5" aria-hidden /> Lihat website
          </Link>
        </nav>
        <div className="hidden p-5 md:block"><UserButton showName /></div>
      </aside>
      <main className="flex-1 space-y-8 p-5 md:p-10">
        {dbReady() ? children : <p className="rounded-2xl bg-muted p-8 text-lg">Database Supabase belum diatur. Isi SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY.</p>}
      </main>
    </div>
  );
}
