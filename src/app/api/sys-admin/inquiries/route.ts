import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminUserFromRequest } from "@/lib/auth";
import { getLocalInquiries, saveLocalInquiry } from "@/lib/server/inquiriesStore";

function normalizeServiceType(raw?: string | null): string {
  if (!raw) return "Contact Inquiry";
  const lower = raw.toLowerCase().trim();
  if (lower.includes("flight") || lower.includes("ticket") || lower.includes("air")) return "Flight Ticket";
  if (lower.includes("hotel") || lower.includes("stay") || lower.includes("resort") || lower.includes("room")) return "Hotel Booking";
  if (lower.includes("package") || lower.includes("tour") || lower.includes("holiday")) return "Holiday Package";
  if (lower.includes("visa")) return "Visa Assistance";
  if (lower.includes("bus")) return "Bus Booking";
  return "Contact Inquiry";
}

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
        id: `FL-${f.id.slice(0, 6).toUpperCase()}`,
        rawId: f.id,
        table: "flight",
        customerName: f.customerName,
        serviceType: "Flight Ticket",
        originalService: "Flight Booking",
        destination: `${f.fromCity} → ${f.toCity}`,
        travelDate: f.departureDate + (f.returnDate ? ` (Ret: ${f.returnDate})` : ""),
        whatsappNumber: f.whatsappNumber,
        email: f.email || undefined,
        status: f.status,
        createdDate: f.createdAt ? f.createdAt.toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
        createdAt: f.createdAt ? f.createdAt.toISOString() : new Date().toISOString(),
        assignedStaff: f.assignedStaff || "Unassigned",
        notes: f.notes || `Trip: ${f.tripType}, Class: ${f.cabinClass}`,
        travelers: f.passengers || "1 Adult",
      })),
      ...hotels.map((h: any) => ({
        id: `HT-${h.id.slice(0, 6).toUpperCase()}`,
        rawId: h.id,
        table: "hotel",
        customerName: h.customerName,
        serviceType: "Hotel Booking",
        originalService: "Hotel Booking",
        destination: h.destination,
        travelDate: h.checkIn + (h.checkOut ? ` → ${h.checkOut}` : ""),
        whatsappNumber: h.whatsappNumber,
        email: h.email || undefined,
        status: h.status,
        createdDate: h.createdAt ? h.createdAt.toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
        createdAt: h.createdAt ? h.createdAt.toISOString() : new Date().toISOString(),
        assignedStaff: h.assignedStaff || "Unassigned",
        notes: h.notes || `Rooms: ${h.rooms}, Guests: ${h.guests}`,
        travelers: h.guests || "2 Guests",
      })),
      ...packages.map((p: any) => ({
        id: `PKG-${p.id.slice(0, 6).toUpperCase()}`,
        rawId: p.id,
        table: "package",
        customerName: p.customerName,
        serviceType: "Holiday Package",
        originalService: p.packageName || "Holiday Package",
        destination: p.destination,
        travelDate: p.travelDate,
        whatsappNumber: p.whatsappNumber,
        email: p.email || undefined,
        status: p.status,
        createdDate: p.createdAt ? p.createdAt.toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
        createdAt: p.createdAt ? p.createdAt.toISOString() : new Date().toISOString(),
        assignedStaff: p.assignedStaff || "Unassigned",
        notes: p.notes || (p.specialRequirements ? `Notes: ${p.specialRequirements}` : `Package: ${p.packageName}`),
        message: p.specialRequirements || undefined,
        travelers: p.travelers || "2 Travelers",
      })),
      ...visas.map((v: any) => ({
        id: `VISA-${v.id.slice(0, 6).toUpperCase()}`,
        rawId: v.id,
        table: "visa",
        customerName: v.fullName,
        serviceType: "Visa Assistance",
        originalService: `${v.visaType} (${v.destinationCountry})`,
        destination: v.destinationCountry,
        travelDate: v.travelPurpose || "Visa Application",
        whatsappNumber: v.whatsappNumber,
        email: v.email,
        status: v.status,
        createdDate: v.createdAt ? v.createdAt.toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
        createdAt: v.createdAt ? v.createdAt.toISOString() : new Date().toISOString(),
        assignedStaff: v.assignedStaff || "Unassigned",
        notes: v.notes || `Visa: ${v.visaType}, Purpose: ${v.travelPurpose}, Nationality: ${v.nationality}`,
      })),
      ...buses.map((b: any) => ({
        id: `BUS-${b.id.slice(0, 6).toUpperCase()}`,
        rawId: b.id,
        table: "bus",
        customerName: b.customerName,
        serviceType: "Bus Booking",
        originalService: "Bus Booking",
        destination: `${b.departureCity} → ${b.destinationCity}`,
        travelDate: b.travelDate,
        whatsappNumber: b.phone,
        status: b.status,
        createdDate: b.createdAt ? b.createdAt.toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
        createdAt: b.createdAt ? b.createdAt.toISOString() : new Date().toISOString(),
        assignedStaff: b.assignedStaff || "Unassigned",
        notes: b.notes || `Passengers: ${b.passengers}`,
        travelers: b.passengers,
      })),
      ...contacts.map((c: any) => ({
        id: `MSG-${c.id.slice(0, 6).toUpperCase()}`,
        rawId: c.id,
        table: "contact",
        customerName: c.name,
        serviceType: normalizeServiceType(c.serviceInterested),
        originalService: c.serviceInterested || "General Travel Inquiry",
        destination: c.destination || "General Inquiry",
        travelDate: "Flexible",
        whatsappNumber: c.phone,
        email: c.email || undefined,
        message: c.message || undefined,
        status: c.status,
        createdDate: c.createdAt ? c.createdAt.toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
        createdAt: c.createdAt ? c.createdAt.toISOString() : new Date().toISOString(),
        assignedStaff: c.assignedStaff || "Unassigned",
        notes: c.notes || "",
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
          id: backup.id.startsWith("lead-") ? `BK-${backup.id.slice(-6).toUpperCase()}` : (backup.id.startsWith("MSG-") ? backup.id : `MSG-${backup.id.slice(0, 6).toUpperCase()}`),
          rawId: backup.id,
          table: backup.table,
          customerName: backup.customerName,
          serviceType: normalizeServiceType(backup.serviceType || backup.originalService),
          originalService: backup.originalService || backup.serviceType,
          destination: backup.destination || "General Inquiry",
          travelDate: backup.travelDate || "Flexible",
          whatsappNumber: backup.whatsappNumber,
          email: backup.email,
          message: backup.message,
          status: backup.status,
          createdDate: backup.createdDate,
          createdAt: backup.createdAt,
          assignedStaff: backup.assignedStaff || "Unassigned",
          notes: backup.notes || "",
        });
      }
    }
  } catch (e) {
    console.error("Error reading local inquiry backups:", e);
  }

  leads.sort((a, b) => {
    const timeA = new Date(a.createdAt || a.createdDate).getTime();
    const timeB = new Date(b.createdAt || b.createdDate).getTime();
    return timeB - timeA;
  });

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
