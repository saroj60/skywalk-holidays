import { NextResponse } from "next/server";

export interface FlightDeal {
  id: string;
  name: string;
  code: string;
  routes: string;
  category: "International" | "Domestic";
  price?: number;
  logo?: string;
  status: "ACTIVE" | "INACTIVE";
}

let FLIGHTS: FlightDeal[] = [
  { id: "FL-1", name: "Qatar Airways", code: "QR", routes: "Kathmandu → Doha & 150+ Global Destinations", category: "International", price: 65000, logo: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=200&q=80", status: "ACTIVE" },
  { id: "FL-2", name: "Emirates", code: "EK", routes: "Kathmandu → International Hubs, Europe & USA", category: "International", price: 72000, logo: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=200&q=80", status: "ACTIVE" },
  { id: "FL-3", name: "Air Arabia", code: "G9", routes: "Kathmandu → Sharjah & Middle East", category: "International", price: 42000, logo: "", status: "ACTIVE" },
  { id: "FL-4", name: "IndiGo", code: "6E", routes: "Kathmandu → Delhi, Mumbai & India Network", category: "International", price: 18000, logo: "", status: "ACTIVE" },
  { id: "FL-5", name: "Nepal Airlines", code: "RA", routes: "Kathmandu → Narita, Bangkok, Kuala Lumpur & Domestic", category: "International", price: 35000, logo: "", status: "ACTIVE" },
  { id: "FL-6", name: "Buddha Air", code: "U4", routes: "Pokhara, Biratnagar, Bhairahawa, Nepalgunj & Mountain Flights", category: "Domestic", price: 6500, logo: "", status: "ACTIVE" },
  { id: "FL-7", name: "Thai Airways", code: "TG", routes: "Kathmandu → Bangkok, East Asia & Australia", category: "International", price: 48000, logo: "", status: "ACTIVE" },
  { id: "FL-8", name: "Singapore Airlines", code: "SQ", routes: "Kathmandu → Singapore, Australia & Pacific", category: "International", price: 58000, logo: "", status: "ACTIVE" },
  { id: "FL-9", name: "Yeti Airlines", code: "YT", routes: "Pokhara, Everest View & Major Nepal Hubs", category: "Domestic", price: 5800, logo: "", status: "ACTIVE" },
];

export async function GET() {
  return NextResponse.json({ flights: FLIGHTS });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newFlight: FlightDeal = {
      id: `FL-${Date.now()}`,
      name: body.name || "Airline Partner",
      code: body.code || "AP",
      routes: body.routes || "Kathmandu → Destination",
      category: body.category || "International",
      price: body.price ? Number(body.price) : 0,
      logo: body.logo || "",
      status: body.status || "ACTIVE",
    };
    FLIGHTS.unshift(newFlight);
    return NextResponse.json({ success: true, flight: newFlight });
  } catch (err) {
    return NextResponse.json({ error: "Failed to create flight deal" }, { status: 500 });
  }
}
