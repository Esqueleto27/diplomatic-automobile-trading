import { CarForm } from "@/components/admin/car-form";
import { AdminPageHeader } from "@/components/admin/page-header";
import { createCar } from "@/server/actions/cars";

export default function NuevoAutoPage() {
  return (
    <div>
      <AdminPageHeader
        title="Nuevo auto"
        description="Se puede publicar sin fotos y completarlas después."
      />
      <CarForm action={createCar} submitLabel="Crear auto" conFotos />
    </div>
  );
}
