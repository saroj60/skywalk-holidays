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
    const { tripType, fromCity, toCity, departureDate, returnDate, passengers, cabinClass, customerName, whatsappNumber } = body;

    if (!fromCity || !toCity || !departureDate || !customerName || !whatsappNumber) {
      return NextResponse.json(
        { error: "Missing required flight inquiry fields." },
        { status: 400 }
      );
    }

    let inquiry: any = null;

    try {
      if (prisma && prisma.flightInquiry && typeof prisma.flightInquiry.create === "function") {
        inquiry = await prisma.flightInquiry.create({
          data: {
            tripType: tripType || "one-way",
            fromCity,
            toCity,
            departureDate,
            returnDate: returnDate || null,
            passengers: passengers || "1 Adult",
            cabinClass: cabinClass || "Economy",
            customerName,
            whatsappNumber,
            status: "NEW",
          },
        });

        // Sync or create Customer profile
        await prisma.customer.upsert({
          where: { id: whatsappNumber },
          update: { fullName: customerName, phone: whatsappNumber, whatsapp: whatsappNumber },
          create: { id: whatsappNumber, fullName: customerName, phone: whatsappNumber, whatsapp: whatsappNumber },
        }).catch(() => null);

        logger.info("New flight inquiry saved in DB", { id: inquiry.id, customerName });
      }
    } catch (dbError) {
      logger.warn("Primary database store skipped for flight inquiry, using backup", dbError);
    }

    if (!inquiry) {
      const backup = saveLocalInquiry({
        table: "flight",
        serviceType: "Flight Ticket",
        customerName,
        whatsappNumber,
        destination: `${fromCity} → ${toCity}`,
        travelDate: departureDate,
        notes: `Trip: ${tripType || "one-way"}, Class: ${cabinClass || "Economy"}, Passengers: ${passengers || "1 Adult"}${returnDate ? `, Return: ${returnDate}` : ""}`,
        rawPayload: body,
      });
      inquiry = {
        id: backup.id,
        tripType: tripType || "one-way",
        fromCity,
        toCity,
        departureDate,
        returnDate: returnDate || null,
        passengers: passengers || "1 Adult",
        cabinClass: cabinClass || "Economy",
        customerName,
        whatsappNumber,
        status: "NEW",
        createdAt: backup.createdAt,
      };
      logger.info("New flight inquiry saved in fail-safe storage", { id: inquiry.id, customerName });
    }

    return NextResponse.json({ success: true, inquiry }, { status: 200 });
  } catch (error: any) {
    logger.error("Error creating flight inquiry", error);
    return NextResponse.json({ error: error?.message || "Failed to submit flight inquiry." }, { status: 500 });
  }
}
