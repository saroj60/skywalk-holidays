import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminUserFromRequest } from "@/lib/auth";
import { updateLocalInquiry, deleteLocalInquiry } from "@/lib/server/inquiriesStore";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = getAdminUserFromRequest(req);
  const isDev = process.env.NODE_ENV !== "production";
  if (!admin && !isDev) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  const { id } = await params;

  try {
    const { table, status, assignedStaff, notes } = await req.json();

    const updateData: any = {};
    if (status) updateData.status = status;
    if (assignedStaff !== undefined) updateData.assignedStaff = assignedStaff;
    if (notes !== undefined) updateData.notes = notes;

    let updatedRecord: any = null;

    try {
      if (table === "flight" && prisma.flightInquiry) {
        updatedRecord = await prisma.flightInquiry.update({ where: { id }, data: updateData });
      } else if (table === "hotel" && prisma.hotelInquiry) {
        updatedRecord = await prisma.hotelInquiry.update({ where: { id }, data: updateData });
      } else if (table === "package" && prisma.holidayPackageInquiry) {
        updatedRecord = await prisma.holidayPackageInquiry.update({ where: { id }, data: updateData });
      } else if (table === "visa" && prisma.visaApplication) {
        updatedRecord = await prisma.visaApplication.update({ where: { id }, data: updateData });
      } else if (table === "bus" && prisma.busInquiry) {
        updatedRecord = await prisma.busInquiry.update({ where: { id }, data: updateData });
      } else if (table === "contact" && prisma.contactMessage) {
        updatedRecord = await prisma.contactMessage.update({ where: { id }, data: updateData });
      }
    } catch (e) {
      // Ignored if table not in SQLite or database unavailable
    }

    // Also update local backup if applicable
    updateLocalInquiry(id, updateData);

    if (!updatedRecord) {
      updatedRecord = { id, ...updateData };
    }

    return NextResponse.json({ success: true, updatedRecord });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update lead record." }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = getAdminUserFromRequest(req);
  const isDev = process.env.NODE_ENV !== "production";
  if (!admin && !isDev) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  const { id } = await params;

  try {
    const { searchParams } = new URL(req.url);
    const table = searchParams.get("table");

    try {
      if (table === "flight" && prisma.flightInquiry) {
        await prisma.flightInquiry.delete({ where: { id } });
      } else if (table === "hotel" && prisma.hotelInquiry) {
        await prisma.hotelInquiry.delete({ where: { id } });
      } else if (table === "package" && prisma.holidayPackageInquiry) {
        await prisma.holidayPackageInquiry.delete({ where: { id } });
      } else if (table === "visa" && prisma.visaApplication) {
        await prisma.visaApplication.delete({ where: { id } });
      } else if (table === "bus" && prisma.busInquiry) {
        await prisma.busInquiry.delete({ where: { id } });
      } else if (table === "contact" && prisma.contactMessage) {
        await prisma.contactMessage.delete({ where: { id } });
      }
    } catch (e) {
      // Ignored if table not in SQLite or mock lead
    }

    deleteLocalInquiry(id);

    return NextResponse.json({ success: true, message: `Lead ${id} deleted.` });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete lead record." }, { status: 500 });
  }
}
