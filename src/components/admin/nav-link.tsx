"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

/**
 * El sidebar (AdminSidebar) es un server component async — hace la query de
 * mensajes sin leer directo a la base. El estado "activo" necesita
 * usePathname, que sólo existe en el cliente, así que vive acá aparte en vez
 * de forzar todo el sidebar a "use client".
 *
 * `icon` recibe el ícono ya renderizado (`<Icon />`), no el componente
 * (`icon: LucideIcon`) — un server component no puede pasarle una función
 * cruda a un client component como prop ("Functions cannot be passed
 * directly to Client Components"), sólo JSX ya resuelto.
 */
export function AdminNavLink({
  href,
  label,
  icon,
  badge,
}: {
  href: string;
  label: string;
  icon: ReactNode;
  badge?: number;
}) {
  const pathname = usePathname();
  const activo = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <Link
      href={href}
      aria-current={activo ? "page" : undefined}
      className={cn(
        "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium outline-none transition-colors",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar",
        activo
          ? "bg-sidebar-accent text-sidebar-accent-foreground"
          : "text-sidebar-foreground/60 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "absolute inset-y-1.5 left-0 w-0.5 rounded-full bg-primary transition-opacity",
          activo ? "opacity-100" : "opacity-0",
        )}
      />
      {icon}
      <span className="flex-1">{label}</span>
      {!!badge && (
        <Badge className="h-5 min-w-5 justify-center rounded-full px-1 tabular-nums">
          {badge}
        </Badge>
      )}
    </Link>
  );
}
