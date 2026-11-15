import Link from "next/link";
import { Clock, Mail, MapPin, MessageCircle } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { getContent } from "@/lib/content";
import { waLink } from "@/lib/content-fields";

export const metadata = { title: "Kontak" };

// Isi diatur dari Panel Admin → Pengaturan Web → Halaman Kontak (nomor WhatsApp di bagian Umum).
export default async function ContactPage() {
  const c = await getContent();
  const wa = waLink(c.whatsapp);
  const rows = [
    { icon: Mail, label: "Email", value: c.kontak_email, href: `mailto:${c.kontak_email}` },
    { icon: Clock, label: "Jam layanan", value: c.kontak_jam },
    ...(c.kontak_alamat ? [{ icon: MapPin, label: "Alamat", value: c.kontak_alamat }] : []),
  ];
  return (
    <div className="mx-auto max-w-3xl space-y-10 px-4 py-14">
      <div className="space-y-4">
        <h1 className="text-[2.6rem] leading-[1.05] md:text-6xl">{c.kontak_judul}</h1>
        <p className="max-w-prose text-xl text-muted-foreground">{c.kontak_teks}</p>
      </div>
      <div data-reveal className="space-y-6 rounded-3xl bg-card p-7 md:p-10">
        {wa ? (
          <a href={wa} target="_blank" rel="noreferrer" className={buttonVariants({ size: "lg", className: "w-full sm:w-auto" })}>
            <MessageCircle aria-hidden /> Chat WhatsApp
          </a>
        ) : (
          <p className="text-muted-foreground">Nomor WhatsApp belum diatur.</p>
        )}
        <dl className="space-y-5 text-lg">
          {rows.map(({ icon: Icon, label, value, href }) => (
            <div key={label} className="flex gap-4">
              <Icon className="mt-1 size-6 shrink-0" aria-hidden />
              <div>
                <dt className="font-bold">{label}</dt>
                <dd className="whitespace-pre-line text-muted-foreground">
                  {href ? <a href={href} className="underline underline-offset-4">{value}</a> : value}
                </dd>
              </div>
            </div>
          ))}
        </dl>
      </div>
      <p className="text-muted-foreground">
        Soal pengembalian dana, lihat <Link href="/kebijakan-refund" className="underline underline-offset-4">Kebijakan Pengembalian Dana</Link>.
      </p>
    </div>
  );
}
