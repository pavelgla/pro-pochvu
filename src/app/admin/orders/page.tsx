import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/Badge";
import { formatPrice } from "@/lib/catalog";
import { cn } from "@/lib/utils";
import { ORDER_STATUSES, statusBadge, type OrderStatus } from "@/lib/order-status";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 20;

type SearchParams = { status?: string; page?: string };

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const status = ORDER_STATUSES.includes(searchParams.status as OrderStatus)
    ? (searchParams.status as OrderStatus)
    : undefined;
  const page = Math.max(1, Number(searchParams.page) || 1);
  const where = status ? { status } : {};

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      select: {
        id: true,
        orderNumber: true,
        status: true,
        total: true,
        paymentStatus: true,
        customerName: true,
        customerPhone: true,
        deliveryAddress: true,
        createdAt: true,
      },
    }),
    prisma.order.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const tabs: { href: string; label: string; active: boolean }[] = [
    { href: "/admin/orders", label: "Все", active: !status },
    ...ORDER_STATUSES.map((s) => ({
      href: `/admin/orders?status=${s}`,
      label: statusBadge(s).label,
      active: status === s,
    })),
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2>Заказы</h2>
        <span className="text-sm text-mute">{total} шт.</span>
      </div>

      {/* Status filter tabs */}
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
              tab.active
                ? "border-accent bg-accent/5 text-accent"
                : "border-line text-ink-2 hover:border-accent/40"
            )}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {orders.length === 0 ? (
        <p className="py-12 text-center text-sm text-mute">
          Заказов с таким статусом нет.
        </p>
      ) : (
        <div className="space-y-2">
          {orders.map((order) => {
            const badge = statusBadge(order.status);
            const addr = order.deliveryAddress as { city?: string } | null;
            return (
              <Link
                key={order.id}
                href={`/admin/orders/${order.id}`}
                className="flex flex-wrap items-center gap-x-4 gap-y-1 rounded-xl border border-line p-4 hover:bg-bg-soft/30 transition-colors"
              >
                <span className="text-sm font-bold">#{order.orderNumber}</span>
                <Badge variant={badge.variant} size="sm">
                  {badge.label}
                </Badge>
                <span className="text-xs text-mute">
                  {order.createdAt.toLocaleString("ru-RU", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                <span className="min-w-0 flex-1 truncate text-sm text-ink-2">
                  {order.customerName} · {order.customerPhone}
                  {addr?.city ? ` · ${addr.city}` : ""}
                </span>
                <span className="text-sm font-bold">
                  {formatPrice(order.total)}
                </span>
              </Link>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/admin/orders?${status ? `status=${status}&` : ""}page=${p}`}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-lg border text-sm",
                p === page
                  ? "border-accent bg-accent/5 font-bold text-accent"
                  : "border-line text-ink-2 hover:border-accent/40"
              )}
            >
              {p}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
