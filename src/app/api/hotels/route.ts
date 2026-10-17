import { NextResponse } from "next/server";

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

let HOTELS: HotelRecord[] = [
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
    amenities: ["Infinity Pool", "Sky Bar", "Gym", "Breakfast"],
    status: "ACTIVE",
  },
];

export async function GET() {
  return NextResponse.json({ hotels: HOTELS });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newHotel: HotelRecord = {
      id: `HTL-${Date.now()}`,
      name: body.name || "Luxury Resort",
      location: body.location || "Kathmandu, Nepal",
      rating: body.rating ? Number(body.rating) : 4.5,
      reviews: body.reviews ? Number(body.reviews) : 10,
      price: body.price ? Number(body.price) : 10000,
      category: body.category || "4-Star Hotel",
      image: body.image || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
      amenities: Array.isArray(body.amenities) ? body.amenities : ["Free Wi-Fi", "Breakfast"],
      status: body.status || "ACTIVE",
    };
    HOTELS.unshift(newHotel);
    return NextResponse.json({ success: true, hotel: newHotel });
  } catch (err) {
    return NextResponse.json({ error: "Failed to add hotel" }, { status: 500 });
  }
}
