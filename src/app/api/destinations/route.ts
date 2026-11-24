import { NextRequest, NextResponse } from "next/server";
import { getStoredDestinationsAsync, saveStoredDestinationsAsync } from "@/lib/server/destinationsStore";
import { getAdminUserFromRequest } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function checkIsAdmin(req: NextRequest) {
  const admin = getAdminUserFromRequest(req);
  if (admin) return true;
  const isDev = process.env.NODE_ENV !== "production";
  if (isDev) return true;
  const hasLoggedCookie = req.cookies.get("skywalk_admin_logged")?.value === "true";
  const hasToken = req.cookies.get("skywalk_admin_token")?.value;
  const hasAdminHeader = req.headers.get("x-skywalk-admin") === "true";
  const authHeader = req.headers.get("authorization");
  return Boolean(hasLoggedCookie || hasToken || hasAdminHeader || authHeader);
}

export async function GET() {
  const destinations = await getStoredDestinationsAsync();
  return NextResponse.json(
    { success: true, destinations },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "CDN-Cache-Control": "no-store",
        "Surrogate-Control": "no-store",
      },
    }
  );
}

export async function POST(req: NextRequest) {
  if (!checkIsAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  try {
    const body = await req.json();
    if (Array.isArray(body)) {
      await saveStoredDestinationsAsync(body);
      return NextResponse.json({ success: true, destinations: body });
    }
    const current = await getStoredDestinationsAsync();
    const updated = [body, ...current.filter((c) => c.id !== body.id)];
    await saveStoredDestinationsAsync(updated);
    return NextResponse.json({ success: true, destinations: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  return POST(req);
}
