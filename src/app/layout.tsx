import type { Metadata } from "next";
import { Anton, Atkinson_Hyperlegible, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import { ClerkProvider } from "@clerk/nextjs";
import { idID } from "@clerk/localizations";
import { Toaster } from "@/components/ui/sonner";
import { PixelTracker } from "@/components/pixel-tracker";
import { REVEAL_BOOT } from "@/components/scroll-reveal";
import { getContent } from "@/lib/content";
import "./globals.css";

// Atkinson Hyperlegible dirancang khusus agar mudah dibaca orang dengan penglihatan lemah.
const body = Atkinson_Hyperlegible({ variable: "--font-body", subsets: ["latin"], weight: ["400", "700"] });
// Anton = judul padat bergaya editorial-enerjik; JetBrains Mono = label kapsul & tombol (DESIGN.md).
const display = Anton({ variable: "--font-display", subsets: ["latin"], weight: "400" });
const code = JetBrains_Mono({ variable: "--font-code", subsets: ["latin"], weight: ["500", "700"] });

export async function generateMetadata(): Promise<Metadata> {
  const c = await getContent();
  return {
    // Alamat dasar untuk gambar pratinjau link (opengraph-image.png) dan tautan kanonis.
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://bebasgerak.my.id"),
    title: { default: `${c.nama} — ${c.judul_tab}`, template: `%s · ${c.nama}` },
    description: c.tagline,
    openGraph: { siteName: c.nama, locale: "id_ID", type: "website", description: c.tagline },
  };
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" suppressHydrationWarning className={`${body.variable} ${display.variable} ${code.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        {/* Menambah kelas reveal-on di <html> sebelum halaman aktif (karena itu suppressHydrationWarning). */}
        <Script id="reveal-boot" strategy="beforeInteractive">{REVEAL_BOOT}</Script>
        <ClerkProvider
          localization={idID}
          appearance={{ variables: { colorPrimary: "#131313", fontSize: "1rem", borderRadius: "0.9rem" } }}
        >
          {children}
          <Toaster position="top-center" richColors />
          <PixelTracker />
        </ClerkProvider>
      </body>
    </html>
  );
}
