import React from "react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  MapPin,
  Clock,
  Calendar,
  CheckCircle2,
  Sparkles,
  Plane,
  ShieldCheck,
  ArrowRight,
  MessageSquare,
  FileCheck,
  ChevronRight,
  Star,
  Compass,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import PackageCard from "@/components/common/PackageCard";
import CTABanner from "@/components/common/CTABanner";
import { buildCustomWhatsAppLink } from "@/lib/whatsapp";

interface DestinationMeta {
  id: string;
  name: string;
  country: string;
  flag: string;
  badge: string;
  image: string;
  subtitle: string;
  description: string;
  bestTimeToVisit: string;
  flightDuration: string;
  visaGuidance: string;
  visaLink?: string;
  startingPrice: number;
  highlights: string[];
  keywords: string[];
}

const DESTINATIONS_DIRECTORY: DestinationMeta[] = [
  {
    id: "thailand",
    name: "Bangkok & Pattaya, Thailand",
    country: "Thailand",
    flag: "🇹🇭",
    badge: "Top Recommended",
    image: "/images/gallery/coral-island-speedboat.png",
    subtitle: "Coastal beaches, royal temples & electrifying nightlife",
    description:
      "Thailand is Nepal's most loved international holiday destination. From the sparkling shores of Pattaya and speedboat rides to Coral Island, to the grandeur of Bangkok's golden temples (Wat Traimitr & Wat Pho) and endless shopping at Chatuchak and Pratunam — our packages include flights, 3-star hotels, transfers, and visa assistance.",
    bestTimeToVisit: "November – April (Dry & Sunny)",
    flightDuration: "Approx. 3h 15m direct from Kathmandu (KTM)",
    visaGuidance: "Skywalk Holidays provides complete Thailand Tourist Visa documentation & filing.",
    visaLink: "/services/visa",
    startingPrice: 42000,
    highlights: [
      "Coral Island Speedboat Tour with complimentary Indian buffet lunch",
      "Guided Bangkok City Tour with Wat Traimitr & Wat Pho",
      "Sanctuary of Truth & Pattaya Beach exploration",
      "Optional extensions to Phi Phi Islands, Phuket & Krabi",
    ],
    keywords: ["bangkok", "pattaya", "thailand", "phuket", "krabi"],
  },
  {
    id: "bali",
    name: "Bali, Indonesia",
    country: "Indonesia",
    flag: "🇮🇩",
    badge: "Island of the Gods",
    image: "/images/bali-kelingking.jpg",
    subtitle: "Emerald rice terraces, ancient sea temples & tropical villas",
    description:
      "Escape to paradise with our curated Bali holiday packages. Discover Kelingking Beach and Broken Beach in Nusa Penida, explore the cultural heart of Ubud with Tegallalang Rice Terraces, witness mesmerizing sunsets at Tanah Lot Temple, and unwind in private pool villas.",
    bestTimeToVisit: "April – October (Dry Season & Beach Sun)",
    flightDuration: "Approx. 7h via Kuala Lumpur or Singapore from KTM",
    visaGuidance: "Visa on Arrival (e-VOA) available online or on landing in Denpasar.",
    visaLink: "/services/visa",
    startingPrice: 52000,
    highlights: [
      "Nusa Penida West Island tour: Kelingking T-Rex Beach & Angel's Billabong",
      "Ubud Art Village, Sacred Monkey Forest & Tegallalang Rice Terraces",
      "Tanah Lot Sea Temple sunset experience",
      "Authentic Balinese coffee tasting at Luwak plantations",
    ],
    keywords: ["bali", "indonesia", "ubud", "seminyak", "denpasar"],
  },
  {
    id: "singapore-malaysia",
    name: "Singapore & Malaysia",
    country: "Singapore & Malaysia",
    flag: "🇸🇬 🇲🇾",
    badge: "Family Favorite Dual Tour",
    image: "https://images.unsplash.com/photo-1565967511849-76a60a516170?w=1920&q=80",
    subtitle: "Futuristic gardens, Sentosa Island & Genting Highlands",
    description:
      "A perfect blend of two iconic Southeast Asian capitals. Marvel at Singapore's Gardens by the Bay, Marina Bay Sands, and Sentosa Island, then journey to Malaysia to explore Kuala Lumpur's Petronas Twin Towers, Batu Caves rainbow steps, and the cool mist of Genting Highlands.",
    bestTimeToVisit: "Year-Round Tropical Destination",
    flightDuration: "Approx. 4h 30m direct to Kuala Lumpur from KTM",
    visaGuidance: "Malaysia eVisa & Singapore Visa handled with complete document check.",
    visaLink: "/services/visa",
    startingPrice: 54000,
    highlights: [
      "Universal Studios Singapore & Sentosa Wings of Time show",
      "Petronas Twin Towers & Kuala Lumpur City Tour",
      "Batu Caves Lord Murugan Statue & Genting Cable Car ride",
      "Gardens by the Bay Supertree Grove & Cloud Forest",
    ],
    keywords: ["singapore", "malaysia", "kuala-lumpur", "genting"],
  },
  {
    id: "paris-europe",
    name: "Paris & Europe",
    country: "France, Switzerland & Italy",
    flag: "🇫🇷 🇨🇭 🇮🇹",
    badge: "Bucket List Grand Tour",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1920&q=80",
    subtitle: "Eiffel Tower, Swiss Alps & Roman Colosseum",
    description:
      "Experience the pinnacle of European culture, alpine wonder, and historical elegance. Climb the Eiffel Tower in Paris, cruise the Seine River, ascend to Jungfraujoch 'Top of Europe' or Mt. Titlis in the Swiss Alps, and walk through centuries of history at Rome's Colosseum and Venice's canals.",
    bestTimeToVisit: "May – October (Pleasant Summer & Golden Autumn)",
    flightDuration: "Approx. 9h – 11h with 1 transit from Kathmandu",
    visaGuidance: "Complete Schengen Visa appointment, itinerary dossier & cover letter assistance.",
    visaLink: "/services/visa",
    startingPrice: 185000,
    highlights: [
      "Eiffel Tower 2nd Level admission & Seine River Cruise",
      "Mt. Titlis revolving cable car & Glacier Cave in Switzerland",
      "Scenic Lake Lucerne & Lion Monument walking tour",
      "Rome Colosseum, Trevi Fountain & Vatican City landmarks",
    ],
    keywords: ["paris", "europe", "france", "swiss", "italy", "schengen", "rome"],
  },
  {
    id: "tokyo-japan",
    name: "Tokyo, Japan",
    country: "Japan",
    flag: "🇯🇵",
    badge: "Land of the Rising Sun",
    image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=1920&q=80",
    subtitle: "Futuristic Tokyo, Mt. Fuji & ancient Kyoto temples",
    description:
      "Immerse yourself in Japan's awe-inspiring balance of ultramodern neon metropolises and serene ancient traditions. Cross Shibuya Scramble, marvel at snow-capped Mount Fuji, ride the iconic Shinkansen Bullet Train, and wander through Kyoto's thousand vermilion Torii gates at Fushimi Inari.",
    bestTimeToVisit: "March – May (Cherry Blossoms) & Sept – Nov (Autumn Foliage)",
    flightDuration: "Approx. 8h – 10h with transit from Kathmandu",
    visaGuidance: "Japan Tourist Visa document verification, guarantee letter & VFS appointment support.",
    visaLink: "/services/visa",
    startingPrice: 145000,
    highlights: [
      "Tokyo highlights: Shibuya Sky, Senso-ji Temple & Akihabara",
      "Mount Fuji 5th Station & Lake Kawaguchiko scenic cruise",
      "Kyoto Fushimi Inari Shrine & Kinkaku-ji Golden Pavilion",
      "Shinkansen Bullet Train high-speed experience",
    ],
    keywords: ["tokyo", "japan", "kyoto", "fuji", "osaka"],
  },
  {
    id: "vietnam",
    name: "Vietnam",
    country: "Vietnam",
    flag: "🇻🇳",
    badge: "Trending Destination",
    image: "/images/gallery/vietnam-highlights-collage-card.png",
    subtitle: "Emerald Ha Long Bay, Golden Bridge & Lantern Rivers",
    description:
      "Vietnam captivates travelers with pristine limestone karsts in Ha Long Bay, historic tree-lined avenues of Hanoi, Ba Na Hills' iconic Golden Bridge held by giant stone hands, and UNESCO Hoi An ancient town adorned with glowing silk lanterns.",
    bestTimeToVisit: "October – April (Mild & Comfortable)",
    flightDuration: "Approx. 4h – 5h via Bangkok or Kuala Lumpur",
    visaGuidance: "Vietnam eVisa fast-track processing within 3–5 business days.",
    visaLink: "/services/visa",
    startingPrice: 45000,
    highlights: [
      "Overnight luxury cruise amidst Ha Long Bay's limestone islands",
      "Sun World Ba Na Hills Cable Car & Golden Giant Hands Bridge",
      "Hoi An Ancient Town lantern river cruise & basket boat ride",
      "Hanoi City Tour with historic Train Street & One Pillar Pagoda",
    ],
    keywords: ["vietnam", "hanoi", "danang", "halong", "hoi-an"],
  },
  {
    id: "china",
    name: "China (Beijing & Shanghai)",
    country: "China",
    flag: "🇨🇳",
    badge: "Wonders of the World",
    image: "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=1920&q=80",
    subtitle: "Great Wall of China, Forbidden City & Shanghai Skyline",
    description:
      "Journey from ancient imperial dynasties to futuristic megacities on our signature China holiday tour from Nepal. Hike the legendary Great Wall at Mutianyu, explore the Forbidden City and Tiananmen Square, ride the 300 km/h high-speed bullet train, and cruise past Shanghai's The Bund with complete China visa assistance in Kathmandu.",
    bestTimeToVisit: "April – May (Spring) & September – November (Autumn)",
    flightDuration: "Approx. 5h direct or via Chengdu/Kunming from Kathmandu",
    visaGuidance: "Complete China Tourist Visa documentation, invitation support & biometrics appointment in Kathmandu.",
    visaLink: "/services/visa",
    startingPrice: 135000,
    highlights: [
      "Mutianyu Great Wall excursion with scenic round-trip cable car tickets",
      "Forbidden City, Tiananmen Square & Summer Palace imperial gardens",
      "High-speed modern bullet train journey from Beijing to Shanghai (300 km/h)",
      "Shanghai Bund modern skyline, Yu Garden & Huangpu River evening cruise",
    ],
    keywords: ["china", "beijing", "shanghai", "great-wall", "china-visa-nepal", "china-tour-from-nepal"],
  },
  {
    id: "philippines",
    name: "Philippines",
    country: "Philippines",
    flag: "🇵🇭",
    badge: "7,000 Island Paradise",
    image: "/images/gallery/philippines-boracay-beach-bangka-boats.png",
    subtitle: "Boracay powder white beaches & vibrant Manila",
    description:
      "Voted among the world's best beach destinations, Boracay offers powdery white sand beaches, crystal-clear turquoise waters, and vibrant island nightlife. Paired with Manila's Spanish-colonial Intramuros and modern BGC shopping.",
    bestTimeToVisit: "December – May (Dry Sunny Season)",
    flightDuration: "Approx. 6h – 8h via Bangkok or Kuala Lumpur",
    visaGuidance: "Philippines Tourist Visa filing and document review at the Manila consular desk.",
    visaLink: "/services/visa",
    startingPrice: 72000,
    highlights: [
      "Boracay Island Hopping boat tour with Puka Beach & snorkeling",
      "White Beach sunset sailing & beachfront dining",
      "Historic Manila Intramuros & Fort Santiago tour",
      "Round-trip domestic island flights & private resort transfers",
    ],
    keywords: ["philippines", "boracay", "manila", "cebu"],
  },
  {
    id: "maldives",
    name: "Maldives",
    country: "Maldives",
    flag: "🇲🇻",
    badge: "Ultra Luxury Escape",
    image: "/images/gallery/maldives-overwater-bungalows-aerial-lagoon.png",
    subtitle: "Overwater villas, coral reefs & turquoise lagoons",
    description:
      "The quintessential honeymoon and luxury retreat. Wake up to panoramic Indian Ocean horizons in a private overwater villa, snorkel among vibrant coral reefs, and enjoy candlelit dinners on white sand sandbanks.",
    bestTimeToVisit: "November – April (Warm & Sunny Dry Season)",
    flightDuration: "Approx. 5h – 6h with 1 transit from Kathmandu",
    visaGuidance: "Free 30-Day Visa on Arrival for all tourist passports on entry.",
    visaLink: "/services/visa",
    startingPrice: 85000,
    highlights: [
      "Private Overwater Villa accommodation with ocean direct access",
      "Speedboat or Seaplane scenic island transfers",
      "Complimentary water sports, snorkeling gear & sunset dolphin cruise",
      "All-inclusive resort meal plans with international buffet dining",
    ],
    keywords: ["maldives", "male", "resort", "bungalow"],
  },
];

// Master Package Database for All Destinations
const ALL_PACKAGES: any[] = [
  {
    id: "bangkok-pattaya-6d",
    title: "Bangkok Pattaya - 05 Nights and 06 Day Itinerary",
    image: "/images/bangkok-pattaya.png",
    destination: "Bangkok & Pattaya, Thailand",
    country: "Thailand",
    duration: "05 Nights and 06 Days",
    price: 48000,
    originalPrice: 58000,
    rating: 4.9,
    reviews: 218,
    inclusions: ["Round-trip Flights", "3-Star Hotels", "Coral Island with Lunch", "City & Temple Tour"],
    badge: "Best Seller",
    destinationIds: ["thailand"],
  },
  {
    id: "bangkok-pattaya-8d",
    title: "Bangkok Pattaya - 07 Nights and 08 Day Itinerary",
    image: "/images/gallery/sanctuary-of-truth-pattaya.png",
    destination: "Bangkok & Pattaya, Thailand",
    country: "Thailand",
    duration: "07 Nights and 08 Days",
    price: 56000,
    originalPrice: 68000,
    rating: 4.9,
    reviews: 142,
    inclusions: ["Round-trip Flights", "Welcome Plaza Hotel", "Coral Island with Lunch", "3 Free Shopping Days"],
    badge: "Extended Holiday",
    destinationIds: ["thailand"],
  },
  {
    id: "bangkok-pattaya-phuket-8d",
    title: "Bangkok Pattaya Phuket - 07 Nights and 08 Day Itinerary",
    image: "/images/gallery/thailand-phi-phi-maya-bay.png",
    destination: "Bangkok, Pattaya & Phuket, Thailand",
    country: "Thailand",
    duration: "07 Nights and 08 Days",
    price: 68000,
    originalPrice: 82000,
    rating: 4.9,
    reviews: 196,
    inclusions: ["All Flights Included", "Coral Island with Lunch", "Phi Phi Islands & Maya Bay", "Bangkok City & Temples"],
    badge: "Island & City Combo",
    destinationIds: ["thailand"],
  },
  {
    id: "krabi-phuket-bangkok-8d",
    title: "Krabi Phuket Bangkok - 07 Nights and 08 Day Itinerary",
    image: "/images/gallery/thailand-krabi-island-boat.jpg",
    destination: "Krabi, Phuket & Bangkok, Thailand",
    country: "Thailand",
    duration: "07 Nights and 08 Days",
    price: 74000,
    originalPrice: 89000,
    rating: 4.9,
    reviews: 175,
    inclusions: ["All Domestic & Int'l Flights", "Phi Phi Islands Tour with Lunch", "Krabi 4 Island Tour with Lunch", "Thailand Visa Included"],
    badge: "Ultimate Islands",
    destinationIds: ["thailand"],
  },
  {
    id: "bangkok-pattaya-5d",
    title: "Bangkok Pattaya - 04 Nights and 05 Day Itinerary",
    image: "/images/gallery/pattaya-coral-island-platinum-speedboat.jpg",
    destination: "Bangkok & Pattaya, Thailand",
    country: "Thailand",
    duration: "04 Nights and 05 Days",
    price: 42000,
    originalPrice: 52000,
    rating: 4.9,
    reviews: 168,
    inclusions: ["Round-trip Flights", "Welcome Plaza Hotel", "Coral Island with Lunch", "Thailand Visa Included"],
    badge: "Value Deal",
    destinationIds: ["thailand"],
  },
  {
    id: "phuket-bangkok-6d",
    title: "Phuket & Bangkok - 05 Nights and 06 Day Itinerary",
    image: "/images/gallery/phuket-phi-phi-maya-bay-boats.png",
    destination: "Phuket & Bangkok, Thailand",
    country: "Thailand",
    duration: "05 Nights and 06 Days",
    price: 58000,
    originalPrice: 70000,
    rating: 4.9,
    reviews: 188,
    inclusions: ["All Int'l & Domestic Flights", "Phi Phi Islands Tour with Lunch", "Bangkok Reclining & Golden Buddha", "Thailand Visa Included"],
    badge: "Island & City Escape",
    destinationIds: ["thailand"],
  },
  {
    id: "bali-7d",
    title: "Bali Island Paradise & Nusa Penida - 06 Nights and 07 Days",
    image: "/images/bali-kelingking.jpg",
    destination: "Bali & Nusa Penida, Indonesia",
    country: "Indonesia",
    duration: "06 Nights and 07 Days",
    price: 62000,
    originalPrice: 75000,
    rating: 4.9,
    reviews: 148,
    inclusions: ["Round-trip Flights", "Nusa Penida Kelingking Beach", "Ubud Rice Terraces & Swing", "Tanah Lot Sunset Tour"],
    badge: "Tropical Paradise",
    destinationIds: ["bali"],
  },
  {
    id: "bali-malaysia-7d",
    title: "Bali Malaysia - 06 Nights and 07 Day Itinerary",
    image: "/images/bali-kelingking.jpg",
    destination: "Bali, Indonesia & Kuala Lumpur, Malaysia",
    country: "Indonesia & Malaysia",
    duration: "06 Nights and 07 Days",
    price: 78000,
    originalPrice: 92000,
    rating: 4.9,
    reviews: 184,
    inclusions: ["All Flights Included", "Kintamani Volcano & Coffee Tour", "Tanah Lot Sea Temple", "Genting Highlands Cable Car"],
    badge: "Top Rated",
    destinationIds: ["bali", "singapore-malaysia"],
  },
  {
    id: "malaysia-singapore-6d",
    title: "Malaysia Singapore - 05 Nights and 06 Day Itinerary",
    image: "https://images.unsplash.com/photo-1565967511849-76a60a516170?w=800&q=80",
    destination: "Singapore & Kuala Lumpur, Malaysia",
    country: "Singapore & Malaysia",
    duration: "05 Nights and 06 Days",
    price: 68000,
    originalPrice: 82000,
    rating: 4.9,
    reviews: 172,
    inclusions: ["Round-trip Flights", "Batu Caves & Genting Cable Car", "Sentosa Wings of Time", "3-Star Accommodations"],
    badge: "Family Favorite",
    destinationIds: ["singapore-malaysia"],
  },
  {
    id: "singapore-4d",
    title: "Singapore - 03 Nights and 04 Days Itinerary",
    image: "/images/gallery/singapore-merlion-park-marina-bay.jpg",
    destination: "Singapore",
    country: "Singapore",
    duration: "03 Nights and 04 Days",
    price: 54000,
    originalPrice: 66000,
    rating: 4.9,
    reviews: 145,
    inclusions: ["Round-trip Flights", "Sentosa Island Cable Car", "Merlion Park City Tour", "Value Thomson Hotel"],
    badge: "City Break",
    destinationIds: ["singapore-malaysia"],
  },
  {
    id: "thailand-malaysia-singapore-9d",
    title: "Thailand Malaysia Singapore - 08 Nights and 09 Days Trio",
    image: "/images/thailand-malaysia-singapore-trio.jpg",
    destination: "Bangkok, Kuala Lumpur & Singapore",
    country: "Thailand, Malaysia & Singapore",
    duration: "08 Nights and 09 Days",
    price: 92000,
    originalPrice: 110000,
    rating: 5.0,
    reviews: 215,
    inclusions: ["All 4 Flight Sectors", "Coral Island Speedboat Tour", "Genting Cable Car & Batu Caves", "Sentosa Island Excursion"],
    badge: "Grand Trio Tour",
    destinationIds: ["thailand", "singapore-malaysia"],
  },
  {
    id: "europe-11d",
    title: "Grand Europe (France, Swiss & Italy) - 10 Nights and 11 Days",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80",
    destination: "Paris, Swiss Alps & Rome",
    country: "Schengen Europe",
    duration: "10 Nights and 11 Days",
    price: 195000,
    originalPrice: 230000,
    rating: 4.9,
    reviews: 98,
    inclusions: ["All Flights & Swiss Rail", "Eiffel Tower Admission", "Mt. Titlis Cable Car", "Colosseum Guided Tour"],
    badge: "Bucket List",
    destinationIds: ["paris-europe"],
  },
  {
    id: "japan-7d",
    title: "Japan Golden Route (Tokyo, Mt. Fuji & Kyoto) - 06 Nights 07 Days",
    image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&q=80",
    destination: "Tokyo, Mt. Fuji & Kyoto, Japan",
    country: "Japan",
    duration: "06 Nights and 07 Days",
    price: 145000,
    originalPrice: 175000,
    rating: 4.9,
    reviews: 112,
    inclusions: ["Round-trip Flights", "Shinkansen Bullet Train", "Mt. Fuji 5th Station", "Kyoto Temples & Torii"],
    badge: "Premium Experience",
    destinationIds: ["tokyo-japan"],
  },
  {
    id: "vietnam-6d",
    title: "Vietnam Highlights (Hanoi, Ha Long Bay & Da Nang) - 05N/06D",
    image: "/images/gallery/vietnam-highlights-collage-card.png",
    destination: "Hanoi, Ha Long Bay & Da Nang, Vietnam",
    country: "Vietnam",
    duration: "05 Nights and 06 Days",
    price: 58000,
    originalPrice: 70000,
    rating: 4.9,
    reviews: 165,
    inclusions: ["Overnight Ha Long Cruise", "4-Star Hotels with Breakfast", "Hanoi Train Street & City Tour", "Hoi An Lantern River Boat"],
    badge: "Trending Choice",
    destinationIds: ["vietnam"],
  },
  {
    id: "vietnam-8d",
    title: "Let's Explore Vietnam & Ba Na Hills - 07 Nights and 08 Days",
    image: "/images/gallery/vietnam-highlights-collage-card.jpg",
    destination: "Hanoi, Ha Long Bay, Da Nang & Ba Na Hills",
    country: "Vietnam",
    duration: "07 Nights and 08 Days",
    price: 76000,
    originalPrice: 92000,
    rating: 4.9,
    reviews: 184,
    inclusions: ["Overnight Luxury Cruise", "Ba Na Hills & Golden Bridge", "VinWonders Safari Passes", "All Domestic & Int'l Flights"],
    badge: "Premium & Ba Na Hills",
    destinationIds: ["vietnam"],
  },
  {
    id: "philippines-6d",
    title: "Boracay White Beach & Manila Discovery - 05 Nights 06 Days",
    image: "/images/gallery/philippines-boracay-beach-bangka-boats.png",
    destination: "Boracay & Manila, Philippines",
    country: "Philippines",
    duration: "05 Nights and 06 Days",
    price: 72000,
    originalPrice: 86000,
    rating: 4.9,
    reviews: 128,
    inclusions: ["All 4 Flight Sectors", "Boracay Island Hopping Boat Tour", "Manila Intramuros Tour", "Beach Resort Accommodation"],
    badge: "Beach Paradise",
    destinationIds: ["philippines"],
  },
  {
    id: "maldives-4d",
    title: "Maldives Overwater Villa Resort - 03 Nights and 04 Days",
    image: "/images/gallery/maldives-overwater-bungalows-aerial-lagoon.png",
    destination: "Maldives Resort Island",
    country: "Maldives",
    duration: "03 Nights and 04 Days",
    price: 85000,
    originalPrice: 105000,
    rating: 5.0,
    reviews: 142,
    inclusions: ["Round-trip Flights", "Speedboat Airport Transfers", "Overwater Villa Stay", "All-Inclusive Dining"],
    badge: "Ultra Luxury",
    destinationIds: ["maldives"],
  },
  {
    id: "china-beijing-shanghai-8d",
    title: "China Highlights (Beijing & Shanghai) - 07 Nights and 08 Days",
    image: "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800&q=80",
    destination: "Beijing & Shanghai, China",
    country: "China",
    duration: "07 Nights and 08 Days",
    price: 135000,
    originalPrice: 158000,
    rating: 4.9,
    reviews: 116,
    inclusions: ["Mutianyu Great Wall Cable Car", "Forbidden City & Tiananmen", "High-Speed Bullet Train", "The Bund & Huangpu Cruise"],
    badge: "Wonders of the World",
    destinationIds: ["china"],
  },
];

function findDestinationBySlug(rawSlug: string): DestinationMeta | undefined {
  const decoded = decodeURIComponent(rawSlug).toLowerCase().trim();
  // Normalize slug to tokens
  const cleanTokens = decoded.replace(/[^a-z0-9]/g, " ").split(/\s+/).filter(Boolean);

  // Exact ID match
  let found = DESTINATIONS_DIRECTORY.find((d) => d.id === decoded);
  if (found) return found;

  // Check matching tokens with keywords
  let bestMatch: DestinationMeta | undefined;
  let maxScore = 0;

  for (const dest of DESTINATIONS_DIRECTORY) {
    let score = 0;
    for (const token of cleanTokens) {
      if (dest.keywords.some((k) => k.includes(token) || token.includes(k))) {
        score += 2;
      }
      if (dest.name.toLowerCase().includes(token)) {
        score += 3;
      }
      if (dest.country.toLowerCase().includes(token)) {
        score += 3;
      }
    }
    if (score > maxScore) {
      maxScore = score;
      bestMatch = dest;
    }
  }

  return maxScore > 0 ? bestMatch : undefined;
}

export async function generateStaticParams() {
  return DESTINATIONS_DIRECTORY.map((d) => ({ slug: d.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const destination = findDestinationBySlug(slug);

  if (!destination) {
    return {
      title: "Popular Travel Destinations & Packages | Skywalk Holidays",
      description: "Explore all-inclusive holiday tour packages from Kathmandu with Skywalk Holidays.",
    };
  }

  const title = `${destination.name} Tour Packages from Nepal | Skywalk Holidays`;
  const description = `Book handpicked ${destination.name} holiday tour packages from Kathmandu with Skywalk Holidays. ${destination.subtitle}. Flight bookings, hotels, visa assistance & guided excursions. Starting from NPR ${destination.startingPrice.toLocaleString("en-US")}.`;
  const canonicalUrl = `https://skywalkholidays.com/destinations/${destination.id}`;
  const imageUrl = destination.image.startsWith("http")
    ? destination.image
    : `https://skywalkholidays.com${destination.image}`;

  return {
    title,
    description,
    keywords: [
      `${destination.country.toLowerCase()} tour package from nepal`,
      `${destination.name.toLowerCase()} holiday from kathmandu`,
      ...destination.keywords,
      "best travel agency in nepal",
      "tour and travel company in nepal",
      "skywalk holidays packages",
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "Skywalk Holidays",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${destination.name} Tour Packages from Nepal`,
        },
      ],
      locale: "en_NP",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function DestinationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const destination = findDestinationBySlug(slug);

  if (!destination) {
    // If slug completely unknown, return 404
    notFound();
  }

  // Filter packages for this destination
  const matchedPackages = ALL_PACKAGES.filter((pkg) => {
    if (pkg.destinationIds?.includes(destination.id)) return true;
    const destStr = (pkg.destination + " " + pkg.country + " " + pkg.title).toLowerCase();
    return destination.keywords.some((k) => destStr.includes(k));
  });

  const displayPackages = matchedPackages.length > 0 ? matchedPackages : ALL_PACKAGES.slice(0, 4);

  const whatsappMessage = `Hello Skywalk Holidays! I am interested in booking a holiday package for ${destination.name}. Please share available departure dates and pricing.`;
  const whatsappUrl = buildCustomWhatsAppLink(whatsappMessage);

  const canonicalUrl = `https://skywalkholidays.com/destinations/${destination.id}`;
  const imageUrl = destination.image.startsWith("http")
    ? destination.image
    : `https://skywalkholidays.com${destination.image}`;

  const destinationSchema = {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    name: destination.name,
    description: destination.description,
    image: imageUrl,
    url: canonicalUrl,
    touristType: ["Adventure Tourism", "Cultural Tourism", "Family Tourism", "Honeymoon"],
    includesAttraction: destination.highlights.map((h) => ({
      "@type": "TouristAttraction",
      name: h,
    })),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      bestRating: "5.0",
      reviewCount: "380",
    },
  };

  const breadcrumbsSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://skywalkholidays.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "International Packages",
        item: "https://skywalkholidays.com/services/packages/international",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: destination.name,
        item: canonicalUrl,
      },
    ],
  };

  const packagesItemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${destination.name} Holiday Packages from Nepal`,
    itemListElement: displayPackages.map((pkg, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "TouristTrip",
        name: pkg.title,
        description: `${pkg.duration} holiday in ${pkg.destination} offered by Skywalk Holidays Nepal.`,
        url: `https://skywalkholidays.com/packages/${pkg.id}`,
        offers: {
          "@type": "Offer",
          price: pkg.price,
          priceCurrency: "NPR",
          availability: "https://schema.org/InStock",
        },
      },
    })),
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(destinationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(packagesItemListSchema) }}
      />
      {/* 1. Destination Hero Banner */}
      <section className="relative min-h-[420px] sm:min-h-[480px] md:min-h-[520px] flex items-center overflow-hidden bg-[#0a1628] text-white">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src={destination.image}
            alt={destination.name}
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          {/* Multi-layered dark gradient overlays for crystal-clear readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a1628]/95 via-[#0a1628]/80 to-[#0a1628]/60 z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] via-transparent to-[#0a1628]/50 z-10" />
        </div>

        <div className="container-custom relative z-20 py-12 md:py-20">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-white/70 mb-4 sm:mb-6">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight size={12} className="text-white/40" />
            <Link href="/services/packages/international" className="hover:text-white transition-colors">
              Destinations
            </Link>
            <ChevronRight size={12} className="text-white/40" />
            <span className="text-[#0ea5e9] font-semibold">{destination.country}</span>
          </nav>

          <div className="max-w-3xl">
            {/* Country Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-1.5 mb-4 shadow-lg">
              <span className="text-base">{destination.flag}</span>
              <span className="text-xs font-bold text-white tracking-wider uppercase">
                {destination.badge}
              </span>
            </div>

            {/* Destination Title */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-tight mb-4 drop-shadow-md">
              {destination.name}
            </h1>

            {/* Subtitle / Description */}
            <p className="text-sm sm:text-base md:text-lg text-white/85 leading-relaxed mb-6 font-normal">
              {destination.description}
            </p>

            {/* Key Quick Facts Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15">
                <span className="text-[11px] text-slate-300 block uppercase font-semibold">
                  Starting From
                </span>
                <span className="text-base sm:text-lg font-black text-amber-400">
                  NPR {destination.startingPrice.toLocaleString("en-US")}
                </span>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15">
                <span className="text-[11px] text-slate-300 block uppercase font-semibold">
                  Packages Available
                </span>
                <span className="text-base sm:text-lg font-black text-emerald-400">
                  {displayPackages.length} Handpicked Tours
                </span>
              </div>

              <div className="col-span-2 sm:col-span-1 bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15">
                <span className="text-[11px] text-slate-300 block uppercase font-semibold">
                  Flight Duration
                </span>
                <span className="text-xs sm:text-sm font-bold text-white truncate block">
                  {destination.flightDuration}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="#related-packages"
                className="inline-flex items-center gap-2 bg-[#f97316] hover:bg-[#ea580c] text-white font-bold px-6 py-3.5 rounded-full text-xs sm:text-sm shadow-xl shadow-orange-500/25 transition-all duration-300 hover:scale-105"
              >
                <span>View {displayPackages.length} Packages Below</span>
                <ArrowRight size={16} />
              </a>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-6 py-3.5 rounded-full text-xs sm:text-sm shadow-xl transition-all duration-300 hover:scale-105"
              >
                <MessageSquare size={16} />
                <span>Instant WhatsApp Inquiry</span>
              </a>

              {destination.visaLink && (
                <Link
                  href={destination.visaLink}
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold px-5 py-3.5 rounded-full text-xs sm:text-sm border border-white/20 backdrop-blur-md transition-colors"
                >
                  <FileCheck size={16} className="text-[#0ea5e9]" />
                  <span>Visa Assistance Desk</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Destination Highlights & Travel Guide Card */}
      <section className="container-custom -mt-8 relative z-30 mb-12">
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/80 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="flex items-center gap-2 text-[#0ea5e9] font-bold text-xs uppercase tracking-wider mb-2">
              <Calendar size={14} />
              <span>Best Time to Travel</span>
            </div>
            <p className="text-sm font-semibold text-[#0a1628] leading-relaxed">
              {destination.bestTimeToVisit}
            </p>
            <p className="text-xs text-[#64748b] mt-1">
              Guaranteed peak season and holiday departures with live airline seat bookings.
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-wider mb-2">
              <ShieldCheck size={14} />
              <span>Visa &amp; Entry Requirements</span>
            </div>
            <p className="text-sm font-semibold text-[#0a1628] leading-relaxed">
              {destination.visaGuidance}
            </p>
            <Link
              href="/services/visa"
              className="text-xs text-[#0ea5e9] font-bold inline-flex items-center gap-1 mt-1 hover:underline"
            >
              <span>Read 2026 Visa Checklist</span>
              <ArrowRight size={11} />
            </Link>
          </div>

          <div>
            <div className="flex items-center gap-2 text-amber-500 font-bold text-xs uppercase tracking-wider mb-2">
              <Sparkles size={14} />
              <span>Tour Inclusions Guaranteed</span>
            </div>
            <ul className="text-xs text-[#334155] space-y-1.5 font-medium">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                <span>Round-trip flights with 20kg baggage</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                <span>3-Star &amp; 4-Star hotels with daily breakfast</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                <span>Private airport transfers &amp; guided sightseeing</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 3. Main Packages Showcase Section */}
      <section id="related-packages" className="container-custom pb-16 scroll-mt-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-[#e0f2fe] text-[#0ea5e9] px-3 py-1 rounded-full text-xs font-bold mb-2">
              <Compass size={13} />
              <span>Related Holiday Packages</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#0a1628] tracking-tight">
              All Packages for {destination.name}
            </h2>
            <p className="text-xs sm:text-sm text-[#64748b] mt-1 max-w-2xl">
              Showing {displayPackages.length} available tour packages with complete day-by-day itineraries, flight arrangements, and transparent NPR pricing.
            </p>
          </div>

          <Link
            href="/services/packages/international"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#0ea5e9] hover:text-[#0284c7] transition-colors self-start md:self-auto"
          >
            <span>View All International Packages</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {displayPackages.map((pkg) => (
            <PackageCard key={pkg.id} {...pkg} />
          ))}
        </div>
      </section>

      {/* 4. Bottom CTA */}
      <CTABanner />
    </div>
  );
}
