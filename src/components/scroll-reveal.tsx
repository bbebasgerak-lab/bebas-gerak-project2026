"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Pasang di layout. Elemen dengan atribut data-reveal muncul pelan saat masuk layar.
// data-reveal-stagger di induk: anak-anaknya muncul bergantian (cocok untuk kartu berjajar).
// Kelas .reveal-on sendiri dipasang lebih awal oleh REVEAL_BOOT supaya tidak ada kedipan.
// Jaring pengaman: kalau komponen ini belum jalan dalam 4 detik (skrip gagal/HP sangat lambat),
// animasi dimatikan dan semua isi langsung tampil.
export const REVEAL_BOOT = `(function(){var d=document.documentElement;if(matchMedia("(prefers-reduced-motion: reduce)").matches||!("IntersectionObserver"in window))return;d.classList.add("reveal-on");setTimeout(function(){if(!d.dataset.revealReady)d.classList.remove("reveal-on")},4000)})()`;

export function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    if (!root.classList.contains("reveal-on")) return;
    root.dataset.revealReady = "1";

    document.querySelectorAll<HTMLElement>("[data-reveal-stagger]").forEach((parent) => {
      Array.from(parent.children).forEach((child, i) => {
        const el = child as HTMLElement;
        if (!el.hasAttribute("data-reveal")) el.setAttribute("data-reveal", "");
        el.style.setProperty("--reveal-delay", `${Math.min(i, 4) * 120}ms`);
      });
    });

    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add("is-revealed");
          observer.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );
    document.querySelectorAll("[data-reveal]:not(.is-revealed)").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
