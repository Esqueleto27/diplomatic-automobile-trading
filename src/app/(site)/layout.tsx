import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/footer";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // `site-theme` inyecta la paleta de marca (ver globals.css). Va acá y no en
  // :root para que el panel /admin conserve el tema neutro de shadcn.
  return (
    <div className="site-theme flex min-h-dvh flex-1 flex-col">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
