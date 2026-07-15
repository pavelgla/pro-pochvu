import { getServerSession } from "next-auth";
import type { Session } from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * Role guard for /api/admin/* routes. Pages under /admin are already gated by
 * middleware, but API routes are outside its matcher — every admin route MUST
 * call this and return 403 on null.
 */
export async function requireAdmin(): Promise<Session | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "admin") return null;
  return session;
}
