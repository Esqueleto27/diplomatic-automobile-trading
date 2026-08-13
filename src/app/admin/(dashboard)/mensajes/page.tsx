import { asc, desc } from "drizzle-orm";
import { MessageSquare } from "lucide-react";
import { getDb } from "@/lib/db";
import { contactMessages } from "@/db/schema";
import { cn } from "@/lib/utils";
import { sqliteTimestampToDate } from "@/lib/date";
import { AdminPageHeader } from "@/components/admin/page-header";
import { Card } from "@/components/ui/card";
import {
  EliminarMensajeButton,
  MensajeLeidoToggle,
} from "@/components/admin/mensaje-row-actions";
import { formatoFechaHora } from "@/lib/format";

export default async function AdminMensajesPage() {
  const db = await getDb();
  const mensajes = await db.query.contactMessages.findMany({
    orderBy: [asc(contactMessages.leido), desc(contactMessages.createdAt)],
  });

  return (
    <div>
      <AdminPageHeader
        title="Mensajes"
        description="Enviados desde el formulario de contacto del sitio."
      />

      {mensajes.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border py-20 text-center">
          <MessageSquare className="size-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Todavía no llegó ningún mensaje.
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {mensajes.map((m) => (
            <li key={m.id}>
              <Card
                className={cn(
                  "flex-row gap-4 px-5 py-4",
                  !m.leido && "border-l-2 border-l-primary",
                )}
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-accent text-sm font-semibold text-foreground/70">
                  {m.nombre[0]}
                  {m.apellido[0]}
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-medium">
                        {m.nombre} {m.apellido}
                        {!m.leido && (
                          <span className="ml-2 inline-block size-1.5 rounded-full bg-primary align-middle" />
                        )}
                      </p>
                      <a
                        href={`mailto:${m.email}`}
                        className="text-sm text-muted-foreground hover:text-foreground hover:underline"
                      >
                        {m.email}
                      </a>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <span className="text-xs text-muted-foreground">
                        {formatoFechaHora.format(sqliteTimestampToDate(m.createdAt))}
                      </span>
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
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
