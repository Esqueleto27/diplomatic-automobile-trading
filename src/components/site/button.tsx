import Link from "next/link";
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";
import { cn } from "@/lib/utils";

const variantes = {
  gold: "bg-gold text-gold-foreground shadow-glow hover:bg-gold-strong hover:shadow-glow-hover",
  outline:
    "border border-gold/40 bg-transparent text-gold hover:border-gold hover:bg-gold/10",
};

const tamanos = {
  sm: "h-10 px-4 text-[0.68rem] tracking-[0.12em]",
  md: "h-11 px-7 text-[0.68rem] tracking-[0.18em]",
  lg: "h-12 px-8 text-[0.7rem] tracking-[0.2em]",
  xl: "h-14 px-10 text-[0.72rem] tracking-[0.2em]",
};

// Máximo 200ms, elevación + sombra + cambio del dorado en hover, cursor
// consistente. Único lugar donde se define el look de un botón del sitio.
const base =
  "inline-flex cursor-pointer select-none items-center justify-center font-medium uppercase outline-none transition-all duration-200 ease-out hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-4 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-60";

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
