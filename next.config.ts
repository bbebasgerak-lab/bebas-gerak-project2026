import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
