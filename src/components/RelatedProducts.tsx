import { ProductCard } from "@/components/ProductCard";
import { getRelatedProducts } from "@/lib/catalog";
import type { Product } from "@/types/database";

export function RelatedProducts({ product }: { product: Product }) {
  const items = getRelatedProducts(product, 4);
  if (items.length === 0) return null;

  return (
    <section className="mt-16">
      <h2 className="mb-6">Похожие товары</h2>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {items.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
