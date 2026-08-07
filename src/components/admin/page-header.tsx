import type { ReactNode } from "react";

/** Encabezado consistente para cada página del panel — título, bajada
 * opcional y acciones a la derecha (botón "Nuevo auto", etc). Antes cada
 * página armaba su propio <h1> + flex a mano, con distinto tamaño y
 * espaciado entre una página y otra. */
export function AdminPageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {description && (
          <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  );
}
