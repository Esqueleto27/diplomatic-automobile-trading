import Link from "next/link";
import { contacto, navLinks, siteConfig } from "@/lib/site";
import { Wordmark } from "@/components/site/wordmark";

// Sin perfiles reales del cliente todavía: un href="#" es un link roto e
// inaccesible (va a ningún lado), así que no se muestra nada hasta tenerlos.
// Reponer acá con la misma forma { label, href, path } cuando lleguen.
const iconosRed: { label: string; href: string; path: string }[] = [];

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-site px-5 py-16 sm:px-8">
        <div
          className={`grid gap-10 sm:grid-cols-2 lg:gap-16 ${
            iconosRed.length > 0
              ? "lg:grid-cols-[auto_1fr_1fr_auto]"
              : "lg:grid-cols-[auto_1fr_1fr]"
          }`}
        >
          <Link href="/" className="justify-self-start">
            <Wordmark />
          </Link>

          <div>
            <h2 className="text-[0.65rem] uppercase tracking-[0.24em] text-muted-foreground">
              Contacto
            </h2>
            <ul className="mt-4 space-y-1.5 text-sm text-foreground/75">
              {contacto.telefonos.map((tel) => (
                <li key={tel}>
                  <a
                    href={`tel:${tel.replace(/\s/g, "")}`}
                    className="hover:text-gold"
                  >
                    {tel}
                  </a>
                </li>
              ))}
              <li>
                <a href={`mailto:${contacto.email}`} className="hover:text-gold">
                  {contacto.email}
                </a>
              </li>
              <li className="text-foreground/60">{contacto.direccion}</li>
            </ul>
          </div>

          <div>
            <h2 className="text-[0.65rem] uppercase tracking-[0.24em] text-muted-foreground">
              Navegación
            </h2>
            <ul className="mt-4 space-y-1.5 text-sm text-foreground/75">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-gold">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {iconosRed.length > 0 && (
            <div className="flex gap-3 lg:justify-end">
              {iconosRed.map(({ label, href, path }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="grid size-9 place-items-center border border-border text-muted-foreground transition-colors hover:border-gold hover:text-gold"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden
                    className="size-4"
                  >
                    <path d={path} />
                  </svg>
                </a>
              ))}
            </div>
          )}
        </div>

        <div className="mt-12 border-t border-border pt-6">
          <p className="text-center text-[0.68rem] tracking-wide text-muted-foreground">
            © {new Date().getFullYear()} {siteConfig.nombre}{" "}
            {siteConfig.apellido}. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
