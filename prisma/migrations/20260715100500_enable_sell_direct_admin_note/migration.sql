-- Enable direct sales: new products sell directly by default,
-- flip all existing products on (out-of-stock ones stay on the
-- marketplace branch via the `sellDirect && inStock` check in UI).
ALTER TABLE "products" ALTER COLUMN "sellDirect" SET DEFAULT true;
UPDATE "products" SET "sellDirect" = true;

-- Seller cabinet: internal note on an order
ALTER TABLE "orders" ADD COLUMN "adminNote" TEXT;
