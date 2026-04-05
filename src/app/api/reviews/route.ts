import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get("productId");
  const offset = parseInt(searchParams.get("offset") ?? "0");
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "20"), 50);
  const sort = searchParams.get("sort") ?? "newest";

  if (!productId) {
    return NextResponse.json({ error: "Missing productId" }, { status: 400 });
  }

  const orderBy =
    sort === "rating"
      ? [{ rating: "desc" as const }, { createdAt: "desc" as const }]
      : [{ createdAt: "desc" as const }];

  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where: { productId, isVisible: true },
      orderBy,
      skip: offset,
      take: limit,
    }),
    prisma.review.count({ where: { productId, isVisible: true } }),
  ]);

  return NextResponse.json({
    reviews,
    total,
    hasMore: offset + reviews.length < total,
  });
}
