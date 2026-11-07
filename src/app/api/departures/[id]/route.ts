import { NextRequest, NextResponse } from "next/server";
import { getAdminUserFromRequest } from "@/lib/auth";
import { getDepartureById, saveStoredDeparture, deleteStoredDeparture } from "@/lib/departuresData";

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

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const dep = await getDepartureById(id);
    if (!dep) {
      return NextResponse.json({ error: "Departure not found." }, { status: 404 });
    }
    return NextResponse.json({ success: true, departure: dep });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!checkIsAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();
    const updated = saveStoredDeparture({ ...body, id });
    return NextResponse.json({ success: true, departure: updated });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to update departure: " + error.message }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return PATCH(req, { params });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!checkIsAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  try {
    const { id } = await params;
    const success = deleteStoredDeparture(id);
    return NextResponse.json({ success, message: "Departure deleted." });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to delete departure: " + error.message }, { status: 500 });
  }
}
