import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { code, subtotal, brands } = body as {
    code: string;
    subtotal: number;
    brands: string[];
  };

  if (!code) {
    return NextResponse.json({ error: "Введите промокод" }, { status: 400 });
  }

  const promo = await prisma.promoCode.findFirst({
    where: { code: { equals: code, mode: "insensitive" }, isActive: true },
  });

  if (!promo) {
    return NextResponse.json({ error: "Промокод не найден" }, { status: 404 });
  }

  // Check dates
  const now = new Date();
  if (promo.validFrom && now < promo.validFrom) {
    return NextResponse.json(
      { error: "Промокод ещё не активен" },
      { status: 400 }
    );
  }
  if (promo.validUntil && now > promo.validUntil) {
    return NextResponse.json(
      { error: "Промокод истёк" },
      { status: 400 }
    );
  }

  // Check uses
  if (promo.usesLimit !== null && promo.usesCount >= promo.usesLimit) {
    return NextResponse.json(
      { error: "Промокод больше не действует" },
      { status: 400 }
    );
  }

  // Check min order
  if (subtotal < promo.minOrderAmount) {
    return NextResponse.json(
      {
        error: `Минимальная сумма заказа для этого промокода — ${promo.minOrderAmount} ₽`,
      },
      { status: 400 }
    );
  }

  // Check applicable brands
  const applicableBrands = promo.applicableBrands as string[] | null;
  if (
    applicableBrands &&
    applicableBrands.length > 0 &&
    !brands.some((b) => applicableBrands.includes(b))
  ) {
    return NextResponse.json(
      { error: "Промокод не применим к товарам в корзине" },
      { status: 400 }
    );
  }

  // Calculate discount
  let discount_amount = 0;
  if (promo.discountType === "percent") {
    discount_amount = Math.round(subtotal * (promo.discountValue / 100));
  } else {
    discount_amount = Math.min(promo.discountValue, subtotal);
  }

  return NextResponse.json({
    code: promo.code,
    discount_type: promo.discountType,
    discount_value: promo.discountValue,
    discount_amount,
  });
}
