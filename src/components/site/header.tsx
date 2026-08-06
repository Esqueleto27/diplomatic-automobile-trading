"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { navLinks } from "@/lib/site";
import { Wordmark } from "@/components/site/wordmark";
import { SiteButton } from "@/components/site/button";

export function SiteHeader() {
  const [abierto, setAbierto] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Histéresis a propósito: el header cambia de alto (h-24 → h-16, 32px)
    // al activar "scrolled". Con un solo umbral, ese cambio de alto dispara
    // scroll anchoring del navegador (reacomoda scrollY para no mover el
    // contenido visualmente), lo que cruza el mismo umbral en sentido
    // contrario y vuelve a disparar el evento — bucle infinito que se ve
    // como temblor. Con dos umbrales separados (más que los 32px de
    // diferencia de alto) ese reacomodo nunca alcanza a cruzar el umbral
    // opuesto.
    const onScroll = () => {
      setScrolled((prev) => {
        if (window.scrollY > 64) return true;
        if (window.scrollY < 16) return false;
        return prev;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-md transition-[height,box-shadow] duration-200",
        scrolled && "shadow-[0_10px_30px_-18px_rgba(0,0,0,0.6)]",
      )}
    >
      <div
        className={cn(
          "mx-auto flex max-w-site items-center justify-between px-5 transition-[height] duration-200 sm:px-8",
          scrolled ? "h-16" : "h-24",
        )}
      >
        <Link
          href="/"
          className="rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-4 focus-visible:ring-offset-background"
          aria-label="Diplomatic Automobile Trading — inicio"
          onClick={() => setAbierto(false)}
        >
          <Wordmark priority />
        </Link>

        <nav
          className="hidden items-center gap-8 md:flex"
          aria-label="Principal"
        >
          {navLinks.map((link) => {
            const activo = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={activo ? "page" : undefined}
                className={cn(
                  "relative py-1 text-[0.95rem] font-medium uppercase tracking-[2px] outline-none transition-colors",
                  "after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-gold after:transition-transform after:duration-200 hover:after:scale-x-100",
                  "focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-4 focus-visible:ring-offset-background",
                  activo
                    ? "text-gold after:scale-x-100"
                    : "text-foreground/80 hover:text-foreground",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-4">
          <SiteButton
            href="/contacto"
            size="sm"
            className="hidden md:inline-flex"
          >
            Solicitar asesor
          </SiteButton>

          <button
            type="button"
            onClick={() => setAbierto((v) => !v)}
            aria-expanded={abierto}
            aria-controls="menu-movil"
            aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
            className="-mr-2 grid size-10 place-items-center text-foreground outline-none focus-visible:ring-2 focus-visible:ring-gold md:hidden"
          >
            {abierto ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      <div
        id="menu-movil"
        hidden={!abierto}
        className="border-t border-border bg-background md:hidden"
      >
        <nav className="mx-auto max-w-site px-5 py-2" aria-label="Principal (móvil)">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setAbierto(false)}
              className="block border-b border-border/60 py-4 text-sm font-medium uppercase tracking-[2px] text-foreground/80 last:border-b-0 hover:text-gold"
            >
              {link.label}
            </Link>
          ))}
          <div className="py-5">
            <SiteButton
              href="/contacto"
              className="w-full"
              onClick={() => setAbierto(false)}
            >
              Solicitar asesor
            </SiteButton>
          </div>
        </nav>
      </div>
    </header>
  );
}
