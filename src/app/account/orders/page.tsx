"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { OrderTracker } from "@/components/OrderTracker";
import { formatPrice } from "@/lib/catalog";
import { useCartStore } from "@/store/cartStore";
import { cn } from "@/lib/utils";

type MockOrder = {
  id: string;
  order_number: number;
  created_at: string;
  total: number;
  status: string;
  delivery_track: string | null;
  delivery_provider: string;
  items: { name: string; quantity: number; price: number; slug: string; brand: string; image: string; weight_grams: number; product_id: string }[];
};

const statusBadge: Record<string, { variant: "success" | "warning" | "info" | "sale"; label: string }> = {
  pending: { variant: "warning", label: "Ожидание" },
  paid: { variant: "info", label: "Оплачен" },
  confirmed: { variant: "info", label: "Подтверждён" },
  shipped: { variant: "info", label: "Отправлен" },
  delivered: { variant: "success", label: "Доставлен" },
  cancelled: { variant: "sale", label: "Отменён" },
};

// Mock orders
const mockOrders: MockOrder[] = [
  {
    id: "ord-1",
    order_number: 100042,
    created_at: "2026-03-28T14:30:00",
    total: 1861,
    status: "delivered",
    delivery_track: "FP-123456",
    delivery_provider: "5Post",
    items: [
      { name: "Био-чай Универсальный с янтарём", quantity: 2, price: 626, slug: "bio-chay-universalnyj-s-yantaryom", brand: "ecokon", image: "", weight_grams: 300, product_id: "c1000000-0000-0000-0000-000000000001" },
      { name: "Био-чай Для орхидей", quantity: 1, price: 611, slug: "bio-chay-dlya-orhidej", brand: "ecokon", image: "", weight_grams: 300, product_id: "c1000000-0000-0000-0000-000000000003" },
    ],
  },
  {
    id: "ord-2",
    order_number: 100043,
    created_at: "2026-03-30T10:15:00",
    total: 2748,
    status: "shipped",
    delivery_track: "CDEK-789012",
    delivery_provider: "СДЭК",
    items: [
      { name: "Фитомодуль настенный 3 кармана (антрацит)", quantity: 1, price: 2748, slug: "fitomodul-nastennyj-3-karmana-antratsit", brand: "tsvetologiya", image: "", weight_grams: 800, product_id: "c1000000-0000-0000-0000-000000000009" },
    ],
  },
];

export default function OrdersPage() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const addItem = useCartStore((s) => s.addItem);

  function reorder(order: MockOrder) {
    for (const item of order.items) {
      addItem({
        product_id: item.product_id,
        name: item.name,
        brand: item.brand,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        slug: item.slug,
        weight_grams: item.weight_grams,
      });
    }
  }

  return (
    <div className="space-y-6">
      <h2>Мои заказы</h2>

      {mockOrders.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-mute">У вас пока нет заказов</p>
          <Link href="/catalog" className="mt-4 inline-block">
            <Button variant="secondary">Перейти в каталог</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {mockOrders.map((order) => {
            const badge = statusBadge[order.status] || statusBadge.pending;
            const isExpanded = expanded === order.id;

            return (
              <div
                key={order.id}
                className="rounded-xl border border-line overflow-hidden"
              >
                {/* Header row */}
                <button
                  type="button"
                  onClick={() => setExpanded(isExpanded ? null : order.id)}
                  className="flex w-full items-center gap-4 p-4 text-left hover:bg-bg-soft/30"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold">
                        #{order.order_number}
                      </span>
                      <Badge variant={badge.variant} size="sm">
                        {badge.label}
                      </Badge>
                    </div>
                    <p className="mt-0.5 text-xs text-mute">
                      {new Date(order.created_at).toLocaleDateString("ru-RU")}
                      {order.delivery_track && ` • Трек: ${order.delivery_track}`}
                    </p>
                  </div>
                  <span className="shrink-0 text-sm font-bold">
                    {formatPrice(order.total)}
                  </span>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 shrink-0 text-mute/60 transition-transform",
                      isExpanded && "rotate-180"
                    )}
                  />
                </button>

                {/* Expanded details */}
                {isExpanded && (
                  <div className="border-t border-line p-4 space-y-3">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex items-center gap-3 text-sm">
                        <div className="h-10 w-10 shrink-0 rounded-lg bg-bg-soft flex items-center justify-center text-xs text-mute/30">
                          {item.brand === "ecokon" ? "🌿" : "🌱"}
                        </div>
                        <Link
                          href={`/product/${item.slug}`}
                          className="flex-1 hover:text-accent"
                        >
                          {item.name}
                        </Link>
                        <span className="text-mute">
                          x{item.quantity}
                        </span>
                        <span className="font-medium">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}

                    {/* Order tracker */}
                    <div className="border-t border-line pt-3">
                      <OrderTracker
                        currentStatus={order.status === "delivered" ? "delivered" : order.status === "shipped" ? "shipped" : "paid"}
                        trackNumber={order.delivery_track}
                        deliveryProvider={order.delivery_provider}
                      />
                    </div>

                    <div className="flex items-center justify-between border-t border-line pt-3">
                      <span className="text-xs text-mute">
                        {order.delivery_provider}
                        {order.delivery_track && ` • ${order.delivery_track}`}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => reorder(order)}
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                        Повторить
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
