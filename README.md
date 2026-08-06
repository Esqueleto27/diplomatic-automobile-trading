# Diplomatic Automobile Trading

Sitio web y panel de administración de Diplomatic Automobile Trading — dealer
de vehículos diplomáticos y de alta gama en Ecuador.

Contexto de negocio, historial de decisiones y guía detallada para trabajar
en este repo con Claude Code viven en `CLAUDE.md`. Este README es sólo para
levantar el proyecto en local.

## Stack

Next.js 15.5.22 + TypeScript + Tailwind CSS v4, desplegado en **Cloudflare
Workers** (vía `@opennextjs/cloudflare`) con **D1** (SQLite) + **Drizzle ORM**
y **R2** para fotos/assets. Auth propia con JWT (`jose`) + `bcryptjs`, sin
Auth.js. Ver `CLAUDE.md` para el detalle completo de arquitectura.

## Requisitos

- Node.js 20+
- Windows: activar "Modo de desarrollador" (Configuración → Privacidad y
  seguridad → Para desarrolladores) — el build de OpenNext usa symlinks,
  bloqueados por defecto sin esto.

## Levantar en local

```bash
npm install
cp .dev.vars.example .dev.vars   # completar AUTH_SECRET y R2_PUBLIC_URL
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000). Las migraciones y el
admin de la D1 local ya deberían existir tras el primer `npm install`; si no,
ver "Base de datos" abajo.

## Base de datos (D1 + Drizzle)

```bash
npx drizzle-kit generate                                              # tras editar src/db/schema.ts
npx wrangler d1 migrations apply diplomatic-automobile-trading-db --local
npx wrangler d1 migrations apply diplomatic-automobile-trading-db --remote  # producción
```

Sembrar el usuario admin (lee `ADMIN_EMAIL`/`ADMIN_PASSWORD` de `.env`):

```bash
npm run db:seed-admin              # D1 local
npm run db:seed-admin -- --remote  # D1 real — no usar con datos de prueba
```

`npm run db:seed-demo` carga inventario de ejemplo (sólo para desarrollo,
nunca correr `--remote` en producción real).

## Scripts

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo (`next dev`) |
| `npm run build` | Build de producción de Next |
| `npm run lint` | ESLint |
| `npm run preview` | Build de OpenNext + servidor local con runtime real de Workers |
| `npm run deploy` | Build de OpenNext + `wrangler deploy` |
| `npm run cf-typegen` | Regenera `cloudflare-env.d.ts` desde `wrangler.jsonc` |

## Despliegue

`npm run deploy` construye con OpenNext y publica a Cloudflare Workers.
Requiere tener seteados los secrets de producción (`wrangler secret put
AUTH_SECRET`) y los bindings de `wrangler.jsonc` (D1, R2) ya creados. Ver
la sección "Cloudflare Workers / despliegue" de `CLAUDE.md` para el detalle
de bindings, migraciones y problemas conocidos de Windows/OneDrive.
