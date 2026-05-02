# Stage 1: Dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

# Stage 2: Build
FROM node:20-alpine AS builder
WORKDIR /app
RUN apk add --no-cache openssl
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Prisma generate (нужен до build)
RUN npx prisma generate

# Build args для клиентских env
ARG NEXT_PUBLIC_SITE_URL=https://pro-pochvu.ru
ARG NEXT_PUBLIC_YMAPS_API_KEY
ARG NEXT_PUBLIC_METRIKA_ID
ARG NEXT_PUBLIC_VK_PIXEL_ID
ARG NEXT_PUBLIC_SHOW_TSVETOLOGIYA=true
ARG NEXT_PUBLIC_YANDEX_VERIFICATION
ARG NEXT_PUBLIC_GOOGLE_VERIFICATION
ARG NEXT_PUBLIC_MAILRU_VERIFICATION

ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}
ENV NEXT_PUBLIC_YMAPS_API_KEY=${NEXT_PUBLIC_YMAPS_API_KEY}
ENV NEXT_PUBLIC_METRIKA_ID=${NEXT_PUBLIC_METRIKA_ID}
ENV NEXT_PUBLIC_VK_PIXEL_ID=${NEXT_PUBLIC_VK_PIXEL_ID}
ENV NEXT_PUBLIC_SHOW_TSVETOLOGIYA=${NEXT_PUBLIC_SHOW_TSVETOLOGIYA}
ENV NEXT_PUBLIC_YANDEX_VERIFICATION=${NEXT_PUBLIC_YANDEX_VERIFICATION}
ENV NEXT_PUBLIC_GOOGLE_VERIFICATION=${NEXT_PUBLIC_GOOGLE_VERIFICATION}
ENV NEXT_PUBLIC_MAILRU_VERIFICATION=${NEXT_PUBLIC_MAILRU_VERIFICATION}

RUN npm run build

# Compile WB sync script to plain JS (tsx not available in production)
RUN npx esbuild scripts/sync-wb-reviews.ts --bundle --platform=node --target=node20 \
    --external:@prisma/client --external:.prisma --outfile=scripts/sync-wb-reviews.js
RUN npx esbuild scripts/sync-ozon-reviews.ts --bundle --platform=node --target=node20 \
    --external:@prisma/client --external:.prisma --outfile=scripts/sync-ozon-reviews.js
RUN npx esbuild scripts/sync-ozon2-reviews.ts --bundle --platform=node --target=node20 \
    --external:@prisma/client --external:.prisma --outfile=scripts/sync-ozon2-reviews.js
RUN npx esbuild scripts/sync-wb-content.ts --bundle --platform=node --target=node20 \
    --external:@prisma/client --external:.prisma --outfile=scripts/sync-wb-content.js
RUN npx esbuild scripts/sync-ozon-prices.ts --bundle --platform=node --target=node20 \
    --external:@prisma/client --external:.prisma --outfile=scripts/sync-ozon-prices.js
RUN npx esbuild scripts/sync-wb-prices.ts --bundle --platform=node --target=node20 \
    --external:@prisma/client --external:.prisma --outfile=scripts/sync-wb-prices.js

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
COPY --from=builder /app/prisma ./prisma

# WB sync script (compiled to JS)
COPY --from=builder /app/scripts/sync-wb-reviews.js ./scripts/sync-wb-reviews.js
COPY --from=builder /app/scripts/sync-ozon-reviews.js ./scripts/sync-ozon-reviews.js
COPY --from=builder /app/scripts/sync-ozon2-reviews.js ./scripts/sync-ozon2-reviews.js

# Entrypoint для автоматических миграций при старте
COPY scripts/deploy-migrate.sh ./scripts/deploy-migrate.sh

# Prisma CLI нужен доступ на запись к engines dir
RUN chown -R nextjs:nodejs node_modules/.prisma node_modules/@prisma node_modules/prisma prisma scripts

USER nextjs
EXPOSE 3002
ENV PORT=3002
ENV HOSTNAME="0.0.0.0"

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:3002/ || exit 1

CMD ["sh", "scripts/deploy-migrate.sh"]
