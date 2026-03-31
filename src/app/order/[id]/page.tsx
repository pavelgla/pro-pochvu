"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { OrderTracker } from "@/components/OrderTracker";

type Props = {
  params: { id: string };
};

export default function OrderPage({ params }: Props) {
  const searchParams = useSearchParams();
  const paymentStatus = searchParams.get("payment");
  const status = searchParams.get("status");

  const isSuccess = paymentStatus === "success" || status === "confirmed";
  const orderId = params.id;
  // Mock order number from ID
  const orderNumber = orderId.slice(0, 6).toUpperCase();

  return (
    <div className="container-main section-padding">
      <Breadcrumbs
        items={[
          { label: "Главная", href: "/" },
          { label: `Заказ #${orderNumber}` },
        ]}
      />

      <div className="mx-auto mt-8 max-w-2xl">
        {/* Status */}
        <div className="text-center">
          {isSuccess ? (
            <>
              <CheckCircle className="mx-auto h-16 w-16 text-success" />
              <h1 className="mt-4">Заказ оформлен!</h1>
              <p className="mt-2 text-brand-gray-dark/60">
                Заказ #{orderNumber} успешно создан
              </p>
            </>
          ) : (
            <>
              <Clock className="mx-auto h-16 w-16 text-yellow-500" />
              <h1 className="mt-4">Ожидание оплаты</h1>
              <p className="mt-2 text-brand-gray-dark/60">
                Заказ #{orderNumber} ожидает подтверждения оплаты
              </p>
            </>
          )}
        </div>

        {/* Order details */}
        <div className="mt-8 space-y-4">
          <div className="rounded-xl border border-brand-gray-light p-5">
            <h3 className="text-base font-bold">Информация о заказе</h3>
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-brand-gray-dark/60">Номер заказа</dt>
                <dd className="font-medium">#{orderNumber}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-brand-gray-dark/60">Дата</dt>
                <dd>{new Date().toLocaleDateString("ru-RU")}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-brand-gray-dark/60">Статус</dt>
                <dd>
                  {isSuccess ? (
                    <span className="rounded-full bg-success/10 px-2 py-0.5 text-xs font-medium text-success">
                      {status === "confirmed" ? "Подтверждён" : "Оплачен"}
                    </span>
                  ) : (
                    <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800">
                      Ожидание
                    </span>
                  )}
                </dd>
              </div>
            </dl>
          </div>

          {/* Order tracking */}
          <div className="rounded-xl border border-brand-gray-light p-5">
            <h3 className="mb-4 text-base font-bold">Отслеживание</h3>
            <OrderTracker
              currentStatus={isSuccess ? "paid" : "created"}
              dates={{
                created: new Date().toISOString(),
                ...(isSuccess ? { paid: new Date().toISOString() } : {}),
              }}
            />
          </div>

          {/* Notification */}
          <div className="rounded-xl bg-brand-cream p-5 text-center text-sm">
            <p>
              Подтверждение отправлено на вашу почту.
              <br />
              Вы можете отслеживать статус заказа на этой странице.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link href="/catalog">
            <Button>Продолжить покупки</Button>
          </Link>
          <Link href="/account">
            <Button variant="secondary">Мои заказы</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
