import Image from "next/image";
import { eq, count } from "drizzle-orm";
import { LayoutDashboard, Car, MessageSquare } from "lucide-react";
import { getDb } from "@/lib/db";
import { contactMessages } from "@/db/schema";
import { logoUrl } from "@/lib/site";
import { getSession } from "@/lib/session";
import { AdminNavLink } from "@/components/admin/nav-link";
import { LogoutButton } from "@/components/admin/logout-button";

export async function AdminSidebar() {
  const db = await getDb();
  const [{ total: mensajesSinLeer }] = await db
    .select({ total: count() })
    .from(contactMessages)
    .where(eq(contactMessages.leido, false));
  const session = await getSession();

  const navLinks = [
    { href: "/admin", label: "Resumen", icon: <LayoutDashboard className="size-4 shrink-0" /> },
    { href: "/admin/autos", label: "Autos", icon: <Car className="size-4 shrink-0" /> },
    {
      href: "/admin/mensajes",
      label: "Mensajes",
      icon: <MessageSquare className="size-4 shrink-0" />,
      badge: mensajesSinLeer,
    },
  ];

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
      <div className="flex items-center gap-2.5 px-5 py-6">
        <Image
          src={logoUrl}
          alt=""
          aria-hidden
          width={300}
          height={74}
          className="h-6 w-auto"
        />
        <span className="rounded-full border border-sidebar-border px-2 py-0.5 text-[0.65rem] font-medium uppercase tracking-[0.12em] text-sidebar-foreground/50">
          Admin
        </span>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3" aria-label="Panel de administración">
        {navLinks.map((link) => (
          <AdminNavLink key={link.href} {...link} />
        ))}
      </nav>

      <div className="border-t border-sidebar-border p-3">
        {session?.email && (
          <div className="flex items-center gap-2.5 px-2 pb-2">
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
              {session.email.slice(0, 2).toUpperCase()}
            </span>
            <span className="truncate text-xs text-sidebar-foreground/60">
              {session.email}
            </span>
          </div>
        )}
        <LogoutButton />
      </div>
    </aside>
  );
}
