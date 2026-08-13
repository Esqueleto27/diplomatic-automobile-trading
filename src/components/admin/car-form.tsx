"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CarActionState } from "@/server/actions/cars";
import { ESTADO_OPTIONS, TIPO_OPTIONS } from "@/lib/cars";
import { PhotoPicker } from "@/components/admin/photo-picker";

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
// 1970, no 1995: un bróker de usados también recibe clásicos ocasionales —
// con el tope anterior no había forma de cargar el año de un vehículo más
// viejo, y la ficha pública quedaba con "Sin definir".
const MIN_ANIO = 1970;
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
  estado?: string | null;
  destacado?: boolean;
  activo?: boolean;
};

function Field({
  label,
  htmlFor,
  hint,
  error,
  children,
  className,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <Label htmlFor={htmlFor}>{label}</Label>
      <div className="mt-1.5">{children}</div>
      {error ? (
        <p className="mt-1.5 text-xs text-destructive">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}

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

  // `state` arranca en `undefined` y sólo pasa a tener valor cuando la
  // action vuelve SIN redirigir (error de validación, o un error inesperado
  // de base de datos) — el caso de éxito ya redirige y avisa desde la página
  // de destino (ver ActionToast), así que acá sólo hace falta cubrir la
  // falla. `state.message` ya se muestra fijo junto al botón más abajo — acá
  // sólo el toast de errores de campo, que están dispersos por todo el
  // formulario y conviene señalarlos desde arriba.
  useEffect(() => {
    if (!state) return;
    if (state.errors) {
      toast.error("Revisa los campos marcados en rojo");
    }
  }, [state]);

  return (
    <form action={formAction} className="max-w-3xl space-y-6">
      {conFotos && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Fotos</CardTitle>
          </CardHeader>
          <CardContent>
            <PhotoPicker name="fotos" />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Datos generales</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Nombre / modelo *"
              htmlFor="nombre"
              error={errors.nombre?.[0]}
              className="sm:col-span-2"
            >
              <Input
                id="nombre"
                name="nombre"
                defaultValue={defaultValues?.nombre}
                required
              />
            </Field>

            <Field label="Marca" htmlFor="marca">
              <Input
                id="marca"
                name="marca"
                defaultValue={defaultValues?.marca ?? undefined}
              />
            </Field>

            <Field label="Año" htmlFor="anio">
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
            </Field>

            <Field label="Kilometraje" htmlFor="kilometraje">
              <Input
                id="kilometraje"
                name="kilometraje"
                type="number"
                min={0}
                defaultValue={defaultValues?.kilometraje ?? undefined}
              />
            </Field>

            <Field label="Transmisión" htmlFor="transmision">
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
            </Field>

            <Field label="Combustible" htmlFor="combustible">
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
            </Field>

            <Field label="Color" htmlFor="color">
              <Input
                id="color"
                name="color"
                defaultValue={defaultValues?.color ?? undefined}
              />
            </Field>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Precio y condición</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field
              label="Precio (USD)"
              htmlFor="precio"
              hint='Vacío = "Precio bajo consulta"'
            >
              <Input
                id="precio"
                name="precio"
                type="number"
                min={0}
                defaultValue={defaultValues?.precio ?? undefined}
              />
            </Field>

            <Field
              label="Tipo"
              htmlFor="tipo"
              hint="Sólo Usado o Diplomático aparecen en la portada del sitio."
            >
              <Select
                name="tipo"
                items={TIPO_OPTIONS}
                // Al crear (conFotos === true, ver nota en la prop) arranca
                // en "Usado" — la inmensa mayoría de las altas lo son, y
                // dejarlo en blanco es la causa más común de "publiqué un
                // auto pero no aparece en el home": el home sólo lista
                // Usado/Diplomático (ver getAutosPorTipo), "Visible en el
                // sitio" no alcanza por sí solo. Al editar se respeta el
                // valor guardado tal cual, sin forzar nada.
                defaultValue={defaultValues?.tipo ?? (conFotos ? "USADO" : undefined)}
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
            </Field>

            <Field
              label="Estado"
              htmlFor="estado"
              hint="Badge en la tarjeta y la ficha del auto."
            >
              <Select
                name="estado"
                items={ESTADO_OPTIONS}
                defaultValue={defaultValues?.estado ?? undefined}
              >
                <SelectTrigger id="estado" className="w-full">
                  <SelectValue placeholder="Sin definir" />
                </SelectTrigger>
                <SelectContent>
                  {ESTADO_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>

          <div className="mt-5 flex flex-wrap gap-6 border-t border-border pt-5">
            <div className="flex items-center gap-2">
              <Checkbox
                id="destacado"
                name="destacado"
                defaultChecked={defaultValues?.destacado ?? false}
              />
              <Label htmlFor="destacado">Destacado (aparece primero en la portada)</Label>
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Descripción</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            id="descripcion"
            name="descripcion"
            rows={4}
            defaultValue={defaultValues?.descripcion ?? undefined}
          />
        </CardContent>
      </Card>

      <div className="flex items-center gap-4">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Guardando..." : submitLabel}
        </Button>
        {state?.message && (
          <p className="text-sm text-destructive">{state.message}</p>
        )}
      </div>
    </form>
  );
}
