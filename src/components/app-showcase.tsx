"use client";

import Image from "next/image";
import { createContext, useContext, useRef, useState, type ReactNode } from "react";
import { ArrowLeft, Check, ChevronLeft, ChevronRight, Menu, MessageCircle, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import heroPhoto from "../../public/images/hero-senam.jpg";
import kekuatanPhoto from "../../public/images/manfaat-kekuatan.jpg";
import keseimbanganPhoto from "../../public/images/manfaat-keseimbangan.jpg";

// Section "lihat tampilannya": mockup HP miring bergaya portofolio.
// Desktop (≥1024px): 4 HP berjajar miring + keterangan bernomor di bawahnya.
// HP/tablet: satu HP per layar, geser (swipe) atau tombol Sebelumnya/Berikutnya. Tidak ada putar otomatis (DESIGN.md).
// Isi layar HP hanya gambar dekoratif (aria-hidden); teks yang dibaca ada di keterangan, ukurannya normal.

export type ShowcaseProgram = { title: string; level: string | null; price: string };

const SAMPLE: ShowcaseProgram[] = [
  { title: "Senam Kursi Pemula", level: "Pemula", price: "Rp99.000" },
  { title: "Keseimbangan Harian", level: "Menengah", price: "Rp129.000" },
  { title: "Akses Semua Program", level: null, price: "Rp199.000" },
];

const CAPTIONS = [
  ["Beranda", "Huruf besar dan tombol jelas, nyaman untuk mata."],
  ["Pilih program", "Lihat isi dan harga setiap program sebelum membeli."],
  ["Video latihan", "Putar video, ikuti gerakan pelan-pelan bersama pelatih."],
  ["Latihan saya", "Semua program Anda tersimpan di satu tempat."],
] as const;

export type ShowcaseText = { name: string; label: string; title1: string; title2: string; text: string };
const BrandName = createContext("");

export function AppShowcase({ programs, text }: { programs: ShowcaseProgram[]; text: ShowcaseText }) {
  const list = programs.length ? programs : SAMPLE;
  const screens = [
    <HomeScreen key="home" />,
    <ProgramScreen key="program" programs={list} />,
    <VideoScreen key="video" program={list[0].title} />,
    <MyScreen key="my" program={list[0].title} />,
  ];

  return (
    <BrandName value={text.name}>
    <section className="overflow-hidden py-16 md:py-20" aria-labelledby="tampilan-judul">
      <div className="mx-auto max-w-6xl px-4 text-center">
        <p className="eyebrow mb-6">{text.label}</p>
        <h2 id="tampilan-judul" className="mx-auto w-fit bg-band px-6 py-4 text-[2.2rem] leading-[1.05] text-band-foreground md:px-10 md:py-6 md:text-6xl">
          {text.title1}
          <span className="block text-band-muted">{text.title2}</span>
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
          {text.text}
        </p>
      </div>

      {/* ===== Versi desktop ===== */}
      <div className="hidden lg:block">
        <div aria-hidden className="flex items-start justify-center gap-2 pt-14 pb-24">
          {screens.map((screen, i) => (
            <div key={i} style={{ transform: `rotate(10deg) translateY(${i % 2 ? -8 : 56}px)` }}>
              <Phone>{screen}</Phone>
            </div>
          ))}
        </div>
        <ol className="mx-auto grid max-w-6xl grid-cols-4 divide-x border-t bg-background px-4">
          {CAPTIONS.map(([title, text], i) => (
            <li key={title} className="space-y-2 px-6 pt-6 first:pl-0 last:pr-0">
              <span className="font-heading text-4xl">0{i + 1}</span>
              <h3 className="text-2xl">{title}</h3>
              <p className="text-muted-foreground">{text}</p>
            </li>
          ))}
        </ol>
      </div>

      {/* ===== Versi HP & tablet ===== */}
      <MobileCarousel screens={screens} />
    </section>
    </BrandName>
  );
}

function MobileCarousel({ screens }: { screens: ReactNode[] }) {
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const last = screens.length - 1;

  const onScroll = () => {
    const el = track.current;
    const slide = el?.firstElementChild as HTMLElement | null;
    if (el && slide) setActive(Math.round(el.scrollLeft / slide.offsetWidth));
  };

  const go = (i: number) => {
    const el = track.current;
    const slide = el?.children[i] as HTMLElement | undefined;
    if (!el || !slide) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({ left: slide.offsetLeft - (el.clientWidth - slide.offsetWidth) / 2, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <div className="lg:hidden" role="region" aria-roledescription="carousel" aria-label="Contoh tampilan di HP">
      <div
        ref={track}
        onScroll={onScroll}
        className="flex snap-x snap-mandatory overflow-x-auto px-[calc(50%-130px)] pt-10 pb-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {screens.map((screen, i) => (
          <div
            key={i}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} dari ${screens.length}: ${CAPTIONS[i][0]}`}
            className="flex w-[260px] shrink-0 snap-center justify-center"
          >
            <div
              aria-hidden
              className={cn("transition-[transform,opacity] duration-300 motion-reduce:transition-none", i === active ? "rotate-[-4deg] opacity-100" : "scale-90 opacity-50")}
            >
              <Phone>{screen}</Phone>
            </div>
          </div>
        ))}
      </div>

      <div className="mx-auto max-w-md px-4 text-center">
        <p className="font-mono text-sm uppercase tracking-wide text-muted-foreground" aria-live="polite">
          {active + 1} dari {screens.length}
        </p>
        <h3 className="mt-2 text-3xl">{CAPTIONS[active][0]}</h3>
        <p className="mt-2 min-h-[3.2em] text-muted-foreground">{CAPTIONS[active][1]}</p>
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => go(active - 1)}
            disabled={active === 0}
            className="inline-flex h-13 items-center justify-center gap-1 rounded-full border-2 border-foreground font-mono text-[0.9rem] font-bold uppercase tracking-wide disabled:opacity-35"
          >
            <ChevronLeft className="size-5" aria-hidden /> Sebelumnya
          </button>
          <button
            type="button"
            onClick={() => go(active + 1)}
            disabled={active === last}
            className="inline-flex h-13 items-center justify-center gap-1 rounded-full bg-primary font-mono text-[0.9rem] font-bold uppercase tracking-wide text-primary-foreground disabled:opacity-35"
          >
            Berikutnya <ChevronRight className="size-5" aria-hidden />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Bingkai HP ---------- */

function Phone({ children }: { children: ReactNode }) {
  return (
    <div className="w-[250px] rounded-[2.4rem] bg-[#131313] p-[7px] shadow-[0_40px_60px_-25px_rgba(19,19,19,0.55)]">
      <div className="relative h-[528px] overflow-hidden rounded-[2rem]">
        {children}
        {/* Kamera depan */}
        <div className="absolute top-2 left-1/2 h-[18px] w-[70px] -translate-x-1/2 rounded-full bg-[#131313]" />
      </div>
    </div>
  );
}

function StatusBar({ dark }: { dark?: boolean }) {
  return (
    <div className={cn("flex h-8 items-center justify-between px-5 pt-1 text-[10px] font-bold", dark ? "text-[#eeefe9]" : "text-[#131313]")}>
      <span>07.30</span>
      <span className="flex items-center gap-1">
        <span className="h-[7px] w-[12px] rounded-[2px] border border-current" />
      </span>
    </div>
  );
}

function MiniPill({ children, dark }: { children: ReactNode; dark?: boolean }) {
  return (
    <span className={cn("inline-block rounded-full border px-2 py-[2px] font-mono text-[7.5px] font-medium uppercase tracking-wide", dark ? "border-[#eeefe9]/60" : "border-current")}>
      {children}
    </span>
  );
}

function MiniButton({ children, light, className }: { children: ReactNode; light?: boolean; className?: string }) {
  return (
    <span className={cn("flex h-7 items-center justify-center rounded-full font-mono text-[8.5px] font-bold uppercase tracking-wide", light ? "bg-[#eeefe9] text-[#131313]" : "bg-[#131313] text-[#eeefe9]", className)}>
      {children}
    </span>
  );
}

function MiniHeader({ title, dark, back }: { title?: string; dark?: boolean; back?: boolean }) {
  const brand = useContext(BrandName);
  return (
    <div className="flex items-center justify-between px-4 py-2">
      {back ? (
        <span className="flex items-center gap-2">
          <span className={cn("flex size-6 items-center justify-center rounded-full border", dark ? "border-[#eeefe9]/50" : "border-[#131313]")}>
            <ArrowLeft className="size-3" />
          </span>
          <span className="font-mono text-[9px] font-medium uppercase tracking-wide">{title}</span>
        </span>
      ) : (
        <span className="flex items-center gap-1.5">
          <span className={cn("size-5 rounded-full", dark ? "bg-[#eeefe9]" : "bg-[#131313]")} />
          <span className="font-heading text-[13px] uppercase italic leading-none">{brand}</span>
        </span>
      )}
      <Menu className="size-4" />
    </div>
  );
}

/* ---------- Isi layar ---------- */

function HomeScreen() {
  return (
    <div className="h-full bg-[#eeefe9] text-[#131313]">
      <StatusBar />
      <MiniHeader />
      <p className="mt-3 px-4 text-center font-heading text-[25px] leading-[1] italic">
        Tubuh Lebih Kuat, Langkah Lebih Mantap
      </p>
      <div className="mt-3 text-center">
        <MiniPill>Senam kursi usia 50+</MiniPill>
      </div>
      <div className="relative mx-3 mt-4 overflow-hidden rounded-[18px] bg-[#131313] p-2">
        <div className="relative -m-2 mb-0 h-[150px]">
          <Image src={heroPhoto} alt="" fill sizes="250px" className="object-cover object-[25%_55%]" />
        </div>
        <div className="relative space-y-1.5 rounded-[14px] bg-[#d5dadc] p-3">
          <span className="inline-block rounded-full bg-[#131313] px-2 py-[2px] font-mono text-[7px] uppercase text-[#eeefe9]">Video gratis</span>
          <p className="font-heading text-[15px] leading-tight">Coba satu latihan sekarang</p>
          <MiniButton>Putar video</MiniButton>
        </div>
      </div>
      <div className="mx-3 mt-3">
        <span className="flex h-7 items-center justify-center rounded-full border-[1.5px] border-[#131313] font-mono text-[8.5px] font-bold uppercase tracking-wide">
          Lihat program
        </span>
      </div>
    </div>
  );
}

function ProgramScreen({ programs }: { programs: ShowcaseProgram[] }) {
  return (
    <div className="h-full bg-[#131313] text-[#eeefe9]">
      <StatusBar dark />
      <MiniHeader dark back title="Program" />
      <div className="px-4 pt-2">
        <MiniPill dark>Pilih program</MiniPill>
        <p className="mt-2 font-heading text-[22px] leading-[1.05]">Mulai dari yang paling cocok</p>
      </div>
      <div className="mt-3 space-y-2.5 px-3">
        {programs.slice(0, 3).map((p, i) => (
          <div key={p.title} className={cn("rounded-[14px] bg-[#d5dadc] p-3 text-[#131313]", i === 2 && "outline-[1.5px] outline-[#eeefe9]")}>
            {p.level ? <MiniPill>{p.level}</MiniPill> : <MiniPill>Paling lengkap</MiniPill>}
            <p className="mt-1.5 font-heading text-[14px] leading-tight">{p.title}</p>
            <div className="mt-2 flex items-center justify-between">
              <span className="font-heading text-[16px]">{p.price}</span>
              <MiniButton className="w-[58px]">Lihat</MiniButton>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function VideoScreen({ program }: { program: string }) {
  const lessons = ["Pemanasan duduk", "Angkat kaki bergantian", "Tangan ke atas", "Pendinginan"];
  return (
    <div className="h-full bg-[#eeefe9] text-[#131313]">
      <StatusBar />
      <MiniHeader back title="Latihan saya" />
      <div className="relative mx-3 mt-1 aspect-video overflow-hidden rounded-[14px] bg-[#131313]">
        <Image src={kekuatanPhoto} alt="" fill sizes="250px" className="object-cover" />
        <span className="absolute inset-0 m-auto flex size-11 items-center justify-center rounded-full bg-[#eeefe9]/95">
          <Play className="ml-0.5 size-5 fill-[#131313]" />
        </span>
        <span className="absolute inset-x-3 bottom-2 h-[3px] rounded-full bg-[#eeefe9]/40">
          <span className="block h-full w-2/5 rounded-full bg-[#eeefe9]" />
        </span>
      </div>
      <div className="px-4 pt-3">
        <p className="font-mono text-[8px] uppercase tracking-wide text-[#3d3d3a]">{program}</p>
        <p className="mt-1 font-heading text-[17px] leading-tight">Hari 3 · Kaki Kuat Sambil Duduk</p>
        <p className="mt-1 text-[9.5px] text-[#3d3d3a]">15 menit · cukup dengan kursi</p>
      </div>
      <ul className="mt-3 space-y-1.5 px-3">
        {lessons.map((l, i) => (
          <li key={l} className="flex items-center gap-2 rounded-[10px] bg-[#d5dadc] px-2.5 py-2 text-[10px]">
            <span className={cn("flex size-4 items-center justify-center rounded-full border border-[#131313]", i < 2 && "bg-[#131313] text-[#eeefe9]")}>
              {i < 2 && <Check className="size-2.5" />}
            </span>
            {l}
          </li>
        ))}
      </ul>
      <div className="mx-3 mt-3">
        <MiniButton>Lanjut gerakan berikutnya</MiniButton>
      </div>
    </div>
  );
}

function MyScreen({ program }: { program: string }) {
  return (
    <div className="h-full bg-[#131313] text-[#eeefe9]">
      <StatusBar dark />
      <MiniHeader dark />
      <div className="px-4 pt-3">
        <p className="text-[10px] text-[#b9bcb4]">Selamat pagi, Ibu</p>
        <p className="font-heading text-[24px] leading-tight">Latihan Saya</p>
      </div>
      <div className="mx-3 mt-3 overflow-hidden rounded-[14px] bg-[#d5dadc] text-[#131313]">
        <div className="relative h-[92px]">
          <Image src={keseimbanganPhoto} alt="" fill sizes="250px" className="object-cover" />
        </div>
        <div className="space-y-2 p-3">
          <p className="font-heading text-[15px] leading-tight">{program}</p>
          <div className="h-[6px] rounded-full bg-[#131313]/15">
            <div className="h-full w-[30%] rounded-full bg-[#131313]" />
          </div>
          <p className="text-[9px] text-[#3d3d3a]">3 dari 10 video selesai</p>
          <MiniButton>Lanjutkan latihan</MiniButton>
        </div>
      </div>
      <div className="mx-3 mt-2.5 flex items-center justify-between rounded-[14px] border border-[#eeefe9]/30 p-3">
        <span>
          <span className="block font-mono text-[7.5px] uppercase tracking-wide text-[#b9bcb4]">Latihan berikutnya</span>
          <span className="font-heading text-[13px]">Hari 4 · Lengan</span>
        </span>
        <span className="flex size-7 items-center justify-center rounded-full bg-[#eeefe9] text-[#131313]">
          <Play className="ml-0.5 size-3 fill-current" />
        </span>
      </div>
      <div className="mx-3 mt-2.5">
        <MiniButton light className="gap-1.5">
          <MessageCircle className="size-3" /> Butuh bantuan? WhatsApp
        </MiniButton>
      </div>
    </div>
  );
}
