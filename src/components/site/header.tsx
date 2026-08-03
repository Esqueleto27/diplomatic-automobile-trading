"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { navLinks } from "@/lib/site";
import { Wordmark } from "@/components/site/wordmark";

export function SiteHeader() {
  const [abierto, setAbierto] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-24 max-w-[1280px] items-center justify-between px-5 sm:px-8">
        <Link
          href="/"
          className="rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-4 focus-visible:ring-offset-background"
          aria-label="Diplomatic Automobile Trading — inicio"
          onClick={() => setAbierto(false)}
        >
          <Wordmark priority />
        </Link>

        <nav className="hidden items-center gap-9 md:flex" aria-label="Principal">
          {navLinks.map((link) => {
            const activo = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={activo ? "page" : undefined}
                className={cn(
                  "relative py-1 text-[0.95rem] font-medium uppercase tracking-[2px] outline-none transition-colors",
                  "after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-gold after:transition-transform after:duration-300 hover:after:scale-x-100",
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

      <div
        id="menu-movil"
        hidden={!abierto}
        className="border-t border-border bg-background md:hidden"
      >
        <nav className="mx-auto max-w-[1280px] px-5 py-2" aria-label="Principal (móvil)">
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
        </nav>
      </div>
    </header>
  );
}
