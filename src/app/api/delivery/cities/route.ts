import { NextRequest, NextResponse } from "next/server";
import { getCities } from "@/lib/apiship";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") || "";

  if (q.length < 2) {
    return NextResponse.json({ cities: [] });
  }

  const cities = await getCities(q);
  return NextResponse.json({ cities });
}
