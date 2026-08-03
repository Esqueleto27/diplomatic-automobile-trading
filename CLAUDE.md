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

Ver stack global del vault: `Matheo Flores/Tecnologias/Stack Tecnológico.md`. Stack real de este proyecto (decidido al empezar a codear el 2026-08-02, reemplaza el borrador inicial):

- Next.js 16 (App Router) + TypeScript + Tailwind CSS v4
- shadcn/ui — **sobre Base UI, no Radix** (`@base-ui/react`). API distinta a la Radix "clásica": los triggers/botones compuestos usan `render={<Componente />}` en vez de `asChild`; Select/Checkbox soportan `name`/`defaultValue`/`defaultChecked` nativos con hidden input propio, no hace falta armar hidden inputs a mano.
- Motion para animaciones (usar con moderación) — aún no implementado, pendiente de la fase de frontend
- Lucide React para iconos
- **Prisma ORM 7** (no Drizzle) + PostgreSQL, con driver adapter `@prisma/adapter-pg` (obligatorio desde Prisma 7). Cliente generado en `src/generated/prisma` (gitignored, se regenera con `prisma generate`, corre automático en el build de Docker).
- **Auth.js v5 / `next-auth@beta`** (no Better Auth) — Credentials Provider, sesión JWT (sin adapter de DB), un solo admin sembrado por `prisma/seed.ts` desde `ADMIN_EMAIL`/`ADMIN_PASSWORD`. Sin registro público, sin OAuth.
- Zod para validación
- Cloudflare R2 para fotos de autos — **pendiente de configurar** (bucket/credenciales), la subida de fotos no está implementada todavía
- npm como package manager
- Docker + docker-compose + VPS en producción (el VPS aloja varios proyectos de la agencia: ver sección Docker abajo)

**Nota Next.js 16:** el archivo de protección de rutas se llama `src/proxy.ts` (antes `middleware.ts`, renombrado por Next 16). Corre en runtime **Node.js por defecto** en v16+ (antes Edge) — importante porque Prisma no funciona en Edge Runtime; si se crea un `middleware.ts` por error en vez de `proxy.ts`, va a romper con errores de `node:path`/`node:url` no soportados.

## Modelo de datos: Auto

Todos los campos opcionales salvo `nombre`:
- `nombre` (requerido), `marca`, `año`, `precio` (null = "Precio bajo consulta"), `kilometraje`, `transmisión`, `combustible`, `color`, `descripción`
- `tipo`: `nuevo` | `usado` | `diplomatico`
- `destacado` (boolean), `activo` (boolean, ocultar sin borrar)
- hasta 5 fotos por auto (R2), con `orden` y `portada`

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
- El enum `TipoAuto` de Prisma **conserva** el valor `NUEVO` sin migración — es barato dejarlo por si alguna vez hay una excepción real, y el admin puede seguir asignándolo a mano si hace falta. Lo que se quitó es la promesa visual al público de que hay stock nuevo.

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
- Modelo `ContactMessage` en `prisma/schema.prisma` (con `leido: Boolean`).
- `src/server/actions/contacto.ts`: `enviarMensajeContacto` (pública, con honeypot anti-spam — campo `empresa_web` oculto vía `hidden`, si llega con valor se descarta en silencio) + `marcarMensajeLeido`/`eliminarMensaje` (protegidas con `requireAdmin()`).
- Panel admin en `/admin/mensajes` (`src/app/admin/(dashboard)/mensajes/`), con contador de no leídos como badge en el sidebar (`AdminSidebar` pasó a ser un server component async por esto).
- **Gotcha real que costó tiempo:** después de correr `prisma migrate dev` para agregar el modelo, hay que correr `npx prisma generate` **y reiniciar el dev server** — Turbopack no recarga el cliente de Prisma regenerado en un proceso que ya lo tenía importado en memoria. El síntoma es `TypeError: Cannot read properties of undefined (reading 'create')` en el modelo nuevo, no un error de conexión a la DB (eso confunde). Si vuelve a pasar tras agregar un modelo: reiniciar `npm run dev`, no depurar el código primero.

### Backend y panel admin

Funcionando de punta a punta (verificado en navegador + contenedor Docker de producción):

- Estructura de carpetas: `src/app/(site)/*` (público, con `Header`/`Footer` propios), `src/app/admin/(auth)/login` y `src/app/admin/(dashboard)/*` (protegido, con sidebar), `src/app/api/auth/[...nextauth]`.
- Auth.js: login/logout, sesión JWT, `src/proxy.ts` protege todo `/admin/*` excepto `/admin/login`. Cada server action de `src/server/actions/*` también valida sesión por su cuenta (no depender solo del proxy — así lo pide la doc de Proxy de Next 16: un matcher mal ajustado puede saltarse una Server Function sin que el proxy la cubra).
- CRUD de autos completo: `src/app/admin/(dashboard)/autos/*` (tabla, alta, edición), `src/server/actions/cars.ts`, validación en `src/lib/validations/car.ts`. Borrado con confirmación (`AlertDialog`).
- Lo único pendiente del backend: subida de fotos a R2 (bloqueado hasta tener bucket/credenciales) y el frontend público real (sigue con placeholders "pendiente de diseño final").

## Docker / despliegue

- `docker-compose.dev.yml` → solo Postgres, para desarrollo local (`npm run dev` corre en el host, no en Docker). Tiene `name: diplomatic-dev` explícito para no chocar de nombre de proyecto con el compose de producción.
- `docker-compose.yml` → producción: `app` (build del `Dockerfile`) + `db` (Postgres). El VPS aloja **varios proyectos de la agencia**, así que `app` **no toma los puertos 80/443**: se publica solo en `127.0.0.1:${APP_PORT}` (definir `APP_PORT` distinto por proyecto en el `.env` del VPS) y un Nginx del host (fuera de Docker, ya gestionando los demás sitios/SSL) hace `proxy_pass` a ese puerto. `db` no expone puerto al host.
- `Dockerfile`: build multi-stage con `output: "standalone"` de Next. El runner copia el `node_modules` completo (podado de devDependencies) **encima** del recorte de standalone — el CLI de Prisma (`migrate deploy`, `db seed`) tiene su propio árbol de dependencias que el tracing de standalone no incluye (standalone solo sigue lo que la app importa en runtime, no un binario CLI aparte). También copia `src/generated/prisma` porque `prisma/seed.ts` lo importa por ruta relativa, no por el alias `@/*`.
- Al arrancar, el contenedor `app` corre `prisma migrate deploy` automáticamente antes de `node server.js`. El seed (crear/resetear el admin) **no** corre automático — se ejecuta a mano una vez: `docker compose exec app npx prisma db seed`.
- Todas las páginas bajo `/admin` tienen `export const dynamic = "force-dynamic"` en `src/app/admin/(dashboard)/layout.tsx` — si no, Next intenta pre-renderizarlas estáticamente en el build y falla porque no hay DB disponible en esa etapa (y aunque la hubiera, esas páginas no deben cachearse estáticas: dependen de sesión y datos que cambian).
- `AUTH_TRUST_HOST=true` fijado en `docker-compose.yml`: obligatorio porque la app corre detrás del Nginx del host: sin esto, Auth.js rechaza o arma mal las URLs de callback.

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

## Convenciones de código
- Sin comentarios salvo que expliquen un porqué no obvio
- No crear abstracciones para casos hipotéticos futuros
- Componentes de shadcn/ui: se personalizan, no se usan por defecto sin ajuste visual
