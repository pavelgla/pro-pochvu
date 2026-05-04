import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // IndexNow ownership verification: serve key from /{KEY}.txt
    // by rewriting to the API route (so the key stays in env, not in /public).
    const indexNowKey = process.env.INDEXNOW_KEY;
    if (indexNowKey && pathname === `/${indexNowKey}.txt`) {
      return NextResponse.rewrite(new URL("/api/indexnow/verify", req.url));
    }

    if (pathname.startsWith("/admin") && token?.role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // IndexNow key file is public — bypass auth.
        const indexNowKey = process.env.INDEXNOW_KEY;
        if (indexNowKey && pathname === `/${indexNowKey}.txt`) {
          return true;
        }

        if (pathname.startsWith("/account") || pathname.startsWith("/admin")) {
          return !!token;
        }
        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    "/account/:path*",
    "/admin/:path*",
    // Match /:filename.txt (catches IndexNow key file and /robots.txt;
    // robots.txt falls through unchanged via NextResponse.next()).
    "/:filename.txt",
  ],
};
