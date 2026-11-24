import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";
import { saveLocalInquiry } from "@/lib/server/inquiriesStore";

export async function POST(req: NextRequest) {
  const rateCheck = checkRateLimit(req, 10, 60000);
  if (!rateCheck.allowed) {
    return NextResponse.json(
      { error: "Too many messages sent. Please try again in 1 minute." },
      { status: 429 }
    );
  }

  try {
    const body = await req.json().catch(() => ({}));
    const { name, email, phone, serviceInterested, destination, message } = body;

    if (!name || !email || !phone || !message) {
      return NextResponse.json(
        { error: "Missing required contact form fields." },
        { status: 400 }
      );
    }

    let contactMsg: any = null;

    // 1. Try to persist to MySQL database via Prisma
    try {
      if (prisma && prisma.contactMessage && typeof prisma.contactMessage.create === "function") {
        contactMsg = await prisma.contactMessage.create({
          data: {
            name,
            email,
            phone,
            serviceInterested: serviceInterested || "General Travel Inquiry",
            destination: destination || null,
            message,
            status: "NEW",
          },
        });
        logger.info("New contact message saved in DB", { id: contactMsg.id, name });
      }
    } catch (dbError) {
      logger.warn("Primary database store skipped for contact message, using local backup", dbError);
    }

    // 2. Synchronize to local fail-safe storage so dashboard is immediately updated
    try {
      const backup = saveLocalInquiry({
        id: contactMsg ? contactMsg.id : undefined,
        table: "contact",
        serviceType: serviceInterested || "General Contact Inquiry",
        originalService: serviceInterested || "General Travel Inquiry",
        customerName: name,
        whatsappNumber: phone,
        email,
        message,
        destination: destination || null,
        travelDate: "Flexible",
        notes: message,
        rawPayload: { name, email, phone, serviceInterested, destination, message },
      });
      if (!contactMsg) {
        contactMsg = {
          id: backup.id,
          name,
          email,
          phone,
          serviceInterested: serviceInterested || "General Travel Inquiry",
          destination: destination || null,
          message,
          status: "NEW",
          createdAt: backup.createdAt,
        };
        logger.info("New contact message saved in fail-safe storage", { id: contactMsg.id, name });
      }
    } catch (localErr) {
      logger.warn("Local inquiry sync error:", localErr);
    }

    return NextResponse.json({ success: true, contactMsg }, { status: 200 });
  } catch (error: any) {
    logger.error("Error creating contact message", error);
    return NextResponse.json({ error: error?.message || "Failed to submit contact message." }, { status: 500 });
  }
}
