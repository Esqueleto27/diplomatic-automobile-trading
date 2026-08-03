FROM node:22-alpine AS base

FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build
RUN npm prune --omit=dev

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

# Next.js standalone server + static assets
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# node_modules completo (sin devDependencies) por encima del recorte de
# standalone: el CLI de Prisma (migrate deploy, db seed) tiene su propio
# árbol de dependencias que el tracing de standalone no incluye porque no
# es código importado por la app, sino un binario invocado aparte.
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/prisma.config.ts ./prisma.config.ts

# prisma/seed.ts importa el cliente generado por ruta relativa (no por el
# alias "@/*"), así que necesita el código fuente presente en runtime.
COPY --from=builder --chown=nextjs:nodejs /app/src/generated ./src/generated

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

CMD ["sh", "-c", "npx prisma migrate deploy && node server.js"]
