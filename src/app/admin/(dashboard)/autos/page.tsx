import Link from "next/link";
import { prisma } from "@/lib/prisma";
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
import { DeleteCarButton } from "@/components/admin/delete-car-button";

const TIPO_LABELS: Record<string, string> = {
  NUEVO: "Nuevo",
  USADO: "Usado",
  DIPLOMATICO: "Diplomático",
};

export default async function AdminAutosPage() {
  const autos = await prisma.car.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { fotos: true } } },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Autos</h1>
        <Button nativeButton={false} render={<Link href="/admin/autos/nuevo" />}>
          Nuevo auto
        </Button>
      </div>

      {autos.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Todavía no hay autos cargados.
        </p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Fotos</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {autos.map((auto) => (
              <TableRow key={auto.id}>
                <TableCell className="font-medium">
                  {auto.nombre}
                  {auto.marca && (
                    <span className="ml-1 font-normal text-muted-foreground">
                      · {auto.marca}
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  {auto.tipo ? TIPO_LABELS[auto.tipo] : "—"}
                </TableCell>
                <TableCell>
                  {auto.precio != null
                    ? `$${auto.precio.toLocaleString("es-EC")}`
                    : "Consultar"}
                </TableCell>
                <TableCell>{auto._count.fotos} / 5</TableCell>
                <TableCell className="space-x-1">
                  {auto.destacado && (
                    <Badge variant="secondary">Destacado</Badge>
                  )}
                  <Badge variant={auto.activo ? "default" : "outline"}>
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
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
