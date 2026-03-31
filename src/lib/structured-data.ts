import type { Product } from "@/types/database";

export function generateProductJsonLd(product: Product) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.short_description || product.description,
    image: product.images.length > 0 ? product.images[0] : undefined,
    brand: {
      "@type": "Brand",
      name: product.brand === "ecokon" ? "ЭКО Конь" : "Цветология",
    },
    sku: product.slug,
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "RUB",
      availability: product.stock > 0
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: `https://ecokon.ru/product/${product.slug}`,
    },
    aggregateRating: product.reviews_count > 0
      ? {
          "@type": "AggregateRating",
          ratingValue: product.rating,
          reviewCount: product.reviews_count,
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
      ...(item.href ? { item: `https://ecokon.ru${item.href}` } : {}),
    })),
  };
}
