import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { ExternalLink } from "lucide-react";
import { getDb } from "@/lib/db";
import { cars } from "@/db/schema";
import { CarForm } from "@/components/admin/car-form";
import { CarPhotos } from "@/components/admin/car-photos";
import { AdminPageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { updateCar } from "@/server/actions/cars";

export default async function EditarAutoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const db = await getDb();
  const auto = await db.query.cars.findFirst({
    where: eq(cars.id, id),
    with: { fotos: { orderBy: (foto, { asc }) => asc(foto.orden) } },
  });

  if (!auto) {
    notFound();
  }

  const updateCarWithId = updateCar.bind(null, auto.id);

  return (
    <div>
      <AdminPageHeader
        title={auto.nombre}
        description="Editar auto"
        actions={
          <Button
            variant="outline"
            size="sm"
            nativeButton={false}
            render={
              <Link href={`/autos/${auto.slug}`} target="_blank" rel="noopener noreferrer" />
            }
          >
            Ver en el sitio
            <ExternalLink className="size-3.5" />
          </Button>
        }
      />
      <div className="max-w-3xl space-y-6">
        <CarForm
          action={updateCarWithId}
          defaultValues={auto}
          submitLabel="Guardar cambios"
        />
        <CarPhotos carId={auto.id} fotos={auto.fotos} />
      </div>
    </div>
  );
}
