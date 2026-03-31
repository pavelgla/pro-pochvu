import { NextRequest, NextResponse } from "next/server";
import { calculateAll } from "@/lib/apiship";

export async function POST(req: NextRequest) {
  const { cityId, weightGrams, length, width, height } = await req.json();

  if (!cityId || !weightGrams) {
    return NextResponse.json({ error: "cityId and weightGrams required" }, { status: 400 });
  }

  const options = await calculateAll(cityId, weightGrams, length, width, height);
  return NextResponse.json({ options });
}
