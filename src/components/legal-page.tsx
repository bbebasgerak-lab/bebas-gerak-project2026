// Halaman teks panjang (Kebijakan Privasi, Syarat & Ketentuan, Refund). Isi diatur dari Pengaturan Web:
// paragraf dipisah baris kosong, baris yang diawali "## " jadi subjudul.
export function LegalPage({ title, updated, body }: { title: string; updated: string; body: string }) {
  return (
    <article className="mx-auto max-w-3xl space-y-8 px-4 py-14">
      <div className="space-y-3">
        <h1 className="text-[2.6rem] leading-[1.05] md:text-6xl">{title}</h1>
        <p className="text-muted-foreground">Terakhir diperbarui: {updated}</p>
      </div>
      <div className="max-w-prose space-y-5 text-lg">
        {body.split(/\n\s*\n/).map((block, i) =>
          block.startsWith("## ") ? (
            <h2 key={i} className="pt-4 text-3xl">{block.slice(3)}</h2>
          ) : (
            <p key={i}>{block}</p>
          ),
        )}
      </div>
    </article>
  );
}
