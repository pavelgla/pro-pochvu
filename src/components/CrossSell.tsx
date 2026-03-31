import { ProductCard } from "@/components/ProductCard";
import { getCrossSellProducts } from "@/lib/catalog";
import type { Product } from "@/types/database";

export function CrossSell({ product }: { product: Product }) {
  const items = getCrossSellProducts(product, 4);
  if (items.length === 0) return null;

  return (
    <section className="mt-16">
      <h2 className="mb-6">С этим покупают</h2>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {items.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
