import { Phone } from "lucide-react";
import { contacto } from "@/lib/site";
import { buildWhatsappHref, getWhatsappNumber } from "@/lib/whatsapp";

/**
 * Accesos rápidos flotantes (WhatsApp + Llamar), visibles en cualquier
 * punto del scroll. El resto de los accesos que pidió el cliente (solicitar
 * asesor, ver inventario) ya están siempre visibles en el header — duplicarlos
 * acá sería ruido, no conversión extra.
 */
export async function QuickContact() {
  const numero = await getWhatsappNumber();
  const hrefWhatsapp = buildWhatsappHref(
    numero,
    "Hola, me gustaría hablar con un especialista de Diplomatic Automobile Trading.",
  );
  const telefono = contacto.telefonos[0];

  return (
    <div
      className="fixed right-4 z-40 flex flex-col gap-3 sm:bottom-8 sm:right-8"
      style={{ bottom: "calc(1.5rem + env(safe-area-inset-bottom))" }}
    >
      {/* Sólo WhatsApp en móvil: dos botones flotantes uno sobre otro tapan
          contenido en pantallas chicas. En desktop hay espacio de sobra
          para los dos. */}
      {telefono && (
        <a
          href={`tel:${telefono.replace(/\s/g, "")}`}
          aria-label={`Llamar a ${telefono}`}
          className="hidden size-12 place-items-center rounded-full border border-gold/40 bg-surface text-gold shadow-[0_10px_28px_-12px_rgba(0,0,0,0.7)] outline-none transition-all duration-200 hover:-translate-y-0.5 hover:border-gold hover:bg-gold/10 focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-4 focus-visible:ring-offset-background sm:grid"
        >
          <Phone className="size-5" aria-hidden />
        </a>
      )}
      <a
        href={hrefWhatsapp}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Escribir por WhatsApp"
        className="grid size-12 place-items-center rounded-full bg-gold text-gold-foreground shadow-glow outline-none transition-all duration-200 hover:-translate-y-0.5 hover:bg-gold-strong hover:shadow-glow-hover focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-4 focus-visible:ring-offset-background sm:size-14"
      >
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden
          className="size-5 sm:size-6"
        >
          <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.4A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.2-.7.8-.8.9-.1.2-.3.2-.6.1-.2-.1-1-.4-1.9-1.2-.7-.6-1.2-1.4-1.3-1.6-.1-.2 0-.4.1-.5l.4-.4.2-.4c.1-.1.1-.3 0-.4-.1-.1-.6-1.4-.8-1.9-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.2-.9.9-.9 2.2s.9 2.6 1.1 2.8c.1.2 1.9 2.9 4.6 4 .6.3 1.1.4 1.5.6.6.2 1.2.2 1.6.1.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.6-.3z" />
        </svg>
      </a>
    </div>
  );
}
