import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Host exacto del bucket, no un wildcard "*.r2.dev": con wildcard,
      // cualquiera puede pasarle a /_next/image la URL de OTRO bucket
      // público de R2 y usar este Worker como proxy/redimensionador gratis
      // para imágenes ajenas (verificado: un host *.r2.dev cualquiera
      // pasaba el chequeo y Next hacía el fetch upstream).
      // Si el dominio público del bucket cambia (ver R2_PUBLIC_URL en
      // wrangler.jsonc / .dev.vars), actualizar acá también.
      { protocol: "https", hostname: "pub-2a4b20ea6c834e9d8fda32f7a54be906.r2.dev" },
    ],
  },
};

export default nextConfig;

import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev());
