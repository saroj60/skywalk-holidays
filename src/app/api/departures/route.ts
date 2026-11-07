import { NextRequest, NextResponse } from "next/server";
import { getAdminUserFromRequest } from "@/lib/auth";
import { getStoredDepartures, saveStoredDeparture } from "@/lib/departuresData";

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

export async function GET(req: NextRequest) {
  try {
    const departures = getStoredDepartures();
    return NextResponse.json({ success: true, departures });
  } catch (error) {
    return NextResponse.json({ success: true, departures: [] });
  }
}

export async function POST(req: NextRequest) {
  if (!checkIsAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const departure = saveStoredDeparture(body);
    return NextResponse.json({ success: true, departure }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to schedule departure: " + error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  return POST(req);
}
