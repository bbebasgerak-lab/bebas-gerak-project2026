// Ilustrasi pengganti foto. Ganti dengan foto instruktur asli dari client kalau sudah ada.
export function HeroArt() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-md">
      <div className="absolute inset-0 rounded-[3rem] bg-secondary" />
      <div className="absolute inset-6 rounded-[2.5rem] bg-primary/90" />
      <svg viewBox="0 0 300 300" className="absolute inset-6 h-[calc(100%-3rem)] w-[calc(100%-3rem)]" aria-hidden>
        {/* kursi */}
        <path d="M95 175h90v14H95zM100 189v66M180 189v66M170 175v-70" className="stroke-primary-foreground/60" strokeWidth="8" strokeLinecap="round" fill="none" />
        {/* orang duduk mengangkat tangan */}
        <circle cx="140" cy="78" r="17" className="fill-[oklch(0.85_0.06_60)]" />
        <path d="M140 98v62" className="stroke-accent" strokeWidth="26" strokeLinecap="round" />
        <path d="M128 108 98 62M152 108l30-46" className="stroke-[oklch(0.85_0.06_60)]" strokeWidth="10" strokeLinecap="round" fill="none" />
        <path d="M135 165h40v62M150 165h30" className="stroke-primary-foreground" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M168 232h22" className="stroke-primary-foreground" strokeWidth="10" strokeLinecap="round" />
      </svg>
      <div className="absolute -left-3 top-10 rounded-2xl border bg-card px-4 py-3 shadow-md">
        <p className="font-heading text-2xl font-semibold">20 menit</p>
        <p className="text-sm text-muted-foreground">cukup sehari</p>
      </div>
      <div className="absolute -right-3 bottom-12 rounded-2xl border bg-card px-4 py-3 shadow-md">
        <p className="font-bold">Dari kursi</p>
        <p className="text-sm text-muted-foreground">aman untuk lutut</p>
      </div>
    </div>
  );
}
