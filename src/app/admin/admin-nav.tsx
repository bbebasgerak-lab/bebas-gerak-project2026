"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Globe, LayoutDashboard, PlaySquare, Settings, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  ["/admin", "Ringkasan", LayoutDashboard],
  ["/admin/program", "Program & Video", PlaySquare],
  ["/admin/member", "Member & Pesanan", Users],
  ["/admin/pengaturan", "Pengaturan Web", Settings],
] as const;

// Menu samping admin. Halaman yang sedang dibuka ditandai pita gelap.
export function AdminNav() {
  const path = usePathname();
  const item = "flex shrink-0 items-center gap-3 rounded-full px-4 py-3 font-bold transition";
  return (
    <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-col" aria-label="Menu admin">
      {nav.map(([href, label, Icon]) => {
        const active = href === "/admin" ? path === "/admin" : path.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(item, active ? "bg-foreground text-background" : "hover:bg-sidebar-accent")}
          >
            <Icon className="size-5" aria-hidden /> {label}
          </Link>
        );
      })}
      <Link href="/" className={cn(item, "text-muted-foreground hover:bg-sidebar-accent")}>
        <Globe className="size-5" aria-hidden /> Lihat website
      </Link>
    </nav>
  );
}
