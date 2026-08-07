import Link from "next/link";
import { desc } from "drizzle-orm";
import { Car as CarIcon, Plus } from "lucide-react";
import { getDb } from "@/lib/db";
import { cars } from "@/db/schema";
import { estadoLabel, tipoLabel } from "@/lib/cars";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AdminPageHeader } from "@/components/admin/page-header";
import { DeleteCarButton } from "@/components/admin/delete-car-button";

// Mismo formato que el sitio público (ver formatoPrecio en car-card.tsx) —
// antes esta tabla armaba "$${...}" a mano y quedaba distinto de "USD X.XXX"
// del sitio.
const formatoPrecio = new Intl.NumberFormat("es-EC", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export default async function AdminAutosPage() {
  const db = await getDb();
  const autos = await db.query.cars.findMany({
    orderBy: desc(cars.createdAt),
    with: { fotos: { columns: { id: true, url: true, portada: true } } },
  });

  return (
    <div>
      <AdminPageHeader
        title="Autos"
        description={`${autos.length} ${autos.length === 1 ? "vehículo" : "vehículos"} en el inventario.`}
        actions={
          <Button nativeButton={false} render={<Link href="/admin/autos/nuevo" />}>
            <Plus className="size-4" />
            Nuevo auto
          </Button>
        }
      />

      {autos.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border py-20 text-center">
          <CarIcon className="size-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Todavía no hay autos cargados.
          </p>
          <Button
            variant="outline"
            size="sm"
            nativeButton={false}
            render={<Link href="/admin/autos/nuevo" />}
          >
            Cargar el primero
          </Button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-16" />
                <TableHead>Nombre</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Fotos</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {autos.map((auto) => {
                const portada =
                  auto.fotos.find((f) => f.portada)?.url ?? auto.fotos[0]?.url;
                return (
                  <TableRow key={auto.id}>
                    <TableCell>
                      <div className="size-11 overflow-hidden rounded-md border border-border bg-muted">
                        {portada ? (
                          /* eslint-disable-next-line @next/next/no-img-element -- URL dinámica de R2, panel interno sin necesidad de optimización */
                          <img
                            src={portada}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="grid h-full w-full place-items-center">
                            <CarIcon className="size-4 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      <Link
                        href={`/admin/autos/${auto.id}`}
                        className="hover:text-primary"
                      >
                        {auto.nombre}
                      </Link>
                      {auto.marca && (
                        <span className="ml-1 font-normal text-muted-foreground">
                          · {auto.marca}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {tipoLabel(auto.tipo) ?? "—"}
                      {estadoLabel(auto.estado) && (
                        <span className="ml-1 text-muted-foreground">
                          · {estadoLabel(auto.estado)}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="tabular-nums">
                      {auto.precio != null
                        ? formatoPrecio.format(auto.precio)
                        : "Consultar"}
                    </TableCell>
                    <TableCell className="tabular-nums text-muted-foreground">
                      {auto.fotos.length} / 10
                    </TableCell>
                    <TableCell className="space-x-1">
                      {auto.destacado && <Badge>Destacado</Badge>}
                      <Badge variant={auto.activo ? "secondary" : "outline"}>
                        {auto.activo ? "Visible" : "Oculto"}
                      </Badge>
                    </TableCell>
                    <TableCell className="space-x-2 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        nativeButton={false}
                        render={<Link href={`/admin/autos/${auto.id}`} />}
                      >
                        Editar
                      </Button>
                      <DeleteCarButton id={auto.id} nombre={auto.nombre} />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
