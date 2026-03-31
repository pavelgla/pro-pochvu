import { NextRequest, NextResponse } from "next/server";

// Mock promo codes (replace with Supabase query)
const promoCodes = [
  {
    code: "WELCOME10",
    discount_type: "percent" as const,
    discount_value: 10,
    min_order_amount: 500,
    valid_from: "2024-01-01",
    valid_until: null as string | null,
    uses_limit: null as number | null,
    uses_count: 0,
    applicable_brands: null as string[] | null,
    is_active: true,
  },
];

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

  const promo = promoCodes.find(
    (p) => p.code.toUpperCase() === code.toUpperCase()
  );

  if (!promo || !promo.is_active) {
    return NextResponse.json({ error: "Промокод не найден" }, { status: 404 });
  }

  // Check dates
  const now = new Date().toISOString().split("T")[0];
  if (promo.valid_from && now < promo.valid_from) {
    return NextResponse.json(
      { error: "Промокод ещё не активен" },
      { status: 400 }
    );
  }
  if (promo.valid_until && now > promo.valid_until) {
    return NextResponse.json(
      { error: "Промокод истёк" },
      { status: 400 }
    );
  }

  // Check uses
  if (promo.uses_limit !== null && promo.uses_count >= promo.uses_limit) {
    return NextResponse.json(
      { error: "Промокод больше не действует" },
      { status: 400 }
    );
  }

  // Check min order
  if (subtotal < promo.min_order_amount) {
    return NextResponse.json(
      {
        error: `Минимальная сумма заказа для этого промокода — ${promo.min_order_amount} ₽`,
      },
      { status: 400 }
    );
  }

  // Check applicable brands
  if (
    promo.applicable_brands &&
    promo.applicable_brands.length > 0 &&
    !brands.some((b) => promo.applicable_brands!.includes(b))
  ) {
    return NextResponse.json(
      { error: "Промокод не применим к товарам в корзине" },
      { status: 400 }
    );
  }

  // Calculate discount
  let discount_amount = 0;
  if (promo.discount_type === "percent") {
    discount_amount = Math.round(subtotal * (promo.discount_value / 100));
  } else {
    discount_amount = Math.min(promo.discount_value, subtotal);
  }

  return NextResponse.json({
    code: promo.code,
    discount_type: promo.discount_type,
    discount_value: promo.discount_value,
    discount_amount,
  });
}
