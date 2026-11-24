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

export async function GET() {
  try {
    const photos = await getSiteDataFromDb<any[]>("gallery");
    return NextResponse.json(
      { success: true, photos: Array.isArray(photos) ? photos : null },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );
  } catch (err) {
    return NextResponse.json({ success: true, photos: null });
  }
}

export async function POST(req: NextRequest) {
  if (!checkIsAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const photos = Array.isArray(body) ? body : body.photos;
    if (!Array.isArray(photos)) {
      return NextResponse.json({ error: "Invalid gallery payload." }, { status: 400 });
    }
    await saveSiteDataToDb("gallery", photos);
    return NextResponse.json({ success: true, photos });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to save gallery." }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  return POST(req);
}
