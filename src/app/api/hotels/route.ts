import { NextRequest, NextResponse } from "next/server";
import { getStoredHotels, saveStoredHotel } from "@/lib/server/hotelsStore";
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
  const hotels = getStoredHotels();
  return NextResponse.json({ hotels });
}

export async function POST(req: NextRequest) {
  if (!checkIsAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const saved = saveStoredHotel(body);
    return NextResponse.json({ success: true, hotel: saved }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to save hotel record: " + err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  return POST(req);
}
