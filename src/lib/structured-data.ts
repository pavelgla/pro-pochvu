const SITE_URL = "https://pro-pochvu.ru";
const SITE_NAME = "Пропочву";
const LEGAL_NAME = "ООО «Цветология»";
const LOGO_URL = `${SITE_URL}/logo.png`;

type JsonLdProduct = {
  name: string;
  slug: string;
  shortDesc?: string | null;
  fullDesc?: string | null;
  images: unknown;
  price: number;
  stock: number;
  rating: number;
  reviewsCount: number;
  productLine?: { brand: string } | null;
};

export function generateProductJsonLd(product: JsonLdProduct) {
  const brand = product.productLine?.brand || "ecokon";
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDesc || product.fullDesc,
    image:
      (product.images as string[]).length > 0
        ? (product.images as string[])[0]
        : undefined,
    brand: {
      "@type": "Brand",
      name: brand === "ecokon" ? "ЭКО Конь" : "Цветология",
    },
    sku: product.slug,
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "RUB",
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      url: `${SITE_URL}/product/${product.slug}`,
    },
    aggregateRating:
      product.reviewsCount > 0
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
      ...(item.href ? { item: `${SITE_URL}${item.href}` } : {}),
    })),
  };
}

export function generateOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    legalName: LEGAL_NAME,
    url: SITE_URL,
    logo: LOGO_URL,
    description:
      "Интернет-магазин ООО «Цветология». Органические удобрения «ЭКО Конь» и фитомодули «Цветология» с фермы «Ранчо Мушкино».",
    sameAs: [
      "https://t.me/+7cAd9gatgP44MDcy",
      "https://www.wildberries.ru/brands/eko-kon",
      "https://www.ozon.ru/brand/eko-kon-147553078/",
      "https://www.ozon.ru/seller/tsvetologiya-1448738/",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      availableLanguage: ["ru"],
    },
  };
}

export function generateWebSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: "ru",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/catalog?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function generateFaqJsonLd(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
