"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock, MapPin, Check, Filter, MessageSquare, Eye, Star, ArrowRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { useSearchParams } from "next/navigation";

export interface PackageItem {
  id: string;
  title: string;
  destination: string;
  country: string;
  duration: string; // e.g. "5 Nights / 6 Days"
  daysCount: number;
  price: number;
  originalPrice: number;
  category: "International Holidays" | "Honeymoon Packages" | "Family Tours" | "Adventure Tours" | "Group Tours";
  badge: string;
  rating: number;
  reviewsCount: number;
  image: string;
  shortDescription: string;
  highlights?: string[];
  inclusions: string[];
}

const PACKAGES_DATA: PackageItem[] = [
  {
    id: "bangkok-pattaya-6d",
    title: "Bangkok Pattaya - 05 Nights and 06 Day Itinerary",
    destination: "Bangkok & Pattaya",
    country: "Thailand",
    duration: "05 Nights and 06 Days",
    daysCount: 6,
    price: 48000,
    originalPrice: 58000,
    category: "International Holidays",
    badge: "Best Seller",
    rating: 4.9,
    reviewsCount: 218,
    image: "/images/bangkok-pattaya.png",
    shortDescription: "Explore coastal Pattaya and vibrant Bangkok. Includes Coral Island speedboat tour with Indian buffet lunch, Wat Traimitr 5.5-ton solid gold Buddha, Wat Pho Reclining Buddha, and market shopping.",
    inclusions: [
      "Round-trip Flights",
      "Private Airport Transfers",
      "3-Star Hotels with Breakfast",
      "Coral Island Tour & Lunch",
      "Bangkok City & Temple Tour",
    ],
  },
  {
    id: "bali-malaysia-7d",
    title: "Bali Malaysia - 06 Nights and 07 Day Itinerary",
    destination: "Bali & Kuala Lumpur",
    country: "Indonesia & Malaysia",
    duration: "06 Nights and 07 Days",
    daysCount: 7,
    price: 78000,
    originalPrice: 92000,
    category: "International Holidays",
    badge: "Top Rated",
    rating: 4.9,
    reviewsCount: 184,
    image: "/images/bali-kelingking.jpg",
    shortDescription:
      "A dual-country journey blending Bali's volcanic landscapes, sacred water temples, and Ubud art markets with Kuala Lumpur's modern skyline, Batu Caves, and Genting Highlands.",
    highlights: [
      "Round-trip airfare & inter-country flights",
      "Kintamani Mount Batur volcano view & Luwak coffee plantation tasting",
      "Pura Taman Ayun, Ulun Danu Bratan & Tanah Lot sea temple",
      "Batu Caves temple & Genting Highlands scenic cable car",
      "Full-day Kuala Lumpur city tour with Petronas Twin Towers",
      "3-Star hotel accommodations with daily breakfast",
    ],
    inclusions: [
      "Round-trip international flights",
      "Private airport transfers (all other transfers on SIC basis)",
      "3-Star hotel accommodation with daily breakfast",
      "City & temple tours across Bali",
      "Genting Highlands cable car ride",
      "Batu Caves & Kuala Lumpur city tour",
    ],
  },
  {
    id: "bangkok-pattaya-8d",
    title: "Bangkok Pattaya - 07 Nights and 08 Day Itinerary",
    destination: "Bangkok & Pattaya",
    country: "Thailand",
    duration: "07 Nights and 08 Days",
    daysCount: 8,
    price: 56000,
    originalPrice: 68000,
    category: "International Holidays",
    badge: "Extended Holiday",
    rating: 4.9,
    reviewsCount: 142,
    image: "/images/gallery/sanctuary-of-truth-pattaya.png",
    shortDescription:
      "8-day Thailand getaway. Coral Island speedboat tour with lunch, Pattaya exploration of Sanctuary of Truth, White Buddha & Alcazar Show, Bangkok City Tour with Golden Temple & Reclining Buddha, plus 3 full free shopping and leisure days.",
    inclusions: [
      "Round-trip International Flights",
      "Private Suvarnabhumi Airport Transfers",
      "Welcome Plaza Hotel & Bangkok 3-Star Hotels",
      "Coral Island Speedboat Tour & Lunch",
      "Sanctuary of Truth, White Buddha & Alcazar Show",
      "Bangkok Temples: Golden Buddha & Reclining Buddha",
      "3 Full Leisure & Shopping Days in Bangkok",
    ],
  },
  {
    id: "bangkok-pattaya-phuket-8d",
    title: "Bangkok Pattaya Phuket - 07 Nights and 08 Day Itinerary",
    destination: "Bangkok, Pattaya & Phuket",
    country: "Thailand",
    duration: "07 Nights and 08 Days",
    daysCount: 8,
    price: 68000,
    originalPrice: 82000,
    category: "International Holidays",
    badge: "Island & City Combo",
    rating: 4.9,
    reviewsCount: 196,
    image: "/images/gallery/thailand-phi-phi-maya-bay.png",
    shortDescription:
      "The definitive Thailand tri-city experience covering bustling Bangkok, coastal Pattaya, and tropical Phuket. Includes Coral Island speedboat with Indian lunch, Bangkok Golden & Reclining Buddha temples, flight to Phuket, Phi Phi Island & Maya Bay tour with lunch, Patong Beach, and free shopping days.",
    inclusions: [
      "Round-trip International & Domestic Flights (BKK ⇄ HKT)",
      "Private Airport Pick up & Drop in all cities",
      "3-Star Hotel Accommodations with Daily Breakfast",
      "Coral Island Speedboat Tour with Indian Lunch",
      "Bangkok City Tour: Golden Buddha & Reclining Buddha",
      "Phi Phi Island Tour & Maya Bay with Beachside Lunch",
      "Leisure & Shopping Day at Chatuchak & Pratunam",
    ],
  },
  {
    id: "bangkok-pattaya-5d",
    title: "Bangkok Pattaya - 04 Nights and 05 Day Itinerary",
    destination: "Bangkok & Pattaya",
    country: "Thailand",
    duration: "04 Nights and 05 Days",
    daysCount: 5,
    price: 42000,
    originalPrice: 52000,
    category: "International Holidays",
    badge: "Value Deal",
    rating: 4.9,
    reviewsCount: 168,
    image: "/images/gallery/pattaya-coral-island-platinum-speedboat.jpg",
    shortDescription:
      "A fast-paced 5-day holiday covering coastal Pattaya and Bangkok. Includes private airport transfer to Welcome Plaza or Phuphaya Hotel, full-day Coral Island tour with lunch, guided Bangkok temple tour to Wat Traimitr & Wat Pho, free shopping day, and single-entry Thailand visa.",
    inclusions: [
      "Round-trip Airfare (Kathmandu ⇄ Bangkok)",
      "Private Airport Pick-up & Drop",
      "Welcome Plaza or Phuphaya Hotel Pattaya",
      "3-Star Bangkok Hotel with Daily Breakfast",
      "Coral Island Tour with Lunch",
      "Bangkok City & Temple Tour (Wat Traimitr & Wat Pho)",
      "Thailand Single Entry Visa Fee Included",
    ],
  },
  {
    id: "krabi-phuket-bangkok-8d",
    title: "Krabi Phuket Bangkok - 07 Nights and 08 Day Itinerary",
    destination: "Krabi, Phuket & Bangkok",
    country: "Thailand",
    duration: "07 Nights and 08 Days",
    daysCount: 8,
    price: 74000,
    originalPrice: 89000,
    category: "International Holidays",
    badge: "Ultimate Islands",
    rating: 4.9,
    reviewsCount: 175,
    image: "/images/gallery/thailand-krabi-island-boat.jpg",
    shortDescription:
      "The ultimate 8-day Thailand island hopping & city adventure. Includes all international & domestic flights (Bangkok ⇄ Phuket & Krabi ⇄ Bangkok), Princeton Hotel Bangkok, Grand Phoenix Hotel Phuket, and Ao Nang Hotel Krabi. Features Phi Phi Island & Maya Bay tour with lunch, scenic Phuket-to-Krabi coastal transfer, Krabi 4 Island Tour with lunch, free shopping day in Bangkok, and Thailand visa included.",
    inclusions: [
      "All International & Domestic Flights (BKK ⇄ HKT & KBV ⇄ BKK)",
      "Private Airport Transfers & Scenic Phuket to Krabi Drive",
      "3-Star Accommodations (Princeton BKK, Grand Phoenix HKT, Ao Nang KBV)",
      "Phi Phi Island Tour & Maya Bay with Beachside Lunch",
      "Krabi 4 Island Tour (Chicken, Tup Sandbank, Poda & Phra Nang) with Lunch",
      "Free Leisure & Shopping Day in Bangkok (Chatuchak & Pratunam)",
      "Thailand Single Entry Visa Fee Included",
    ],
  },
  {
    id: "malaysia-singapore-6d",
    title: "Malaysia Singapore - 05 Nights and 06 Day Itinerary",
    destination: "Singapore & Kuala Lumpur",
    country: "Singapore & Malaysia",
    duration: "05 Nights and 06 Days",
    daysCount: 6,
    price: 68000,
    originalPrice: 82000,
    category: "International Holidays",
    badge: "City & Thrills",
    rating: 4.9,
    reviewsCount: 152,
    image: "/images/gallery/malaysia-petronas-towers-flag-night.png",
    shortDescription:
      "A thrilling 6-day twin-country holiday across Singapore and Malaysia. Includes Value Thomson Hotel Singapore, Merlion Park & Civic District city tour, Sentosa Island with 1-way cable car and Wings of Time show, luxury coach to Kuala Lumpur, Genting Highlands with Skyway cable car, 400-million-year-old Batu Caves, and half-day Kuala Lumpur city tour.",
    inclusions: [
      "Round-trip International Airfare (Kathmandu ⇄ Singapore / KL ⇄ Kathmandu)",
      "Private Airport Pick-up and Drop Transfers",
      "Value Thomson Hotel Singapore & 3-Star Kuala Lumpur Hotel with Daily Breakfast",
      "Singapore City Tour & Merlion Park Photo Stop",
      "Sentosa Island Tour with 1-way Cable Car & Wings of Time Show Pass",
      "Cross-Border Luxury Coach Transfer to Kuala Lumpur",
      "Genting Highlands Tour with 1-way Skyway Cable Car",
      "Historic Batu Caves & 42.7m Golden Lord Muruga Statue",
      "Half-day Kuala Lumpur City Tour (National Monument, King's Palace, Jamek Mosque)",
      "Singapore & Malaysia Visa Assistance Included",
    ],
  },
  {
    id: "maldives-4d",
    title: "Maldives - 03 Nights and 04 Day Itinerary",
    destination: "Malé & Hulhumalé",
    country: "Maldives",
    duration: "03 Nights and 04 Days",
    daysCount: 4,
    price: 85000,
    originalPrice: 105000,
    category: "Honeymoon Packages",
    badge: "Ocean Getaway",
    rating: 4.9,
    reviewsCount: 138,
    image: "/images/gallery/maldives-overwater-bungalows-aerial-lagoon.png",
    shortDescription:
      "Turquoise waters, white sandbanks, and unforgettable ocean moments in the Maldives. Includes round-trip international airfare, private airport meet-and-greet transfers, 3-star Hulhumalé beachfront hotel with daily breakfast, secluded sandbank island trip, guided coral reef snorkeling, and romantic sunset dolphin cruise.",
    inclusions: [
      "Round-trip International Airfare (Kathmandu ⇄ Malé)",
      "Private Airport Pick-up & Hotel Drop-off Transfers",
      "3 Nights Accommodation at 3-Star Hotel in Hulhumalé",
      "Daily Breakfast at Hotel",
      "Secluded White Sandbank Visit Surrounded by Open Sea",
      "Guided Snorkeling with Tropical Reef Fishes & Corals",
      "Sunset Dolphin Cruise Sail on Calm Waters",
      "Free 30-Day Visa on Arrival for Nepali Passport Holders",
    ],
  },
  {
    id: "philippines-6d",
    title: "Philippines - 05 Nights and 06 Day Itinerary",
    destination: "Manila & Boracay",
    country: "Philippines",
    duration: "05 Nights and 06 Days",
    daysCount: 6,
    price: 89000,
    originalPrice: 108000,
    category: "International Holidays",
    badge: "Island Hopping",
    rating: 4.9,
    reviewsCount: 164,
    image: "/images/gallery/philippines-boracay-beach-bangka-boats.png",
    shortDescription:
      "Experience the ultimate tropical getaway across Manila and Boracay. Includes round-trip international & domestic flights, private Manila airport transfers, 3-star Manila hotel & Boracay beachfront resort, full Boracay island hopping tour with Puka Beach & Filipino buffet lunch, and comprehensive Manila heritage city tour.",
    highlights: [
      "Round-trip international flights (Kathmandu ⇄ Manila) & domestic flights (Manila ⇄ Boracay)",
      "Private airport transfers upon arrival & departure in Manila",
      "Full Boracay Island Hopping boat tour with Puka Beach & scenic snorkeling",
      "Delicious Filipino-style buffet lunch on the island tour",
      "Full Manila City Tour (Intramuros, Fort Santiago, Manila Cathedral, Rizal Park, San Agustin, BGC)",
      "3-Star hotel & beach resort stays with daily breakfast",
    ],
    inclusions: [
      "Round-trip airfare (Int'l + Domestic flights)",
      "Private airport pick-up and drop-off in Manila",
      "All transfers on PVT/SIC basis",
      "3-star hotel & resort accommodation with daily breakfast",
      "Boracay Island Hopping boat tour with lunch & snorkeling",
      "Manila City Tour with historic landmarks & BGC",
      "SkyWalk Tours visa assistance for Nepali passport holders",
    ],
  },
  {
    id: "philippines-8d",
    title: "Philippines - 07 Nights and 08 Day Itinerary",
    destination: "Manila & Boracay",
    country: "Philippines",
    duration: "07 Nights and 08 Days",
    daysCount: 8,
    price: 98000,
    originalPrice: 118000,
    category: "International Holidays",
    badge: "Extended Island Escape",
    rating: 4.9,
    reviewsCount: 182,
    image: "/images/gallery/philippines-el-nido-palawan-aerial-lagoon.png",
    shortDescription:
      "The comprehensive 8-day Philippine getaway. Features Manila's Spanish colonial monuments, domestic flights to Boracay, Puka Beach island hopping with Filipino buffet lunch, dedicated free days at leisure in Boracay and Manila, and full Manila city heritage tour.",
    highlights: [
      "Round-trip international flights (Kathmandu ⇄ Manila) & domestic flights (Manila ⇄ Boracay)",
      "Private airport transfers upon arrival & departure in Manila",
      "Full Boracay Island Hopping boat tour with Puka Beach & vibrant coral reef snorkeling",
      "Authentic Filipino-style buffet lunch on the island tour",
      "Full Free Day in Boracay – Explore White Beach or try parasailing & water sports",
      "Comprehensive Manila City Tour: Intramuros, Fort Santiago, Manila Cathedral, Rizal Park & BGC",
      "Full Free Day in Manila – Explore SM Mall of Asia, Makati, and cultural markets",
      "3-Star hotel & beach resort stays with daily buffet breakfast",
    ],
    inclusions: [
      "Round-trip airfare (Int'l + Domestic flights)",
      "Private airport pick-up and drop-off in Manila",
      "All transfers on PVT/SIC basis",
      "3-star hotel & beachfront resort accommodation with daily breakfast",
      "Boracay Island Hopping boat tour with lunch & snorkeling",
      "Manila City Tour with historic landmarks & BGC",
      "2 Dedicated Free Days at leisure in Boracay and Manila",
      "SkyWalk Tours visa assistance for Nepali passport holders",
    ],
  },
  {
    id: "phuket-bangkok-6d",
    title: "Phuket & Bangkok - 05 Nights and 06 Day Itinerary",
    destination: "Phuket & Bangkok",
    country: "Thailand",
    duration: "05 Nights and 06 Days",
    daysCount: 6,
    price: 58000,
    originalPrice: 70000,
    category: "International Holidays",
    badge: "Island & City Combo",
    rating: 4.9,
    reviewsCount: 188,
    image: "/images/gallery/phuket-phi-phi-maya-bay-boats.png",
    shortDescription:
      "A perfect blend of island bliss in Phuket and dynamic city energy in Bangkok. Features international and domestic flights, private airport transfers, full-day Phi Phi Islands speedboat tour with buffet lunch, sacred Bangkok temple tour (Reclining & Golden Buddha), and dedicated free shopping day in Bangkok.",
    highlights: [
      "Round-trip international flights (Kathmandu ⇄ Bangkok) & domestic flights (Bangkok ⇄ Phuket)",
      "Private airport transfers upon arrival & departure in Bangkok and Phuket",
      "Full-day Phi Phi Islands tour with Maya Bay, emerald lagoons & snorkeling",
      "Delicious Thai buffet lunch on the beach during the island tour",
      "Bangkok City & Temple Tour: Wat Pho Reclining Buddha & Wat Traimit Golden Buddha",
      "Full Free Day in Bangkok – Shop at Chatuchak Weekend Market & Pratunam wholesale market",
      "3-Star hotel accommodations with daily buffet breakfast",
      "Thailand Tourist Visa fee included in package",
    ],
    inclusions: [
      "Round-trip airfare (Int'l + Domestic flights)",
      "Private airport pick-up and drop-off in Bangkok and Phuket",
      "All transfers on PVT/SIC basis",
      "3-star hotel accommodation with daily breakfast (Princeton Bangkok & Grand Phoenix Phuket)",
      "Phi Phi Island tour with lunch & snorkeling gear",
      "Bangkok Temple sightseeing (Wat Pho & Wat Traimit)",
      "Thailand single-entry tourist visa included",
    ],
  },
  {
    id: "singapore-4d",
    title: "Singapore - 03 Nights and 04 Days Itinerary",
    destination: "Singapore",
    country: "Singapore",
    duration: "03 Nights and 04 Days",
    daysCount: 4,
    category: "International Holidays",
    price: 54000,
    originalPrice: 66000,
    badge: "City Break",
    rating: 4.9,
    reviewsCount: 145,
    image: "/images/gallery/singapore-merlion-park-marina-bay.jpg",
    shortDescription:
      "A dynamic 4-day cosmopolitan escape in Singapore. Includes round-trip flights, private airport transfers, stay at Value Thomson (or similar 3-star), guided Civic District and Merlion Park city tour, Sentosa Island excursion with 1-way cable car and Wings of Time first show pass, plus a free day to discover Singapore Botanic Gardens and Gardens by the Bay.",
    highlights: [
      "Round-trip airfare from Kathmandu to Singapore",
      "Private airport transfers on arrival and departure",
      "3 Nights stay at Value Thomson Hotel (or similar 3-star)",
      "Daily international breakfast at hotel",
      "Guided Singapore Half-Day City Tour: Civic District & Merlion Park",
      "Sentosa Island Tour with 1-Way Cable Car ride included",
      "Wings of Time 1st show pass included",
      "Free day to explore Marina Bay skyline & Gardens by the Bay",
      "Free visa / visa assistance for Nepali passport holders",
    ],
    inclusions: [
      "Round-trip international airfare",
      "Private airport pick-up and drop-off",
      "All transfers on PVT / SIC basis",
      "3-star hotel accommodation (Value Thomson or similar)",
      "Daily breakfast at hotel",
      "Sentosa Island tour with 1-way Cable Car & Wings of Time show",
      "Singapore City Tour & Merlion Park",
    ],
  },
  {
    id: "sri-lanka-thailand-7d",
    title: "Sri Lanka & Thailand - 06 Nights and 07 Days Itinerary",
    destination: "Bangkok, Pattaya & Colombo",
    country: "Sri Lanka & Thailand",
    duration: "06 Nights and 07 Days",
    daysCount: 7,
    category: "International Holidays",
    price: 72000,
    originalPrice: 86000,
    badge: "Twin Country Special",
    rating: 4.9,
    reviewsCount: 162,
    image: "/images/gallery/sri-lanka-national-flag-flying-sky.png",
    shortDescription:
      "A thrilling 7-day dual-country discovery uniting the vibrant seaside wonders of Pattaya and the sacred temples of Bangkok with the rich coastal charm and heritage of Colombo, Sri Lanka. Includes international and inter-country flights, private transfers, Coral Island speedboat tour with Indian buffet lunch, Bangkok temple tour (Wat Pho & Wat Traimit), and a guided half-day Colombo city tour.",
    highlights: [
      "Round-trip airfare + Inter-country flight from Thailand to Sri Lanka",
      "Private airport transfers upon arrival & departure in all destinations",
      "3-star hotel accommodation with daily breakfast (Pattaya, Bangkok & Colombo)",
      "Speedboat tour to Coral Island (Koh Larn) with Indian buffet lunch",
      "Bangkok Temple Tour: Wat Traimit (5.5-Ton Golden Buddha) & Wat Pho (Reclining Buddha)",
      "Pattaya exploration with Walking Street, Viewpoint & Sanctuary of Truth options",
      "Half-day guided Colombo City Tour visiting major heritage & shopping attractions",
      "Comprehensive visa assistance for Nepali passport holders",
    ],
    inclusions: [
      "Round-trip international flights + inter-country flight",
      "Private airport pick-up and drop-off in Thailand & Sri Lanka",
      "All transfers on PVT / SIC basis",
      "3-star hotel accommodations with daily breakfast",
      "Coral Island tour by speedboat with Indian buffet lunch",
      "Bangkok city and temple sightseeing tour (Wat Pho & Wat Traimit)",
      "Colombo half-day city tour",
    ],
  },
  {
    id: "thailand-vietnam-8d",
    title: "Thailand & Vietnam - 07 Nights and 08 Days Itinerary — Hanoi",
    destination: "Bangkok, Pattaya, Hanoi & Halong Bay",
    country: "Thailand & Vietnam",
    duration: "07 Nights and 08 Days",
    daysCount: 8,
    category: "International Holidays",
    price: 78000,
    originalPrice: 94000,
    badge: "Cruise & Twin Country",
    rating: 4.9,
    reviewsCount: 176,
    image: "/images/gallery/halong-bay-luxury-yacht-cruise-sunset.png",
    shortDescription:
      "An extraordinary 8-day dual-country odyssey uniting the tropical excitement of Pattaya and sacred temples of Bangkok with the historic heritage of Hanoi and an unforgettable overnight luxury cruise amidst the emerald karsts of Halong Bay.",
    highlights: [
      "Round-trip international flights from Kathmandu plus Bangkok to Hanoi inter-country airfare",
      "Private and SIC transfers with professional English-speaking drivers throughout",
      "Exciting Coral Island (Koh Larn) speedboat excursion with Indian buffet lunch",
      "Bangkok City & Temple Tour: Wat Traimitr (5.5-Ton Golden Buddha) & Wat Pho (Reclining Buddha)",
      "Unforgettable Halong Bay 2-Day/1-Night Luxury Cruise with full-board gourmet meals",
      "Cruise excursions: Surprise Cave (Sung Sot), Titov Island panoramic peak & Luon Cave bamboo boat",
      "Sunset party, sundeck Tai Chi morning session & authentic Vietnamese cooking class",
      "Hanoi City Tour: Ho Chi Minh Complex, Ba Dinh Square, One Pillar Pagoda, Temple of Literature & Hoan Kiem Lake",
      "Vietnam visa letter provided by SkyWalk Holidays",
    ],
    inclusions: [
      "Vietnam Visa approval letter provided",
      "7 Nights accommodation with daily breakfast (including 1 Night Halong Bay Cruise cabin)",
      "Transfers by private or shared (PVT/SIC) vehicle with English-speaking driver",
      "Meals as specified in the itinerary, including Indian food on Coral Island & cruise meals",
      "Speedboat transfer to Coral Island with Indian buffet lunch",
      "Bangkok City & Temple Tour (Wat Pho & Wat Traimit)",
      "Overnight Halong Bay Cruise with Surprise Cave, Titov Island & Luon Cave bamboo boat",
      "Half-day guided Hanoi City Tour & Old Quarter walking exploration",
    ],
  },
  {
    id: "thailand-malaysia-singapore-9d",
    title: "Thailand, Malaysia & Singapore - 08 Nights and 09 Days Itinerary",
    destination: "Bangkok, Pattaya, Singapore & Kuala Lumpur",
    country: "Thailand, Malaysia & Singapore",
    duration: "08 Nights and 09 Days",
    daysCount: 9,
    category: "International Holidays",
    price: 88000,
    originalPrice: 106000,
    badge: "Tri-Country Grand Tour",
    rating: 4.9,
    reviewsCount: 194,
    image: "/images/gallery/thailand-malaysia-singapore-trio.jpg",
    shortDescription:
      "The definitive 9-day grand tour across Southeast Asia's top three destinations. Experience Pattaya's beaches with a Coral Island speedboat tour, Bangkok's sacred Golden and Reclining Buddhas, Singapore's futuristic skyline and Sentosa Island, luxury coach ride to Malaysia, and Kuala Lumpur's Batu Caves, Genting Highlands, and royal landmarks.",
    highlights: [
      "Round-trip airfare from Kathmandu plus Bangkok to Singapore inter-country flight",
      "Scenic luxury express coach transfer from Singapore to Kuala Lumpur, Malaysia",
      "Pattaya Coral Island (Koh Larn) speedboat tour with beach time and Indian buffet lunch",
      "Bangkok guided cultural temple tour: Wat Traimitr (5.5-Ton Solid Gold Buddha) & Wat Pho",
      "Singapore city sightseeing: Civic District, Padang Cricket Club & Merlion Park Marina Bay",
      "Sentosa Island tour with One-Way Cable Car ride and Wings of Time first show pass",
      "Genting Highlands mountain resort tour with Skyway Cable Car ride",
      "Iconic Batu Caves visit with the colossal 42.7m golden Lord Murugan statue",
      "Kuala Lumpur guided city tour: National Monument, King's Palace & House of Parliament",
      "3-Star hotel accommodations with daily breakfast across all destinations",
      "Full visa assistance and documentation support for Nepali passport holders",
    ],
    inclusions: [
      "Round-trip international airfare & Bangkok-to-Singapore flight",
      "Private airport transfers upon arrival & departure",
      "All transfers on a private (PVT) or shared (SIC) basis including luxury coach to Malaysia",
      "8 Nights accommodation in 3-star hotels (Pattaya, Bangkok, Singapore & Kuala Lumpur)",
      "Daily breakfast at all hotels",
      "Coral Island tour by speedboat with Indian buffet lunch",
      "Bangkok city tour with temples (Wat Traimit & Wat Pho)",
      "Singapore city tour & Sentosa Island with Cable Car & Wings of Time pass",
      "Genting Highlands tour with Skyway Cable Car ticket",
      "Batu Caves excursion & Kuala Lumpur city tour",
    ],
  },
  {
    id: "vietnam-6d",
    title: "Let's Explore Vietnam - 05 Nights and 06 Days Itinerary",
    destination: "Hanoi, Ha Long Bay & Da Nang",
    country: "Vietnam",
    duration: "05 Nights and 06 Days",
    daysCount: 6,
    category: "International Holidays",
    price: 62000,
    originalPrice: 75000,
    badge: "4-Star & Cruise",
    rating: 4.9,
    reviewsCount: 168,
    image: "/images/gallery/vietnam-highlights-collage-card.png",
    shortDescription:
      "A remarkable 6-day Vietnamese discovery featuring 4-star hotels, Hanoi's historic landmarks and famous Train Street, an unforgettable overnight luxury cruise amidst Ha Long Bay's emerald karsts, and the coastal wonders of Da Nang and UNESCO Hoi An Ancient Town with a traditional basket boat ride and floating river lanterns.",
    highlights: [
      "4-Star hotels: Flower Garden Hotel Hanoi & Eden Ocean View Hotel Da Nang",
      "Overnight luxury Ha Long Bay Cruise aboard La Regina Royal Cruise (Noble Suite Room)",
      "Sung Sot (Surprise) Cave exploration and Luon Cave bamboo boat row or kayak",
      "Full-Day Guided Hanoi City Tour: Tran Quoc Pagoda, Ho Chi Minh Complex & Temple of Literature",
      "Famous Hanoi Train Street experience with active railway street culture",
      "Cam Thanh Coconut Village excursion featuring iconic round basket boat ride & net-casting",
      "UNESCO Hoi An Ancient Town walking tour: Japanese Bridge, Tan Ky House & silk lanterns",
      "Romantic evening wooden boat cruise on the Thu Bon River with flower lantern release",
      "Private air-conditioned transfers, English-speaking guides & daily bottled water",
    ],
    inclusions: [
      "5 Nights accommodation in 4-star hotels & luxury cruise (Hanoi, Ha Long Bay, Da Nang)",
      "Overnight Ha Long Bay Cruise with private suite cabin and full board dining",
      "Daily buffet breakfasts, 1 Vietnamese lunch, 1 cruise gourmet dinner & 1 cruise brunch",
      "Round-trip private air-conditioned vehicle transfers throughout the itinerary",
      "Local professional English-speaking guide during scheduled tours",
      "All entrance and sightseeing fees as specified in the program",
      "Cam Thanh Coconut Village round basket boat ride experience",
      "Hoi An Thu Bon River wooden boat tour with floating flower lanterns",
      "Daily bottled drinking water (2 bottles per person per touring day)",
    ],
  },
  {
    id: "vietnam-8d",
    title: "Let's Explore Vietnam - 07 Nights and 08 Days Premium Itinerary",
    destination: "Hanoi, Ha Long Bay, Da Nang & Ba Na Hills",
    country: "Vietnam",
    duration: "07 Nights and 08 Days",
    daysCount: 8,
    category: "International Holidays",
    price: 76000,
    originalPrice: 92000,
    badge: "Premium & Ba Na Hills",
    rating: 4.9,
    reviewsCount: 184,
    image: "/images/gallery/vietnam-highlights-collage-card.jpg",
    shortDescription:
      "The definitive 8-day premium Vietnam experience featuring 4-star hotels, historic Hanoi, an overnight luxury cruise in Ha Long Bay, full-day Sun World Ba Na Hills with the iconic Golden Bridge held by giant stone hands, Hoi An Ancient Town lantern river cruise, and VinWonders Nam Hoi An River Safari.",
    highlights: [
      "4-Star hotels: Flower Garden Hotel Hanoi & Eden Ocean View Hotel Da Nang",
      "Overnight luxury Ha Long Bay Cruise aboard La Regina Royal Cruise (Noble Suite Room)",
      "Full-Day Sun World Ba Na Hills tour: Cable Car, Golden Giant Hands Bridge & French Village",
      "VinWonders Nam Hoi An full-day theme park passes: River Safari, Folk Island & Water World",
      "Hanoi City Tour: Tran Quoc Pagoda, Ho Chi Minh Complex, Temple of Literature & Train Street",
      "Cam Thanh Coconut Village excursion featuring round basket boat ride & net-casting",
      "UNESCO Hoi An Ancient Town walking tour & Thu Bon River flower lantern boat ride",
      "Private air-conditioned transfers throughout with professional English-speaking tour guides",
    ],
    inclusions: [
      "7 Nights accommodation in 4-star hotels & luxury cruise (Hanoi, Ha Long Bay, Da Nang)",
      "Overnight Ha Long Bay Cruise with private suite cabin and full-board dining",
      "Daily buffet breakfasts, 1 Vietnamese lunch, 1 cruise gourmet dinner & 1 cruise brunch",
      "Full-Day Ba Na Hills cable car & Golden Bridge entrance pass",
      "Full-Day VinWonders Nam Hoi An entrance pass with River Safari boat cruise",
      "Round-trip private air-conditioned vehicle transfers throughout the itinerary",
      "Local professional English-speaking guide during scheduled tours",
      "All entrance and sightseeing fees as specified in the program",
      "Cam Thanh Coconut Village round basket boat ride experience",
      "Hoi An Thu Bon River wooden boat tour with floating flower lanterns",
      "Daily bottled drinking water (2 bottles per person per touring day)",
    ],
  },
];

const CATEGORIES = [
  "All Packages",
  "International Holidays",
  "Honeymoon Packages",
  "Family Tours",
  "Adventure Tours",
  "Group Tours",
] as const;

export default function HolidayPackagesListing() {
  const searchParams = useSearchParams();
  const urlCountry = searchParams
    ? searchParams.get("country") ||
      searchParams.get("destination") ||
      searchParams.get("search") ||
      searchParams.get("q")
    : null;

  const [packagesList, setPackagesList] = useState<PackageItem[]>(PACKAGES_DATA);
  const [selectedCategory, setSelectedCategory] = useState<string>("All Packages");
  const [destinationFilter, setDestinationFilter] = useState<string>("All");
  const [durationFilter, setDurationFilter] = useState<string>("All");
  const [budgetFilter, setBudgetFilter] = useState<string>("All");

  React.useEffect(() => {
    if (urlCountry) {
      setDestinationFilter(urlCountry);
    }
  }, [urlCountry]);

  React.useEffect(() => {
    const fetchLivePackages = async () => {
      try {
        const res = await fetch("/api/packages");
        if (res.ok) {
          const data = await res.json();
          if (data.packages && data.packages.length > 0) {
            const mapped: PackageItem[] = data.packages.map((pkg: any) => ({
              id: String(pkg.id),
              title: pkg.title,
              destination: pkg.destination,
              country: pkg.country || pkg.destination,
              duration: pkg.duration,
              daysCount: Number(pkg.duration?.match(/\d+/g)?.[1] || pkg.duration?.match(/\d+/g)?.[0] || 6),
              price: pkg.price,
              originalPrice: pkg.originalPrice || pkg.price * 1.2,
              category: pkg.category === "Honeymoon" ? "Honeymoon Packages" : "International Holidays",
              badge: pkg.badge || "Popular",
              rating: pkg.rating || 4.9,
              reviewsCount: pkg.reviews || 120,
              image: pkg.coverImage || "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80",
              shortDescription: pkg.overview || "Experience luxury travel and guided sightseeing.",
              inclusions: Array.isArray(pkg.inclusions) ? pkg.inclusions : [],
            }));
            setPackagesList(mapped);
          }
        }
      } catch (e) {}
    };
    fetchLivePackages();
  }, []);

  const filteredPackages = useMemo(() => {
    return packagesList.filter((pkg) => {
      // Category filter
      if (selectedCategory !== "All Packages" && pkg.category !== selectedCategory) {
        return false;
      }
      // Destination filter
      if (destinationFilter !== "All" && !pkg.destination.toLowerCase().includes(destinationFilter.toLowerCase()) && !pkg.country.toLowerCase().includes(destinationFilter.toLowerCase())) {
        return false;
      }
      // Duration filter
      if (durationFilter === "short" && pkg.daysCount > 5) return false;
      if (durationFilter === "medium" && (pkg.daysCount < 6 || pkg.daysCount > 7)) return false;
      if (durationFilter === "long" && pkg.daysCount < 8) return false;

      // Budget filter
      if (budgetFilter === "under50k" && pkg.price >= 50000) return false;
      if (budgetFilter === "50k-100k" && (pkg.price < 50000 || pkg.price > 100000)) return false;
      if (budgetFilter === "above100k" && pkg.price <= 100000) return false;

      return true;
    });
  }, [packagesList, selectedCategory, destinationFilter, durationFilter, budgetFilter]);

  const generateWhatsAppLink = (pkg: PackageItem) => {
    return buildWhatsAppLink({
      service: "Holiday Package Inquiry",
      name: "[Customer]",
      destination: pkg.destination,
      travelDate: "Flexible",
      passengers: "2 Travelers",
      whatsappNumber: "",
      additionalDetails: `Interested in: ${pkg.title} (${pkg.duration}) | Starting Price: NPR ${pkg.price.toLocaleString()}`,
    });
  };

  return (
    <div className="space-y-10">
      {/* 1. Category Filter Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer min-h-[44px] ${
              selectedCategory === cat
                ? "bg-[#0a1628] text-white shadow-lg shadow-navy-900/20"
                : "bg-white text-[#64748b] border border-[#e2e8f0] hover:border-[#0ea5e9] hover:text-[#0ea5e9]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 2. Advanced Filter Options Bar */}
      <div className="bg-white rounded-3xl p-5 border border-[#e2e8f0] shadow-sm">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#e2e8f0] text-xs font-bold uppercase tracking-wider text-[#0a1628]">
          <Filter size={16} className="text-[#0ea5e9]" />
          <span>Filter Packages By</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Destination */}
          <div>
            <label className="text-xs font-bold text-[#64748b] uppercase tracking-wider mb-1.5 block">
              Destination
            </label>
            <select
              className="w-full h-11 rounded-xl border border-[#e2e8f0] bg-[#f8fafc] px-3 text-base sm:text-sm font-semibold text-[#0a1628] focus:outline-none focus:border-[#0ea5e9]"
              value={destinationFilter}
              onChange={(e) => setDestinationFilter(e.target.value)}
            >
              <option value="All">All Destinations</option>
              <option value="Thailand">Thailand</option>
              <option value="Bali">Bali, Indonesia</option>
              <option value="Singapore">Singapore &amp; Malaysia</option>
              <option value="Europe">Europe</option>
              <option value="Japan">Japan</option>
              <option value="Vietnam">Vietnam</option>
              <option value="Maldives">Maldives</option>
              <option value="Philippines">Philippines</option>
            </select>
          </div>

          {/* Duration */}
          <div>
            <label className="text-xs font-bold text-[#64748b] uppercase tracking-wider mb-1.5 block">
              Duration
            </label>
            <select
              className="w-full h-11 rounded-xl border border-[#e2e8f0] bg-[#f8fafc] px-3 text-base sm:text-sm font-semibold text-[#0a1628] focus:outline-none focus:border-[#0ea5e9]"
              value={durationFilter}
              onChange={(e) => setDurationFilter(e.target.value)}
            >
              <option value="All">All Durations</option>
              <option value="short">1 – 5 Days</option>
              <option value="medium">6 – 7 Days</option>
              <option value="long">8+ Days</option>
            </select>
          </div>

          {/* Budget */}
          <div>
            <label className="text-xs font-bold text-[#64748b] uppercase tracking-wider mb-1.5 block">
              Budget Range
            </label>
            <select
              className="w-full h-11 rounded-xl border border-[#e2e8f0] bg-[#f8fafc] px-3 text-base sm:text-sm font-semibold text-[#0a1628] focus:outline-none focus:border-[#0ea5e9]"
              value={budgetFilter}
              onChange={(e) => setBudgetFilter(e.target.value)}
            >
              <option value="All">All Budgets</option>
              <option value="under50k">Under NPR 50,000</option>
              <option value="50k-100k">NPR 50,000 – 100,000</option>
              <option value="above100k">Above NPR 100,000</option>
            </select>
          </div>

          {/* Reset button */}
          <div className="flex items-end">
            <Button
              variant="outline"
              onClick={() => {
                setSelectedCategory("All Packages");
                setDestinationFilter("All");
                setDurationFilter("All");
                setBudgetFilter("All");
              }}
              className="w-full h-11 rounded-xl border-[#e2e8f0] text-xs font-semibold text-[#64748b] hover:text-[#0a1628]"
            >
              Reset Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Results Count Header */}
      <div className="flex items-center justify-between text-sm text-[#64748b] px-1">
        <div>
          Showing <span className="font-bold text-[#0a1628]">{filteredPackages.length}</span> curated holiday package{filteredPackages.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* 3. Modern Package Cards Grid */}
      {filteredPackages.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 sm:p-14 text-center border border-[#e2e8f0] shadow-sm space-y-4 max-w-xl mx-auto my-8">
          <div className="w-16 h-16 rounded-full bg-sky-50 text-[#0ea5e9] flex items-center justify-center mx-auto text-2xl font-bold">
            ✈️
          </div>
          <h3 className="text-xl font-bold text-[#0a1628]">
            {packagesList.length === 0 ? "New Holiday Packages Coming Soon" : "No Packages Found"}
          </h3>
          <p className="text-sm text-[#64748b] leading-relaxed">
            {packagesList.length === 0
              ? "We are currently preparing and updating our latest holiday itineraries. You can request a personalized travel plan tailored to your preferences."
              : "We couldn't find any packages matching your filter criteria. Try selecting a different destination or budget range."}
          </p>
          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            {packagesList.length === 0 ? (
              <>
                <Button asChild className="bg-[#f97316] hover:bg-[#ea580c] text-white font-bold">
                  <Link href="/services/custom">Customize Your Trip</Link>
                </Button>
                <Button variant="outline" asChild className="border-emerald-600 text-emerald-600 hover:bg-emerald-50">
                  <a href="https://wa.me/9779714491103" target="_blank" rel="noopener noreferrer">
                    Inquire on WhatsApp
                  </a>
                </Button>
              </>
            ) : (
              <Button
                onClick={() => {
                  setSelectedCategory("All Packages");
                  setDestinationFilter("All");
                  setDurationFilter("All");
                  setBudgetFilter("All");
                }}
                className="bg-[#0a1628] text-white hover:bg-[#163058]"
              >
                Reset All Filters
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredPackages.map((pkg) => {
            const discountPercent = Math.round(((pkg.originalPrice - pkg.price) / pkg.originalPrice) * 100);
            return (
              <div
                key={pkg.id}
                className="group relative bg-white rounded-3xl overflow-hidden border border-[#e2e8f0] shadow-sm hover:shadow-2xl hover:border-[#0ea5e9]/40 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between cursor-pointer"
              >
                {/* 100% Stretched Link across the ENTIRE card container */}
                <Link
                  href={`/packages/${pkg.id}`}
                  className="absolute inset-0 z-10"
                  aria-label={`View full details for ${pkg.title}`}
                />

                <div>
                  {/* Destination Image */}
                  <div className="relative h-48 sm:h-60 w-full overflow-hidden bg-[#0a1628] pointer-events-none">
                    <Image
                      src={pkg.image}
                      alt={pkg.title}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

                    {/* Badge */}
                    <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-[#0ea5e9] text-white text-[11px] sm:text-xs font-extrabold px-2.5 py-1 rounded-full shadow">
                      {pkg.badge}
                    </div>

                    {/* Discount */}
                    {discountPercent > 0 && (
                      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-[#f97316] text-white text-[11px] sm:text-xs font-extrabold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg">
                        {discountPercent}% OFF
                      </div>
                    )}

                    {/* Duration Pill */}
                    <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 flex items-center gap-1.5 bg-white/90 backdrop-blur-md text-[#0a1628] text-[11px] sm:text-xs font-bold px-2.5 py-1 rounded-full shadow">
                      <Clock size={12} className="text-[#0ea5e9] shrink-0" />
                      <span>{pkg.duration}</span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-4 sm:p-6 pointer-events-none">
                    {/* Destination */}
                    <div className="flex items-center justify-between text-xs text-[#64748b] mb-2 gap-2">
                      <span className="flex items-center gap-1 font-medium truncate">
                        <MapPin size={12} className="text-[#0ea5e9] shrink-0" />
                        <span className="truncate">{pkg.destination}</span>
                      </span>
                      <span className="flex items-center gap-1 text-amber-500 font-bold shrink-0">
                        <Star size={12} className="fill-amber-400" />
                        {pkg.rating} ({pkg.reviewsCount})
                      </span>
                    </div>

                    {/* Package Title */}
                    <h3 className="text-base sm:text-xl font-bold text-[#0a1628] mb-2 group-hover:text-[#0ea5e9] transition-colors leading-snug">
                      {pkg.title.includes(" - ") ? (
                        <>
                          <span className="block font-extrabold text-lg sm:text-xl text-[#0a1628] leading-tight">
                            {pkg.title.split(" - ")[0]}
                          </span>
                          <span className="block text-xs sm:text-sm font-bold text-[#0ea5e9] mt-1">
                            {pkg.title.split(" - ")[1]}
                          </span>
                        </>
                      ) : (
                        <span className="line-clamp-2">{pkg.title}</span>
                      )}
                    </h3>

                    {/* Short Description */}
                    <p className="text-xs text-[#64748b] leading-relaxed mb-3 sm:mb-4 line-clamp-2">
                      {pkg.shortDescription}
                    </p>

                    {/* Inclusions */}
                    <div className="flex flex-wrap gap-1.5 mb-4 sm:mb-6">
                      {pkg.inclusions.slice(0, 3).map((inc) => (
                        <span key={inc} className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] text-[#475569] bg-[#f8fafc] border border-[#e2e8f0] px-2 py-0.5 rounded-full font-medium">
                          <Check size={10} className="text-emerald-500 shrink-0" />
                          <span className="truncate">{inc}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Price & Action Buttons */}
                <div className="p-4 pt-0 sm:p-6 sm:pt-0 border-t border-[#f1f5f9] mt-auto">
                  <div className="flex flex-wrap items-baseline justify-between gap-1 mb-3 pt-3 pointer-events-none">
                    <div>
                      <span className="text-[11px] sm:text-xs text-[#94a3b8] block">Starting Price</span>
                      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                        <span className="text-base sm:text-xl font-extrabold text-[#0a1628]">
                          NPR {pkg.price.toLocaleString("en-US")}
                        </span>
                        <span className="text-xs text-[#94a3b8] line-through">
                          NPR {pkg.originalPrice.toLocaleString("en-US")}
                        </span>
                      </div>
                    </div>
                    <span className="text-[11px] text-[#64748b] font-medium self-end">per person</span>
                  </div>

                  {/* Dual Buttons: View Details (Link) + WhatsApp (Button) */}
                  <div className="grid grid-cols-2 gap-2 relative z-20">
                    <span className="inline-flex items-center justify-center gap-1 w-full text-[11px] sm:text-xs font-semibold py-2.5 rounded-xl border border-[#e2e8f0] bg-white text-[#0a1628] group-hover:bg-[#0a1628] group-hover:text-white transition-colors min-h-[42px] px-2">
                      <Eye size={13} className="shrink-0" />
                      View Details
                    </span>

                    <a
                      href={generateWhatsAppLink(pkg)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center justify-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] sm:text-xs font-bold py-2.5 px-2 rounded-xl shadow-md transition-colors min-h-[42px]"
                    >
                      <MessageSquare size={13} className="shrink-0" />
                      WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
