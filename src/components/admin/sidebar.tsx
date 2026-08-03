import Link from "next/link";
import { eq, count } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { contactMessages } from "@/db/schema";
import { Badge } from "@/components/ui/badge";
import { LogoutButton } from "@/components/admin/logout-button";

export async function AdminSidebar() {
  const db = await getDb();
  const [{ total: mensajesSinLeer }] = await db
    .select({ total: count() })
    .from(contactMessages)
    .where(eq(contactMessages.leido, false));

  const navLinks = [
    { href: "/admin/autos", label: "Autos" },
    { href: "/admin/mensajes", label: "Mensajes", badge: mensajesSinLeer },
  ];

  return (
    <aside className="flex h-full w-56 shrink-0 flex-col justify-between border-r border-border bg-background p-4">
      <div>
        <p className="mb-6 px-2 text-sm font-semibold tracking-tight">
          Diplomatic Admin
        </p>
        <nav className="flex flex-col gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center justify-between rounded-md px-2 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              {link.label}
              {!!link.badge && (
                <Badge variant="secondary" className="ml-2">
                  {link.badge}
                </Badge>
              )}
            </Link>
          ))}
        </nav>
      </div>
      <LogoutButton />
    </aside>
  );
}
