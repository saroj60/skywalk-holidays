import fs from "fs";
import path from "path";

export interface HotelRecord {
  id: string;
  name: string;
  location: string;
  rating: number;
  reviews: number;
  price: number;
  category: string;
  image: string;
  amenities: string[];
  status: "ACTIVE" | "INACTIVE";
}

const DATA_DIR = path.join(process.cwd(), "src", "data");
const HOTELS_FILE = path.join(DATA_DIR, "hotels.json");

const DEFAULT_HOTELS: HotelRecord[] = [
  {
    id: "HTL-1",
    name: "Grand Hyatt Kathmandu",
    location: "Kathmandu, Nepal",
    rating: 4.9,
    reviews: 240,
    price: 18500,
    category: "5-Star Luxury",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
    amenities: ["Spa", "Pool", "Free Wi-Fi", "Airport Transfer"],
    status: "ACTIVE",
  },
  {
    id: "HTL-2",
    name: "Mandarin Oriental Bangkok",
    location: "Chao Phraya River, Bangkok, Thailand",
    rating: 4.9,
    reviews: 512,
    price: 36000,
    category: "5-Star Luxury Resort",
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80",
    amenities: ["River Cruise", "Pool", "Fine Dining", "Spa"],
    status: "ACTIVE",
  },
  {
    id: "HTL-3",
    name: "Fishtail Lodge Pokhara",
    location: "Lakeside, Pokhara",
    rating: 4.8,
    reviews: 189,
    price: 12500,
    category: "Heritage Resort",
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80",
    amenities: ["Lake View", "Garden", "Restaurant", "Boating"],
    status: "ACTIVE",
  },
  {
    id: "HTL-4",
    name: "Marina Bay Luxury Suites",
    location: "Marina Bay, Singapore",
    rating: 4.9,
    reviews: 380,
    price: 38000,
    category: "5-Star Hotel",
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80",
    amenities: ["Infinity Pool", "Rooftop Bar", "Gym", "Breakfast"],
    status: "ACTIVE",
  },
  {
    id: "HTL-5",
    name: "Ayana Resort & Spa Bali",
    location: "Jimbaran, Bali, Indonesia",
    rating: 4.9,
    reviews: 420,
    price: 29000,
    category: "Private Villa Resort",
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80",
    amenities: ["Rock Bar Access", "Private Pool", "Ocean View", "Spa"],
    status: "ACTIVE",
  },
  {
    id: "HTL-6",
    name: "Kuala Lumpur City Center Hotel",
    location: "KLCC, Kuala Lumpur, Malaysia",
    rating: 4.8,
    reviews: 310,
    price: 11000,
    category: "4-Star Deluxe",
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80",
    amenities: ["Petronas Towers View", "Rooftop Pool", "Free Breakfast"],
    status: "ACTIVE",
  },
];

export function getStoredHotels(): HotelRecord[] {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(HOTELS_FILE)) {
      const content = fs.readFileSync(HOTELS_FILE, "utf-8");
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error("Error reading hotels.json:", err);
  }

  try {
    fs.writeFileSync(HOTELS_FILE, JSON.stringify(DEFAULT_HOTELS, null, 2), "utf-8");
  } catch (e) {}
  return DEFAULT_HOTELS;
}

export function saveStoredHotel(hotel: Partial<HotelRecord>): HotelRecord {
  const current = getStoredHotels();
  const id = hotel.id || `HTL-${Date.now()}`;
  const existingIdx = current.findIndex((h) => h.id === id);

  const record: HotelRecord = {
    id,
    name: hotel.name || "Hotel Accommodation",
    location: hotel.location || "City Center",
    rating: hotel.rating ? Number(hotel.rating) : 4.8,
    reviews: hotel.reviews ? Number(hotel.reviews) : 100,
    price: hotel.price !== undefined ? Number(hotel.price) : 12000,
    category: hotel.category || "4-Star Deluxe",
    image: hotel.image || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
    amenities: Array.isArray(hotel.amenities) ? hotel.amenities : ["Free Wi-Fi", "Daily Breakfast"],
    status: hotel.status || "ACTIVE",
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
    fs.writeFileSync(HOTELS_FILE, JSON.stringify(current, null, 2), "utf-8");
  } catch (e) {
    console.error("Error saving hotel:", e);
  }

  return record;
}

export function deleteStoredHotel(id: string): boolean {
  const current = getStoredHotels();
  const filtered = current.filter((h) => h.id !== id);
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(HOTELS_FILE, JSON.stringify(filtered, null, 2), "utf-8");
    return true;
  } catch (e) {
    console.error("Error deleting hotel:", e);
    return false;
  }
}
