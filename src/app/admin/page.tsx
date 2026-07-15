import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/Badge";
import { formatPrice } from "@/lib/catalog";
import { ORDER_STATUSES, statusBadge } from "@/lib/order-status";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const [byStatus, revenue, recent] = await Promise.all([
    prisma.order.groupBy({
      by: ["status"],
      _count: { _all: true },
    }),
    prisma.order.aggregate({
      _sum: { total: true },
      where: {
        paymentStatus: "succeeded",
        createdAt: { gte: thirtyDaysAgo },
      },
    }),
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        orderNumber: true,
        status: true,
        total: true,
        customerName: true,
        createdAt: true,
      },
    }),
  ]);

  const countByStatus = new Map(byStatus.map((s) => [s.status, s._count._all]));

  return (
    <div className="space-y-8">
      <h2>Сводка</h2>

      {/* Status counters */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {ORDER_STATUSES.map((status) => (
          <Link
            key={status}
            href={`/admin/orders?status=${status}`}
            className="rounded-xl border border-line p-4 text-center hover:border-accent/40 transition-colors"
          >
            <div className="text-2xl font-bold">
              {countByStatus.get(status) ?? 0}
            </div>
            <div className="mt-1 text-xs text-mute">
              {statusBadge(status).label}
            </div>
          </Link>
        ))}
      </div>

      {/* Revenue */}
      <div className="rounded-xl border border-line p-5">
        <div className="text-sm text-mute">Оплачено за 30 дней</div>
        <div className="mt-1 text-3xl font-bold">
          {formatPrice(revenue._sum.total ?? 0)}
        </div>
      </div>

      {/* Recent orders */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold">Последние заказы</h3>
          <Link href="/admin/orders" className="text-sm text-accent hover:underline">
            Все заказы →
          </Link>
        </div>
        {recent.length === 0 ? (
          <p className="text-sm text-mute">Заказов пока нет.</p>
        ) : (
          <div className="space-y-2">
            {recent.map((order) => {
              const badge = statusBadge(order.status);
              return (
                <Link
                  key={order.id}
                  href={`/admin/orders/${order.id}`}
                  className="flex items-center gap-4 rounded-xl border border-line p-4 hover:bg-bg-soft/30 transition-colors"
                >
                  <span className="text-sm font-bold">#{order.orderNumber}</span>
                  <Badge variant={badge.variant} size="sm">
                    {badge.label}
                  </Badge>
                  <span className="flex-1 truncate text-sm text-ink-2">
                    {order.customerName}
                  </span>
                  <span className="text-xs text-mute">
                    {order.createdAt.toLocaleDateString("ru-RU")}
                  </span>
                  <span className="text-sm font-bold">
                    {formatPrice(order.total)}
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
