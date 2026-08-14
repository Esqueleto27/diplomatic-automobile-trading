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
      {/* `pb-24` en móvil: el botón flotante de WhatsApp (QuickContact, fijo
          abajo a la derecha) se apoyaba justo encima de la línea de copyright
          al llegar al final del scroll. En sm+ el botón queda a la derecha del
          texto centrado y no hace falta el colchón. */}
      <div className="mx-auto max-w-site px-5 pb-20 pt-11 sm:px-8 sm:py-16">
        <div
          className={`grid gap-8 sm:grid-cols-2 sm:gap-10 lg:gap-16 ${
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
            {/* En fila que envuelve mientras entre en dos renglones (móvil),
                apilada desde sm. Los cinco links en columna sumaban ~160px de
                alto muerto en el teléfono, que era buena parte del "hueco
                negro" del pie. */}
            <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-foreground/75 sm:block sm:space-y-1.5">
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

        <div className="mt-9 border-t border-border pt-6 sm:mt-12">
          <p className="text-center text-[0.68rem] tracking-wide text-muted-foreground">
            © {new Date().getFullYear()} {siteConfig.nombre}{" "}
            {siteConfig.apellido}. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
