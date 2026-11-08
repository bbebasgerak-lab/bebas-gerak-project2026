import { clerkMiddleware } from "@clerk/nextjs/server";

// Cek login & admin dilakukan di tiap halaman/aksi (src/lib/auth.ts), sesuai anjuran Clerk.
// /api/webhook/midtrans memang terbuka: yang memanggil server Midtrans, dan diamankan dengan tanda tangan.
export default clerkMiddleware();

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    "/__clerk/:path*",
  ],
};
