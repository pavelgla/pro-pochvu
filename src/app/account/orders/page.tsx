"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronDown, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { OrderTracker } from "@/components/OrderTracker";
import { formatPrice } from "@/lib/catalog";
import { statusBadge } from "@/lib/order-status";
import { useCartStore } from "@/store/cartStore";
import { cn } from "@/lib/utils";

type ApiOrderItem = {
  id: string;
  productId: string;
  variantId: string | null;
  quantity: number;
  price: number;
  name: string;
  image: string | null;
  product: {
    slug: string;
    weightGrams: number;
    productLine: { brand: string } | null;
  } | null;
};

type ApiOrder = {
  id: string;
  orderNumber: number;
  status: string;
  total: number;
  deliveryProvider: string | null;
  deliveryTrack: string | null;
  createdAt: string;
  items: ApiOrderItem[];
};

function providerLabel(provider: string | null): string {
  if (!provider) return "";
  return provider === "ozon" ? "Озон-доставка" : provider;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<ApiOrder[] | null>(null);
  const [error, setError] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    fetch("/api/user/orders")
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data: ApiOrder[]) => setOrders(data))
      .catch(() => setError(true));
  }, []);

  function reorder(order: ApiOrder) {
    for (const item of order.items) {
      addItem({
        product_id: item.productId,
        variant_id: item.variantId ?? undefined,
        name: item.name,
        brand: item.product?.productLine?.brand ?? "ecokon",
        price: item.price,
        quantity: item.quantity,
        image: item.image ?? "",
        slug: item.product?.slug ?? "",
        weight_grams: item.product?.weightGrams ?? 0,
      });
    }
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h2>Мои заказы</h2>
        <p className="py-12 text-center text-mute">
          Не удалось загрузить заказы. Обновите страницу.
        </p>
      </div>
    );
  }

  if (orders === null) {
    return (
      <div className="space-y-6">
        <h2>Мои заказы</h2>
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-line border-t-accent" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2>Мои заказы</h2>

      {orders.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-mute">У вас пока нет заказов</p>
          <Link href="/catalog" className="mt-4 inline-block">
            <Button variant="secondary">Перейти в каталог</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => {
            const badge = statusBadge(order.status);
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
                        #{order.orderNumber}
                      </span>
                      <Badge variant={badge.variant} size="sm">
                        {badge.label}
                      </Badge>
                    </div>
                    <p className="mt-0.5 text-xs text-mute">
                      {new Date(order.createdAt).toLocaleDateString("ru-RU")}
                      {order.deliveryTrack && ` • Трек: ${order.deliveryTrack}`}
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
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 text-sm">
                        <div className="h-10 w-10 shrink-0 rounded-lg bg-bg-soft flex items-center justify-center text-xs text-mute/30">
                          {item.product?.productLine?.brand === "tsvetologiya" ? "🌱" : "🌿"}
                        </div>
                        {item.product?.slug ? (
                          <Link
                            href={`/product/${item.product.slug}`}
                            className="flex-1 hover:text-accent"
                          >
                            {item.name}
                          </Link>
                        ) : (
                          <span className="flex-1">{item.name}</span>
                        )}
                        <span className="text-mute">x{item.quantity}</span>
                        <span className="font-medium">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}

                    {/* Order tracker */}
                    <div className="border-t border-line pt-3">
                      <OrderTracker
                        currentStatus={
                          order.status === "delivered"
                            ? "delivered"
                            : order.status === "shipped"
                            ? "shipped"
                            : "paid"
                        }
                        trackNumber={order.deliveryTrack}
                        deliveryProvider={providerLabel(order.deliveryProvider)}
                      />
                    </div>

                    <div className="flex items-center justify-between border-t border-line pt-3">
                      <span className="text-xs text-mute">
                        {providerLabel(order.deliveryProvider)}
                        {order.deliveryTrack && ` • ${order.deliveryTrack}`}
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
