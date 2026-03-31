import type { Product, ProductLine, Category } from "@/types/database";

// =============================================
// Mock data (used when Supabase is not connected)
// =============================================

const mockProductLines: ProductLine[] = [
  { id: "a1000000-0000-0000-0000-000000000001", slug: "bio-chay", name: "Био-чай", brand: "ecokon", description: "Органические удобрения в стиках для комнатных и садовых растений", image: null, sort_order: 1, is_active: true, created_at: "" },
  { id: "a1000000-0000-0000-0000-000000000002", slug: "specialized", name: "Специализированные удобрения", brand: "ecokon", description: "Удобрения для конкретных культур и задач", image: null, sort_order: 2, is_active: true, created_at: "" },
  { id: "a1000000-0000-0000-0000-000000000003", slug: "fitmoduli", name: "Фитомодули", brand: "tsvetologiya", description: "Модульные системы для вертикального озеленения", image: null, sort_order: 3, is_active: true, created_at: "" },
  { id: "a1000000-0000-0000-0000-000000000004", slug: "accessories", name: "Аксессуары", brand: "tsvetologiya", description: "Аксессуары для фитомодулей и растений", image: null, sort_order: 4, is_active: true, created_at: "" },
];

const mockCategories: Category[] = [
  { id: "b1000000-0000-0000-0000-000000000001", slug: "bio-chay-stiki", name: "Био-чай в стиках", parent_id: null, product_line_id: "a1000000-0000-0000-0000-000000000001", description: "", image: null, sort_order: 1, is_active: true, created_at: "" },
  { id: "b1000000-0000-0000-0000-000000000002", slug: "specialized-udobreniya", name: "Специализированные удобрения", parent_id: null, product_line_id: "a1000000-0000-0000-0000-000000000002", description: "", image: null, sort_order: 2, is_active: true, created_at: "" },
  { id: "b1000000-0000-0000-0000-000000000003", slug: "nastennye-fitmoduli", name: "Настенные фитомодули", parent_id: null, product_line_id: "a1000000-0000-0000-0000-000000000003", description: "", image: null, sort_order: 3, is_active: true, created_at: "" },
  { id: "b1000000-0000-0000-0000-000000000004", slug: "napolnye-fitmoduli", name: "Напольные фитомодули", parent_id: null, product_line_id: "a1000000-0000-0000-0000-000000000003", description: "", image: null, sort_order: 4, is_active: true, created_at: "" },
  { id: "b1000000-0000-0000-0000-000000000005", slug: "ukryvnoy-material", name: "Укрывной материал", parent_id: null, product_line_id: "a1000000-0000-0000-0000-000000000004", description: "", image: null, sort_order: 5, is_active: true, created_at: "" },
  { id: "b1000000-0000-0000-0000-000000000006", slug: "bio-chay-nabory", name: "Наборы Био-чай", parent_id: null, product_line_id: "a1000000-0000-0000-0000-000000000001", description: "", image: null, sort_order: 6, is_active: true, created_at: "" },
];

const mockProducts: Product[] = [
  { id: "c1000000-0000-0000-0000-000000000001", slug: "bio-chay-universalnyj-s-yantaryom", name: "Био-чай Универсальный с янтарём", description: "", short_description: "Органическое удобрение с янтарной кислотой для всех типов растений.", price: 626, price_old: null, discount_percent: null, brand: "ecokon", product_line_id: "a1000000-0000-0000-0000-000000000001", category_id: "b1000000-0000-0000-0000-000000000001", images: [], video_url: null, characteristics: {}, variants: [], weight_grams: 300, dimensions: null, stock: 100, badge: "bestseller", rating: 4.9, reviews_count: 9762, marketplace_ids: {}, seo_title: null, seo_description: null, seo_og_image: null, is_active: true, created_at: "2024-01-01", updated_at: "2024-01-01" },
  { id: "c1000000-0000-0000-0000-000000000002", slug: "bio-chay-dlya-dekorativno-listvennyh", name: "Био-чай Для декоративно-лиственных", description: "", short_description: "Специальная формула для фикусов, монстер, пальм.", price: 609, price_old: null, discount_percent: null, brand: "ecokon", product_line_id: "a1000000-0000-0000-0000-000000000001", category_id: "b1000000-0000-0000-0000-000000000001", images: [], video_url: null, characteristics: {}, variants: [], weight_grams: 300, dimensions: null, stock: 100, badge: "bestseller", rating: 4.9, reviews_count: 6287, marketplace_ids: {}, seo_title: null, seo_description: null, seo_og_image: null, is_active: true, created_at: "2024-01-01", updated_at: "2024-01-01" },
  { id: "c1000000-0000-0000-0000-000000000003", slug: "bio-chay-dlya-orhidej", name: "Био-чай Для орхидей", description: "", short_description: "Мягкая формула для орхидей и эпифитов.", price: 611, price_old: null, discount_percent: null, brand: "ecokon", product_line_id: "a1000000-0000-0000-0000-000000000001", category_id: "b1000000-0000-0000-0000-000000000001", images: [], video_url: null, characteristics: {}, variants: [], weight_grams: 300, dimensions: null, stock: 100, badge: null, rating: 4.9, reviews_count: 1727, marketplace_ids: {}, seo_title: null, seo_description: null, seo_og_image: null, is_active: true, created_at: "2024-01-02", updated_at: "2024-01-02" },
  { id: "c1000000-0000-0000-0000-000000000004", slug: "bio-chay-dlya-rassady", name: "Био-чай Для рассады", description: "", short_description: "Безопасное удобрение для рассады и молодых растений.", price: 608, price_old: null, discount_percent: null, brand: "ecokon", product_line_id: "a1000000-0000-0000-0000-000000000001", category_id: "b1000000-0000-0000-0000-000000000001", images: [], video_url: null, characteristics: {}, variants: [], weight_grams: 300, dimensions: null, stock: 100, badge: null, rating: 5.0, reviews_count: 51, marketplace_ids: {}, seo_title: null, seo_description: null, seo_og_image: null, is_active: true, created_at: "2024-01-03", updated_at: "2024-01-03" },
  { id: "c1000000-0000-0000-0000-000000000005", slug: "bio-chay-dlya-tsvetushchih", name: "Био-чай Для цветущих", description: "", short_description: "Формула для обильного и продолжительного цветения.", price: 608, price_old: null, discount_percent: null, brand: "ecokon", product_line_id: "a1000000-0000-0000-0000-000000000001", category_id: "b1000000-0000-0000-0000-000000000001", images: [], video_url: null, characteristics: {}, variants: [], weight_grams: 300, dimensions: null, stock: 100, badge: null, rating: 4.9, reviews_count: 61, marketplace_ids: {}, seo_title: null, seo_description: null, seo_og_image: null, is_active: true, created_at: "2024-01-04", updated_at: "2024-01-04" },
  { id: "c1000000-0000-0000-0000-000000000006", slug: "dlya-ukrepleniya-kornevoj-sistemy", name: "Для укрепления корневой системы", description: "", short_description: "Стимулятор корнеобразования на основе конского компоста.", price: 633, price_old: null, discount_percent: null, brand: "ecokon", product_line_id: "a1000000-0000-0000-0000-000000000002", category_id: "b1000000-0000-0000-0000-000000000002", images: [], video_url: null, characteristics: {}, variants: [], weight_grams: 300, dimensions: null, stock: 100, badge: "bestseller", rating: 4.9, reviews_count: 5784, marketplace_ids: {}, seo_title: null, seo_description: null, seo_og_image: null, is_active: true, created_at: "2024-01-05", updated_at: "2024-01-05" },
  { id: "c1000000-0000-0000-0000-000000000007", slug: "dlya-ovoshchej", name: "Для овощей", description: "", short_description: "Органическое удобрение для овощных культур.", price: 487, price_old: null, discount_percent: null, brand: "ecokon", product_line_id: "a1000000-0000-0000-0000-000000000002", category_id: "b1000000-0000-0000-0000-000000000002", images: [], video_url: null, characteristics: {}, variants: [], weight_grams: 300, dimensions: null, stock: 100, badge: null, rating: 4.9, reviews_count: 1789, marketplace_ids: {}, seo_title: null, seo_description: null, seo_og_image: null, is_active: true, created_at: "2024-01-06", updated_at: "2024-01-06" },
  { id: "c1000000-0000-0000-0000-000000000008", slug: "dlya-tsitrusovyh", name: "Для цитрусовых", description: "", short_description: "Специальная формула для цитрусовых растений.", price: 487, price_old: null, discount_percent: null, brand: "ecokon", product_line_id: "a1000000-0000-0000-0000-000000000002", category_id: "b1000000-0000-0000-0000-000000000002", images: [], video_url: null, characteristics: {}, variants: [], weight_grams: 300, dimensions: null, stock: 100, badge: null, rating: 4.9, reviews_count: 1621, marketplace_ids: {}, seo_title: null, seo_description: null, seo_og_image: null, is_active: true, created_at: "2024-01-07", updated_at: "2024-01-07" },
  { id: "c1000000-0000-0000-0000-000000000009", slug: "fitomodul-nastennyj-3-karmana-antratsit", name: "Фитомодуль настенный 3 кармана (антрацит)", description: "", short_description: "Модуль вертикального озеленения на 3 кармана.", price: 2748, price_old: null, discount_percent: null, brand: "tsvetologiya", product_line_id: "a1000000-0000-0000-0000-000000000003", category_id: "b1000000-0000-0000-0000-000000000003", images: [], video_url: null, characteristics: {}, variants: [], weight_grams: 800, dimensions: null, stock: 100, badge: null, rating: 4.8, reviews_count: 4899, marketplace_ids: {}, seo_title: null, seo_description: null, seo_og_image: null, is_active: true, created_at: "2024-01-08", updated_at: "2024-01-08" },
  { id: "c1000000-0000-0000-0000-000000000010", slug: "fitomodul-nastennyj-3-karmana-zelenyj", name: "Фитомодуль настенный 3 кармана (зелёный)", description: "", short_description: "Модуль вертикального озеленения зелёного цвета.", price: 2748, price_old: null, discount_percent: null, brand: "tsvetologiya", product_line_id: "a1000000-0000-0000-0000-000000000003", category_id: "b1000000-0000-0000-0000-000000000003", images: [], video_url: null, characteristics: {}, variants: [], weight_grams: 800, dimensions: null, stock: 100, badge: null, rating: 4.7, reviews_count: 500, marketplace_ids: {}, seo_title: null, seo_description: null, seo_og_image: null, is_active: true, created_at: "2024-01-09", updated_at: "2024-01-09" },
  { id: "c1000000-0000-0000-0000-000000000011", slug: "fitomodul-nastennyj-6-karmanov", name: "Фитомодуль настенный 6 карманов", description: "", short_description: "Большой модуль на 6 карманов для зелёной стены.", price: 4200, price_old: null, discount_percent: null, brand: "tsvetologiya", product_line_id: "a1000000-0000-0000-0000-000000000003", category_id: "b1000000-0000-0000-0000-000000000003", images: [], video_url: null, characteristics: {}, variants: [], weight_grams: 1500, dimensions: null, stock: 100, badge: null, rating: 4.6, reviews_count: 200, marketplace_ids: {}, seo_title: null, seo_description: null, seo_og_image: null, is_active: true, created_at: "2024-01-10", updated_at: "2024-01-10" },
  { id: "c1000000-0000-0000-0000-000000000012", slug: "fitomodul-napolnyj", name: "Фитомодуль напольный", description: "", short_description: "Напольная система вертикального озеленения.", price: 4800, price_old: null, discount_percent: null, brand: "tsvetologiya", product_line_id: "a1000000-0000-0000-0000-000000000003", category_id: "b1000000-0000-0000-0000-000000000004", images: [], video_url: null, characteristics: {}, variants: [], weight_grams: 2500, dimensions: null, stock: 100, badge: null, rating: 4.5, reviews_count: 100, marketplace_ids: {}, seo_title: null, seo_description: null, seo_og_image: null, is_active: true, created_at: "2024-01-11", updated_at: "2024-01-11" },
  { id: "c1000000-0000-0000-0000-000000000013", slug: "ukryvnoj-material", name: "Укрывной материал", description: "", short_description: "Нетканый материал для защиты растений.", price: 159, price_old: null, discount_percent: null, brand: "tsvetologiya", product_line_id: "a1000000-0000-0000-0000-000000000004", category_id: "b1000000-0000-0000-0000-000000000005", images: [], video_url: null, characteristics: {}, variants: [], weight_grams: 200, dimensions: null, stock: 100, badge: null, rating: 4.7, reviews_count: 300, marketplace_ids: {}, seo_title: null, seo_description: null, seo_og_image: null, is_active: true, created_at: "2024-01-12", updated_at: "2024-01-12" },
];

// =============================================
// Types
// =============================================

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
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
};

// =============================================
// Query functions (mock — replace with Supabase)
// =============================================

export function getProducts(filters: CatalogFilters = {}): CatalogResult {
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

  let result = [...mockProducts].filter((p) => p.is_active);

  if (brand) {
    const brands = brand.split(",");
    result = result.filter((p) => brands.includes(p.brand));
  }
  if (productLine) {
    const pl = mockProductLines.find((l) => l.slug === productLine);
    if (pl) result = result.filter((p) => p.product_line_id === pl.id);
  }
  if (category) {
    const cat = mockCategories.find((c) => c.slug === category);
    if (cat) result = result.filter((p) => p.category_id === cat.id);
  }
  if (priceMin) result = result.filter((p) => p.price >= priceMin);
  if (priceMax) result = result.filter((p) => p.price <= priceMax);
  if (rating) result = result.filter((p) => p.rating >= rating);

  switch (sort) {
    case "price_asc":
      result.sort((a, b) => a.price - b.price);
      break;
    case "price_desc":
      result.sort((a, b) => b.price - a.price);
      break;
    case "rating":
      result.sort((a, b) => b.rating - a.rating);
      break;
    case "newest":
      result.sort((a, b) => b.created_at.localeCompare(a.created_at));
      break;
    default: // popularity
      result.sort((a, b) => b.reviews_count - a.reviews_count);
  }

  const total = result.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const start = (page - 1) * limit;
  const paged = result.slice(start, start + limit);

  return { products: paged, total, page, totalPages };
}

export function getProductLines(): ProductLine[] {
  return mockProductLines.filter((l) => l.is_active);
}

export function getProductLineBySlug(slug: string): ProductLine | undefined {
  return mockProductLines.find((l) => l.slug === slug && l.is_active);
}

export function getCategories(productLineId?: string): Category[] {
  if (productLineId) {
    return mockCategories.filter((c) => c.product_line_id === productLineId);
  }
  return mockCategories;
}

export function getProductBySlug(slug: string): Product | undefined {
  return mockProducts.find((p) => p.slug === slug && p.is_active);
}

export function getAllProductSlugs(): string[] {
  return mockProducts.filter((p) => p.is_active).map((p) => p.slug);
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return mockProducts
    .filter((p) => p.id !== product.id && p.category_id === product.category_id && p.is_active)
    .sort((a, b) => b.reviews_count - a.reviews_count)
    .slice(0, limit);
}

export function getCrossSellProducts(product: Product, limit = 4): Product[] {
  const otherBrand = product.brand === "ecokon" ? "tsvetologiya" : "ecokon";
  return mockProducts
    .filter((p) => p.brand === otherBrand && p.is_active)
    .sort((a, b) => b.reviews_count - a.reviews_count)
    .slice(0, limit);
}

export function getProductLineById(id: string): ProductLine | undefined {
  return mockProductLines.find((l) => l.id === id);
}

export function getCategoryById(id: string): Category | undefined {
  return mockCategories.find((c) => c.id === id);
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("ru-RU").format(price) + " ₽";
}
