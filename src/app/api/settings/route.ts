import { NextRequest, NextResponse } from "next/server";
import { getStoredSettings, saveStoredSettings } from "@/lib/server/settingsStore";
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
  const settings = getStoredSettings();
  return NextResponse.json({ success: true, settings });
}

export async function POST(req: NextRequest) {
  if (!checkIsAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const saved = saveStoredSettings(body);
    return NextResponse.json({ success: true, settings: saved });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  return POST(req);
}
