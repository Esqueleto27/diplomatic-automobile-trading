import { headers } from "next/headers";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/footer";
import { QuickContact } from "@/components/site/quick-contact";
import { contacto, siteUrl } from "@/lib/site";
import { jsonLd } from "@/lib/json-ld";

// AutomotiveBusiness (Schema.org): describe el negocio para resultados
// enriquecidos de búsqueda (nombre, dirección, teléfono). Va sólo en el
// layout público, no en /admin.
function organizacionSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "AutomotiveBusiness",
    name: "Diplomatic Automobile Trading",
    url: siteUrl,
    telephone: contacto.telefonos[0],
    email: contacto.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: contacto.direccion,
      addressLocality: "Quito",
      addressCountry: "EC",
    },
  };
}

export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // El nonce lo genera src/middleware.ts por request (ver la CSP ahí) y lo
  // manda como header de request — así este script inline pasa la política
  // sin necesitar 'unsafe-inline' en script-src.
  const nonce = (await headers()).get("x-nonce") ?? undefined;
  const messages = await getMessages();

  // `site-theme` inyecta la paleta de marca (ver globals.css). Va acá y no en
  // :root para que el panel /admin conserve el tema neutro de shadcn.
  //
  // NextIntlClientProvider va sólo acá, no en el layout raíz: /admin no usa
  // next-intl (queda en español fijo, es una herramienta interna), así que
  // no necesita mensajes ni el overhead del provider.
  return (
    <NextIntlClientProvider messages={messages}>
      <div className="site-theme flex min-h-dvh flex-1 flex-col">
        <script
          type="application/ld+json"
          nonce={nonce}
          // El navegador oculta el valor real de `nonce` una vez aplicada la
          // CSP (devuelve "" al leer la propiedad), así que React ve el atributo
          // del HTML del servidor distinto del DOM y avisa por hidratación. Es
          // comportamiento esperado del navegador, no un bug del componente.
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: jsonLd(organizacionSchema()) }}
        />
        <SiteHeader />
        {/* El header pasó a `fixed` (para poder ir transparente sobre el hero
            y encogerse sin empujar el layout) — por eso ya no reserva su
            espacio en el flujo normal. `pt-20` acá compensa esa altura para
            el resto de páginas; `Hero` cancela este padding con `-mt-20`
            para que su foto arranque debajo del header en vez de debajo del
            hueco que este padding deja. */}
        <main className="flex-1 pt-20">
          {children}
        </main>
        <SiteFooter />
        <QuickContact />
      </div>
    </NextIntlClientProvider>
  );
}
