import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  experimental: {
    // Next.js limita el body de un Server Action a 1 MB por defecto — con
    // una sola foto liviana entraba, pero subir varias (hasta 10, 8 MB cada
    // una — ver MAX_FOTOS_POR_AUTO en car-photos.ts) rompía con "Body
    // exceeded 1 MB limit" (500, sin mensaje claro para el usuario). 100 MB
    // deja margen sobre el máximo teórico (10 × 8 MB = 80 MB) sin acercarse
    // al límite de tamaño de request de Cloudflare Workers.
    serverActions: {
      bodySizeLimit: "100mb",
    },
  },
  images: {
    // Next 15 sólo permite calidad 75 en el optimizador por defecto — un
    // <Image quality={N}> con N fuera de esta lista devuelve 400 (fue
    // exactamente el bug: car-media.tsx y car-gallery.tsx piden quality={90}
    // y esa foto salía rota, mientras que las miniaturas sin `quality`
    // explícito — 75 por default — cargaban bien).
    qualities: [75, 90],
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

export default withNextIntl(nextConfig);

import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev());
