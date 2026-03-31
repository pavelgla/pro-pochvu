import { NextRequest, NextResponse } from "next/server";
import { createOrder } from "@/lib/apiship";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { provider, tariffId, ...orderData } = body;

  if (!provider || !tariffId) {
    return NextResponse.json({ error: "provider and tariffId required" }, { status: 400 });
  }

  const result = await createOrder(provider, tariffId, orderData);
  return NextResponse.json(result);
}
