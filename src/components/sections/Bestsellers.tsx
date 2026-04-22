import Link from "next/link";
import { Ornament } from "@/components/ui/Ornament";
import { ProductCard } from "@/components/ProductCard";
import { getProducts } from "@/lib/catalog";
import type { ProductWithLine } from "@/types/database";

const mockProducts: ProductWithLine[] = [
  {
    id: "mock-1",
    name: "Био-чай Янтарь+Фосфор для комнатных растений",
    slug: "bio-chay-yantar-fosfor",
    description: "",
    price: 349,
    oldPrice: 449,
    images: ["/images/ecokon/bio-chay-yantar-fosfor_0.jpg"],
    badge: "bestseller",
    rating: 4.9,
    reviewsCount: 12400,
    isActive: true,
    weightGrams: 100,
    productLineId: "ecokon",
    categoryId: "udobreniya",
    createdAt: new Date(),
    updatedAt: new Date(),
    productLine: { id: "ecokon", name: "ЭКО Конь", brand: "ecokon", description: "", createdAt: new Date(), updatedAt: new Date() },
    category: { id: "udobreniya", name: "Удобрения", slug: "udobreniya", description: "", parentId: null, createdAt: new Date(), updatedAt: new Date() },
  },
  {
    id: "mock-2",
    name: "Фитомодуль настенный белый 3 кармана",
    slug: "fitomodul-nastenny-bely-3",
    description: "",
    price: 890,
    oldPrice: null,
    images: [],
    badge: "bestseller",
    rating: 4.8,
    reviewsCount: 3200,
    isActive: true,
    weightGrams: 500,
    productLineId: "tsvetologiya",
    categoryId: "fitomoduli",
    createdAt: new Date(),
    updatedAt: new Date(),
    productLine: { id: "tsvetologiya", name: "Цветология", brand: "tsvetologiya", description: "", createdAt: new Date(), updatedAt: new Date() },
    category: { id: "fitomoduli", name: "Фитомодули", slug: "fitomoduli", description: "", parentId: null, createdAt: new Date(), updatedAt: new Date() },
  },
  {
    id: "mock-3",
    name: "Удобрение для орхидей Био-чай",
    slug: "bio-chay-orkhidei",
    description: "",
    price: 299,
    oldPrice: 349,
    images: [],
    badge: "new",
    rating: 4.9,
    reviewsCount: 8700,
    isActive: true,
    weightGrams: 80,
    productLineId: "ecokon",
    categoryId: "udobreniya",
    createdAt: new Date(),
    updatedAt: new Date(),
    productLine: { id: "ecokon", name: "ЭКО Конь", brand: "ecokon", description: "", createdAt: new Date(), updatedAt: new Date() },
    category: { id: "udobreniya", name: "Удобрения", slug: "udobreniya", description: "", parentId: null, createdAt: new Date(), updatedAt: new Date() },
  },
  {
    id: "mock-4",
    name: "Фитомодуль напольный чёрный 5 карманов",
    slug: "fitomodul-napolny-cherny-5",
    description: "",
    price: 1290,
    oldPrice: null,
    images: [],
    badge: null,
    rating: 4.7,
    reviewsCount: 1900,
    isActive: true,
    weightGrams: 800,
    productLineId: "tsvetologiya",
    categoryId: "fitomoduli",
    createdAt: new Date(),
    updatedAt: new Date(),
    productLine: { id: "tsvetologiya", name: "Цветология", brand: "tsvetologiya", description: "", createdAt: new Date(), updatedAt: new Date() },
    category: { id: "fitomoduli", name: "Фитомодули", slug: "fitomoduli", description: "", parentId: null, createdAt: new Date(), updatedAt: new Date() },
  },
] as unknown as ProductWithLine[];

export async function Bestsellers() {
  let products: ProductWithLine[] = [];

  try {
    const result = await getProducts({ sort: "popularity", limit: 8 });
    products = result.products;
  } catch {
    products = mockProducts;
  }

  if (products.length === 0) {
    products = mockProducts;
  }

  return (
    <section className="px-4 pb-12 pt-10 md:px-6 xl:px-12 lg:pb-24">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="section-label mb-5">
              <Ornament variant="divider" />
              <span>БЕСТСЕЛЛЕРЫ</span>
            </div>
            <h2 className="section-heading">
              Покупают
              <br />
              <span className="text-accent">чаще всего.</span>
            </h2>
          </div>
          <div className="max-w-[360px] lg:text-right">
            <p className="mb-4 text-sm leading-relaxed text-ink-2">
              Позиции, к которым клиенты возвращаются раз за разом. Проверено
              растениями.
            </p>
          </div>
        </div>

        {/* Grid */}
        <div className="grid gap-5 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 lg:gap-7">
          {products.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-14 text-center">
          <Link href="/catalog" className="btn-outline">
            Смотреть все товары →
          </Link>
        </div>
      </div>
    </section>
  );
}
