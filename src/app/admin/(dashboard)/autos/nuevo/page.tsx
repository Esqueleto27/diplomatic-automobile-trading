import { CarForm } from "@/components/admin/car-form";
import { createCar } from "@/server/actions/cars";

export default function NuevoAutoPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Nuevo auto</h1>
      <CarForm action={createCar} submitLabel="Crear auto" />
    </div>
  );
}
