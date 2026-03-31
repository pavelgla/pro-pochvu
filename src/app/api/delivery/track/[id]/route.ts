import { NextRequest, NextResponse } from "next/server";
import { trackOrder } from "@/lib/apiship";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const result = await trackOrder(params.id);
  return NextResponse.json(result);
}
