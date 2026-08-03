"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CarActionState } from "@/server/actions/cars";

const TIPO_OPTIONS = [
  { value: "NUEVO", label: "Nuevo" },
  { value: "USADO", label: "Usado" },
  { value: "DIPLOMATICO", label: "Diplomático" },
];

const TRANSMISION_OPTIONS = [
  { value: "Automática", label: "Automática" },
  { value: "Manual", label: "Manual" },
];

const COMBUSTIBLE_OPTIONS = [
  { value: "Gasolina", label: "Gasolina" },
  { value: "Diésel", label: "Diésel" },
  { value: "Híbrido", label: "Híbrido" },
  { value: "Eléctrico", label: "Eléctrico" },
];

const ANIO_ACTUAL = new Date().getFullYear();
const MIN_ANIO = 1995;
const ANIOS_OPTIONS = Array.from(
  { length: ANIO_ACTUAL - MIN_ANIO + 1 },
  (_, i) => {
    const value = String(ANIO_ACTUAL - i);
    return { value, label: value };
  },
);

type CarFormValues = {
  nombre?: string;
  marca?: string | null;
  anio?: number | null;
  precio?: number | null;
  kilometraje?: number | null;
  transmision?: string | null;
  combustible?: string | null;
  color?: string | null;
  descripcion?: string | null;
  tipo?: string | null;
  destacado?: boolean;
  activo?: boolean;
};

export function CarForm({
  action,
  defaultValues,
  submitLabel,
  conFotos = false,
}: {
  action: (
    state: CarActionState,
    formData: FormData,
  ) => Promise<CarActionState>;
  defaultValues?: CarFormValues;
  submitLabel: string;
  conFotos?: boolean;
}) {
  const [state, formAction, isPending] = useActionState(action, undefined);
  const errors = state?.errors ?? {};

  return (
    <form action={formAction} className="max-w-2xl space-y-6">
      {conFotos && (
        <div className="space-y-2">
          <Label htmlFor="fotos">Fotos (máx. 5)</Label>
          <input
            id="fotos"
            name="fotos"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="block w-full text-sm text-muted-foreground file:mr-3 file:rounded-md file:border-0 file:bg-secondary file:px-3 file:py-1.5 file:text-sm file:font-medium"
          />
          <p className="text-xs text-muted-foreground">
            JPG, PNG o WebP, hasta 8 MB cada una. Se pueden subir también
            después desde el panel.
          </p>
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="nombre">Nombre / modelo *</Label>
          <Input
            id="nombre"
            name="nombre"
            defaultValue={defaultValues?.nombre}
            required
          />
          {errors.nombre && (
            <p className="text-sm text-destructive">{errors.nombre[0]}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="marca">Marca</Label>
          <Input
            id="marca"
            name="marca"
            defaultValue={defaultValues?.marca ?? undefined}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="anio">Año</Label>
          <Select
            name="anio"
            items={ANIOS_OPTIONS}
            defaultValue={
              defaultValues?.anio != null
                ? String(defaultValues.anio)
                : undefined
            }
          >
            <SelectTrigger id="anio" className="w-full">
              <SelectValue placeholder="Sin definir" />
            </SelectTrigger>
            <SelectContent>
              {ANIOS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="precio">Precio (USD)</Label>
          <Input
            id="precio"
            name="precio"
            type="number"
            min={0}
            defaultValue={defaultValues?.precio ?? undefined}
          />
          <p className="text-xs text-muted-foreground">
            Vacío = &quot;Precio bajo consulta&quot;
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="kilometraje">Kilometraje</Label>
          <Input
            id="kilometraje"
            name="kilometraje"
            type="number"
            min={0}
            defaultValue={defaultValues?.kilometraje ?? undefined}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="transmision">Transmisión</Label>
          <Select
            name="transmision"
            items={TRANSMISION_OPTIONS}
            defaultValue={defaultValues?.transmision ?? undefined}
          >
            <SelectTrigger id="transmision" className="w-full">
              <SelectValue placeholder="Sin definir" />
            </SelectTrigger>
            <SelectContent>
              {TRANSMISION_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="combustible">Combustible</Label>
          <Select
            name="combustible"
            items={COMBUSTIBLE_OPTIONS}
            defaultValue={defaultValues?.combustible ?? undefined}
          >
            <SelectTrigger id="combustible" className="w-full">
              <SelectValue placeholder="Sin definir" />
            </SelectTrigger>
            <SelectContent>
              {COMBUSTIBLE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="color">Color</Label>
          <Input
            id="color"
            name="color"
            defaultValue={defaultValues?.color ?? undefined}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tipo">Tipo</Label>
          <Select
            name="tipo"
            items={TIPO_OPTIONS}
            defaultValue={defaultValues?.tipo ?? undefined}
          >
            <SelectTrigger id="tipo" className="w-full">
              <SelectValue placeholder="Sin definir" />
            </SelectTrigger>
            <SelectContent>
              {TIPO_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="descripcion">Descripción</Label>
        <Textarea
          id="descripcion"
          name="descripcion"
          rows={4}
          defaultValue={defaultValues?.descripcion ?? undefined}
        />
      </div>

      <div className="flex gap-6">
        <div className="flex items-center gap-2">
          <Checkbox
            id="destacado"
            name="destacado"
            defaultChecked={defaultValues?.destacado ?? false}
          />
          <Label htmlFor="destacado">Destacado</Label>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id="activo"
            name="activo"
            defaultChecked={defaultValues?.activo ?? true}
          />
          <Label htmlFor="activo">Visible en el sitio</Label>
        </div>
      </div>

      {state?.message && (
        <p className="text-sm text-destructive">{state.message}</p>
      )}

      <Button type="submit" disabled={isPending}>
        {isPending ? "Guardando..." : submitLabel}
      </Button>
    </form>
  );
}
