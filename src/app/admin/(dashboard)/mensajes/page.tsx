import { asc, desc } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { contactMessages } from "@/db/schema";
import { cn } from "@/lib/utils";
import { sqliteTimestampToDate } from "@/lib/date";
import {
  EliminarMensajeButton,
  MensajeLeidoToggle,
} from "@/components/admin/mensaje-row-actions";

const formatoFecha = new Intl.DateTimeFormat("es-EC", {
  dateStyle: "medium",
  timeStyle: "short",
});

export default async function AdminMensajesPage() {
  const db = await getDb();
  const mensajes = await db.query.contactMessages.findMany({
    orderBy: [asc(contactMessages.leido), desc(contactMessages.createdAt)],
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Mensajes</h1>
        <p className="text-sm text-muted-foreground">
          Enviados desde el formulario de contacto del sitio.
        </p>
      </div>

      {mensajes.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Todavía no llegó ningún mensaje.
        </p>
      ) : (
        <ul className="space-y-3">
          {mensajes.map((m) => (
            <li
              key={m.id}
              className={cn(
                "rounded-lg border border-border p-4",
                !m.leido && "border-l-4 border-l-primary bg-accent/40",
              )}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium">
                    {m.nombre} {m.apellido}
                  </p>
                  <a
                    href={`mailto:${m.email}`}
                    className="text-sm text-muted-foreground hover:underline"
                  >
                    {m.email}
                  </a>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatoFecha.format(sqliteTimestampToDate(m.createdAt))}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <MensajeLeidoToggle id={m.id} leido={m.leido} />
                  <EliminarMensajeButton
                    id={m.id}
                    nombre={`${m.nombre} ${m.apellido}`}
                  />
                </div>
              </div>

              <p className="mt-3 text-sm font-medium">{m.asunto}</p>
              <p className="mt-1 whitespace-pre-wrap text-sm text-muted-foreground">
                {m.mensaje}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
