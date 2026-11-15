import { getContent } from "@/lib/content";

export const metadata = { title: "Kebijakan Privasi" };

// Teks diatur dari Panel Admin → Pengaturan Web. Baris yang diawali "## " jadi subjudul.
// Link halaman ini dipakai di layar izin login Google dan diminta Midtrans.
export default async function PrivacyPage() {
  const c = await getContent();
  return (
    <article className="mx-auto max-w-3xl space-y-8 px-4 py-14">
      <div className="space-y-3">
        <h1 className="text-[2.6rem] leading-[1.05] md:text-6xl">{c.privasi_judul}</h1>
        <p className="text-muted-foreground">Terakhir diperbarui: {c.privasi_tanggal}</p>
      </div>
      <div className="max-w-prose space-y-5 text-lg">
        {c.privasi_isi.split(/\n\s*\n/).map((block) =>
          block.startsWith("## ") ? (
            <h2 key={block} className="pt-4 text-3xl">{block.slice(3)}</h2>
          ) : (
            <p key={block}>{block}</p>
          ),
        )}
      </div>
    </article>
  );
}
