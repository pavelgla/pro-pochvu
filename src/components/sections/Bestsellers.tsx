import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { BrandLabel } from "@/components/BrandLabel";
import { Star } from "lucide-react";
import type { Product } from "@/types/database";

// Mock data — used when Supabase is not connected
const mockProducts: Pick<
  Product,
  | "id"
  | "slug"
  | "name"
  | "price"
  | "price_old"
  | "brand"
  | "badge"
  | "rating"
  | "reviews_count"
  | "images"
>[] = [
  {
    id: "1",
    slug: "bio-chay-universalnyj-s-yantaryom",
    name: "Био-чай Универсальный с янтарём",
    price: 626,
    price_old: null,
    brand: "ecokon",
    badge: "bestseller",
    rating: 4.9,
    reviews_count: 9762,
    images: [],
  },
  {
    id: "2",
    slug: "bio-chay-dlya-dekorativno-listvennyh",
    name: "Био-чай Для декоративно-лиственных",
    price: 609,
    price_old: null,
    brand: "ecokon",
    badge: "bestseller",
    rating: 4.9,
    reviews_count: 6287,
    images: [],
  },
  {
    id: "3",
    slug: "dlya-ukrepleniya-kornevoj-sistemy",
    name: "Для укрепления корневой системы",
    price: 633,
    price_old: null,
    brand: "ecokon",
    badge: "bestseller",
    rating: 4.9,
    reviews_count: 5784,
    images: [],
  },
  {
    id: "4",
    slug: "fitomodul-nastennyj-3-karmana-antratsit",
    name: "Фитомодуль настенный 3 кармана (антрацит)",
    price: 2748,
    price_old: null,
    brand: "tsvetologiya",
    badge: null,
    rating: 4.8,
    reviews_count: 4899,
    images: [],
  },
];

function formatPrice(price: number) {
  return new Intl.NumberFormat("ru-RU").format(price) + " ₽";
}

function ProductCard({
  product,
}: {
  product: (typeof mockProducts)[number];
}) {
  return (
    <Link
      href={`/product/${product.slug}`}
      className="group flex flex-col rounded-2xl bg-white p-4 shadow-md transition-all duration-200 hover:shadow-lg"
    >
      {/* Image */}
      <div className="relative mb-4 aspect-square overflow-hidden rounded-xl bg-brand-gray-light">
        <div className="flex h-full items-center justify-center text-4xl text-brand-gray-dark/20">
          📦
        </div>
        {product.badge && (
          <div className="absolute left-2 top-2">
            <Badge variant="bestseller">Хит</Badge>
          </div>
        )}
        <div className="absolute right-2 top-2">
          <BrandLabel brand={product.brand as "ecokon" | "tsvetologiya"} />
        </div>
      </div>

      {/* Info */}
      <h4 className="text-sm font-semibold leading-snug group-hover:text-brand-green md:text-base">
        {product.name}
      </h4>

      {/* Rating */}
      <div className="mt-2 flex items-center gap-1 text-sm text-brand-gray-dark/60">
        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        <span className="font-medium text-brand-gray-dark">{product.rating}</span>
        <span>({product.reviews_count.toLocaleString("ru-RU")})</span>
      </div>

      {/* Price */}
      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-lg font-bold text-brand-gray-dark">
          {formatPrice(product.price)}
        </span>
        {product.price_old && (
          <span className="text-sm text-brand-gray-dark/40 line-through">
            {formatPrice(product.price_old)}
          </span>
        )}
      </div>

      {/* CTA */}
      <div className="mt-4">
        <Button size="sm" className="w-full">
          В корзину
        </Button>
      </div>
    </Link>
  );
}

export function Bestsellers() {
  // TODO: replace with Supabase fetch when DB is connected
  const products = mockProducts;

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
