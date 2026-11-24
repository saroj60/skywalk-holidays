import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";
import { saveLocalInquiry } from "@/lib/server/inquiriesStore";

export async function POST(req: NextRequest) {
  const rateCheck = checkRateLimit(req, 10, 60000);
  if (!rateCheck.allowed) {
    return NextResponse.json(
      { error: "Too many inquiry requests. Please try again in 1 minute." },
      { status: 429 }
    );
  }

  try {
    const body = await req.json().catch(() => ({}));
    const { packageId, packageName, destination, travelDate, travelers, customerName, whatsappNumber, specialRequirements } = body;

    if (!packageName || !destination || !travelDate || !customerName || !whatsappNumber) {
      return NextResponse.json(
        { error: "Missing required package inquiry fields." },
        { status: 400 }
      );
    }

    let inquiry: any = null;

    try {
      if (prisma && prisma.holidayPackageInquiry && typeof prisma.holidayPackageInquiry.create === "function") {
        inquiry = await prisma.holidayPackageInquiry.create({
          data: {
            packageId: packageId ? Number(packageId) : null,
            packageName,
            destination,
            travelDate,
            travelers: travelers || "2 Travelers",
            customerName,
            whatsappNumber,
            specialRequirements: specialRequirements || null,
            status: "NEW",
          },
        });
        logger.info("New package inquiry saved in DB", { id: inquiry.id, customerName });
      }
    } catch (dbError) {
      logger.warn("Primary database store skipped for package inquiry, using backup", dbError);
    }

    if (!inquiry) {
      const backup = saveLocalInquiry({
        table: "package",
        serviceType: "Holiday Package",
        customerName,
        whatsappNumber,
        destination,
        travelDate,
        notes: `Package: ${packageName}, Travelers: ${travelers || "2 Travelers"}${specialRequirements ? `\nNotes: ${specialRequirements}` : ""}`,
        rawPayload: body,
      });
      inquiry = {
        id: backup.id,
        packageId: packageId ? Number(packageId) : null,
        packageName,
        destination,
        travelDate,
        travelers: travelers || "2 Travelers",
        customerName,
        whatsappNumber,
        specialRequirements: specialRequirements || null,
        status: "NEW",
        createdAt: backup.createdAt,
      };
      logger.info("New package inquiry saved in fail-safe storage", { id: inquiry.id, customerName });
    }

    return NextResponse.json({ success: true, inquiry }, { status: 200 });
  } catch (error: any) {
    logger.error("Error creating package inquiry", error);
    return NextResponse.json({ error: error?.message || "Failed to submit package inquiry." }, { status: 500 });
  }
}
