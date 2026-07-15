import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/Badge";
import { formatPrice } from "@/lib/catalog";
import { statusBadge } from "@/lib/order-status";
import { adminOrderSelect } from "@/lib/admin-orders";
import { OrderStatusControl } from "@/components/admin/OrderStatusControl";

export const dynamic = "force-dynamic";

const PAYMENT_LABELS: Record<string, string> = {
  bank_card: "Банковская карта",
  sbp: "СБП",
  sberbank: "SberPay",
  tinkoff_bank: "Тинькофф Pay",
  installments: "Рассрочка",
  cod: "Наложенный платёж",
};

export default async function AdminOrderPage({
  params,
}: {
  params: { id: string };
}) {
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    select: adminOrderSelect,
  });
  if (!order) notFound();

  const badge = statusBadge(order.status);
  const addr = order.deliveryAddress as {
    city?: string;
    point_address?: string;
    address?: string;
  } | null;
  const addressLine = addr
    ? [addr.city, addr.point_address ?? addr.address].filter(Boolean).join(", ")
    : "—";

  return (
    <div className="space-y-6">
      <Link
        href="/admin/orders"
        className="inline-flex items-center gap-2 text-sm text-mute hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" />
        Все заказы
      </Link>

      <div className="flex flex-wrap items-center gap-3">
        <h2>Заказ #{order.orderNumber}</h2>
        <Badge variant={badge.variant} size="md">
          {badge.label}
        </Badge>
        <span className="text-sm text-mute">
          {order.createdAt.toLocaleString("ru-RU", {
            day: "2-digit",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Customer */}
        <div className="rounded-xl border border-line p-5 space-y-2 text-sm">
          <h3 className="text-base font-bold">Покупатель</h3>
          <p>{order.customerName}</p>
          <p>
            <a href={`tel:${order.customerPhone}`} className="text-accent hover:underline">
              {order.customerPhone}
            </a>
          </p>
          <p>
            <a href={`mailto:${order.customerEmail}`} className="text-accent hover:underline">
              {order.customerEmail}
            </a>
          </p>
          {order.customerComment && (
            <p className="rounded-lg bg-bg-soft p-3 text-ink-2">
              💬 {order.customerComment}
            </p>
          )}
        </div>

        {/* Delivery & payment */}
        <div className="rounded-xl border border-line p-5 space-y-2 text-sm">
          <h3 className="text-base font-bold">Доставка и оплата</h3>
          <p>
            <span className="text-mute">Доставка:</span>{" "}
            {order.deliveryProvider === "ozon"
              ? "Озон-доставка (пункт выдачи)"
              : order.deliveryProvider || "—"}
          </p>
          <p>
            <span className="text-mute">Адрес:</span> {addressLine}
          </p>
          {order.deliveryTrack && (
            <p>
              <span className="text-mute">Трек:</span> {order.deliveryTrack}
            </p>
          )}
          <p>
            <span className="text-mute">Оплата:</span>{" "}
            {PAYMENT_LABELS[order.paymentMethod ?? ""] ?? order.paymentMethod ?? "—"}{" "}
            <span
              className={
                order.paymentStatus === "succeeded"
                  ? "text-success"
                  : "text-mute"
              }
            >
              ({order.paymentStatus === "succeeded" ? "оплачен" : order.paymentStatus})
            </span>
          </p>
        </div>
      </div>

      {/* Items */}
      <div className="rounded-xl border border-line p-5 space-y-3">
        <h3 className="text-base font-bold">Состав заказа</h3>
        {order.items.map((item) => (
          <div key={item.id} className="flex items-center gap-3 text-sm">
            {item.product?.slug ? (
              <Link
                href={`/product/${item.product.slug}`}
                className="flex-1 hover:text-accent"
                target="_blank"
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
        <div className="space-y-1.5 border-t border-line pt-3 text-sm">
          <div className="flex justify-between">
            <span className="text-mute">Товары</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-success">
              <span>Скидка{order.promoCode ? ` (${order.promoCode})` : ""}</span>
              <span>−{formatPrice(order.discount)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-mute">Доставка</span>
            <span>
              {order.deliveryCost === 0 ? "Бесплатно" : formatPrice(order.deliveryCost)}
            </span>
          </div>
          <div className="flex justify-between border-t border-line pt-2 text-base font-bold">
            <span>Итого</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>

      {/* Status management */}
      <OrderStatusControl
        orderId={order.id}
        currentStatus={order.status}
        deliveryTrack={order.deliveryTrack ?? ""}
        adminNote={order.adminNote ?? ""}
      />
    </div>
  );
}
