import Link from "next/link";
import { contacto, navLinks, siteConfig } from "@/lib/site";
import { Wordmark } from "@/components/site/wordmark";

// lucide-react ya no distribuye iconos de marcas, así que van inline.
// PENDIENTE: reemplazar los href por los perfiles reales del cliente.
const iconosRed = [
  {
    label: "Facebook",
    href: "#",
    path: "M14 9h3V6h-3c-1.7 0-3 1.3-3 3v2H8v3h3v7h3v-7h3l1-3h-4V9c0-.6.4-1 1-1z",
  },
  {
    label: "Instagram",
    href: "#",
    path: "M12 8.6a3.4 3.4 0 1 0 0 6.8 3.4 3.4 0 0 0 0-6.8zM7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm10.8 4.4a.9.9 0 1 0 0 1.8.9.9 0 0 0 0-1.8z",
  },
  {
    label: "YouTube",
    href: "#",
    path: "M21.6 7.2c-.2-.9-.9-1.6-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4c-.9.2-1.6.9-1.8 1.8C2 8.8 2 12 2 12s0 3.2.4 4.8c.2.9.9 1.6 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4c.9-.2 1.6-.9 1.8-1.8.4-1.6.4-4.8.4-4.8s0-3.2-.4-4.8zM10 15V9l5 3-5 3z",
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-[1280px] px-5 py-14 sm:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[auto_1fr_1fr_auto] lg:gap-16">
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
