import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle, Clock, CreditCard } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/Button";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { OrderTracker } from "@/components/OrderTracker";
import { OrderStatusPoller } from "@/components/OrderStatusPoller";
import { PurchaseTracker } from "@/components/analytics/PurchaseTracker";
import type { EcommerceProduct } from "@/lib/analytics";
import { isOrderConfirmed } from "@/lib/order-status";

type Props = {
  params: { id: string };
  searchParams: { redirectUrl?: string; payment?: string; status?: string };
};

async function getOrder(id: string) {
  if (id.includes("mock")) {
    return {
      id,
      orderNumber: 999999,
      total: 1490,
      subtotal: 1490,
      deliveryCost: 0,
      promoCode: null,
      customerEmail: "test@example.com",
      paymentStatus: "paid" as const,
      paymentMethod: "online",
      status: "confirmed",
      createdAt: new Date(),
      items: [] as Array<{
        productId: string;
        variantId: string | null;
        name: string;
        price: number;
        quantity: number;
      }>,
    };
  }
  return prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });
}

export default async function OrderPage({ params, searchParams }: Props) {
  const order = await getOrder(params.id);

  if (!order) notFound();

  const isPending =
    order.paymentStatus === "pending" && order.paymentMethod !== "cod";
  const redirectUrl = searchParams.redirectUrl;
  const isConfirmed = isOrderConfirmed(order);
  // Buyer just bounced back from YooKassa's hosted payment page — the
  // webhook that actually confirms payment may not have landed yet, so
  // give it a few seconds of client-side polling before settling on
  // "Ожидание оплаты" for a genuinely unpaid/cancelled order.
  const justReturnedFromPayment =
    searchParams.payment === "success" || searchParams.status === "confirmed";

  const orderNumber = String(order.orderNumber).padStart(6, "0");

  const ecommerceProducts: EcommerceProduct[] = (order.items ?? []).map((i) => ({
    id: i.productId,
    name: i.name,
    price: i.price,
    quantity: i.quantity,
    variant: i.variantId ?? undefined,
  }));

  return (
    <div className="container-main section-padding">
      <OrderStatusPoller active={!isConfirmed && justReturnedFromPayment} />
      <PurchaseTracker
        orderId={order.id}
        orderNumber={order.orderNumber}
        total={order.total}
        shipping={order.deliveryCost ?? 0}
        coupon={order.promoCode ?? undefined}
        products={ecommerceProducts}
        enabled={isConfirmed}
      />
      <Breadcrumbs
        items={[
          { label: "Главная", href: "/" },
          { label: `Заказ #${orderNumber}` },
        ]}
      />

      <div className="mx-auto mt-8 max-w-2xl">
        {/* Status header */}
        <div className="text-center">
          {isConfirmed ? (
            <>
              <CheckCircle className="mx-auto h-16 w-16 text-success" />
              <h1 className="mt-4">Заказ оформлен!</h1>
              <p className="mt-2 text-mute">
                Заказ #{orderNumber} успешно создан
              </p>
            </>
          ) : (
            <>
              <Clock className="mx-auto h-16 w-16 text-yellow-500" />
              <h1 className="mt-4">Ожидание оплаты</h1>
              <p className="mt-2 text-mute">
                Заказ #{orderNumber} ожидает подтверждения оплаты
              </p>
            </>
          )}
        </div>

        {/* Order details */}
        <div className="mt-8 space-y-4">
          <div className="rounded-xl border border-line p-5">
            <h3 className="text-base font-bold">Информация о заказе</h3>
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-mute">Номер заказа</dt>
                <dd className="font-medium">#{orderNumber}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-mute">Сумма</dt>
                <dd className="font-medium">
                  {new Intl.NumberFormat("ru-RU").format(order.total)} ₽
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-mute">Email</dt>
                <dd>{order.customerEmail}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-mute">Дата</dt>
                <dd>
                  {new Date(order.createdAt).toLocaleDateString("ru-RU")}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-mute">Статус</dt>
                <dd>
                  {isConfirmed ? (
                    <span className="rounded-full bg-success/10 px-2 py-0.5 text-xs font-medium text-success">
                      {order.paymentMethod === "cod"
                        ? "Наложенный платёж"
                        : "Оплачен"}
                    </span>
                  ) : (
                    <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800">
                      Ожидание оплаты
                    </span>
                  )}
                </dd>
              </div>
            </dl>
          </div>

          {/* Order tracking */}
          <div className="rounded-xl border border-line p-5">
            <h3 className="mb-4 text-base font-bold">Отслеживание</h3>
            <OrderTracker
              currentStatus={isConfirmed ? "paid" : "created"}
              dates={{
                created: new Date(order.createdAt).toISOString(),
                ...(isConfirmed
                  ? { paid: new Date(order.createdAt).toISOString() }
                  : {}),
              }}
            />
          </div>

          {/* Notification */}
          <div className="rounded-xl bg-cream p-5 text-center text-sm">
            <p>
              Подтверждение отправлено на{" "}
              <span className="font-medium">{order.customerEmail}</span>.
              <br />
              Вы можете отслеживать статус заказа на этой странице.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          {isPending && redirectUrl && (
            <a href={redirectUrl}>
              <Button>
                <CreditCard className="mr-2 h-4 w-4" />
                Оплатить
              </Button>
            </a>
          )}
          <Link href="/catalog">
            <Button variant={isPending && redirectUrl ? "secondary" : "primary"}>
              Вернуться в каталог
            </Button>
          </Link>
          <Link href="/account">
            <Button variant="secondary">Мои заказы</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
