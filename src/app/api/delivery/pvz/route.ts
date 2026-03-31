import { NextRequest, NextResponse } from "next/server";
import { getPickupPoints } from "@/lib/apiship";

export async function POST(req: NextRequest) {
  const { cityId, providers } = await req.json();

  if (!cityId) {
    return NextResponse.json({ error: "cityId required" }, { status: 400 });
  }

  const points = await getPickupPoints(cityId, providers);
  return NextResponse.json({ points });
}
