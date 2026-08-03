# Diplomatic Automobile Trading — Rediseño Web

Proyecto de [Thexify] para el cliente Diplomatic Automobile Trading. Rediseño completo de https://diplomatic-trading.com/.

Contexto de negocio completo (alcance, decisiones, historial) vive en el vault de Obsidian del usuario:
`Matheo Flores/Clientes/Diplomatic Automobile Trading/Proyecto Web - Rediseño.md`.
Si el alcance cambia durante el desarrollo, actualizar esa nota también, no solo este archivo.

## Referencia visual (dirección de diseño aprobada por el cliente)

Objetivo: transmitir **lujo** y dejar claro que es un **dealer de autos de alta gama**, sin sentirse "todo junto" (el cliente pidió explícitamente que no se vea saturado — dar aire, jerarquía clara, una cosa a la vez).

Descripción del mockup de referencia (casi 1:1, salvo colores que van a iterar):
- Tema oscuro (fondos negro/gris carbón muy oscuro)
- Acento dorado/mostaza para botones y detalles (CTA "Contact a Specialist", "Agenda un Test Drive")
- Header fijo: logo serif a la izquierda, nav simple a la derecha (Empresa, Inventario, Servicios, Contacto), selector de idioma
- Hero a pantalla completa: foto grande de auto de lujo, titular grande en serif ("LUXURY DIPLOMATIC TRADING"), subtítulo corto, un solo CTA
- Carrusel horizontal de logos de marcas (Mercedes, BMW, Audi, Porsche, Lamborghini, etc.)
- Sección "Vehículos Nuevos": carrusel de tarjetas con foto grande, controles prev/next
- Sección "Vehículos Diplomáticos Usados": texto descriptivo a la izquierda + grid de tarjetas de auto (foto, nombre, specs cortas, 2 botones: "Agenda un Test Drive" / "Ver todas las fotos")
- Sección "Servicios Adicionales": grid de tarjetas con imagen de fondo y overlay oscuro (Matriculación, Importación de Mercaderías, Importación de Vehículos, Seguro de Vehículos, Seguro de Viajes, Seguro de Salud)
- Footer oscuro simple: logo, dos bloques de contacto, iconos de redes sociales, copyright

**Importante — esto va a cambiar:** el cliente es indeciso. Los colores exactos, tipografías y hasta el orden de secciones probablemente cambien varias veces. La estructura de este mockup (qué secciones existen y su propósito) es estable; los estilos NO lo son. Ver sección "Arquitectura para cambios fáciles" abajo — es la razón de ser de esas reglas.

**Imagen del hero (`public/img/hero.webp`):** generada con Higgsfield (modelo `z_image`), no es una foto con licencia. Se generó a propósito un SUV **genérico sin marcas**: el primer intento salió con un Rolls-Royce reconocible (parrilla, emblema y figura del capó son marcas registradas) y se descartó — publicar una foto generada de un auto de marca real en un sitio comercial es riesgo legal si no se es concesionario oficial. Si se regenera, mantener en el prompt: sin emblemas, sin figura de capó, sin placa, sin logos. Las fotos del **inventario real deben ser auténticas**, nunca generadas.

## Stack técnico

Ver stack global del vault: `Matheo Flores/Tecnologias/Stack Tecnológico.md`. Stack real de este proyecto — **migrado de VPS/Docker/Postgres a Cloudflare Workers el 2026-08-03, y de Prisma+Auth.js a Drizzle+JWT el mismo día** (ver "Migración a Drizzle + JWT" al final de este archivo para el porqué completo — bug real y sin fix de Prisma 7 en Workers).

- **Next.js fijado en 15.5.22** (no 16 — ver nota de compatibilidad abajo) + TypeScript + Tailwind CSS v4
- shadcn/ui — **sobre Base UI, no Radix** (`@base-ui/react`). API distinta a la Radix "clásica": los triggers/botones compuestos usan `render={<Componente />}` en vez de `asChild`; Select/Checkbox soportan `name`/`defaultValue`/`defaultChecked` nativos con hidden input propio, no hace falta armar hidden inputs a mano.
- Motion para animaciones (usar con moderación) — implementado (`Reveal`, ver sección de diseño abajo)
- Lucide React para iconos
- **Drizzle ORM + Cloudflare D1** (SQLite), no Prisma. Schema en `src/db/schema.ts` (`sqliteTable`), migraciones en `./migrations/` (formato plano compatible con `wrangler d1 migrations apply`, a diferencia de Prisma). SQLite/D1 no soporta enums nativos: el campo `tipo` de `Car` es `text()`, no un enum — se valida como union de string en Zod (`src/lib/validations/car.ts`) y en TypeScript (`TipoAuto` en `src/lib/cars.ts`).
- **`getDb()` no es un singleton de módulo.** El binding D1 (`env.DB`) sólo existe dentro del contexto de request de Workers, no como variable de entorno estática — por eso `src/lib/db.ts` exporta `getDb()` (async, resuelve el binding vía `getCloudflareContext()`) en vez de un `export const db = ...` de nivel de módulo. **Todo código que toque la base de datos debe hacer `const db = await getDb()` primero.** A diferencia del viejo `getPrisma()`, no hace falta cachear la instancia (envolver `env.DB` con `drizzle()` es liviano, no arranca un motor aparte).
- **JWT + cookies httpOnly a mano** (`jose` + `bcryptjs`), no Auth.js/next-auth — sin adapter de sesión, un solo admin sembrado por `scripts/seed-admin.ts` desde `ADMIN_EMAIL`/`ADMIN_PASSWORD`. Sin registro público, sin OAuth. Ver `src/lib/auth.ts` (primitivas edge-safe) + `src/lib/session.ts` (wrapper con `cookies()` de Next).
- Zod para validación
- **Cloudflare R2 para fotos de autos — implementado.** Bucket `PHOTOS_BUCKET` (binding en `wrangler.jsonc`), subida vía `src/server/actions/car-photos.ts`. Máximo 10 fotos por auto (`CarPhoto`, con `orden`/`portada`), tipos permitidos `image/jpeg|png|webp`, 8 MB máx por archivo. **Siempre `await file.arrayBuffer()`, nunca `file.stream()`** — R2 rechaza streams con `Provided readable stream must have a known length`.
- **Assets de diseño del sitio (logos, hero, fondos de servicios) también en R2**, prefijo `sitio/` del mismo bucket `PHOTOS_BUCKET` — no viven en `public/img/` (esa carpeta no existe). Ver sección "Migración de imágenes estáticas a R2" al final de este archivo.
- npm como package manager
- **Cloudflare Workers en producción** (no VPS/Docker) — ver sección dedicada abajo.

**Nota crítica de compatibilidad Next.js 16 vs 15 (por qué está fijado):** Next.js 16 reemplazó `middleware.ts` por `src/proxy.ts`, y ese archivo **corre siempre en runtime Node.js sin poder optar por Edge** (`export const runtime = "edge"` da un error de compilación explícito: "Route segment config is not allowed in Proxy file"). `@opennextjs/cloudflare` rechaza cualquier middleware en runtime Node ("Node.js middleware is not currently supported"). El `package.json` de `@opennextjs/cloudflare@1.20.2` declara soporte peer para `>=15.5.21 <16 || >=16.2.11` — o sea que Next 16.2.11+ funciona para el resto de la app (páginas, Server Actions, Route Handlers corren bien), pero **la pieza de middleware específicamente sigue rota en Next 16** independientemente de esa versión de OpenNext. Si en el futuro se quiere volver a Next 16, revisar primero si ese issue de `proxy.ts` ya se resolvió.

**Middleware y Edge Runtime:** `src/middleware.ts` corre en Edge Runtime (Workers) y verifica el JWT de la cookie con `jose` (Web Crypto, 100% edge-safe) — **nunca importa `src/lib/db.ts`/`src/db/schema.ts`** (drizzle-orm/d1 no hace falta para sólo verificar un token, y evita arrastrar peso innecesario al bundle de Edge). Lee `AUTH_SECRET` vía `getCloudflareContext()`, igual que el resto del código que toca bindings.

## Modelo de datos: Auto

Todos los campos opcionales salvo `nombre`:
- `nombre` (requerido), `marca`, `año`, `precio` (null = "Precio bajo consulta"), `kilometraje`, `transmisión`, `combustible`, `color`, `descripción`
- `tipo`: `nuevo` | `usado` | `diplomatico`
- `destacado` (boolean), `activo` (boolean, ocultar sin borrar)
- hasta 10 fotos por auto (R2), con `orden` y `portada`

Botón de contacto por auto = link directo a WhatsApp con mensaje prellenado (sin formulario, sin leads en BD).
"Servicios Adicionales" = páginas estáticas informativas, sin modelo de datos.

Volumen: ~20 autos, ~30 visitas/día. Bajo tráfico — no sobre-optimizar (sin cache agresivo, sin CDN complejo más allá de lo que R2 ya da).

## Estado actual (2026-08-02)

### Frontend público — implementado

Home replicando el mockup, verificada a 1440 / 834 / 390 px. Secciones en `src/components/site/`:
`hero`, `brand-strip`, `bienvenida`, `pilares`, `vehiculos-usados`, `servicios-adicionales`, más `header`/`footer`/`wordmark`. La home (`src/app/(site)/page.tsx`) sólo las compone: **reordenar la página es mover una línea**, y una sección sin inventario no se monta.

**El inventario es sólo de vehículos usados/diplomáticos — no hay "Vehículos Nuevos".** Dato real del negocio, no una omisión: conseguir un vehículo nuevo es un servicio (importación directa o compra local, ver Pilares), no algo que se liste con fotos. Por eso:
- No existe `vehiculos-nuevos.tsx` (se construyó y se borró en esta misma sesión al conocer este dato).
- El filtro "Nuevos" no está en `/inventario` (`src/app/(site)/inventario/page.tsx`), sólo Todos/Diplomáticos/Usados.
- El campo `tipo` (texto libre validado en Zod) **conserva** el valor `NUEVO` como opción — es barato dejarlo por si alguna vez hay una excepción real, y el admin puede seguir asignándolo a mano si hace falta. Lo que se quitó es la promesa visual al público de que hay stock nuevo.

**Contenido de `bienvenida` y `pilares` (`src/lib/site.ts`):** redactado a partir de lo que el cliente pidió comunicar (asesoría en compra/venta de exonerados, +30 años en el mercado, tres líneas de negocio: Vehículos Diplomáticos / Organismos Internacionales / Vehículos Usados) tomando como referencia la estructura de un competidor — **texto propio, no copiado**. Los pilares no llevan numeración 01/02/03: son categorías, no un proceso secuencial, así que numerarlos sería decoración sin significado.

También hechas: `/inventario` (grid + filtro por tipo vía querystring), `/autos/[slug]` (galería + ficha técnica + CTA), `/servicios` (desde `src/lib/site.ts`, con anclas por slug), `/empresa`, `/contacto`.

Detalles no obvios:
- **Tipografía:** Cormorant Garamond (`font-display`) para titulares/wordmark + Jost (`font-sans`) para UI. Definidas en `src/app/layout.tsx`, expuestas como tokens en `@theme inline`.
- **Tema:** la paleta vive en el bloque `.site-theme` de `globals.css` y **sólo** ahí. Va scopeado al layout de `(site)`, no a `:root`, para que `/admin` conserve el tema neutro de shadcn y sus popups (que se montan fuera del árbol) no hereden el tema oscuro. Por eso el sitio público evita portales: el menú móvil es un panel dentro del header, no un Dialog.
- **Carruseles:** `use-scroll-row.ts` usa scroll nativo (conserva arrastre táctil y teclado) y sólo agrega flechas. Dos trampas ya resueltas: con `snap-x` hay que poner `scroll-px-*` o el navegador ignora el padding izquierdo y desalinea la primera tarjeta; y `justify-center` en un contenedor con scroll recorta el inicio y lo vuelve inalcanzable (en `brand-strip` se centra con un `ul` interno `w-max mx-auto`).
- **Autos sin foto:** `car-media.tsx` dibuja un marcador tipográfico en vez de un hueco roto — el inventario se publica antes de la sesión de fotos.
- Páginas que leen inventario llevan `export const dynamic = "force-dynamic"` (no hay base de datos en build).

- **Logos de marcas:** SVG monocromos blancos en `public/img/marcas/` (de simple-icons), servidos como estáticos y no inlineados en el bundle — el escudo de Porsche solo pesa 24 KB. Se tiñen con `opacity`, no con `currentColor` (van en `<img>`). Cada marca lleva una `escala` en `src/lib/site.ts` para equilibrar ópticamente la fila: los SVG vienen en cajas de 24x24 y los logos anchos y bajos (aros de Audi, alas de Bentley, wordmark de McLaren) llenan poca altura, así que sin ese ajuste se ven diminutos junto a un escudo. Es ajuste a ojo: al cambiar un logo hay que revisar su número. Marcas sin archivo caen al wordmark tipográfico automáticamente.
  - **`BrandStrip` no es un carrusel.** Se probó con flechas y se descartó: esconder marcas detrás de un control obliga a buscarlas, y una fila en movimiento constante se lee inquieta, al revés del tono de la marca. Ahora es `flex-wrap` con todas visibles (12 en una fila en desktop, 8+4 en tablet, 4 por fila en móvil), sin estado ni JS — por eso es server component, sin `"use client"`.
  - **Mercedes-Benz y Land/Range Rover no están**: sus titulares pidieron retirarlos de las librerías abiertas de iconos. Para incluirlos hay que pedirle el SVG oficial al cliente (que como concesionario debería poder conseguirlo de la marca). Mercedes-Benz igual está en el array `marcas` (sin `logo`), así que ya aparece como wordmark tipográfico en vez de faltar del todo — apenas llegue el SVG, se agrega el `logo:` y desaparece el texto solo.
  - 2026-08-02, más marcas: se sumaron Toyota, Mazda y Kia (sí están en simple-icons) a pedido del cliente — el mix de marcas pasó de sólo-lujo a lujo+generalistas, lo cual tiene sentido para un bróker que de verdad maneja ambos segmentos.
- **Mapa de `/contacto`:** el embed gratuito de Google Maps no acepta estilos y su mapa claro metía un bloque blanco en medio de la página oscura. Se corrige con `invert(0.92) hue-rotate(180deg)` — el truco estándar para llevarlo a modo oscuro sin romper los tonos. Si se toca ese filtro, verificar que el pin siga distinguiéndose.
- **La portada tolera que la base de datos no responda:** las consultas de inventario van envueltas en `autosOVacio()`, que loguea el error y devuelve `[]`. Así un problema de base de datos no tumba la página entera con un 500 — se siguen sirviendo hero, marcas y servicios, que son estáticos, y el visitante todavía puede contactar al negocio. El error queda en los logs del servidor para que se note.

**Ya entregado por el cliente:** logo real (`public/img/logo/logo-300x74.png`, usado en `Wordmark` vía `next/image`), teléfono y dirección reales en `contacto` (`src/lib/site.ts`), mapa embebido de Google Maps en `/contacto` (con `filter: invert() hue-rotate()` para que el mapa claro no rompa el tema oscuro — el embed gratuito no acepta estilos propios), y el copy real de `/empresa` y `servicios` (ya no son placeholder).

- **La estructura "bienvenida + 3 categorías" se rediseñó por completo** (`bienvenida`/`Pilares` ya no existen) porque, aunque el texto era propio, calcaba la arquitectura de la web de la competencia (mismo saludo, misma historia breve, mismas 3 categorías en el mismo orden) — eso también se lee como copia, no sólo el texto literal. Ahora: `confianza.frase` (una sola línea de trust, +30 años) vive como leyenda dentro de `BrandStrip`, no en una sección propia; y sólo quedan **2** líneas de negocio (`lineasNegocio` en `src/lib/site.ts`: Vehículos Diplomáticos, Organismos Internacionales) en `LineasNegocio`, un layout de paneles editoriales con regla vertical — a propósito nada parecido a una grilla de 3 tarjetas con ícono arriba. La tercera categoría de la competencia ("Vehículos Usados") no tiene tarjeta propia: su mensaje ("¿tiene uno para vender?") se fundió dentro de `VehiculosUsados`, que ya muestra el inventario real, para no repetir la misma idea dos veces. `/empresa` reutiliza los mismos datos pero con un tratamiento visual distinto (lista apilada con `<dl>`, no la grilla de paneles) para que dos páginas del sitio no luzcan como el mismo bloque repetido.
- **Servicios Adicionales tiene foto de fondo por tarjeta**, generadas con Higgsfield (`z_image`, gratis). Antes las 6 tarjetas usaban `min-h-[15rem]` + texto de largo variable, lo que hacía que la fila de arriba (con el título más largo, 2 líneas) quedara más alta que la de abajo — se ve en `servicios-adicionales.tsx`: ahora es `aspect-[4/3]` fijo + `line-clamp-2` en título y descripción, así las 6 miden exactamente lo mismo sin importar el contenido. Igual que con el hero, se pidió explícitamente **sin emblemas, sin figura de capó, sin logos legibles** en los prompts — el primer intento de "Importación de Vehículos" salió con una parrilla estilo Maybach/Bentley reconocible y se regeneró.
- **Gotcha de testing:** las capturas de página completa con Playwright (`page.screenshot({ fullPage: true })`) NO disparan la carga diferida (`loading="lazy"`) de imágenes fuera del viewport inicial — Chromium captura el documento completo vía CDP sin scrollear de verdad, así que las `next/image` de secciones bajas salen en negro/vacías aunque en el navegador real carguen perfecto. Solución: scrollear la página con `page.evaluate` antes de capturar (ver `shot-scroll-vp.mjs` en el scratchpad de la sesión). Si una captura futura muestra imágenes "rotas" que sí funcionan en el navegador, esta es la causa antes de sospechar del código.

Pendiente en el frontend: fotos reales de inventario (bloqueado por R2), email/redes sociales reales (siguen con placeholder marcado `PENDIENTE` en `src/lib/site.ts`), los SVG de Mercedes-Benz y Range Rover, confirmar con el cliente la lista real de marcas, y el selector de idioma del mockup (se omitió a propósito: sin i18n implementado sería un control muerto).

### Pasada de diseño (2026-08-02, feedback detallado del cliente)

El cliente mandó una auditoría de diseño punto por punto (mucho negro plano, tipografía chica, poco aire, tarjetas sin peso, poco dorado, nada de animación). Se implementó casi todo tal cual, con algunos ajustes de criterio propio documentados abajo. Cambios estructurales, no cosméticos sueltos:

- **Tres negros distintos, no uno repetido.** `.site-theme` en `globals.css`: `--background: #111111` (cuerpo), `--overlay-strong: #090909` (sólo el degradado del hero, vía `--color-overlay-strong` → clase `from-overlay-strong`), `--surface: #171717` (tarjetas). Es la fuente de la sensación de "todo es la misma masa negra" que se reportó — con tres valores distintos las tarjetas ahora se leen como un plano elevado sobre el fondo, no como parte de él.
- **`--muted-foreground` subió de `#979289` a `#c9c4b8`.** Se mantiene la temperatura cálida (a tono con el marfil `--foreground` y el dorado) en vez de saltar a un gris frío tipo `#D6D6D6` que hubiera desentonado con la paleta. Los párrafos de cuerpo en todo el sitio pasaron de `text-sm/text-xs` a `text-base`/`text-lg` con `leading-[1.8]` — fue el cambio de mayor impacto en legibilidad, tocó una decena de archivos (`hero`, `lineas-negocio`, `vehiculos-usados`, `servicios-adicionales` y las páginas de `/empresa`, `/inventario`, `/contacto`, `/servicios`, `/autos/[slug]`).
- **Contenedor global de 1400px a 1280px** (`max-w-[1400px]` → `max-w-[1280px]`, reemplazo masivo en los 12 archivos que lo usaban) — líneas de texto más cortas, más fáciles de leer.
- **Espaciado vertical entre secciones**: de `py-20 sm:py-24` (80/96px) a `py-28 sm:py-36` (112/144px) en las tres secciones principales de la home; páginas estáticas de `py-14 sm:py-20` a `py-16 sm:py-28`.
- **Hero**: título -20% (`clamp(2.75rem,7.5vw,5.25rem)` → `clamp(2.2rem,6vw,4.2rem)`) para que el auto gane protagonismo; subtítulo de ~14-16px a 22-24px (`text-[1.375rem] sm:text-[1.5rem]`) en `text-foreground/85` (antes `/70`); botón más alto/ancho (`h-12`→`h-14`, `px-8`→`px-10`) con sombra dorada (`shadow-[0_12px_32px_-10px_rgba(199,163,84,0.5)]`) y `hover:-translate-y-0.5`. Se agregó un Ken Burns muy lento (`animate-hero-zoom`, 22s, `scale(1)→scale(1.06)→scale(1)`, infinito) y una entrada fade+slide-up del texto (`animate-fade-up-in`, escalonada con `animationDelay` por elemento) — **ambas en CSS puro, no Motion**, porque son animaciones de un solo propósito sin scroll-trigger y el hero no necesitaba pasar a client component sólo por esto.
- **Header**: logo +20% (`h-8 sm:h-10` → `h-10 sm:h-12`), nav links de `text-[0.7rem]` (11px) a `text-[0.95rem]` (15px) `font-medium tracking-[2px]` (antes tracking `0.22em` ≈ 2.5px a 11px, se sentía más apretado de lo que medía).
- **Tarjetas de auto** (`car-card.tsx`, usado en `/inventario` y en la home): borde de `border-border` (~8% opacidad) a `border-white/[0.07]` (más fino, según pedido explícito); hover `-translate-y-1.5` (6px) + `shadow-[0_24px_44px_-18px_rgba(0,0,0,0.6)]` + `border-gold/50`; zoom de imagen de `1.04` a `1.03` (ajustado al número exacto que pidió). **Precio**: de `text-xs text-gold/90` a `text-[1.375rem] font-semibold text-gold` (22px/600) — antes se perdía, ahora es lo más grande de la tarjeta después del nombre. Se sacó el borde propio de `CarMedia` (quedaba doble borde con el de la tarjeta contenedora). De paso se encontró y borró `CarCardMedia`, código muerto desde que se sacó la sección "Vehículos Nuevos" (nadie la importaba).
- **Marcas**: alto base de `2.125rem` a `2.76rem` (+30%), opacidad de `0.6` a `0.75` en reposo (sigue yendo a `1` en hover). Se agregó una línea dorada corta arriba de la frase de confianza.
- **`SectionHeading`** (usado en casi todos los títulos del sitio) ahora antepone una rayita dorada de 48px — es el "más dorado en títulos" que pidió, tocando un solo archivo en vez de cada página.
- **Servicios Adicionales**: el ícono de cada categoría ahora se ve siempre (antes sólo aparecía si no había foto de fondo) como una insignia circular tipo "vidrio esmerilado" (`backdrop-blur-sm`, borde blanco tenue que pasa a dorado en hover) arriba a la derecha de la foto — es el detalle "Apple/Porsche" que pidió. Zoom de imagen en hover subido a `1.08` (antes `1.05`), mismo tratamiento de borde fino/elevación/sombra que las tarjetas de auto.
- **Animaciones de scroll con Motion** (`src/components/site/reveal.tsx`, un wrapper `<Reveal>` con `whileInView` + `viewport={{ once: true }}`): aplicado a los paneles de `LineasNegocio` (con stagger), las tarjetas de `ServiciosAdicionales` (stagger por columna) y el bloque de texto de `VehiculosUsados`. **No se aplicó a los carruseles horizontales** (las tarjetas de auto en sí): `whileInView` usa `IntersectionObserver` contra el viewport de la página, que no sabe que el carrusel las recorta con `overflow-x`, así que animaría todas las tarjetas juntas al cargar en vez de una por una al deslizar — más confuso que prolijo, se dejó sin animar a propósito.
- Point que se ignoró deliberadamente: bajar la opacidad del hairline de `--border` a nivel global — se prefirió resolverlo por componente (tarjetas específicamente) para no afectar separadores de tablas/listas donde sí hace falta que el borde se note.

### Formulario de contacto

`/contacto` tiene un formulario real (Nombre, Apellido, Email, Asunto, Mensaje) que se guarda en la base de datos — distinto del botón "Agendar Test Drive", que sigue yendo directo a WhatsApp sin tocar la DB. Piezas:
- Tabla `ContactMessage` en `src/db/schema.ts` (con `leido` boolean).
- `src/server/actions/contacto.ts`: `enviarMensajeContacto` (pública, con honeypot anti-spam — campo `empresa_web` oculto vía `hidden`, si llega con valor se descarta en silencio) + `marcarMensajeLeido`/`eliminarMensaje` (protegidas con `requireSession()`).
- Panel admin en `/admin/mensajes` (`src/app/admin/(dashboard)/mensajes/`), con contador de no leídos como badge en el sidebar (`AdminSidebar` pasó a ser un server component async por esto).
- `createdAt` se guarda como texto `CURRENT_TIMESTAMP` de SQLite (`"YYYY-MM-DD HH:MM:SS"`, no ISO 8601) — `sqliteTimestampToDate()` en `src/lib/date.ts` lo convierte a `Date` antes de formatear con `Intl.DateTimeFormat`. Si se agrega una fecha nueva a la UI, pasar siempre por ese helper, no `new Date(valor)` directo.

### Backend y panel admin

Funcionando de punta a punta (verificado en navegador con `next dev` y con `wrangler dev`/runtime real de Workers):

- Estructura de carpetas: `src/app/(site)/*` (público, con `Header`/`Footer` propios), `src/app/admin/(auth)/login` y `src/app/admin/(dashboard)/*` (protegido, con sidebar).
- JWT + cookies httpOnly: login/logout (`src/server/actions/auth.ts`), `src/middleware.ts` protege todo `/admin/*` excepto `/admin/login` (matcher `["/admin/:path*"]`). Cada server action de `src/server/actions/*` **también** valida sesión por su cuenta con `requireSession()` (`src/lib/session.ts`) — defensa en profundidad real, no redundancia: los Server Actions no pasan por el matcher del middleware si se invocan fuera de una navegación de página.
- CRUD de autos completo: `src/app/admin/(dashboard)/autos/*` (tabla, alta, edición), `src/server/actions/cars.ts`, validación en `src/lib/validations/car.ts`. Borrado con confirmación (`AlertDialog`).
- Subida de fotos a R2: `src/components/admin/car-photos.tsx` (grid de fotos + form de subida) en la página de edición de auto, `src/server/actions/car-photos.ts` (`subirFotos`, `eliminarFoto`, `marcarPortada`). Máximo 10 fotos, tipos `jpeg/png/webp`, 8 MB por archivo.

## Cloudflare Workers / despliegue

Sin VPS, sin Docker, sin Postgres — todo el proyecto vive en el ecosistema Cloudflare: **Workers** (compute, vía `@opennextjs/cloudflare`), **D1** (`diplomatic-automobile-trading-db`, id `2dbd3843-5030-426b-9c46-607ced93553a`) y **R2** (un solo bucket, ver abajo).

- `wrangler.jsonc`: config central. Bindings:
  - `DB` → D1 `diplomatic-automobile-trading-db`.
  - `PHOTOS_BUCKET` → R2 `diplomatic-automobile-trading-photos` (fotos de autos/logos, el único bucket real que usa la app).
  - `vars.R2_PUBLIC_URL` → URL pública desde donde se sirven las fotos (dominio custom conectado al bucket, o `*.r2.dev`). No es secreto, por eso va en texto plano acá y no con `wrangler secret put`. **Pendiente completar** hasta activar acceso público al bucket.
  - `vars.AUTH_SECRET` → placeholder vacío sólo para que exista el tipo; el valor real de producción se define con `wrangler secret put AUTH_SECRET` (pisa al var del mismo nombre al deployar). En local, `.dev.vars`.
  - `IMAGES` → binding de optimización de imágenes de Cloudflare.
  - **Deliberadamente sin bucket de caché incremental de OpenNext** (`NEXT_INC_CACHE_R2_BUCKET`/`r2IncrementalCache`): para un sitio de ~20 autos / ~30 visitas día no vale la pena un bucket R2 aparte sólo para eso — `open-next.config.ts` no declara `incrementalCache`, así que usa el caché en memoria por defecto de OpenNext.
- `next.config.ts`: sin `output: "standalone"` (eso era para Docker) — sólo el `import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev())` que agrega el scaffold, necesario para que `next dev` tenga acceso a los bindings en local.
- **Acceso a bindings en código**: nunca `process.env.DB`/`process.env.PHOTOS_BUCKET`/`process.env.AUTH_SECRET` (no existen así de forma confiable en Workers — sólo los `vars` string declarados en `wrangler.jsonc` se reflejan en `process.env`, y aun así se prefiere no mezclar patrones). Siempre `const { env } = await getCloudflareContext({ async: true })` de `@opennextjs/cloudflare`. Puntos de entrada ya armados, reusar siempre estos en vez de crear un cuarto patrón:
  - `src/lib/db.ts` (`getDb()`) — Drizzle contra D1.
  - `src/lib/r2.ts` (`getPhotosBucket()`, `getPhotosPublicUrl()`) — R2.
  - `src/lib/session.ts` (`getSession()`/`createSession()`/`destroySession()`/`requireSession()`) — JWT/`AUTH_SECRET`, para Server Components/Actions (usa `cookies()` de `next/headers`, runtime Node).
  - `src/middleware.ts` — el único otro lugar que lee `AUTH_SECRET` directo (Edge Runtime, sin `next/headers`).
- **Migraciones con Drizzle contra D1**: a diferencia de Prisma, el flujo es simple porque `drizzle-kit generate` ya produce SQL en el formato plano que `wrangler` espera:
  1. Editar `src/db/schema.ts`.
  2. `npx drizzle-kit generate` — genera `migrations/<n>_<nombre>.sql` (diffea contra el historial en `migrations/meta/`, no necesita conexión a ninguna DB).
  3. `npx wrangler d1 migrations apply diplomatic-automobile-trading-db --local` y luego `--remote`.
- **Seed del admin contra D1**: `scripts/seed-admin.ts` y `scripts/seed-demo.ts` **no usan Drizzle** (D1 no es alcanzable por ningún ORM fuera de un Worker en runtime) — generan el SQL a mano (bcrypt del lado Node, `INSERT ... ON CONFLICT`) y lo aplican con `wrangler d1 execute --file=<temp>.sql` vía `child_process`. Se usa `--file` con un archivo temporal, no `--command` con la query inline: en Windows, `--command` con SQL multilínea se rompe por el escaping de shell (PowerShell/cmd separan el SQL en "argumentos" sueltos). `npm run db:seed-admin` siembra en D1 local; `npm run db:seed-admin -- --remote` en la D1 real. Mismo patrón para `db:seed-demo`.
- **Build y deploy**: `npm run preview` (build + servidor local de prueba), `npm run deploy` (build + `wrangler deploy`). Ambos corren `opennextjs-cloudflare build` primero.
- **Windows: symlinks bloqueados por defecto.** El build de OpenNext crea symlinks al empaquetar `node_modules` para la función de servidor; sin permisos, falla con `EPERM: operation not permitted, symlink`. Arreglo: activar "Modo de desarrollador" en Windows (Configuración → Privacidad y seguridad → Para desarrolladores) — no requiere admin ni reinicio.
- **OneDrive puede romper el build/deploy.** Si el proyecto vive dentro de una carpeta sincronizada por OneDrive, `.open-next` sincronizado activamente puede bloquear archivos durante el build (`EPERM`/`Device or resource busy` al borrar/escribir), incluso ya con Modo Desarrollador activado. Confirmado varias veces en esta sesión. Arreglo que funcionó: copiar el proyecto fuera de OneDrive con `robocopy <origen> <destino> /MIR /XD .open-next .git .wrangler node_modules` y correr `npm install` + el build/deploy desde ahí. Si el `.open-next` de esa copia externa queda bloqueado por un proceso `wrangler dev` todavía corriendo, no forzar el `rm` — cerrar el proceso específico (por PID) primero, o copiar a una carpeta nueva. No hay que matar procesos de OneDrive ni desinstalarlo.
- Todas las páginas bajo `/admin` tienen `export const dynamic = "force-dynamic"` en `src/app/admin/(dashboard)/layout.tsx` — si no, Next intenta pre-renderizarlas estáticamente en el build y falla porque no hay DB disponible en esa etapa (y aunque la hubiera, esas páginas no deben cachearse estáticas: dependen de sesión y datos que cambian).

## Arquitectura para cambios fáciles (regla central del proyecto)

El cliente va a pedir cambios de color/estilo/estructura repetidamente. El código debe estar armado para que esos cambios sean baratos:

1. **Tokens de diseño centralizados, cero hardcode.**
   Todos los colores, radios, sombras y espaciados clave se definen como variables CSS en un único archivo (`globals.css`, estilo shadcn: `--background`, `--foreground`, `--primary`, `--accent`, etc.) y se mapean en `tailwind.config`. Ningún componente usa un hex/rgb directo ni un color Tailwind crudo (`bg-[#111]`, `text-yellow-500`) — siempre la clase semántica (`bg-background`, `text-accent`). Cambiar la paleta completa = editar un archivo.

2. **Tipografía como tokens, no hardcodeada por componente.**
   Familias (serif para títulos, sans para cuerpo) definidas como variables en Tailwind config (`font-display`, `font-body`), no importadas/aplicadas individualmente en cada archivo.

3. **Secciones de página como componentes independientes y reordenables.**
   Cada sección del home (Hero, MarcasCarrusel, VehiculosNuevos, VehiculosUsados, ServiciosAdicionales) es un componente autocontenido sin dependencias de orden entre sí. La página compone la lista de secciones — reordenar o quitar una sección es editar un array/lista en un solo lugar, no reestructurar JSX.

4. **Contenido de "Servicios Adicionales" como data, no JSX hardcodeado.**
   Un archivo de datos (array de objetos: título, imagen, slug) alimenta el grid. Agregar/quitar/reordenar servicios no toca el componente de layout.

5. **Sin abstracciones prematuras más allá de esto.**
   No armar un "theme switcher" en vivo ni un CMS a medida — no lo pidieron. Solo que cambiar valores sea rápido para nosotros al editar código, no que el cliente lo autogestione.

### Ajustes puntuales de home/inventario (2026-08-02)

Ronda corta de 4 correcciones sobre feedback visual directo del cliente viendo la app corriendo:

1. **`/inventario` sin filtro Todos/Diplomáticos/Usados.** El inventario completo es de usados — "diplomático" es una variante de usado, no una categoría real para el visitante. Se eliminó el nav de tabs y el `searchParams` de `src/app/(site)/inventario/page.tsx`; ahora `getAutosVisibles()` se lista completo y directo.
2. **Logo real de Mercedes-Benz en `brand-strip`.** Antes caía al wordmark tipográfico (no estaba en `simple-icons`, su titular lo hizo retirar de esa librería). Se agregó `public/img/marcas/mercedes.svg`: estrella de tres puntas dentro de un círculo, redibujada a mano como forma geométrica simple — uso nominativo para identificar que se comercializa la marca, no una reproducción del arte oficial. Si el cliente consigue el asset oficial del fabricante, reemplazar el archivo (mismo nombre) para que quede pixel-perfect.
3. **Borde dorado en tarjetas de auto, sin el lado superior.** `border-x border-b border-t-0 border-gold/25` en reposo, `hover:border-gold/60` — antes era un borde uniforme y parejo en gris claro (`border-white/[0.07]`) en los cuatro lados, que el cliente vio como "mal". Dejar el top sin borde evita que se vea como un marco cerrado encima de la foto, que ya tiene su propio borde inferior implícito por el corte de imagen.
4. **Grilla 2×2 en vez de carrusel horizontal en la home.** `VehiculosUsados` mostraba 4 autos en una fila con scroll horizontal; con el tamaño de tarjeta actual (foto + specs + precio + dos botones) quedaba demasiado aire vacío arriba de cada una en pantallas anchas. El cliente pidió explícitamente la alternativa de grilla en vez de rellenar con más info. Se cambió a `grid grid-cols-1 sm:grid-cols-2` mostrando los primeros 4 autos, y se eliminaron `arrow-button.tsx` y `use-scroll-row.ts` (quedaron sin uso).

### Migración a Cloudflare Workers + D1 + R2 (2026-08-03)

Cambio de infraestructura completo: de VPS + Docker + Postgres a Cloudflare Workers + D1 + R2 (nuevo estándar global de Thexify, ver `Matheo Flores/Tecnologias/Stack Tecnológico.md` del vault). Se mantuvo la arquitectura de datos/auth existente (Prisma + Auth.js) — esto fue una migración de infraestructura de despliegue, no una reescritura de la app.

- **`prisma/schema.prisma`**: `datasource` de `postgresql` a `sqlite`. El `enum TipoAuto` se convirtió a `String` (SQLite/D1 no soporta enums nativos) — validado igual en Zod (`src/lib/validations/car.ts`) y como union de TypeScript (`TipoAuto` ahora vive en `src/lib/cars.ts`, no en el cliente generado de Prisma).
- **`src/lib/prisma.ts`**: de `PrismaPg` (singleton de módulo) a `PrismaD1` con `getPrisma()` async (resuelve el binding `env.DB` por request vía `getCloudflareContext()`, cachea después). Cambio de patrón en cascada: los ~10 archivos que usaban `prisma.*` directo ahora hacen `const prisma = await getPrisma()` primero.
- **Auth.js partido en dos archivos** (`auth.config.ts` edge-safe + `auth.ts` completo) para que `src/middleware.ts` no arrastre Prisma al bundle de Edge Runtime — ver detalle en "Stack técnico" arriba.
- **`src/proxy.ts` (Next 16) → `src/middleware.ts` (Next 15.5.22)**: se bajó la versión de Next.js de 16.2.12 a 15.5.22 porque `proxy.ts` en Next 16 fuerza runtime Node.js sin poder optar por Edge, incompatible con `@opennextjs/cloudflare`. Se evaluó y descartó quedarse en Next 16 protegiendo `/admin` desde el layout en vez de un middleware real (funcionaba, pero un middleware de verdad es el patrón validado y más robusto).
- **R2 implementado**: subida de fotos de autos (`src/server/actions/car-photos.ts`, `src/lib/r2.ts`, `src/components/admin/car-photos.tsx`), máximo 5 por auto. `await file.arrayBuffer()`, nunca `file.stream()` (R2 lo rechaza).
- **`wrangler.jsonc`**: agregados binding D1 (`DB` → `diplomatic-db`) y binding R2 de fotos (`PHOTOS_BUCKET` → `diplomatic-automobile-trading-photos`, distinto del bucket de caché de OpenNext). Agregado `vars.R2_PUBLIC_URL` (pendiente completar).
- **Borrados**: `Dockerfile`, `docker-compose.yml`, `docker-compose.dev.yml`, `.dockerignore`. Limpiadas de `.env`/`.env.example` las variables de Postgres/Docker (`POSTGRES_USER/PASSWORD/DB`, `APP_PORT`). `DATABASE_URL` se mantuvo pero cambió de significado: ya no apunta a Postgres, apunta a un SQLite local (`file:./prisma/dev.db`) usado sólo para autorar migraciones con `prisma migrate dev` — la app en runtime nunca la lee (usa el binding D1).
- **`eslint.config.mjs`**: `eslint-config-next@15.5.22` publica sus presets en formato eslintrc clásico (no flat-config nativo como la 16.x) — el import directo (`import x from "eslint-config-next/core-web-vitals"`) rompe con "Plugin '' not found". Se cambió a `FlatCompat` de `@eslint/eslintrc` (`compat.extends("next/core-web-vitals", "next/typescript")`), el puente oficial para este caso. Se agregaron `.open-next/**`, `.wrangler/**` y `cloudflare-env.d.ts` a los ignores — sin esto, ESLint lintea el build generado de OpenNext (17 mil+ problemas falsos).
- **Windows**: symlinks bloqueados por defecto rompían el build de OpenNext (`EPERM`) — se resuelve activando "Modo de desarrollador" en Windows, sin necesitar admin.
- No se tocó la lógica de negocio, el diseño, ni el modelo de datos más allá del cambio enum→String forzado por SQLite.

### Migración de Prisma+Auth.js a Drizzle+JWT (2026-08-03, mismo día)

**Motivo:** con la app ya corriendo contra D1 (sección anterior), probarla con `wrangler dev` (runtime **real** de Workers, no la emulación de `next dev`) reveló un bug real y sin fix de Prisma 7 en Cloudflare Workers: `CompileError: WebAssembly.Module(): Wasm code generation disallowed by embedder`. El motor de queries de Prisma 7 compila WASM en tiempo de ejecución, y Workers bloquea eso por seguridad — pasa con **cualquier query**, no algo puntual de D1. Confirmado como issue abierto y sin resolver: [prisma/prisma#28657](https://github.com/prisma/prisma/issues/28657); la única mitigación documentada es bajar a Prisma 6.19.0 (anterior al patrón de driver adapters). Se decidió no hacer eso y en cambio volver a lo que ya estaba definido como estándar desde el principio en `Matheo Flores/Tecnologias/Stack Tecnológico.md` y validado end-to-end en `demo-crud` (`Matheo Flores/Tecnologias/Flujo de Creación de Proyectos.md`): **Drizzle ORM + JWT/cookies a mano**. Prisma+Auth.js había sido un desvío puntual de esa decisión al empezar a codear este proyecto, no el plan original.

- **ORM**: `src/db/schema.ts` (Drizzle `sqliteTable`) reemplaza `prisma/schema.prisma`. Mismas 4 tablas (`User`, `Car`, `CarPhoto`, `ContactMessage`), mismos nombres de columna — se recrearon desde cero en D1 (drop + `drizzle-kit generate` + `wrangler d1 migrations apply`) en vez de intentar que Drizzle adoptara las tablas creadas por Prisma, para evitar cualquier mismatch sutil de tipos/constraints entre lo que generaba cada motor.
- **`src/lib/prisma.ts` → `src/lib/db.ts`** (`getDb()`, ver "Cloudflare Workers / despliegue" arriba).
- **Auth.js → JWT a mano**: `src/lib/auth.ts` (primitivas edge-safe: `hashPassword`/`verifyPassword` con bcryptjs, `createToken`/`verifyToken` con `jose`) + `src/lib/session.ts` (wrapper con `cookies()` de Next: `getSession()`, `createSession()`, `destroySession()`, `requireSession()`). Cookie `session`, httpOnly, `SameSite=Lax`, 7 días. Se borraron `src/lib/auth.config.ts` y `src/app/api/auth/` (ya no hace falta el catch-all de next-auth).
- **`src/middleware.ts` reescrito**: ya no envuelve `auth()` de next-auth — verifica el JWT directo con `verifyToken()` (edge-safe, no toca D1) y redirige a mano. Mismo comportamiento (matcher `/admin/:path*`, excepción para `/admin/login`).
- **Todos los Server Actions y páginas admin migrados** de `prisma.*` a queries de Drizzle (`db.query.X.findMany/findFirst`, `db.insert/update/delete`). `marcarPortada` usa `db.batch([...])` (transacción nativa de D1) en vez de `prisma.$transaction`.
- **Timestamps como texto, no Date**: Drizzle con `text("createdAt")` devuelve el `CURRENT_TIMESTAMP` de SQLite como string `"YYYY-MM-DD HH:MM:SS"`, no como objeto `Date` (a diferencia de Prisma, que auto-convertía). Se agregó `sqliteTimestampToDate()` en `src/lib/date.ts` para los lugares que formatean fechas (hoy sólo `/admin/mensajes`).
- **Scripts de seed movidos**: `prisma/seed.ts`/`prisma/seed-demo.ts` → `scripts/seed-admin.ts`/`scripts/seed-demo.ts`. La lógica interna (generar SQL a mano + `wrangler d1 execute --file`) no cambió — nunca dependió de Prisma, ya era ORM-agnóstica desde la migración anterior.
- **D1 y R2 recreados con nombres completos**: `diplomatic-db` → `diplomatic-automobile-trading-db`, y se sacó el bucket de caché incremental de OpenNext (`diplomatic-automobile-trading-opennext-cache`) — no se justifica para el volumen de este sitio. **Nota:** en el camino, `wrangler d1 list`/`r2 bucket list` reportaron temporalmente los recursos originales como inexistentes (aun cuando `execute`/`create` seguían funcionando) — nunca se confirmó la causa (glitch de API vs. error humano revisando el dashboard). Se optó por recrear todo con nombres nuevos en vez de seguir investigando, ya que sólo había datos de prueba (admin sembrado + 9 autos demo) en riesgo.
- **Confirmado que el fix funciona**: build de `wrangler dev` real (no `next dev`) contra la D1 nueva vía Drizzle — sin el error de WASM, con lecturas y escrituras (crear auto, login, subir foto) probadas de punta a punta.
- **Prisma completamente eliminado**: `prisma/` (carpeta), `prisma.config.ts`, `src/generated/prisma`, dependencias `@prisma/*`/`prisma` en `package.json`. `next-auth` también desinstalado.

### Límite de fotos a 10 + migración de imágenes estáticas a R2 (2026-08-03)

- **Bugfix: límite de fotos por auto.** Un cambio local sin commitear había quitado el límite por completo en vez de subirlo de 5 a 10 como se pidió. Restaurado como `MAX_FOTOS_POR_AUTO = 10` en `src/server/actions/car-photos.ts` (validación server-side, la que realmente importa) y `src/components/admin/car-photos.tsx` (oculta el form de subida cuando ya hay 10, muestra contador "Fotos (n/10)").
- **Migración de imágenes estáticas a R2.** Los 25 archivos que vivían en `public/img/` (logo, logo blanco, hero, 15 SVG de marcas, 6 fondos de servicios) se subieron al bucket `PHOTOS_BUCKET` real bajo el prefijo `sitio/` (`wrangler r2 object put ... --remote`, mismo bucket que usan las fotos de autos bajo `autos/` — ver convención de prefijos en `src/lib/r2.ts`). Se borró `public/img/` por completo.
  - `src/lib/site.ts` ganó `ASSETS_BASE_URL` + los exports `heroImageUrl`/`logoUrl`/`logoBlancoUrl`, y los campos `logo`/`imagen` de `marcas`/`servicios` pasaron de rutas locales (`/img/marcas/bmw.svg`) a URLs de R2.
  - **`ASSETS_BASE_URL` es un string literal hardcodeado, a propósito no lee `process.env.R2_PUBLIC_URL`.** `site.ts` lo importan tanto Server como Client Components (ej. `Wordmark` dentro de `Header`, que es `"use client"`), y `process.env.X` sin prefijo `NEXT_PUBLIC_` sólo existe en el bundle del servidor — en el cliente da `undefined`, produciendo `"undefined/sitio/..."` y un `TypeError: Failed to construct 'URL': Invalid URL` en runtime. Se detectó este error exacto al verificar en navegador y se corrigió hardcodeando el literal en vez de agregar el prefijo `NEXT_PUBLIC_` (la URL pública ya es estable; si algún día cambia, tocar código de todas formas).
  - `next.config.ts` ya tenía `images.remotePatterns` para `*.r2.dev` (de la migración de fotos de autos), así que `next/image` con `heroImageUrl`/`logoUrl` funcionó sin más cambios.
  - Reemplazar un logo/imagen a futuro: subir el archivo a R2 con el mismo key (`sitio/...`) — no hace falta tocar código ni redeployar, igual que con las fotos de autos.

## Convenciones de código
- Sin comentarios salvo que expliquen un porqué no obvio
- No crear abstracciones para casos hipotéticos futuros
- Componentes de shadcn/ui: se personalizan, no se usan por defecto sin ajuste visual
