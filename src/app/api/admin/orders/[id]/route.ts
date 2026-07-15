import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";
import { adminOrderSelect } from "@/lib/admin-orders";
import { ORDER_STATUSES, statusBadge } from "@/lib/order-status";
import { notifyStatusChange } from "@/lib/telegram";
import { sendShippingNotification, sendDeliveryConfirmation } from "@/lib/email";

const patchSchema = z
  .object({
    status: z.enum(ORDER_STATUSES).optional(),
    deliveryTrack: z.string().max(100).optional(),
    adminNote: z.string().max(2000).optional(),
  })
  .refine((d) => Object.values(d).some((v) => v !== undefined), {
    message: "Нет полей для обновления",
  });

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const order = await prisma.order.findUnique({
    where: { id: params.id },
    select: adminOrderSelect,
  });
  if (!order) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(order);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body;
  try {
    body = patchSchema.parse(await req.json());
  } catch (err) {
    const message = err instanceof z.ZodError ? err.issues : "Invalid data";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const existing = await prisma.order.findUnique({
    where: { id: params.id },
    select: { id: true, status: true },
  });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const order = await prisma.order.update({
    where: { id: params.id },
    data: {
      ...(body.status !== undefined ? { status: body.status } : {}),
      ...(body.deliveryTrack !== undefined
        ? { deliveryTrack: body.deliveryTrack || null }
        : {}),
      ...(body.adminNote !== undefined
        ? { adminNote: body.adminNote || null }
        : {}),
    },
    include: { items: true },
  });

  // Customer/admin notifications — only on an actual status transition
  const statusChanged =
    body.status !== undefined && body.status !== existing.status;

  if (statusChanged) {
    const forNotification = {
      id: order.id,
      order_number: order.orderNumber,
      total: order.total,
      delivery_cost: order.deliveryCost,
      delivery_provider: order.deliveryProvider,
      delivery_address: order.deliveryAddress as Record<string, string> | null,
      delivery_track: order.deliveryTrack,
      delivery_status: statusBadge(order.status).label,
      payment_method: order.paymentMethod,
      customer_name: order.customerName,
      customer_phone: order.customerPhone,
      items: order.items.map((i) => ({
        name: i.name,
        quantity: i.quantity,
        price: i.price,
      })),
    };
    const forEmail = {
      id: order.id,
      order_number: order.orderNumber,
      total: order.total,
      subtotal: order.subtotal,
      delivery_cost: order.deliveryCost,
      discount: order.discount,
      delivery_provider: order.deliveryProvider,
      delivery_address: order.deliveryAddress as Record<string, string> | null,
      delivery_track: order.deliveryTrack,
      customer_name: order.customerName,
      customer_email: order.customerEmail,
      items: forNotification.items,
    };

    const tasks: Promise<unknown>[] = [notifyStatusChange(forNotification)];
    if (order.status === "shipped") {
      tasks.push(sendShippingNotification(forEmail));
    } else if (order.status === "delivered") {
      tasks.push(sendDeliveryConfirmation(forEmail));
    }
    Promise.allSettled(tasks).then((results) => {
      for (const r of results) {
        if (r.status === "rejected") {
          console.error("[admin/orders] notification failed:", r.reason);
        }
      }
    });
  }

  return NextResponse.json({ ok: true, status: order.status });
}
