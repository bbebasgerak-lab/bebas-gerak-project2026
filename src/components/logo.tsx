import { getContent } from "@/lib/content";
import { cn } from "@/lib/utils";

// Logo diatur dari Panel Admin → Pengaturan Web → Umum. Bawaan: public/images/logo.png
// (logo BGL dari client, latar putihnya sudah dibuat transparan).
export async function Logo({ className }: { className?: string }) {
  const { nama, logo } = await getContent();
  // eslint-disable-next-line @next/next/no-img-element -- ukuran logo unggahan tidak diketahui; tinggi tetap, lebar menyesuaikan
  return <img src={logo} alt={nama} className={cn("h-11 w-auto sm:h-12", className)} />;
}
