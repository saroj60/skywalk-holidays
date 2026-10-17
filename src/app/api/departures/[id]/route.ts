import { NextRequest, NextResponse } from "next/server";
import { getAdminUserFromRequest } from "@/lib/auth";
import { saveStoredDeparture, deleteStoredDeparture } from "@/lib/departuresData";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = getAdminUserFromRequest(req);
  const isDev = process.env.NODE_ENV !== "production";
  const hasAdminCookie = req.cookies.get("skywalk_admin_logged")?.value === "true";

  if (!admin && !isDev && !hasAdminCookie) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();
    const updated = saveStoredDeparture({ ...body, id });

    return NextResponse.json({ success: true, departure: updated });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update departure." }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = getAdminUserFromRequest(req);
  const isDev = process.env.NODE_ENV !== "production";
  const hasAdminCookie = req.cookies.get("skywalk_admin_logged")?.value === "true";

  if (!admin && !isDev && !hasAdminCookie) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  try {
    const { id } = await params;
    const success = deleteStoredDeparture(id);

    return NextResponse.json({ success, message: "Departure deleted." });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete departure." }, { status: 500 });
  }
}

