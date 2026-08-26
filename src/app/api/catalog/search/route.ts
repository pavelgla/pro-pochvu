import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { SHOW_TSVETOLOGIYA } from "@/lib/constants";
import {
  parseBotSearchParams,
  buildBotCatalogWhere,
  serializeBotProduct,
  botSearchStems,
  rankBotResults,
} from "@/lib/bot-catalog";

export const dynamic = "force-dynamic";

// Live catalog for the site assistant (bot tool `search_catalog`).
// Read-only, but not public: an open price feed of the whole catalog is not
// something we need to hand out, so the caller proves itself with a shared secret.
export async function GET(req: NextRequest) {
  const expected = process.env.BOT_API_SECRET;
  if (!expected || req.headers.get("x-bot-secret") !== expected) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const params = parseBotSearchParams(req.nextUrl.searchParams);
  const where = buildBotCatalogWhere(params, SHOW_TSVETOLOGIYA);

  try {
    const [total, products] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        // The whole catalogue is small, so matches are ranked here rather than in SQL:
        // relevance by name first, popularity second (see rankBotResults).
        take: 50,
        orderBy: [{ reviewsCount: "desc" }, { rating: "desc" }],
        select: {
          name: true,
          slug: true,
          price: true,
          oldPrice: true,
          stock: true,
          rating: true,
          reviewsCount: true,
          weightGrams: true,
          productLine: { select: { name: true, slug: true, brand: true } },
        },
      }),
    ]);

    const results = rankBotResults(products, botSearchStems(params.q))
      .slice(0, params.limit)
      .map(serializeBotProduct);
    return NextResponse.json({ count: total, returned: results.length, results });
  } catch (error) {
    console.error("[api/catalog/search] catalog unavailable:", error);
    // The assistant is told to admit it cannot see stock rather than invent a price.
    return NextResponse.json({ error: "catalog unavailable" }, { status: 503 });
  }
}
