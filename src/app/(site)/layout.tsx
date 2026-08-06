import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/footer";
import { QuickContact } from "@/components/site/quick-contact";
import { contacto, siteUrl } from "@/lib/site";

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

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // `site-theme` inyecta la paleta de marca (ver globals.css). Va acá y no en
  // :root para que el panel /admin conserve el tema neutro de shadcn.
  return (
    <div className="site-theme flex min-h-dvh flex-1 flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizacionSchema()) }}
      />
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-sm focus:bg-gold focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-gold-foreground"
      >
        Saltar al contenido
      </a>
      <SiteHeader />
      <main id="contenido" className="flex-1">
        {children}
      </main>
      <SiteFooter />
      <QuickContact />
    </div>
  );
}
