import type { ProductWithLine } from "@/types/database";

export function generateProductJsonLd(product: ProductWithLine) {
  const brand = product.productLine?.brand || "ecokon";
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDesc || product.fullDesc,
    image: (product.images as string[]).length > 0 ? (product.images as string[])[0] : undefined,
    brand: {
      "@type": "Brand",
      name: brand === "ecokon" ? "ЭКО Конь" : "Цветология",
    },
    sku: product.slug,
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "RUB",
      availability: product.stock > 0
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: `https://pro-pochvu.ru/product/${product.slug}`,
    },
    aggregateRating: product.reviewsCount > 0
      ? {
          "@type": "AggregateRating",
          ratingValue: product.rating,
          reviewCount: product.reviewsCount,
          bestRating: 5,
          worstRating: 1,
        }
      : undefined,
  };
}

export function generateBreadcrumbJsonLd(
  items: { label: string; href?: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      ...(item.href ? { item: `https://pro-pochvu.ru${item.href}` } : {}),
    })),
  };
}
