import { createServerClient as createSSRServerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export function createServerClient() {
  const cookieStore = cookies();
  return createSSRServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key",
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // setAll can be called from Server Components where
            // cookies can't be set — this is expected and safe to ignore.
          }
        },
      },
    }
  );
}
