/**
 * Admin endpoint: submit all known URLs (static pages + product lines + products)
 * to IndexNow. Used for initial warm-up after launch or after bulk catalog updates.
 *
 * Auth: admin role via NextAuth, OR shared secret via X-Admin-Token header
 * (the latter for cron/CLI usage where session isn't available).
 */

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getAllProductSlugs, getProductLines } from "@/lib/catalog";
import { SHOW_TSVETOLOGIYA } from "@/lib/constants";
import { pingIndexNowBulk, indexNowConfig } from "@/lib/indexnow";

export const dynamic = "force-dynamic";

const STATIC_PATHS = [
  "/",
  "/catalog",
  "/about",
  "/contacts",
  "/delivery",
  "/returns",
  "/blog",
  "/knowledge-base",
  "/knowledge-base/video",
];

async function isAuthorized(req: Request): Promise<boolean> {
  // 1. Shared secret for CLI/cron
  const adminToken = process.env.ADMIN_API_TOKEN;
  const headerToken = req.headers.get("x-admin-token");
  if (adminToken && headerToken === adminToken) return true;

  // 2. NextAuth session with admin role
  const session = await getServerSession(authOptions);
  return session?.user?.role === "admin";
}

export async function POST(req: Request) {
  if (!(await isAuthorized(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.INDEXNOW_KEY) {
    return NextResponse.json(
      { error: "INDEXNOW_KEY is not configured" },
      { status: 500 }
    );
  }

  const [productLines, slugs] = await Promise.all([
    getProductLines(),
    getAllProductSlugs(),
  ]);

  const productLinePaths = productLines
    .filter((pl) => SHOW_TSVETOLOGIYA || pl.brand !== "tsvetologiya")
    .map((pl) => `/catalog/${pl.slug}`);

  const productPaths = slugs.map((slug) => `/product/${slug}`);

  const allUrls = [...STATIC_PATHS, ...productLinePaths, ...productPaths].map(
    (p) => `${indexNowConfig.SITE_URL}${p}`
  );

  const results = await pingIndexNowBulk(allUrls);

  const totalSubmitted = results.reduce((sum, r) => sum + r.submitted, 0);
  const allOk = results.every((r) => r.ok);

  return NextResponse.json(
    {
      ok: allOk,
      total: allUrls.length,
      submitted: totalSubmitted,
      batches: results,
    },
    { status: allOk ? 200 : 502 }
  );
}
