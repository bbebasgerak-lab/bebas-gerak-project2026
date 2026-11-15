"use client";

import { useEffect } from "react";

// Klik tautan yang menuju halaman yang sama (menu Testimoni / Tanya Jawab, logo di beranda,
// tombol "Putar video") meluncur halus ke tujuan, bukan melompat. Pindah ke halaman lain tetap
// langsung. Kalau pengguna memilih "kurangi gerakan", tetap melompat.
export function SmoothScroll() {
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a || (a.target && a.target !== "_self") || a.hasAttribute("download")) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || url.pathname !== location.pathname || url.search !== location.search) return;

      const target = url.hash ? document.getElementById(decodeURIComponent(url.hash.slice(1))) : null;
      if (url.hash && !target) return; // tujuan tidak ada di halaman ini: biarkan normal

      // Mencegah Next.js ikut menangani klik ini (Link melewati klik yang sudah di-preventDefault).
      e.preventDefault();
      const behavior = matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
      if (target) target.scrollIntoView({ behavior, block: "start" });
      else window.scrollTo({ top: 0, behavior });
      history.pushState(history.state, "", url.hash ? url.hash : url.pathname + url.search);
    }
    // Fase capture: jalan sebelum handler klik milik Link.
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);
  return null;
}
