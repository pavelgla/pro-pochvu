export const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "paid",
  "shipped",
  "delivered",
  "cancelled",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const STATUS_LABELS: Record<
  OrderStatus,
  { label: string; variant: "success" | "warning" | "info" | "sale" }
> = {
  pending: { variant: "warning", label: "Ожидание оплаты" },
  confirmed: { variant: "info", label: "Подтверждён" },
  paid: { variant: "info", label: "Оплачен" },
  shipped: { variant: "info", label: "Отправлен" },
  delivered: { variant: "success", label: "Доставлен" },
  cancelled: { variant: "sale", label: "Отменён" },
};

export function statusBadge(status: string) {
  return STATUS_LABELS[status as OrderStatus] ?? STATUS_LABELS.pending;
}

/**
 * Whether an order is actually paid/confirmed. Only trusts DB fields set by
 * the YooKassa webhook or an admin — never a redirect query param, since
 * YooKassa bounces the browser back to the same return_url regardless of
 * whether the payment succeeded, failed, or was abandoned.
 */
export function isOrderConfirmed(order: {
  paymentStatus: string | null;
  status: string;
}): boolean {
  return (
    order.paymentStatus === "succeeded" ||
    order.paymentStatus === "cod" ||
    order.status === "paid" ||
    order.status === "confirmed"
  );
}
