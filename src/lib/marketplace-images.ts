/**
 * Rules for product galleries that marketplace content syncs must respect.
 *
 * The WB content sync puts marketplace photos first, so whatever the WB card
 * shows becomes the main photo on the site after every container restart.
 * For a few products that is wrong: the brand supplies its own photos and the
 * marketplace card lags behind.
 */

/**
 * Products whose gallery is curated by hand — syncs must leave images untouched.
 *
 * udobrenie-tsitrusovye: the WB card still shows the discontinued «для цитрусовых»
 * packaging, while the product is sold as «Удобрение для пальм, фикусов и цитрусов»
 * with a different box (Ирина, 13.08.2026).
 */
export const MANUAL_IMAGE_SLUGS = new Set(["udobrenie-tsitrusovye"]);

export function isMarketplaceImage(url: string): boolean {
  return url.includes("wbbasket.ru") || url.includes("/images/wb/");
}

/**
 * Returns the image list to store, or null when the sync must not touch images.
 */
export function mergeProductImages(
  slug: string,
  existing: string[],
  marketplacePhotos: string[]
): string[] | null {
  if (MANUAL_IMAGE_SLUGS.has(slug)) return null;

  const ownImages = existing.filter((url) => !isMarketplaceImage(url));
  return [...marketplacePhotos, ...ownImages];
}
