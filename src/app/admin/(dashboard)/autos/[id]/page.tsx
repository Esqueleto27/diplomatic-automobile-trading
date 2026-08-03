import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CarForm } from "@/components/admin/car-form";
import { updateCar } from "@/server/actions/cars";

export default async function EditarAutoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const auto = await prisma.car.findUnique({ where: { id } });

  if (!auto) {
    notFound();
  }

  const updateCarWithId = updateCar.bind(null, auto.id);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">
        Editar: {auto.nombre}
      </h1>
      <CarForm
        action={updateCarWithId}
        defaultValues={auto}
        submitLabel="Guardar cambios"
      />
      <p className="text-sm text-muted-foreground">
        Fotos: disponible cuando se configure Cloudflare R2.
      </p>
    </div>
  );
}
