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
}: {
  action: (
    state: CarActionState,
    formData: FormData,
  ) => Promise<CarActionState>;
  defaultValues?: CarFormValues;
  submitLabel: string;
}) {
  const [state, formAction, isPending] = useActionState(action, undefined);
  const errors = state?.errors ?? {};

  return (
    <form action={formAction} className="max-w-2xl space-y-6">
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
          <Input
            id="anio"
            name="anio"
            type="number"
            defaultValue={defaultValues?.anio ?? undefined}
          />
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
          <Input
            id="transmision"
            name="transmision"
            defaultValue={defaultValues?.transmision ?? undefined}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="combustible">Combustible</Label>
          <Input
            id="combustible"
            name="combustible"
            defaultValue={defaultValues?.combustible ?? undefined}
          />
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
