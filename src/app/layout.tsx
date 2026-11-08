import type { Metadata } from "next";
import { Atkinson_Hyperlegible, Fraunces } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { idID } from "@clerk/localizations";
import { Toaster } from "@/components/ui/sonner";
import { PixelTracker } from "@/components/pixel-tracker";
import { site } from "@/lib/site";
import "./globals.css";

// Atkinson Hyperlegible dirancang khusus agar mudah dibaca orang dengan penglihatan lemah.
const body = Atkinson_Hyperlegible({ variable: "--font-body", subsets: ["latin"], weight: ["400", "700"] });
const display = Fraunces({ variable: "--font-display", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: `${site.name} — Senam Kursi untuk Lansia`, template: `%s · ${site.name}` },
  description: site.tagline,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className={`${body.variable} ${display.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <ClerkProvider
          localization={idID}
          appearance={{ variables: { colorPrimary: "#1e5b4f", fontSize: "1rem", borderRadius: "0.9rem" } }}
        >
          {children}
          <Toaster position="top-center" richColors />
          <PixelTracker />
        </ClerkProvider>
      </body>
    </html>
  );
}
