import type { Prisma } from "@prisma/client";

export type {
  User,
  Product,
  ProductLine,
  Category,
  Order,
  OrderItem,
  PromoCode,
  Review,
  BlogPost,
  KnowledgeBase,
  Favorite,
  Subscription,
  Notification,
  SyncLog,
} from "@prisma/client";

// Алиас для обратной совместимости
export type { User as Profile } from "@prisma/client";

// Составные типы для UI
export type ProductWithRelations = Prisma.ProductGetPayload<{
  include: { productLine: true; category: true; reviews: true };
}>;

export type ProductWithLine = Prisma.ProductGetPayload<{
  include: { productLine: true; category: true };
}>;

export type OrderWithItems = Prisma.OrderGetPayload<{
  include: { items: true };
}>;
