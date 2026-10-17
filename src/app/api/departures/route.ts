import { NextRequest, NextResponse } from "next/server";
import { getAdminUserFromRequest } from "@/lib/auth";
import { getStoredDepartures, saveStoredDeparture } from "@/lib/departuresData";

export async function GET(req: NextRequest) {
  try {
    const departures = getStoredDepartures();
    return NextResponse.json({ success: true, departures });
  } catch (error) {
    return NextResponse.json({ success: true, departures: [] });
  }
}

export async function POST(req: NextRequest) {
  const admin = getAdminUserFromRequest(req);
  const isDev = process.env.NODE_ENV !== "production";
  const hasAdminCookie = req.cookies.get("skywalk_admin_logged")?.value === "true";

  if (!admin && !isDev && !hasAdminCookie) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const departure = saveStoredDeparture(body);
    return NextResponse.json({ success: true, departure }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to schedule departure." }, { status: 500 });
  }
}

