import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getProductBySlug } from "@/lib/catalog";
import { generateProductJsonLd } from "@/lib/structured-data";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ProductGallery } from "@/components/ProductGallery";
import { ProductInfo } from "@/components/ProductInfo";
import { ProductTabs } from "@/components/ProductTabs";
import { CrossSell } from "@/components/CrossSell";
import { RelatedProducts } from "@/components/RelatedProducts";
import { TelegramPost } from "@/components/TelegramPost";
import { PARTNER, PARTNER_PRODUCT_POSTS } from "@/lib/partner-content";

type Props = {
  params: { slug: string };
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  if (!product) return {};

  const title = product.seoTitle || product.name;
  const baseDescript =
    product.seoDescription ||
    product.shortDesc ||
    `${product.name} — купить в интернет-магазине pro-pochvu.ru`;
  const brandSuffix =
    product.productLine?.brand === "tsvetologiya"
      ? " ® Торговая марка «Цветология» зарегистрирована."
      : product.productLine?.brand === "ecokon"
        ? " ® Торговая марка «ЭКО Конь» зарегистрирована."
        : "";
  const description = baseDescript + brandSuffix;

  return {
    title,
    description,
    alternates: { canonical: `https://pro-pochvu.ru/product/${product.slug}` },
    openGraph: {
      title,
      description,
      type: "website",
      images: product.seoOgImage ? [product.seoOgImage] : undefined,
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();

  const breadcrumbs = [
    { label: "Главная", href: "/" },
    { label: "Каталог", href: "/catalog" },
    ...(product.productLine
      ? [{ label: product.productLine.name, href: `/catalog/${product.productLine.slug}` }]
      : []),
    ...(product.category ? [{ label: product.category.name }] : []),
  ];

  const jsonLd = generateProductJsonLd(product);
  const partnerPost = PARTNER_PRODUCT_POSTS[product.slug];

  return (
    <div className="container-main section-padding">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Breadcrumbs items={breadcrumbs} />

      {/* Product hero: gallery + info */}
      <div className="mt-6 grid gap-8 md:grid-cols-2">
        <ProductGallery
          images={product.images as string[]}
          videoUrl={product.videoUrl}
          brand={product.productLine?.brand || "ecokon"}
        />
        <ProductInfo product={product} />
      </div>

      {/* Tabs: description, characteristics, reviews, how-to */}
      <div className="mt-12">
        <ProductTabs product={product} />
      </div>

      {/* Видео-обзор от партнёра-блогера */}
      {partnerPost && (
        <div className="mt-12 border-t border-ink/10 pt-10">
          <div className="mb-6 max-w-xl">
            <h2 className="font-serif text-2xl font-medium tracking-tight">
              Видео-обзор от <span className="text-accent">{PARTNER.name}</span>
            </h2>
            <p className="mt-2 text-sm text-ink/70">
              {PARTNER.fullName} рассказывает о товаре своим подписчикам в Telegram.
            </p>
          </div>
          <div className="max-w-md">
            <TelegramPost post={partnerPost} />
          </div>
        </div>
      )}

      {/* Cross-sell & related */}
      <Suspense>
        <CrossSell product={product} />
      </Suspense>
      <Suspense>
        <RelatedProducts product={product} />
      </Suspense>
    </div>
  );
}
