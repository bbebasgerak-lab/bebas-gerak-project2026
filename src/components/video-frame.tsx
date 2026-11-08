// Pemutar video. watermark = email member, tampil samar supaya rekaman bajakan ketahuan asalnya.
export function VideoFrame({ src, title, watermark }: { src: string | null; title: string; watermark?: string | null }) {
  if (!src) {
    return (
      <div className="flex aspect-video items-center justify-center rounded-2xl bg-muted p-6 text-center text-muted-foreground">
        Video belum tersedia. Admin perlu mengisi link videonya.
      </div>
    );
  }
  return (
    <div className="relative aspect-video overflow-hidden rounded-2xl bg-black shadow-lg">
      <iframe
        src={src}
        title={title}
        className="absolute inset-0 h-full w-full"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
      />
      {/* Menutup judul & tautan "Tonton di YouTube" di bagian atas pemutar. */}
      <div className="absolute inset-x-0 top-0 h-14" aria-hidden />
      {watermark && (
        <div className="pointer-events-none absolute right-3 bottom-14 select-none text-xs font-bold text-white/40 sm:text-sm" aria-hidden>
          {watermark}
        </div>
      )}
    </div>
  );
}
