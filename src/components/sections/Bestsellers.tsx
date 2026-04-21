import Link from "next/link";
import { Button } from "@/components/ui/Button";
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
    const result = await getProducts({ sort: "popularity", limit: 4 });
    products = result.products;
  } catch {
    products = mockProducts;
  }

  if (products.length === 0) {
    products = mockProducts;
  }

  return (
    <section className="section-padding bg-brand-gray-light/50">
      <div className="container-main">
        <h2 className="mb-8 text-center">Бестселлеры</h2>

        <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
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
