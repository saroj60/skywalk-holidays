import fs from "fs";
import path from "path";

export interface FlightDeal {
  id: string;
  name: string;
  code: string;
  routes: string;
  category: "International" | "Domestic" | string;
  price?: number;
  logo?: string;
  status: "ACTIVE" | "INACTIVE";
}

const DATA_DIR = path.join(process.cwd(), "src", "data");
const FLIGHTS_FILE = path.join(DATA_DIR, "flights.json");

const DEFAULT_FLIGHTS: FlightDeal[] = [
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

export function getStoredFlights(): FlightDeal[] {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(FLIGHTS_FILE)) {
      const content = fs.readFileSync(FLIGHTS_FILE, "utf-8");
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error("Error reading flights.json:", err);
  }

  try {
    fs.writeFileSync(FLIGHTS_FILE, JSON.stringify(DEFAULT_FLIGHTS, null, 2), "utf-8");
  } catch (e) {}
  return DEFAULT_FLIGHTS;
}

export function saveStoredFlight(flight: Partial<FlightDeal>): FlightDeal {
  const current = getStoredFlights();
  const id = flight.id || `FL-${Date.now()}`;
  const existingIdx = current.findIndex((f) => f.id === id);

  const record: FlightDeal = {
    id,
    name: flight.name || "Airline Partner",
    code: flight.code || "AP",
    routes: flight.routes || "Kathmandu → Destinations",
    category: flight.category || "International",
    price: flight.price !== undefined ? Number(flight.price) : 0,
    logo: flight.logo || "",
    status: flight.status || "ACTIVE",
  };

  if (existingIdx >= 0) {
    current[existingIdx] = record;
  } else {
    current.unshift(record);
  }

  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(FLIGHTS_FILE, JSON.stringify(current, null, 2), "utf-8");
  } catch (e) {
    console.error("Error saving flight:", e);
  }

  return record;
}

export function deleteStoredFlight(id: string): boolean {
  const current = getStoredFlights();
  const filtered = current.filter((f) => f.id !== id);
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(FLIGHTS_FILE, JSON.stringify(filtered, null, 2), "utf-8");
    return true;
  } catch (e) {
    console.error("Error deleting flight:", e);
    return false;
  }
}
