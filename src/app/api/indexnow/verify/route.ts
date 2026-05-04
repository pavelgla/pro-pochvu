/**
 * IndexNow ownership verification endpoint.
 * IndexNow expects a file at https://pro-pochvu.ru/{KEY}.txt containing
 * just the key. Middleware rewrites that URL here so the key stays in env
 * and isn't committed to /public.
 */

export const dynamic = "force-dynamic";

export async function GET() {
  const key = process.env.INDEXNOW_KEY;

  if (!key) {
    return new Response("Not configured", { status: 404 });
  }

  return new Response(key, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
