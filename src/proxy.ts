import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Cek login & admin dilakukan di tiap halaman/aksi (src/lib/auth.ts), sesuai anjuran Clerk.
// /api/webhook/midtrans memang terbuka: yang memanggil server Midtrans, dan diamankan dengan tanda tangan.
// www.bebasgerak.my.id -> bebasgerak.my.id (satu alamat saja, lebih rapi untuk Google & login).
export default clerkMiddleware((_auth, req) => {
  const host = req.headers.get("host") ?? "";
  if (host.startsWith("www.")) {
    const url = req.nextUrl.clone();
    url.host = host.slice(4);
    url.port = "";
    url.protocol = "https:";
    return NextResponse.redirect(url, 308);
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    "/__clerk/:path*",
  ],
};
