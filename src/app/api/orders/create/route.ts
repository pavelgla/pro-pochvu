import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { FREE_DELIVERY_THRESHOLD, OZON_DELIVERY_COST } from "@/lib/constants";
import { createPayment } from "@/lib/yookassa";

const itemSchema = z.object({
  product_id: z.string(),
  variant_id: z.string().optional(),
  quantity: z.number().int().positive().max(999),
});

const schema = z.object({
  items: z.array(itemSchema).min(1),
  customer_name: z.string().min(2).max(200),
  customer_email: z.string().email(),
  customer_phone: z.string().min(11).max(20),
  customer_comment: z.string().max(1000).optional(),
  delivery_city: z.string().min(2).max(120),
  delivery_pvz_address: z.string().min(5).max(300),
  promo_code: z.string().max(50).optional(),
  payment_method: z
    .enum(["bank_card", "sbp", "sberbank", "tinkoff_bank", "installments"])
    .optional(),
  ym_client_id: z.string().max(64).optional(),
});

type Variant = { id: string; label: string; price_diff?: number };

export async function POST(req: NextRequest) {
  let body;
  try {
    body = schema.parse(await req.json());
  } catch (err) {
    const message = err instanceof z.ZodError ? err.issues : "Invalid data";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  // Prices, names and availability come from the DB only — client values are never trusted
  const productIds = Array.from(new Set(body.items.map((i) => i.product_id)));
  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, isActive: true, sellDirect: true },
  });
  const productById = new Map(products.map((p) => [p.id, p]));

  const orderItems: {
    productId: string;
    variantId?: string;
    quantity: number;
    price: number;
    name: string;
    image: string;
  }[] = [];

  for (const item of body.items) {
    const product = productById.get(item.product_id);
    if (!product) {
      return NextResponse.json(
        { error: "Один из товаров недоступен для заказа. Обновите корзину." },
        { status: 400 }
      );
    }
    if (product.stock < item.quantity) {
      return NextResponse.json(
        { error: `«${product.name}» — недостаточно товара в наличии.` },
        { status: 400 }
      );
    }

    const variants = Array.isArray(product.variants)
      ? (product.variants as Variant[])
      : [];
    const variant = item.variant_id
      ? variants.find((v) => v.id === item.variant_id)
      : undefined;
    if (item.variant_id && !variant) {
      return NextResponse.json(
        { error: `«${product.name}» — выбранный вариант недоступен.` },
        { status: 400 }
      );
    }

    const images = Array.isArray(product.images)
      ? (product.images as string[])
      : [];

    orderItems.push({
      productId: product.id,
      variantId: item.variant_id,
      quantity: item.quantity,
      price: product.price + (variant?.price_diff ?? 0),
      name: variant ? `${product.name} — ${variant.label}` : product.name,
      image: images[0] ?? "",
    });
  }

  const subtotal = orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

  // Fetch promo from DB — never trust client-supplied discount
  let promoRecord: Awaited<ReturnType<typeof prisma.promoCode.findFirst>> = null;
  let discount = 0;
  if (body.promo_code) {
    promoRecord = await prisma.promoCode.findFirst({
      where: { code: { equals: body.promo_code, mode: "insensitive" }, isActive: true },
    });
    if (promoRecord) {
      const now = new Date();
      const isValid =
        (!promoRecord.validFrom || now >= promoRecord.validFrom) &&
        (!promoRecord.validUntil || now <= promoRecord.validUntil) &&
        (promoRecord.usesLimit === null || promoRecord.usesCount < promoRecord.usesLimit) &&
        subtotal >= promoRecord.minOrderAmount;
      if (isValid) {
        discount =
          promoRecord.discountType === "percent"
            ? Math.round(subtotal * (promoRecord.discountValue / 100))
            : Math.min(promoRecord.discountValue, subtotal);
      } else {
        promoRecord = null; // invalid — don't increment
      }
    }
  }

  // MVP: single delivery option — Ozon pickup point, flat rate, computed server-side
  const deliveryCost = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : OZON_DELIVERY_COST;
  const total = subtotal - discount + deliveryCost;

  const session = await getServerSession(authOptions);

  let order;
  try {
    order = await prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          status: "pending",
          total,
          subtotal,
          deliveryCost,
          discount,
          promoCode: promoRecord?.code,
          deliveryProvider: "ozon",
          deliveryMethod: "ozon_pvz",
          deliveryAddress: {
            city: body.delivery_city,
            point_address: body.delivery_pvz_address,
          },
          paymentMethod: body.payment_method ?? "bank_card",
          paymentStatus: "pending",
          customerName: body.customer_name,
          customerEmail: body.customer_email,
          customerPhone: body.customer_phone,
          customerComment: body.customer_comment,
          userId: session?.user ? (session.user as { id?: string }).id : undefined,
          items: { create: orderItems },
        },
      });
      if (promoRecord) {
        await tx.promoCode.update({
          where: { id: promoRecord.id },
          data: { usesCount: { increment: 1 } },
        });
      }
      return created;
    });
  } catch (err) {
    console.error("DB error creating order:", err);
    return NextResponse.json(
      { error: "Не удалось создать заказ. Попробуйте ещё раз." },
      { status: 500 }
    );
  }

  // Stock is not decremented in MVP — the seller adjusts it manually per shipment

  try {
    const { paymentId, confirmationUrl } = await createPayment({
      orderId: order.id,
      orderNumber: order.orderNumber,
      total,
      items: orderItems.map((i) => ({
        name: i.name,
        price: i.price,
        quantity: i.quantity,
      })),
      deliveryCost,
      customerEmail: body.customer_email,
      customerPhone: body.customer_phone,
      paymentMethod: body.payment_method,
      ymClientId: body.ym_client_id,
    });

    await prisma.order.update({
      where: { id: order.id },
      data: { paymentId },
    });

    return NextResponse.json({
      orderId: order.id,
      orderNumber: order.orderNumber,
      paymentId,
      redirectUrl: confirmationUrl,
    });
  } catch (err) {
    console.error("Payment creation failed:", err);
    await prisma.order
      .update({ where: { id: order.id }, data: { paymentStatus: "failed" } })
      .catch(() => {});
    return NextResponse.json(
      { error: "Не удалось создать платёж. Попробуйте ещё раз." },
      { status: 500 }
    );
  }
}
