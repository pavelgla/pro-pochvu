import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  // TODO: update order delivery_status in Supabase
  // TODO: send notification to customer via Telegram/email
  console.log("ApiShip webhook:", JSON.stringify(body));

  return NextResponse.json({ ok: true });
}
