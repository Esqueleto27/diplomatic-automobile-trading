import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { AdminSidebar } from "@/components/admin/sidebar";
import { MobileSidebarFrame } from "@/components/admin/mobile-sidebar-frame";

// El panel admin depende de sesión y datos en vivo: nunca debe prerenderse
// estáticamente (rompería el build sin DB disponible, y mostraría datos
// desactualizados).
export const dynamic = "force-dynamic";

// src/middleware.ts ya protege /admin/* a nivel de ruta; este chequeo es
// defensa en profundidad (igual que requireSession() en cada Server Action)
// para el caso de que el middleware no cubra alguna ruta nueva por error de
// matcher.
export default async function AdminDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground lg:flex-row">
      <MobileSidebarFrame>
        <AdminSidebar />
      </MobileSidebarFrame>
      <main className="flex-1 overflow-x-hidden">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-10 sm:py-10">
          {children}
        </div>
      </main>
    </div>
  );
}
