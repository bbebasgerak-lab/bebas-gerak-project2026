import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { Logo } from "@/components/logo";
import { requireAdmin } from "@/lib/auth";
import { dbReady } from "@/lib/data";
import { AdminNav } from "./admin-nav";

export const metadata = { title: "Panel Admin" };

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  await requireAdmin();
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <aside className="border-b bg-sidebar md:w-64 md:shrink-0 md:border-r md:border-b-0">
        <div className="flex items-center justify-between p-5">
          <Link href="/admin"><Logo /></Link>
          <span className="md:hidden"><UserButton /></span>
        </div>
        <AdminNav />
        <div className="hidden p-5 md:block"><UserButton showName /></div>
      </aside>
      <main className="min-w-0 flex-1 space-y-10 p-5 md:p-10">
        {dbReady() ? children : <p className="rounded-3xl bg-card p-8 text-lg">Database Supabase belum diatur. Isi SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY.</p>}
      </main>
    </div>
  );
}
