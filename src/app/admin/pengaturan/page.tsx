import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getContent } from "@/lib/content";
import { faqHeading, groups, type FieldDef } from "@/lib/content-fields";
import { Field } from "../program/program-form";
import { FaqEditor, ImageField, SettingsForm } from "./editors";

export const metadata = { title: "Pengaturan Web" };

const sectionClass = "scroll-mt-6 space-y-5 rounded-2xl border bg-card p-6";
const FAQ_ID = "bagian-tanya-jawab";

export default async function SettingsPage() {
  const c = await getContent();
  const text = (f: FieldDef) => (
    <div key={f.key} className={f.kind === "area" ? "md:col-span-2" : undefined}>
      <Field label={f.label} hint={f.hint}>
        {f.kind === "image" ? (
          <ImageField name={f.key} defaultValue={c[f.key]} original={f.def} />
        ) : f.kind === "area" ? (
          <Textarea name={f.key} defaultValue={c[f.key]} rows={f.key === "tentang_isi" ? 10 : 3} className="text-base" />
        ) : (
          <Input name={f.key} defaultValue={c[f.key]} className="h-11 text-base" />
        )}
      </Field>
    </div>
  );

  return (
    <>
      <div className="space-y-3">
        <h1 className="text-4xl font-semibold">Pengaturan Web</h1>
        <p className="max-w-prose text-lg text-muted-foreground">
          Ubah tulisan dan foto di website, lalu tekan <b>Simpan perubahan</b> di bagian bawah. Kolom yang dikosongkan kembali ke tulisan awal.
        </p>
      </div>
      <nav aria-label="Lompat ke bagian" className="flex flex-wrap gap-2">
        {[...groups.map((g, i) => [`#bagian-${i}`, g.title]), [`#${FAQ_ID}`, "Beranda: tanya jawab"]].map(([href, title]) => (
          <a key={href} href={href} className="rounded-full border bg-card px-4 py-2 text-sm font-bold hover:bg-muted">{title}</a>
        ))}
      </nav>
      <SettingsForm>
        {groups.map((g, i) => (
          <section key={g.title} id={`bagian-${i}`} className={sectionClass}>
            <div className="space-y-1">
              <h2 className="text-2xl font-semibold">{g.title}</h2>
              {g.note && <p className="text-muted-foreground">{g.note}</p>}
            </div>
            <div className="grid gap-5 md:grid-cols-2">{g.fields.map(text)}</div>
          </section>
        ))}
        <section id={FAQ_ID} className={sectionClass}>
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold">Beranda: tanya jawab</h2>
            <p className="text-muted-foreground">Bisa ditambah atau dihapus. Kalau semua dihapus, pertanyaan awal tampil lagi.</p>
          </div>
          <div className="grid gap-5 md:grid-cols-2">{[faqHeading.label, faqHeading.judul].map(text)}</div>
          <FaqEditor initial={c.faq} />
        </section>
        <div className="sticky bottom-0 -mx-5 flex flex-wrap items-center gap-3 border-t bg-background/95 px-5 py-4 backdrop-blur md:-mx-10 md:px-10">
          <Button type="submit" size="lg">Simpan perubahan</Button>
          <Link href="/" target="_blank" className={buttonVariants({ variant: "outline", size: "lg" })}>Lihat website</Link>
        </div>
      </SettingsForm>
    </>
  );
}
