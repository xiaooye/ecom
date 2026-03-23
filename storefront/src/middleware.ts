import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedPaths = ["/account"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if accessing a protected route
  const isProtected = protectedPaths.some((path) =>
    pathname.startsWith(path)
  );

  if (isProtected) {
    // Check for Medusa session cookie
    const hasSession =
      request.cookies.has("connect.sid") ||
      request.cookies.has("_medusa_jwt");

    if (!hasSession) {
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/account/:path*"],
};
