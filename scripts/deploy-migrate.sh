#!/bin/sh
set -e

echo "Running Prisma migrations..."
node node_modules/prisma/build/index.js migrate deploy

echo "Syncing WB reviews..."
node scripts/sync-wb-reviews.js || echo "WB sync failed (non-fatal), continuing..."

echo "Syncing Ozon reviews..."
node scripts/sync-ozon-reviews.js || echo "Ozon sync failed (non-fatal), continuing..."

echo "Starting application..."
exec node server.js
