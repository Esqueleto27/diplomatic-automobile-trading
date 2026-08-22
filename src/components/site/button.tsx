import Link from "next/link";
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";
import { cn } from "@/lib/utils";

const variantes = {
  // El relleno es un degradado (`--gold-gradient`), no el hex plano: un
  // dorado de un solo tono se lee amarillo, y lo que el ojo interpreta como
  // metal es el rango entre la luz y la sombra dentro de la misma pieza. A
  // eso se suman los dos `inset` de --shadow-glow (canto superior claro,
  // canto inferior oscuro), que le dan espesor, y el reflejo de `.sheen`,
  // que barre una vez al pasar el mouse. Los tres juntos son la diferencia
  // entre un rectángulo amarillo y un botón troquelado en bronce.
  gold: "sheen bg-gold-metal text-gold-foreground shadow-glow hover:shadow-glow-hover hover:brightness-[1.07]",
  // Sin `sheen`: el reflejo sólo tiene sentido sobre una superficie llena.
  // En un botón transparente no cruza ningún material, cruza el fondo de la
  // página — se lee como un destello suelto.
  //
  // Hover reforzado (antes `bg-gold/10` a secas): como variante secundaria
  // el borde dorado sobre negro ya es sutil en reposo — si además el hover
  // apenas se nota, el botón no se lee como accionable. El relleno al 18%
  // más el reflejo tenue lo confirman sin llegar al peso del botón lleno.
  // La sombra dorada difusa que tenía antes se cambió por la sombra neutra
  // del sistema: el halo de color era justo el recurso que hacía ver el
  // conjunto a plantilla.
  outline:
    "border border-gold/50 bg-transparent text-gold hover:border-gold hover:bg-gold/[0.18] hover:text-gold-strong hover:shadow-glow",
};

// Tracking bajado de ~0.12–0.2em a un rango 0.08–0.1em: al tamaño de texto
// de estos botones (11–12px) el tracking anterior se leía espaciado en
// exceso, no elegante.
const tamanos = {
  sm: "h-10 px-4 text-[0.68rem] tracking-[0.08em]",
  md: "h-11 px-7 text-[0.68rem] tracking-[0.08em]",
  lg: "h-12 px-8 text-[0.7rem] tracking-[0.09em]",
  xl: "h-14 px-10 text-[0.72rem] tracking-[0.1em]",
};

// Máximo 200ms, elevación + sombra + cambio del dorado en hover, cursor
// consistente. Único lugar donde se define el look de un botón del sitio.
const base =
  "inline-flex cursor-pointer select-none items-center justify-center font-medium uppercase outline-none transition-all duration-300 ease-out hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-4 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-60";

type SiteButtonProps = {
  children: ReactNode;
  variant?: keyof typeof variantes;
  size?: keyof typeof tamanos;
  className?: string;
  href?: string;
} & (AnchorHTMLAttributes<HTMLAnchorElement> | ButtonHTMLAttributes<HTMLButtonElement>);

export function SiteButton({
  children,
  variant = "gold",
  size = "md",
  className,
  href,
  ...props
}: SiteButtonProps) {
  const clases = cn(base, variantes[variant], tamanos[size], className);

  if (href) {
    const externo = /^(https?:|mailto:|tel:)/.test(href);
    if (externo) {
      return (
        <a
          href={href}
          className={clases}
          {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {children}
        </a>
      );
    }
    return (
      <Link
        href={href}
        className={clases}
        {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      className={clases}
      {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {children}
    </button>
  );
}
