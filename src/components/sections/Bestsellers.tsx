import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ProductCard } from "@/components/ProductCard";
import { getProducts } from "@/lib/catalog";

export function Bestsellers() {
  const { products } = getProducts({ sort: "popularity", limit: 4 });

  return (
    <section className="section-padding bg-brand-gray-light/50">
      <div className="container-main">
        <h2 className="mb-8 text-center">Бестселлеры</h2>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link href="/catalog">
            <Button variant="secondary">Все товары →</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
