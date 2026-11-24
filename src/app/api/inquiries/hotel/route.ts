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
    const { destination, checkIn, checkOut, guests, rooms, customerName, whatsappNumber } = body;

    if (!destination || !checkIn || !customerName || !whatsappNumber) {
      return NextResponse.json(
        { error: "Missing required hotel inquiry fields." },
        { status: 400 }
      );
    }

    let inquiry: any = null;

    try {
      if (prisma && prisma.hotelInquiry && typeof prisma.hotelInquiry.create === "function") {
        inquiry = await prisma.hotelInquiry.create({
          data: {
            destination,
            checkIn,
            checkOut: checkOut || null,
            guests: guests || "2 Guests",
            rooms: rooms || "1 Room",
            customerName,
            whatsappNumber,
            status: "NEW",
          },
        });
        logger.info("New hotel inquiry saved in DB", { id: inquiry.id, customerName });
      }
    } catch (dbError) {
      logger.warn("Primary database store skipped for hotel inquiry, using backup", dbError);
    }

    if (!inquiry) {
      const backup = saveLocalInquiry({
        table: "hotel",
        serviceType: "Hotel Booking",
        customerName,
        whatsappNumber,
        destination,
        travelDate: checkIn,
        notes: `Guests: ${guests || "2 Guests"}, Rooms: ${rooms || "1 Room"}${checkOut ? `, Check-out: ${checkOut}` : ""}`,
        rawPayload: body,
      });
      inquiry = {
        id: backup.id,
        destination,
        checkIn,
        checkOut: checkOut || null,
        guests: guests || "2 Guests",
        rooms: rooms || "1 Room",
        customerName,
        whatsappNumber,
        status: "NEW",
        createdAt: backup.createdAt,
      };
      logger.info("New hotel inquiry saved in fail-safe storage", { id: inquiry.id, customerName });
    }

    return NextResponse.json({ success: true, inquiry }, { status: 200 });
  } catch (error: any) {
    logger.error("Error creating hotel inquiry", error);
    return NextResponse.json({ error: error?.message || "Failed to submit hotel inquiry." }, { status: 500 });
  }
}
