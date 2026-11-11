import type { ReactNode } from "react";
import { SiteImage } from "@/components/site-image";

// Panel hero bergaya editorial (DESIGN.md).
// Foto: Khanh Do di Unsplash (Unsplash License — bebas dipakai komersial, tanpa wajib atribusi)
// https://unsplash.com/photos/group-of-women-exercising-together-in-a-park-YFzKE1P6l80
// Foto & label bisa diganti dari Panel Admin → Pengaturan Web.
export function HeroArt({ photo, alt, badges, children }: { photo: string; alt: string; badges: string[]; children?: ReactNode }) {
  return (
    <div className="relative overflow-hidden rounded-[2rem] bg-foreground md:aspect-[16/8]">
      <div className="relative aspect-[4/3] md:absolute md:inset-0 md:aspect-auto">
        <SiteImage
          src={photo}
          alt={alt}
          fill
          loading="eager"
          fetchPriority="high"
          sizes="(min-width: 1152px) 1120px, 100vw"
          className="object-cover object-[30%_45%]"
        />
        {/* HP: label di bawah foto agar tidak menutupi wajah; desktop: pojok kiri atas. */}
        <div className="absolute inset-x-3 bottom-3 flex flex-wrap gap-2 md:inset-x-auto md:bottom-auto md:left-6 md:top-6">
          {badges.map((b) => (
            <span key={b} className="eyebrow border-transparent bg-foreground/85 text-background">{b}</span>
          ))}
        </div>
      </div>
      {children && (
        <div className="m-4 rounded-3xl bg-card p-6 md:absolute md:bottom-6 md:right-6 md:m-0 md:w-[26rem] md:p-8">
          {children}
        </div>
      )}
    </div>
  );
}
