import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const acceptHeader = request.headers.get("accept") || "";

  // Skip static assets, internal Next.js paths, admin, and APIs
  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/admin/") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Agent requests markdown representation
  if (
    acceptHeader.includes("text/markdown") ||
    acceptHeader.includes("text/x-markdown") ||
    request.nextUrl.searchParams.get("format") === "markdown"
  ) {
    const rewriteUrl = new URL("/api/markdown", request.url);
    rewriteUrl.searchParams.set("path", pathname);
    return NextResponse.rewrite(rewriteUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
