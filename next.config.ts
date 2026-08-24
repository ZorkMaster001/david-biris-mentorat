import type { NextConfig } from "next";

// Copiat, nu importat: `next.config.ts` se incarca inainte de alias-urile TypeScript.
const DEFAULT_LOCALE = "ro";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ["@phosphor-icons/react"],
  },
  async redirects() {
    // Redirect real 308, nu o pagina randata: `/` nu mai are nevoie de un layout
    // radacina propriu, deci layout-ul poate cobori sub `[locale]` si poate pune
    // limba corecta pe `<html>`.
    return [{ source: "/", destination: `/${DEFAULT_LOCALE}`, permanent: true }];
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
