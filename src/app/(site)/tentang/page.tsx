import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { site } from "@/lib/site";

export const metadata = { title: "Tentang Kami" };

// Teks contoh — ganti dengan cerita asli client.
export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-14">
      <p className="font-bold uppercase tracking-widest text-accent">Tentang kami</p>
      <h1 className="text-5xl font-semibold">Bergerak dengan nyaman di usia berapa pun</h1>
      <div className="space-y-5 text-lg">
        <p>
          {site.name} lahir dari keyakinan sederhana: setiap orang berhak merasa kuat, mandiri, dan percaya diri,
          berapa pun usianya.
        </p>
        <p>
          Banyak latihan di internet terlalu cepat atau terlalu berat untuk orang tua kita. Karena itu setiap video kami
          bergerak pelan, menjelaskan gerakan dengan jelas, dan selalu menyediakan pilihan yang lebih ringan.
        </p>
        <p>
          Tujuan kami: membantu Anda tetap aktif, lebih kuat setiap minggu, dan terus menikmati hidup yang sudah Anda
          bangun dengan kerja keras.
        </p>
      </div>
      <Link href="/program" className={buttonVariants({ size: "lg" })}>Lihat program</Link>
    </div>
  );
}
