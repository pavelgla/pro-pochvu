import Image from "next/image";
import Link from "next/link";
import { Send } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getMarketplaceLinks } from "@/lib/marketplace-map";
import { MarketplaceButtons } from "@/components/MarketplaceButtons";
import { formatPrice } from "@/lib/catalog";
import { TELEGRAM_URL } from "@/lib/constants";

/**
 * End-of-article CTA. Shows the article's anchor product with direct
 * "buy on marketplace" buttons. Falls back to a generic catalog CTA
 * when no product is mapped/found.
 */
export async function BlogProductCta({ productSlug }: { productSlug?: string }) {
  const product = productSlug
    ? await prisma.product.findUnique({
        where: { slug: productSlug },
        include: { productLine: true },
      })
    : null;

  if (!product) {
    return (
      <div className="mt-12 rounded-2xl bg-cream p-7 sm:p-8">
        <h2 className="font-serif text-2xl font-medium text-ink mb-2">Готовы попробовать?</h2>
        <p className="text-ink-2 mb-5">
          Выбирайте товары в каталоге и заказывайте на Wildberries или Ozon. Полезные
          советы по уходу — в нашем Telegram.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/catalog?brand=ecokon"
            className="inline-flex items-center gap-1 rounded-xl bg-accent px-6 py-3 text-sm font-medium text-white hover:bg-accent/90 transition-colors"
          >
            Смотреть в каталоге →
          </Link>
          <a
            href={TELEGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-xl border border-line px-6 py-3 text-sm font-medium text-ink hover:bg-bg-soft transition-colors"
          >
            Открыть Telegram
          </a>
        </div>
      </div>
    );
  }

  const links = getMarketplaceLinks(product.slug);
  const images = product.images as unknown as string[];
  const image = Array.isArray(images) && images.length > 0 ? images[0] : null;

  return (
    <div className="mt-12 rounded-2xl bg-cream p-6 sm:p-7">
      <p className="mb-4 text-xs font-medium uppercase tracking-wide text-accent">
        Товар из статьи
      </p>
      <div className="flex flex-col gap-5 sm:flex-row">
        {image && (
          <Link
            href={`/product/${product.slug}`}
            className="relative block aspect-square w-full shrink-0 overflow-hidden rounded-xl bg-bg-soft sm:w-40"
          >
            <Image src={image} alt={product.name} fill className="object-cover" />
          </Link>
        )}
        <div className="flex flex-1 flex-col">
          <Link href={`/product/${product.slug}`}>
            <h3 className="font-serif text-xl font-medium leading-snug text-ink hover:text-accent transition-colors">
              {product.name}
            </h3>
          </Link>
          <div className="mt-2 mb-4 flex items-baseline gap-2">
            <span className="font-serif text-2xl font-semibold text-ink">
              {formatPrice(product.price)}
            </span>
            {product.oldPrice && product.oldPrice > product.price && (
              <span className="text-sm text-mute line-through">
                {formatPrice(product.oldPrice)}
              </span>
            )}
          </div>
          <MarketplaceButtons wb={links.wb} ozon={links.ozon} slug={product.slug} source="blog" />
          <Link
            href={`/product/${product.slug}`}
            className="mt-3 inline-flex items-center gap-1 text-sm text-mute hover:text-accent transition-colors"
          >
            Подробнее о товаре →
          </Link>
        </div>
      </div>
      <a
        href={TELEGRAM_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 inline-flex items-center gap-2 text-sm text-mute hover:text-ink transition-colors"
      >
        <Send className="h-4 w-4" />
        Советы по уходу — в нашем Telegram
      </a>
    </div>
  );
}
