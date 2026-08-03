import { AdminSidebar } from "@/components/admin/sidebar";

// El panel admin depende de sesión y datos en vivo: nunca debe prerenderse
// estáticamente (rompería el build sin DB disponible, y mostraría datos
// desactualizados).
export const dynamic = "force-dynamic";

export default function AdminDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
