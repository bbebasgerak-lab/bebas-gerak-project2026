import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Foto yang diunggah admin lewat Pengaturan Web disimpan di Supabase Storage (bucket publik "web").
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**.supabase.co", pathname: "/storage/v1/object/public/web/**" }],
  },
  // Cache Components sengaja dimatikan: hampir semua halaman bergantung pada user yang login.
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
