import { getContent } from "@/lib/content";
import { LegalPage } from "@/components/legal-page";

export const metadata = { title: "Syarat & Ketentuan" };

export default async function TermsPage() {
  const c = await getContent();
  return <LegalPage title={c.sk_judul} updated={c.sk_tanggal} body={c.sk_isi} />;
}
