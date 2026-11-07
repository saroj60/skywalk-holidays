import { NextRequest, NextResponse } from "next/server";
import { getAllPackages, saveOrUpdatePackage } from "@/lib/server/packagesDataStore";
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

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");

    let packages = await getAllPackages();

    if (category && category !== "All" && category !== "ALL") {
      packages = packages.filter(
        (p) => p.category?.toLowerCase() === category.toLowerCase()
      );
    }

    if (featured === "true") {
      packages = packages.filter((p) => p.featured);
    }

    return NextResponse.json({ success: true, packages });
  } catch (error: any) {
    console.error("GET /api/packages error:", error);
    return NextResponse.json({ success: true, packages: [] });
  }
}

export async function POST(req: NextRequest) {
  if (!checkIsAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  try {
    const body = await req.json();
    if (!body.title || !body.destination || body.price === undefined) {
      return NextResponse.json(
        { error: "Title, destination, and price are required." },
        { status: 400 }
      );
    }

    const saved = await saveOrUpdatePackage(body);
    return NextResponse.json({ success: true, package: saved }, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/packages error:", error);
    return NextResponse.json(
      { error: "Failed to save holiday package: " + error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  return POST(req);
}

export async function PATCH(req: NextRequest) {
  return POST(req);
}
