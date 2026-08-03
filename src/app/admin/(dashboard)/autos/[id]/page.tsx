import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { cars } from "@/db/schema";
import { CarForm } from "@/components/admin/car-form";
import { CarPhotos } from "@/components/admin/car-photos";
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
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold tracking-tight">
        Editar: {auto.nombre}
      </h1>
      <CarForm
        action={updateCarWithId}
        defaultValues={auto}
        submitLabel="Guardar cambios"
      />
      <CarPhotos carId={auto.id} fotos={auto.fotos} />
    </div>
  );
}
