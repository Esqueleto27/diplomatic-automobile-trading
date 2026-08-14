import Link from "next/link";
import Image from "next/image";
import { desc } from "drizzle-orm";
import { Car as CarIcon, Plus } from "lucide-react";
import { getDb } from "@/lib/db";
import { cars } from "@/db/schema";
import {
  AUTOS_EN_PORTADA,
  esVendido,
  estadoLabel,
  getAutosPorTipo,
  tipoLabel,
} from "@/lib/cars";
import { MAX_FOTOS_POR_AUTO } from "@/lib/fotos";
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
import { ActionToast } from "@/components/admin/action-toast";
import { formatoPrecio } from "@/lib/format";

export default async function AdminAutosPage({
  searchParams,
}: {
  searchParams: Promise<{ creado?: string; actualizado?: string }>;
}) {
  const { creado, actualizado } = await searchParams;
  const db = await getDb();
  // La portada se arma sola (los N usados más recientes) — se consulta con
  // la MISMA función que usa el home en vez de recalcular ese criterio acá,
  // que es lo que haría que las dos vistas se desincronicen con el tiempo.
  // Sin este badge el admin no tendría forma de saber qué está publicado en
  // la portada, ya que no hay ningún control manual que lo indique.
  const [autos, portada] = await Promise.all([
    db.query.cars.findMany({
      orderBy: desc(cars.createdAt),
      with: { fotos: { columns: { id: true, url: true, portada: true } } },
    }),
    getAutosPorTipo(["USADO"], AUTOS_EN_PORTADA),
  ]);
  const enPortada = new Set(portada.map((auto) => auto.id));

  return (
    <div>
      <ActionToast
        show={creado === "1" || actualizado === "1"}
        message={creado === "1" ? "Auto publicado" : "Cambios guardados"}
        pathname="/admin/autos"
      />
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
                      <div className="relative size-11 overflow-hidden rounded-md border border-border bg-muted">
                        {portada ? (
                          <Image
                            src={portada}
                            alt=""
                            fill
                            sizes="44px"
                            className="object-cover"
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
                      {estadoLabel(auto.estado) &&
                        (esVendido(auto.estado) ? (
                          <Badge variant="destructive" className="ml-1.5">
                            {estadoLabel(auto.estado)}
                          </Badge>
                        ) : (
                          <span className="ml-1 text-muted-foreground">
                            · {estadoLabel(auto.estado)}
                          </span>
                        ))}
                    </TableCell>
                    <TableCell className="tabular-nums">
                      {auto.precio != null
                        ? formatoPrecio.format(auto.precio)
                        : "Consultar"}
                    </TableCell>
                    <TableCell className="tabular-nums text-muted-foreground">
                      {auto.fotos.length} / {MAX_FOTOS_POR_AUTO}
                    </TableCell>
                    <TableCell className="space-x-1">
                      {enPortada.has(auto.id) && <Badge>En portada</Badge>}
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
