import { prisma } from "@/lib/prisma";

export type CatalogFilters = {
  brand?: string;
  productLine?: string;
  category?: string;
  priceMin?: number;
  priceMax?: number;
  rating?: number;
  sort?: "popularity" | "price_asc" | "price_desc" | "rating" | "newest";
  page?: number;
  limit?: number;
};

export type CatalogResult = {
  products: any[];
  total: number;
  page: number;
  totalPages: number;
};

export async function getProducts(filters: CatalogFilters = {}): Promise<CatalogResult> {
  const {
    brand,
    productLine,
    category,
    priceMin,
    priceMax,
    rating,
    sort = "popularity",
    page = 1,
    limit = 12,
  } = filters;

  const where: any = { isActive: true };

  if (brand) {
    const brands = brand.split(",");
    where.productLine = { brand: { in: brands } };
  }
  if (productLine) {
    where.productLine = { ...where.productLine, slug: productLine };
  }
  if (category) {
    where.category = { slug: category };
  }
  if (priceMin || priceMax) {
    where.price = {};
    if (priceMin) where.price.gte = priceMin;
    if (priceMax) where.price.lte = priceMax;
  }
  if (rating) {
    where.rating = { gte: rating };
  }

  let orderBy: any = { reviewsCount: "desc" };
  if (sort === "price_asc") orderBy = { price: "asc" };
  if (sort === "price_desc") orderBy = { price: "desc" };
  if (sort === "rating") orderBy = { rating: "desc" };
  if (sort === "newest") orderBy = { createdAt: "desc" };

  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      select: {
        id: true, slug: true, name: true, shortDesc: true,
        price: true, oldPrice: true, images: true, badge: true,
        rating: true, reviewsCount: true, stock: true, isActive: true,
        productLine: { select: { id: true, slug: true, name: true, brand: true, image: true } },
        category: { select: { id: true, slug: true, name: true } },
      },
      orderBy,
      take: limit,
      skip,
    }),
    prisma.product.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return { products, total, page, totalPages };
}

export async function getProductLines() {
  return prisma.productLine.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });
}

export async function getProductLineBySlug(slug: string) {
  return prisma.productLine.findFirst({
    where: { slug, isActive: true },
  });
}

export async function getCategories(productLineId?: string) {
  return prisma.category.findMany({
    where: {
      isActive: true,
      ...(productLineId && { productLineId }),
    },
    select: {
      id: true, slug: true, name: true, description: true, image: true, sortOrder: true,
      productLine: { select: { id: true, slug: true, name: true, brand: true } },
    },
    orderBy: { sortOrder: "asc" },
  });
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: {
      productLine: true,
      category: true,
      reviews: {
        where: { isVisible: true },
        orderBy: { createdAt: "desc" },
        take: 20,
      },
    },
  });
}

export async function getProductById(id: string) {
  return prisma.product.findUnique({
    where: { id },
    select: {
      id: true, slug: true, name: true, shortDesc: true, price: true, oldPrice: true,
      images: true, badge: true, rating: true, reviewsCount: true, stock: true,
      weightGrams: true, dimensions: true, isActive: true, productLineId: true, categoryId: true,
      productLine: { select: { id: true, slug: true, name: true, brand: true, image: true } },
      category: { select: { id: true, slug: true, name: true } },
    },
  });
}

export async function getAllProductSlugs() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    select: { slug: true },
  });
  return products.map((p) => p.slug);
}

export async function getRelatedProducts(productId: string, categoryId: string, limit = 4) {
  return prisma.product.findMany({
    where: { isActive: true, categoryId, id: { not: productId } },
    include: { productLine: true, category: true },
    take: limit,
    orderBy: { rating: "desc" },
  });
}

export async function getCrossSellProducts(productLineBrand: string, excludeProductId: string, limit = 4) {
  const otherBrand = productLineBrand === "ecokon" ? "tsvetologiya" : "ecokon";
  if (process.env.NEXT_PUBLIC_SHOW_TSVETOLOGIYA === "false" && otherBrand === "tsvetologiya") {
    return [];
  }
  return prisma.product.findMany({
    where: { isActive: true, productLine: { brand: otherBrand }, id: { not: excludeProductId } },
    include: { productLine: true, category: true },
    take: limit,
    orderBy: { reviewsCount: "desc" },
  });
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("ru-RU").format(price) + " ₽";
}
