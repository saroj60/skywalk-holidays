import { NextRequest, NextResponse } from "next/server";
import { getStoredDestinations, saveStoredDestinations } from "@/lib/server/destinationsStore";
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
  return Boolean(hasLoggedCookie || hasToken);
}

export async function GET() {
  const destinations = getStoredDestinations();
  return NextResponse.json({ success: true, destinations });
}

export async function POST(req: NextRequest) {
  if (!checkIsAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  try {
    const body = await req.json();
    if (Array.isArray(body)) {
      saveStoredDestinations(body);
      return NextResponse.json({ success: true, destinations: body });
    }
    const current = getStoredDestinations();
    const updated = [body, ...current.filter((c) => c.id !== body.id)];
    saveStoredDestinations(updated);
    return NextResponse.json({ success: true, destinations: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  return POST(req);
}
