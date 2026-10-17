import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

export async function POST(req: NextRequest) {
  const rateCheck = checkRateLimit(req, 10, 60000);
  if (!rateCheck.allowed) {
    return NextResponse.json(
      { error: "Too many inquiry requests. Please try again in 1 minute." },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const { packageId, packageName, destination, travelDate, travelers, customerName, whatsappNumber, specialRequirements } = body;

    if (!packageName || !destination || !travelDate || !customerName || !whatsappNumber) {
      return NextResponse.json(
        { error: "Missing required package inquiry fields." },
        { status: 400 }
      );
    }

    let inquiry = null;
    try {
      if (prisma?.holidayPackageInquiry?.create) {
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
        logger.info("New package inquiry saved", { id: inquiry.id, customerName });
      }
    } catch (dbError) {
      logger.warn("Database storage skipped for package inquiry", dbError);
    }

    return NextResponse.json({ success: true, inquiry }, { status: 200 });
  } catch (error) {
    logger.error("Error creating package inquiry", error);
    return NextResponse.json({ success: true, message: "Inquiry processed" }, { status: 200 });
  }
}
