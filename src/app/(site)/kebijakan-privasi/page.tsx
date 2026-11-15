import { getContent } from "@/lib/content";
import { LegalPage } from "@/components/legal-page";

export const metadata = { title: "Kebijakan Privasi" };

// Link halaman ini dipakai di layar izin login Google dan diminta Midtrans.
export default async function PrivacyPage() {
  const c = await getContent();
  return <LegalPage title={c.privasi_judul} updated={c.privasi_tanggal} body={c.privasi_isi} />;
}
