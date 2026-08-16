import type { Metadata } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import { headers } from "next/headers";
import { getLocale, getTranslations } from "next-intl/server";
import { Toaster } from "@/components/ui/sonner";
import { heroImageUrl, siteUrl } from "@/lib/site";
import "./globals.css";

// Display: serif de alto contraste para titulares y el wordmark.
// Sólo los pesos que el sitio realmente usa (300/400/600) — cada peso extra
// es un archivo woff2 más que descargar.
const cormorant = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  display: "swap",
});

// UI: geométrica, para navegación, etiquetas, botones y texto corrido.
const jost = Jost({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

// `generateMetadata` y no un objeto `metadata` fijo: la descripción y el
// `og:locale` tienen que seguir al idioma elegido con el toggle ES/EN. Con
// el objeto estático quedaban siempre en español — el buscador y las vistas
// previas al compartir (WhatsApp, redes) mostraban texto en español incluso
// a un visitante que estaba viendo el sitio en inglés, que es justo el
// público extranjero al que apunta el negocio.
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metadata");
  const description = t("sitioDescripcion");

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: "Diplomatic Automobile Trading",
      template: "%s — Diplomatic Automobile Trading",
    },
    description,
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      // "es_EC" en español (el negocio opera en Ecuador, dato real) pero
      // sólo "en" en inglés, sin país — a pedido del cliente: el público de
      // habla inglesa es internacional (embajadas, organismos), no
      // específicamente de EE.UU. ni Reino Unido, así que atarlo a "en_US"
      // sugería lo contrario sin corresponder a ningún hecho real del
      // negocio (a diferencia de "es_EC", que sí describe dónde opera).
      locale: t("ogLocale"),
      url: siteUrl,
      siteName: "Diplomatic Automobile Trading",
      title: "Diplomatic Automobile Trading",
      description,
      images: [{ url: heroImageUrl, width: 1600, height: 900 }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Diplomatic Automobile Trading",
      description,
      images: [heroImageUrl],
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // El toggle ES/EN sólo vive en el sitio público (ver SiteLayout). /admin
  // comparte la cookie de idioma pero su interfaz está siempre en español,
  // así que si el visitante dejó el sitio público en inglés el panel se
  // anunciaba como `lang="en"` con todo el texto en español — un lector de
  // pantalla lo leería con pronunciación equivocada. El pathname llega por
  // header desde el middleware (un Server Component no puede leerlo solo).
  const [locale, headerList] = await Promise.all([getLocale(), headers()]);
  const esAdmin = (headerList.get("x-pathname") ?? "").startsWith("/admin");
  const lang = esAdmin ? "es" : locale;

  return (
    <html
      lang={lang}
      className={`${cormorant.variable} ${jost.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
