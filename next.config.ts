import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // PGlite (base de datos local) carga archivos WASM: no debe empaquetarse
  serverExternalPackages: ["@electric-sql/pglite"],
  images: {
    // Fotos en Supabase Storage (bucket público "media"). Ver src/lib/storage.ts
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/media/**" },
    ],
  },
  experimental: {
    // Subida de fotos de producto desde el admin (máx. 8 MB por imagen)
    serverActions: { bodySizeLimit: "20mb" },
    proxyClientMaxBodySize: "20mb",
  },
};

export default nextConfig;
