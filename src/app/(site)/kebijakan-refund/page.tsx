import { getContent } from "@/lib/content";
import { LegalPage } from "@/components/legal-page";

export const metadata = { title: "Kebijakan Pengembalian Dana" };

export default async function RefundPage() {
  const c = await getContent();
  return <LegalPage title={c.refund_judul} updated={c.refund_tanggal} body={c.refund_isi} />;
}
