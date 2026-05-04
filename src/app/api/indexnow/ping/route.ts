/**
 * Point ping endpoint: submit 1..N URLs to IndexNow.
 * Used by admin tooling, webhooks, or manual reindex from product/blog edit screens.
 *
 * Body: { urls: string[] }
 * Auth: admin role via NextAuth, OR X-Admin-Token header.
 */

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { pingIndexNow } from "@/lib/indexnow";

export const dynamic = "force-dynamic";

const Body = z.object({
  urls: z.array(z.string().url()).min(1).max(10000),
});

async function isAuthorized(req: Request): Promise<boolean> {
  const adminToken = process.env.ADMIN_API_TOKEN;
  const headerToken = req.headers.get("x-admin-token");
  if (adminToken && headerToken === adminToken) return true;

  const session = await getServerSession(authOptions);
  return session?.user?.role === "admin";
}

export async function POST(req: Request) {
  if (!(await isAuthorized(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let parsed;
  try {
    parsed = Body.parse(await req.json());
  } catch (err) {
    return NextResponse.json(
      {
        error: "Invalid body",
        details: err instanceof Error ? err.message : String(err),
      },
      { status: 400 }
    );
  }

  const result = await pingIndexNow(parsed.urls);

  return NextResponse.json(result, { status: result.ok ? 200 : 502 });
}
