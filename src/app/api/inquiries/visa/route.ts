import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";
import { saveLocalInquiry } from "@/lib/server/inquiriesStore";

export async function POST(req: NextRequest) {
  const rateCheck = checkRateLimit(req, 10, 60000);
  if (!rateCheck.allowed) {
    return NextResponse.json(
      { error: "Too many application requests. Please try again in 1 minute." },
      { status: 429 }
    );
  }

  try {
    const body = await req.json().catch(() => ({}));
    const { fullName, nationality, destinationCountry, visaType, travelPurpose, whatsappNumber, email } = body;

    if (!fullName || !destinationCountry || !visaType || !whatsappNumber) {
      return NextResponse.json(
        { error: "Missing required visa application fields." },
        { status: 400 }
      );
    }

    let application: any = null;

    try {
      if (prisma && prisma.visaApplication && typeof prisma.visaApplication.create === "function") {
        application = await prisma.visaApplication.create({
          data: {
            fullName,
            nationality: nationality || "Nepalese",
            destinationCountry,
            visaType,
            travelPurpose: travelPurpose || "Tourism",
            whatsappNumber,
            email: email || "",
            status: "NEW",
          },
        });
        logger.info("New visa application saved in DB", { id: application.id, fullName });
      }
    } catch (dbError) {
      logger.warn("Primary database store skipped for visa application, using backup", dbError);
    }

    if (!application) {
      const backup = saveLocalInquiry({
        table: "visa",
        serviceType: "Visa Assistance",
        customerName: fullName,
        whatsappNumber,
        destination: destinationCountry,
        travelDate: null,
        notes: `Type: ${visaType}, Nationality: ${nationality || "Nepalese"}, Purpose: ${travelPurpose || "Tourism"}${email ? `\nEmail: ${email}` : ""}`,
        rawPayload: body,
      });
      application = {
        id: backup.id,
        fullName,
        nationality: nationality || "Nepalese",
        destinationCountry,
        visaType,
        travelPurpose: travelPurpose || "Tourism",
        whatsappNumber,
        email: email || "",
        status: "NEW",
        createdAt: backup.createdAt,
      };
      logger.info("New visa application saved in fail-safe storage", { id: application.id, fullName });
    }

    return NextResponse.json({ success: true, application }, { status: 200 });
  } catch (error: any) {
    logger.error("Error creating visa application", error);
    return NextResponse.json({ error: error?.message || "Failed to submit visa application." }, { status: 500 });
  }
}
