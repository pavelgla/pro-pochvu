import { NextResponse, type NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Check for Supabase auth cookies
  const hasSession = req.cookies.getAll().some(
    (c) => c.name.startsWith("sb-") && c.name.endsWith("-auth-token")
  );

  // Protected routes: /account/*
  if (pathname.startsWith("/account")) {
    if (!hasSession) {
      const loginUrl = new URL("/auth/login", req.url);
      loginUrl.searchParams.set("return", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Admin routes: /admin/*
  if (pathname.startsWith("/admin")) {
    if (!hasSession) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
    // Role check happens in admin layout (server-side via Supabase)
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/account/:path*", "/admin/:path*"],
};
