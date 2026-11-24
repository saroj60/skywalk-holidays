import { NextRequest, NextResponse } from "next/server";
import { HOMEPAGE_MARKDOWN, CONTACT_MARKDOWN } from "@/lib/markdownContent";

export function GET(request: NextRequest) {
  const path = request.nextUrl.searchParams.get("path") || "/";

  let content = HOMEPAGE_MARKDOWN;
  if (path === "/contact") {
    content = CONTACT_MARKDOWN;
  }

  return new NextResponse(content, {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Vary": "Accept",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
