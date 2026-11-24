import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminUserFromRequest } from "@/lib/auth";
import { getLocalInquiries, saveLocalInquiry } from "@/lib/server/inquiriesStore";

export async function GET(req: NextRequest) {
  const admin = getAdminUserFromRequest(req);
  // Allow if admin or local development mode
  const isDev = process.env.NODE_ENV !== "production";
  if (!admin && !isDev) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  let leads: any[] = [];

  try {
    const flights = await prisma.flightInquiry?.findMany().catch(() => []) || [];
    const hotels = await prisma.hotelInquiry?.findMany().catch(() => []) || [];
    const packages = await prisma.holidayPackageInquiry?.findMany().catch(() => []) || [];
    const visas = await prisma.visaApplication?.findMany().catch(() => []) || [];
    const buses = await prisma.busInquiry?.findMany().catch(() => []) || [];
    const contacts = await prisma.contactMessage?.findMany().catch(() => []) || [];

    // Map all inquiries to unified CRM lead format
    leads = [
      ...flights.map((f: any) => ({
        id: `FL-${f.id.slice(0, 6)}`,
        rawId: f.id,
        table: "flight",
        customerName: f.customerName,
        serviceType: "Flight Ticket",
        destination: `${f.fromCity} → ${f.toCity}`,
        travelDate: f.departureDate,
        whatsappNumber: f.whatsappNumber,
        status: f.status,
        createdDate: f.createdAt ? f.createdAt.toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
        assignedStaff: f.assignedStaff || "Unassigned",
        notes: f.notes || "Trip: " + f.tripType + ", Class: " + f.cabinClass,
      })),
      ...hotels.map((h: any) => ({
        id: `HT-${h.id.slice(0, 6)}`,
        rawId: h.id,
        table: "hotel",
        customerName: h.customerName,
        serviceType: "Hotel Booking",
        destination: h.destination,
        travelDate: h.checkIn,
        whatsappNumber: h.whatsappNumber,
        status: h.status,
        createdDate: h.createdAt ? h.createdAt.toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
        assignedStaff: h.assignedStaff || "Unassigned",
        notes: h.notes || "Guests: " + h.guests + ", Rooms: " + h.rooms,
      })),
      ...packages.map((p: any) => ({
        id: `PKG-${p.id.slice(0, 6)}`,
        rawId: p.id,
        table: "package",
        customerName: p.customerName,
        serviceType: "Holiday Package",
        destination: p.destination,
        travelDate: p.travelDate,
        whatsappNumber: p.whatsappNumber,
        status: p.status,
        createdDate: p.createdAt ? p.createdAt.toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
        assignedStaff: p.assignedStaff || "Unassigned",
        notes: p.notes || "Package: " + p.packageName,
      })),
      ...visas.map((v: any) => ({
        id: `VISA-${v.id.slice(0, 6)}`,
        rawId: v.id,
        table: "visa",
        customerName: v.fullName,
        serviceType: "Visa Assistance",
        destination: v.destinationCountry,
        travelDate: v.travelPurpose,
        whatsappNumber: v.whatsappNumber,
        status: v.status,
        createdDate: v.createdAt ? v.createdAt.toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
        assignedStaff: v.assignedStaff || "Unassigned",
        notes: v.notes || "Visa Type: " + v.visaType + ", Email: " + v.email,
      })),
      ...buses.map((b: any) => ({
        id: `BUS-${b.id.slice(0, 6)}`,
        rawId: b.id,
        table: "bus",
        customerName: b.customerName,
        serviceType: "Bus Booking",
        destination: `${b.departureCity} → ${b.destinationCity}`,
        travelDate: b.travelDate,
        whatsappNumber: b.phone,
        status: b.status,
        createdDate: b.createdAt ? b.createdAt.toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
        assignedStaff: b.assignedStaff || "Unassigned",
        notes: b.notes || "Passengers: " + b.passengers,
      })),
      ...contacts.map((c: any) => ({
        id: `MSG-${c.id.slice(0, 6)}`,
        rawId: c.id,
        table: "contact",
        customerName: c.name,
        serviceType: c.serviceInterested || "Contact Inquiry",
        destination: c.destination || "General Inquiry",
        travelDate: "Flexible",
        whatsappNumber: c.phone,
        status: c.status,
        createdDate: c.createdAt ? c.createdAt.toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
        assignedStaff: c.assignedStaff || "Unassigned",
        notes: c.notes || c.message,
      })),
    ];
  } catch (err) {
    leads = [];
  }

  // Merge fail-safe backup leads
  try {
    const localBackups = getLocalInquiries();
    const existingRawIds = new Set(leads.map((l) => l.rawId));
    for (const backup of localBackups) {
      if (!existingRawIds.has(backup.id)) {
        leads.push({
          id: backup.id.startsWith("lead-") ? `BK-${backup.id.slice(-6)}` : backup.id,
          rawId: backup.id,
          table: backup.table,
          customerName: backup.customerName,
          serviceType: backup.serviceType,
          destination: backup.destination || "General Inquiry",
          travelDate: backup.travelDate || "Flexible",
          whatsappNumber: backup.whatsappNumber,
          status: backup.status,
          createdDate: backup.createdDate,
          assignedStaff: backup.assignedStaff || "Unassigned",
          notes: backup.notes || "",
        });
      }
    }
  } catch (e) {
    console.error("Error reading local inquiry backups:", e);
  }

  leads.sort((a, b) => (a.createdDate < b.createdDate ? 1 : -1));

  return NextResponse.json({ success: true, leads });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      customerName,
      whatsappNumber,
      serviceType,
      destination,
      travelDate,
      travelers,
      budget,
      assignedStaff,
      notes,
      status,
    } = body;

    const saved = saveLocalInquiry({
      table: "contact",
      serviceType: serviceType || "Holiday Package",
      customerName: customerName || "Customer",
      whatsappNumber: whatsappNumber || "",
      destination: destination || "Custom Tour",
      travelDate: travelDate || "Flexible",
      status: status || "NEW",
      assignedStaff: assignedStaff || "Unassigned",
      notes: `${notes || ""}${travelers ? `\nTravelers: ${travelers}` : ""}${budget ? `\nBudget: ${budget}` : ""}`,
      rawPayload: body,
    });

    const newLead = {
      id: `LEAD-${saved.id.slice(-6)}`,
      rawId: saved.id,
      table: "contact",
      customerName: saved.customerName,
      serviceType: saved.serviceType,
      destination: saved.destination,
      travelDate: saved.travelDate,
      whatsappNumber: saved.whatsappNumber,
      status: saved.status,
      createdDate: saved.createdDate,
      assignedStaff: saved.assignedStaff,
      notes: saved.notes,
    };

    return NextResponse.json({ success: true, lead: newLead });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create manual lead." }, { status: 500 });
  }
}
