import type { Metadata } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

// Display: serif de alto contraste para titulares y el wordmark.
const cormorant = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

// UI: geométrica, para navegación, etiquetas, botones y texto corrido.
const jost = Jost({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Diplomatic Automobile Trading",
  description: "Vehículos de lujo para clientes globales.",
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
