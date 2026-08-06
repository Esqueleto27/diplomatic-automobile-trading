import type { Metadata } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
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

const description =
  "Dealer especializado en vehículos diplomáticos y de alta gama en Ecuador: compra, venta, importación y trámites para embajadas, organismos internacionales y clientes globales.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Diplomatic Automobile Trading",
    template: "%s — Diplomatic Automobile Trading",
  },
  description,
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "es_EC",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${cormorant.variable} ${jost.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
