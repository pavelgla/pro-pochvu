# Stage 1: Dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

# Stage 2: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Prisma generate (нужен до build)
RUN npx prisma generate

# Build args для клиентских env
ARG NEXT_PUBLIC_SITE_URL=https://ecokon.ru
ARG NEXT_PUBLIC_YMAPS_API_KEY
ARG NEXT_PUBLIC_METRIKA_ID
ARG NEXT_PUBLIC_VK_PIXEL_ID

ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}
ENV NEXT_PUBLIC_YMAPS_API_KEY=${NEXT_PUBLIC_YMAPS_API_KEY}
ENV NEXT_PUBLIC_METRIKA_ID=${NEXT_PUBLIC_METRIKA_ID}
ENV NEXT_PUBLIC_VK_PIXEL_ID=${NEXT_PUBLIC_VK_PIXEL_ID}

RUN npm run build

# Stage 3: Production
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN apk add --no-cache openssl && \
    addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Prisma: копируем клиент, CLI и schema для миграций
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/node_modules/prisma ./node_modules/prisma
COPY --from=builder /app/node_modules/.bin/prisma ./node_modules/.bin/prisma
COPY --from=builder /app/prisma ./prisma

USER nextjs
EXPOSE 3002
ENV PORT=3002
ENV HOSTNAME="0.0.0.0"

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:3002/ || exit 1

CMD ["node", "server.js"]
