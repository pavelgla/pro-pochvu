import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getProductBySlug,
  getAllProductSlugs,
  getProductLineById,
  getCategoryById,
} from "@/lib/catalog";
import { generateProductJsonLd } from "@/lib/structured-data";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ProductGallery } from "@/components/ProductGallery";
import { ProductInfo } from "@/components/ProductInfo";
import { ProductTabs } from "@/components/ProductTabs";
import { CrossSell } from "@/components/CrossSell";
import { RelatedProducts } from "@/components/RelatedProducts";

type Props = {
  params: { slug: string };
};

export function generateStaticParams() {
  return getAllProductSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const product = getProductBySlug(params.slug);
  if (!product) return {};

  const title = product.seo_title || product.name;
  const description =
    product.seo_description ||
    product.short_description ||
    `${product.name} — купить в интернет-магазине ecokon.ru`;

  return {
    title,
    description,
    alternates: { canonical: `https://ecokon.ru/product/${product.slug}` },
    openGraph: {
      title,
      description,
      type: "website",
      images: product.seo_og_image ? [product.seo_og_image] : undefined,
    },
  };
}

export default function ProductPage({ params }: Props) {
  const product = getProductBySlug(params.slug);
  if (!product) notFound();

  const productLine = getProductLineById(product.product_line_id);
  const category = product.category_id
    ? getCategoryById(product.category_id)
    : null;

  const breadcrumbs = [
    { label: "Главная", href: "/" },
    { label: "Каталог", href: "/catalog" },
    ...(productLine
      ? [{ label: productLine.name, href: `/catalog/${productLine.slug}` }]
      : []),
    ...(category ? [{ label: category.name }] : []),
  ];

  const jsonLd = generateProductJsonLd(product);

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
          images={product.images}
          videoUrl={product.video_url}
          brand={product.brand}
        />
        <ProductInfo product={product} />
      </div>

      {/* Tabs: description, characteristics, reviews, how-to */}
      <div className="mt-12">
        <ProductTabs product={product} />
      </div>

      {/* Cross-sell & related */}
      <CrossSell product={product} />
      <RelatedProducts product={product} />
    </div>
  );
}
