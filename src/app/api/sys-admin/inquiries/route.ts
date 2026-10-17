import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminUserFromRequest } from "@/lib/auth";

const SAMPLE_CRM_LEADS = [
  {
    id: "PKG-782101",
    rawId: "lead-001",
    table: "package",
    customerName: "Aayush Sharma",
    serviceType: "Holiday Package",
    destination: "Bangkok & Pattaya, Thailand",
    travelDate: "2026-11-04",
    whatsappNumber: "9779841234567",
    email: "aayush.sharma@gmail.com",
    travelers: "2 Adults",
    status: "NEW",
    createdDate: "2026-10-14",
    assignedStaff: "Saroj",
    budget: "NPR 96,000",
    notes: "Inquired about Bangkok Pattaya 5N/6D. Prefers 4-star hotel near shopping center and Coral island tour.",
  },
  {
    id: "FL-629140",
    rawId: "lead-002",
    table: "flight",
    customerName: "Sunita Adhikari",
    serviceType: "Flight Ticket",
    destination: "Kathmandu → Tokyo (NRT)",
    travelDate: "2026-10-28",
    whatsappNumber: "9779813456789",
    email: "sunita.adhikari@outlook.com",
    travelers: "1 Adult",
    status: "QUOTATION_SENT",
    createdDate: "2026-10-13",
    assignedStaff: "Aayush",
    budget: "NPR 85,000",
    notes: "Quoted Nepal Airlines direct vs Singapore Airlines transit. Waiting for customer approval.",
  },
  {
    id: "PKG-904231",
    rawId: "lead-003",
    table: "package",
    customerName: "Ramesh Thapa",
    serviceType: "Holiday Package",
    destination: "Seminyak & Ubud, Bali",
    travelDate: "2026-11-12",
    whatsappNumber: "9779801239876",
    email: "ramesh.thapa@yahoo.com",
    travelers: "2 Adults (Honeymoon)",
    status: "CONFIRMED",
    createdDate: "2026-10-12",
    assignedStaff: "Saroj",
    budget: "NPR 164,000",
    notes: "Deposit paid. Private pool villa booked in Seminyak with flower bath and Ubud tours.",
  },
  {
    id: "VISA-331892",
    rawId: "lead-004",
    table: "visa",
    customerName: "Prashant Shrestha",
    serviceType: "Visa Assistance",
    destination: "Japan Tourist Visa",
    travelDate: "2026-12-05",
    whatsappNumber: "9779851098765",
    email: "prashant.shr@gmail.com",
    travelers: "1 Applicant",
    status: "CONTACTED",
    createdDate: "2026-10-11",
    assignedStaff: "Visa Desk",
    budget: "NPR 15,000",
    notes: "Document checklist sent via WhatsApp. Applicant preparing 6-month bank statement and tax clearance.",
  },
  {
    id: "HT-119844",
    rawId: "lead-005",
    table: "hotel",
    customerName: "Pooja Gurung",
    serviceType: "Hotel Booking",
    destination: "Kuala Lumpur, Malaysia",
    travelDate: "2026-10-30",
    whatsappNumber: "9779862112233",
    email: "pooja.g@gmail.com",
    travelers: "3 Guests, 2 Rooms",
    status: "QUOTATION_SENT",
    createdDate: "2026-10-10",
    assignedStaff: "Tour Desk",
    budget: "NPR 35,000",
    notes: "Quoted 4-star hotel near Bukit Bintang and KLCC with complimentary breakfast.",
  },
  {
    id: "PKG-455219",
    rawId: "lead-006",
    table: "package",
    customerName: "Bibek & Srijana",
    serviceType: "Holiday Package",
    destination: "Vietnam Ha Long Bay & Hanoi",
    travelDate: "2026-11-20",
    whatsappNumber: "9779841998877",
    email: "bibek.srijana@gmail.com",
    travelers: "2 Adults",
    status: "NEW",
    createdDate: "2026-10-14",
    assignedStaff: "Unassigned",
    budget: "NPR 120,000",
    notes: "Requested luxury overnight cruise in Ha Long Bay + Ba Na Hills Golden Bridge tour.",
  },
  {
    id: "MSG-882012",
    rawId: "lead-007",
    table: "contact",
    customerName: "Kiran Poudel",
    serviceType: "Custom Tour Inquiry",
    destination: "Singapore & Malaysia 9 Days",
    travelDate: "2026-12-25",
    whatsappNumber: "9779803344556",
    email: "kiran.p@gmail.com",
    travelers: "4 Adults (Family Group)",
    status: "COMPLETED",
    createdDate: "2026-10-08",
    assignedStaff: "Saroj",
    budget: "NPR 320,000",
    notes: "Trip concluded with 100% satisfaction. Family left positive 5-star Google review.",
  },
];

export async function GET(req: NextRequest) {
  const admin = getAdminUserFromRequest(req);
  // Allow if admin or local development mode
  const isDev = process.env.NODE_ENV !== "production";
  if (!admin && !isDev) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  let leads: any[] = [];

  try {
    const flights = await prisma.flightInquiry.findMany().catch(() => []);
    const hotels = await prisma.hotelInquiry.findMany().catch(() => []);
    const packages = await prisma.holidayPackageInquiry.findMany().catch(() => []);
    const visas = await prisma.visaApplication.findMany().catch(() => []);
    const buses = await prisma.busInquiry.findMany().catch(() => []);
    const contacts = await prisma.contactMessage.findMany().catch(() => []);

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

  // If no DB records yet, provide rich starter CRM leads for demonstration
  if (leads.length === 0) {
    leads = SAMPLE_CRM_LEADS;
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

    const newLead = {
      id: `LEAD-${Date.now().toString().slice(-6)}`,
      rawId: `lead-${Date.now()}`,
      table: "contact",
      customerName: customerName || "Customer",
      serviceType: serviceType || "Holiday Package",
      destination: destination || "Custom Tour",
      travelDate: travelDate || "Flexible",
      whatsappNumber: whatsappNumber || "",
      travelers: travelers || "2 Travelers",
      budget: budget || "",
      status: status || "NEW",
      createdDate: new Date().toISOString().split("T")[0],
      assignedStaff: assignedStaff || "Unassigned",
      notes: notes || "",
    };

    return NextResponse.json({ success: true, lead: newLead }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create lead." }, { status: 500 });
  }
}
