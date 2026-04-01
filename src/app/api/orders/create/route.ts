import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { FREE_DELIVERY_THRESHOLD } from "@/lib/constants";

const itemSchema = z.object({
  product_id: z.string(),
  variant_id: z.string().optional(),
  name: z.string(),
  brand: z.string(),
  price: z.number().positive(),
  quantity: z.number().int().positive(),
  image: z.string(),
  slug: z.string(),
  weight_grams: z.number(),
});

const schema = z.object({
  items: z.array(itemSchema).min(1),
  customer_name: z.string().min(2),
  customer_email: z.string().email(),
  customer_phone: z.string().min(11),
  customer_comment: z.string().optional(),
  delivery_provider: z.string(),
  delivery_method: z.string(),
  delivery_cost: z.number(),
  delivery_tariff_id: z.string(),
  delivery_address: z.any(),
  delivery_point_id: z.string().optional(),
  delivery_city_code: z.number().optional(),
  promo_code: z.string().optional(),
  promo_discount: z.number().optional(),
  payment_method: z.string(),
});

export async function POST(req: NextRequest) {
  let body;
  try {
    body = schema.parse(await req.json());
  } catch (err) {
    const message = err instanceof z.ZodError ? err.issues : "Invalid data";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  // Calculate totals server-side
  const subtotal = body.items.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );
  const discount = body.promo_discount || 0;
  const deliveryCost =
    subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : body.delivery_cost;
  const total = subtotal - discount + deliveryCost;

  // COD surcharge
  const isCod = body.payment_method === "cod";
  const codSurcharge = isCod ? Math.round(total * 0.03) : 0;
  const finalTotal = total + codSurcharge;

  const session = await getServerSession(authOptions);

  const order = await prisma.order.create({
    data: {
      status: isCod ? "confirmed" : "pending",
      total: finalTotal,
      subtotal,
      deliveryCost,
      discount,
      promoCode: body.promo_code,
      deliveryProvider: body.delivery_provider,
      deliveryMethod: body.delivery_method,
      deliveryAddress: body.delivery_address,
      deliveryCityCode: body.delivery_city_code,
      paymentMethod: body.payment_method,
      paymentStatus: isCod ? "cod" : "pending",
      customerName: body.customer_name,
      customerEmail: body.customer_email,
      customerPhone: body.customer_phone,
      customerComment: body.customer_comment,
      userId: session?.user ? (session.user as any).id : undefined,
      items: {
        create: body.items.map((item) => ({
          productId: item.product_id,
          variantId: item.variant_id,
          quantity: item.quantity,
          price: item.price,
          name: item.name,
          image: item.image,
        })),
      },
    },
  });

  if (isCod) {
    // COD: create delivery order immediately
    // TODO: call ApiShip createOrder
    return NextResponse.json({
      orderId: order.id,
      orderNumber: order.orderNumber,
      redirectUrl: `/order/${order.id}?status=confirmed`,
    });
  }

  // Online payment: create YooKassa payment
  try {
    const payRes = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/payment/create`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: order.id,
          orderNumber: order.orderNumber,
          total: finalTotal,
          items: body.items.map((i) => ({
            name: i.name,
            price: i.price,
            quantity: i.quantity,
          })),
          deliveryCost,
          customerEmail: body.customer_email,
          customerPhone: body.customer_phone,
          paymentMethod:
            body.payment_method === "cod" ? undefined : body.payment_method,
        }),
      }
    );

    const payData = await payRes.json();

    if (!payRes.ok) {
      return NextResponse.json(
        { error: payData.error || "Payment error" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      orderId: order.id,
      orderNumber: order.orderNumber,
      paymentId: payData.paymentId,
      redirectUrl: payData.confirmationUrl,
    });
  } catch {
    return NextResponse.json(
      { error: "Payment creation failed" },
      { status: 500 }
    );
  }
}
