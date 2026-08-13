"use client";

import { useEffect, useRef, useState } from "react";
import { UploadCloud, X } from "lucide-react";
import {
  ACCEPT_FOTOS,
  MAX_BYTES_POR_FOTO,
  MAX_FOTOS_POR_AUTO,
  TIPOS_PERMITIDOS,
} from "@/lib/fotos";

/**
 * Reemplaza el `<input type="file">` nativo (feo, sin preview, sin límite
 * visible) que tenía CarForm en el flujo de creación. Mismo tratamiento
 * visual que CarPhotos (dropzone + grilla) para que crear y editar se
 * sientan como la misma app, no dos UIs distintas para "fotos".
 *
 * El input real queda oculto y sincronizado a mano vía DataTransfer — es la
 * única forma de controlar qué archivos lleva un `<input type="file">`
 * (no acepta un `value` controlado como los demás inputs), necesario para
 * poder quitar un archivo ya elegido antes de enviar el form.
 *
 * Filtra tipo/peso ACÁ, del lado del cliente, antes de aceptar el archivo
 * (no sólo confiar en `accept` del input): `accept` es apenas una sugerencia
 * al selector del SO, no una garantía — en Windows "Todos los archivos" lo
 * salta sin problema, y un HEIC de iPhone puede pasar el filtro pero el
 * navegador no puede decodificarlo para el preview. Antes esto colaba
 * cualquier archivo directo al estado y sólo se enteraba al fallar la
 * validación del servidor (o, según el archivo, ni eso) — reportado como
 * "una carpeta de fotos sí sube, la otra no" sin ningún mensaje.
 */
export function PhotoPicker({ name = "fotos" }: { name?: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [decodificando, setDecodificando] = useState(false);

  useEffect(() => {
    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviews(urls);
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [files]);

  function syncInput(next: File[]) {
    const dt = new DataTransfer();
    next.forEach((file) => dt.items.add(file));
    if (inputRef.current) inputRef.current.files = dt.files;
    setFiles(next);
  }

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const elegidos = Array.from(e.target.files ?? []);
    // Permite re-elegir el mismo archivo después de un error (si no se
    // limpia, el navegador no dispara onChange una segunda vez con el
    // mismo archivo).
    e.target.value = "";

    const candidatos: File[] = [];
    const motivos = new Set<string>();
    for (const file of elegidos) {
      if (!TIPOS_PERMITIDOS.has(file.type)) {
        motivos.add(
          `Formato no soportado (${file.type || "desconocido"}) — sólo JPG, PNG o WebP.`,
        );
        continue;
      }
      if (file.size > MAX_BYTES_POR_FOTO) {
        motivos.add(`"${file.name}" pesa más de 8 MB.`);
        continue;
      }
      candidatos.push(file);
    }

    setDecodificando(true);
    // Comprueba que el navegador pueda abrir cada archivo como imagen. El
    // tipo/peso de arriba no alcanza: un JPG corrupto o un archivo renombrado
    // con la extensión equivocada los pasa sin problema y recién fallaba al
    // enviar el formulario — a veces con un error de red genérico si el
    // archivo llegaba a rechazarse camino al servidor.
    const validos: File[] = [];
    for (const file of candidatos) {
      try {
        const bitmap = await createImageBitmap(file);
        bitmap.close();
        validos.push(file);
      } catch {
        motivos.add(`"${file.name}" no se pudo abrir como imagen.`);
      }
    }
    setDecodificando(false);

    const disponibles = MAX_FOTOS_POR_AUTO - files.length;
    if (validos.length > disponibles) {
      motivos.add(
        `Máximo ${MAX_FOTOS_POR_AUTO} fotos — se tomaron las primeras ${disponibles}.`,
      );
    }

    try {
      syncInput([...files, ...validos].slice(0, MAX_FOTOS_POR_AUTO));
    } catch {
      motivos.add("No se pudieron cargar esas fotos. Prueba de a pocas por vez.");
    }
    setError(motivos.size ? Array.from(motivos).join(" ") : null);
  }

  function quitar(i: number) {
    setError(null);
    syncInput(files.filter((_, idx) => idx !== i));
  }

  const lleno = files.length >= MAX_FOTOS_POR_AUTO;

  return (
    <div>
      {files.length > 0 && (
        <ul className="mb-3 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
          {files.map((file, i) => (
            <li
              key={`${file.name}-${file.lastModified}-${i}`}
              className="relative aspect-square overflow-hidden rounded-lg border border-border bg-muted"
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- preview local vía blob:, next/image no soporta blob URLs */}
              <img src={previews[i]} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => quitar(i)}
                className="absolute right-1.5 top-1.5 rounded-full bg-destructive p-1 text-destructive-foreground shadow-sm hover:bg-destructive/90"
                aria-label={`Quitar ${file.name}`}
                title="Quitar"
              >
                <X className="size-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {!lleno && (
        <label
          htmlFor={name}
          className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border border-dashed border-input px-4 py-8 text-center transition-colors hover:border-primary/60 hover:bg-accent/40"
        >
          <UploadCloud className="size-5 text-muted-foreground" aria-hidden />
          <span className="text-sm font-medium">Haz clic para elegir fotos</span>
          <span className="text-xs text-muted-foreground">
            JPG, PNG o WebP · hasta 8 MB cada una · máximo {MAX_FOTOS_POR_AUTO} fotos
          </span>
        </label>
      )}

      {decodificando && (
        <p className="mt-2 text-sm text-muted-foreground">Verificando fotos...</p>
      )}
      {error && <p className="mt-2 text-sm text-destructive">{error}</p>}

      <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
        <span>Se pueden agregar más después desde el panel.</span>
        <span className="tabular-nums">
          {files.length}/{MAX_FOTOS_POR_AUTO}
        </span>
      </div>

      <input
        ref={inputRef}
        id={name}
        type="file"
        name={name}
        accept={ACCEPT_FOTOS}
        multiple
        className="sr-only"
        onChange={onPick}
      />
    </div>
  );
}
