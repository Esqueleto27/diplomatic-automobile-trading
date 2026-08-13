import Link from "next/link";
import { count, desc, eq } from "drizzle-orm";
import { Car, Star, EyeOff, MessageSquare, ImageOff, ArrowRight } from "lucide-react";
import { getDb } from "@/lib/db";
import { contactMessages } from "@/db/schema";
import { sqliteTimestampToDate } from "@/lib/date";
import { AdminPageHeader } from "@/components/admin/page-header";
import { StatCard } from "@/components/admin/stat-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatoFecha } from "@/lib/format";

// Portada real en vez de un redirect ciego a /autos: da una foto del
// negocio de un vistazo (cuánto inventario, qué falta de atención) antes de
// entrar a trabajar en una tabla específica.
export default async function AdminDashboardPage() {
  const db = await getDb();

  const [autos, mensajesRecientes] = await Promise.all([
    db.query.cars.findMany({
      with: { fotos: { columns: { id: true } } },
    }),
    db.query.contactMessages.findMany({
      orderBy: [desc(contactMessages.createdAt)],
      limit: 4,
    }),
  ]);

  const destacados = autos.filter((a) => a.destacado).length;
  const ocultos = autos.filter((a) => !a.activo).length;
  const sinFotos = autos.filter((a) => a.fotos.length === 0).length;
  // Total real de sin leer (el `limit: 4` de arriba es sólo para el
  // preview de abajo, no alcanza para este conteo si hay más de 4) — mismo
  // patrón que usa AdminSidebar para su badge.
  const [{ total: totalSinLeer }] = await db
    .select({ total: count() })
    .from(contactMessages)
    .where(eq(contactMessages.leido, false));

  return (
    <div>
      <AdminPageHeader
        title="Resumen"
        description="Estado del inventario y los mensajes del sitio."
        actions={
          <Button nativeButton={false} render={<Link href="/admin/autos/nuevo" />}>
            Nuevo auto
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Autos publicados" value={autos.length} icon={Car} />
        <StatCard label="Destacados" value={destacados} icon={Star} />
        <StatCard label="Ocultos" value={ocultos} icon={EyeOff} />
        <StatCard
          label="Mensajes sin leer"
          value={totalSinLeer}
          icon={MessageSquare}
          tone={totalSinLeer > 0 ? "warning" : "default"}
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {sinFotos > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <ImageOff className="size-4 text-primary" />
                {sinFotos} {sinFotos === 1 ? "auto sin fotos" : "autos sin fotos"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Se publican igual (con un marcador tipográfico), pero conviene
                completar la sesión de fotos apenas se pueda.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                nativeButton={false}
                render={<Link href="/admin/autos" />}
              >
                Ver inventario
                <ArrowRight className="size-3.5" />
              </Button>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-base font-semibold">
              Mensajes recientes
              <Link
                href="/admin/mensajes"
                className="text-xs font-normal text-muted-foreground hover:text-foreground"
              >
                Ver todos
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {mensajesRecientes.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Todavía no llegó ningún mensaje.
              </p>
            ) : (
              <ul className="divide-y divide-border">
                {mensajesRecientes.map((m) => (
                  <li key={m.id} className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0">
                    <span
                      aria-hidden
                      className={`size-1.5 shrink-0 rounded-full ${m.leido ? "bg-transparent" : "bg-primary"}`}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {m.nombre} {m.apellido}
                        <span className="ml-1.5 font-normal text-muted-foreground">
                          · {m.asunto}
                        </span>
                      </p>
                    </div>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {formatoFecha.format(sqliteTimestampToDate(m.createdAt))}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
