import { ProductCard } from "@/components/ProductCard";
import { getCrossSellProducts } from "@/lib/catalog";
import type { ProductWithLine } from "@/types/database";

export async function CrossSell({ product }: { product: ProductWithLine }) {
  const brand = product.productLine?.brand || "ecokon";
  const items = await getCrossSellProducts(brand, product.id, 4, product.price);
  if (items.length === 0) return null;

  return (
    <section className="mt-16">
      <h2 className="mb-6 font-serif text-3xl font-normal tracking-tight">С этим покупают</h2>
      <div className="grid gap-5 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
