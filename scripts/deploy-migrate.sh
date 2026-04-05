#!/bin/sh
set -e

echo "Running Prisma migrations..."
node node_modules/prisma/build/index.js migrate deploy

echo "Syncing WB reviews..."
node scripts/sync-wb-reviews.js || echo "WB sync failed (non-fatal), continuing..."

echo "Syncing Ozon reviews (account 1 — ЭКО Конь удобрения)..."
node scripts/sync-ozon-reviews.js || echo "Ozon sync failed (non-fatal), continuing..."

echo "Syncing Ozon reviews (account 2 — Цветология + Грунт)..."
node scripts/sync-ozon2-reviews.js || echo "Ozon2 sync failed (non-fatal), continuing..."

echo "Syncing WB content (descriptions + photos, acc1 ЭКО Конь)..."
node scripts/sync-wb-content.js || echo "WB content sync failed (non-fatal), continuing..."

echo "Syncing Ozon prices (both accounts)..."
node scripts/sync-ozon-prices.js || echo "Ozon prices sync failed (non-fatal), continuing..."

echo "Syncing WB prices (both accounts)..."
node scripts/sync-wb-prices.js || echo "WB prices sync failed (non-fatal), continuing..."

echo "Starting application..."
exec node server.js
