import { NextRequest, NextResponse } from "next/server";
import { getAdminUserFromRequest } from "@/lib/auth";
import { getSiteDataFromDb, saveSiteDataToDb } from "@/lib/server/siteDataStore";

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
  if (!checkIsAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }
  const staff = await getSiteDataFromDb<any[]>("staff-accounts");
  return NextResponse.json({ success: true, staff: Array.isArray(staff) ? staff : null });
}

export async function POST(req: NextRequest) {
  if (!checkIsAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const staff = Array.isArray(body) ? body : body.staff;
    if (!Array.isArray(staff)) {
      return NextResponse.json({ error: "Invalid staff payload." }, { status: 400 });
    }
    await saveSiteDataToDb("staff-accounts", staff);
    return NextResponse.json({ success: true, staff });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to save staff." }, { status: 500 });
  }
}
