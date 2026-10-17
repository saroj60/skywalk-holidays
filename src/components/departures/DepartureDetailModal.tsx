"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Calendar,
  MapPin,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Plane,
  Hotel,
  ShieldCheck,
  FileCheck2,
  Phone,
  MessageSquare,
  ArrowRight,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { COMPANY } from "@/lib/constants";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { Departure } from "@/components/sections/UpcomingHolidaysSection";

interface DepartureDetailModalProps {
  departure: Departure | null;
  onClose: () => void;
}

// Preset rich itinerary and inclusions matching fixed departure destinations
const DEPARTURE_DETAILS_MAP: Record<
  string,
  {
    packageSlug?: string;
    duration: string;
    overview: string;
    itinerary: { day: string; title: string; desc: string }[];
    inclusions: string[];
    exclusions: string[];
    highlights: string[];
  }
> = {
  "dep-001": {
    packageSlug: "/packages/vietnam-6d",
    duration: "7 Days / 6 Nights",
    overview:
      "Celebrate Dashain amidst the limestone karsts of Ha Long Bay and the clouds of Ba Na Hills. This fixed departure group tour offers guaranteed flights from Kathmandu, a luxury overnight cruise, hand-picked 4-star hotels, and guided excursions to Vietnam's most iconic wonders.",
    highlights: [
      "5-Star Ha Long Bay luxury overnight cruise with Tai Chi and sea kayaking",
      "Sun World Ba Na Hills cable car & world-famous Golden Bridge (Giant Hands)",
      "Ancient Hoi An Lantern Town evening walk and river basket boat tour",
      "Hanoi Old Quarter cultural street food & French colonial heritage walk",
      "Roundtrip international & domestic Vietnam flights included",
    ],
    itinerary: [
      {
        day: "Day 1",
        title: "Kathmandu to Hanoi Arrival & Old Quarter",
        desc: "Fly from Tribhuvan International Airport to Hanoi. Welcome by Skywalk Holidays local representative, private transfer to 4-star hotel in central Hanoi. Evening leisure walk through Hanoi Old Quarter.",
      },
      {
        day: "Day 2",
        title: "Hanoi to Ha Long Bay — 5-Star Luxury Overnight Cruise",
        desc: "Scenic highway transfer to Ha Long Bay. Embark on a luxury cruise liner, enjoy welcome drink and seafood lunch. Cruise past Fighting Cocks islet, explore Sung Sot Cave, and kayak in emerald lagoons. Sunset party and overnight onboard.",
      },
      {
        day: "Day 3",
        title: "Morning Tai Chi, Cruise Disembark & Flight to Da Nang",
        desc: "Sunrise Tai Chi session on sundeck followed by buffet breakfast. Visit Titov Island for panoramic bay view. Disembark at noon and transfer to airport for domestic flight to coastal Da Nang. Check into beachfront resort.",
      },
      {
        day: "Day 4",
        title: "Sun World Ba Na Hills & Iconic Golden Bridge",
        desc: "Take the world-record cable car up to Ba Na Hills. Walk across the breathtaking Golden Bridge cradled by giant stone hands. Visit French Village, Linh Ung Pagoda, and Fantasy Park.",
      },
      {
        day: "Day 5",
        title: "Cam Thanh Coconut Forest & Hoi An Ancient Lantern Town",
        desc: "Experience spinning round bamboo basket boats in Cam Thanh water coconut forest. In the afternoon, explore UNESCO-listed Hoi An Ancient Town, Japanese Covered Bridge, and lantern night markets.",
      },
      {
        day: "Day 6",
        title: "Da Nang Marble Mountains & Flight to Hanoi",
        desc: "Explore the mystical caves and Buddhist shrines of Marble Mountains. Relax by My Khe Beach. Evening domestic flight back to Hanoi for souvenir shopping at Dong Xuan Market.",
      },
      {
        day: "Day 7",
        title: "Hanoi City Sightseeing & Return Flight to Kathmandu",
        desc: "Visit Ho Chi Minh Mausoleum complex, One Pillar Pagoda, and Tran Quoc Pagoda by West Lake. Transfer to Noi Bai Airport for return flight to Kathmandu with cherished festival memories.",
      },
    ],
    inclusions: [
      "Round-trip international flights (Kathmandu ⇄ Hanoi) with checked baggage",
      "Domestic flight within Vietnam (Hanoi ⇄ Da Nang)",
      "1 Night accommodation in 5-Star Luxury Ha Long Bay Cruise (Private Balcony Cabin)",
      "5 Nights accommodation in 4-Star hand-picked hotels in Hanoi and Da Nang",
      "Daily buffet breakfast, lunches and specialty dinners as per itinerary",
      "Ba Na Hills Cable Car & Golden Bridge all-access pass",
      "Complete Vietnam Tourist Visa approval letter & application assistance",
      "Dedicated English-speaking tour guide and AC private coach transfers",
    ],
    exclusions: [
      "Personal expenses, laundry, and telephone calls",
      "Vietnam visa stamping fee ($25 USD) payable at airport",
      "Beverages during meals unless specified",
      "Travel insurance (can be arranged upon request)",
    ],
  },
  "dep-002": {
    packageSlug: "/packages/bali-malaysia-7d",
    duration: "8 Days / 7 Nights",
    overview:
      "A tropical holiday escape blending romantic Balinese culture, turquoise beaches, cliffside temples, and emerald rice terraces. Features guaranteed group flights, beachfront resort accommodation, and private pool villa stay in Ubud.",
    highlights: [
      "Full-day West Nusa Penida Island tour: Kelingking T-Rex Beach & Angel's Billabong",
      "Uluwatu Clifftop Temple sunset & hypnotic Kecak Fire Dance performance",
      "Tegallalang emerald rice terraces & thrilling Aloha Bali Jungle Swing",
      "Tanjung Benoa water sports (Banana boat & parasailing included)",
      "1 Night stay in private pool luxury villa in Ubud with floating breakfast option",
    ],
    itinerary: [
      {
        day: "Day 1",
        title: "Arrival in Bali (Denpasar) & Hotel Check-in",
        desc: "Arrive at Ngurah Rai International Airport. Traditional floral garland welcome by Skywalk Holidays staff. Private transfer to premium beach resort in Kuta / Seminyak. Evening beach walk and rest.",
      },
      {
        day: "Day 2",
        title: "Tanjung Benoa Watersports & Uluwatu Sunset Kecak Dance",
        desc: "Morning thrilling water sports at Tanjung Benoa beach (banana boat included). In the afternoon, visit the dramatic 70-meter sea cliffs of Uluwatu Temple and watch the Kecak Fire Dance at sunset.",
      },
      {
        day: "Day 3",
        title: "Full Day Nusa Penida Island Speedboat Expedition",
        desc: "Board high-speed catamaran to Nusa Penida. Visit iconic Kelingking Beach (T-Rex cliff), Broken Beach, natural infinity pool at Angel’s Billabong, and crystal bay swimming. Return to main island by evening.",
      },
      {
        day: "Day 4",
        title: "Transfer to Ubud — Tegenungan Waterfall & Ubud Palace",
        desc: "Scenic drive into central Bali. Swim and take photos at Tegenungan Waterfall. Check in to luxury Ubud private villa. Tour Ubud Royal Palace and local handicrafts market.",
      },
      {
        day: "Day 5",
        title: "Tegallalang Rice Terraces, Bali Jungle Swing & Coffee Farm",
        desc: "Stroll the UNESCO terraced rice paddies of Tegallalang. Experience the famous Bali Jungle Swing overlooking palm valleys. Sample Luwak civet coffee and organic herbal teas.",
      },
      {
        day: "Day 6",
        title: "Kintamani Volcano Panorama & Ulun Danu Water Temple",
        desc: "Marvel at the active Mount Batur volcano and crater lake from Kintamani viewpoint. Visit Ulun Danu Beratan water temple floating on Lake Beratan in Bedugul.",
      },
      {
        day: "Day 7",
        title: "Balinese Spa Rejuvenation & Jimbaran Bay Candlelight Dinner",
        desc: "Pamper yourself with a 60-minute traditional Balinese aroma massage. Evening romantic sunset seafood candlelight dinner directly on the sandy shores of Jimbaran Bay.",
      },
      {
        day: "Day 8",
        title: "Souvenir Shopping & Flight Departure to Kathmandu",
        desc: "Breakfast at villa. Last-minute souvenir shopping at Krisna Oleh Oleh Bali. Private transfer to airport for your flight back home.",
      },
    ],
    inclusions: [
      "Roundtrip international flight tickets from Kathmandu with baggage",
      "5 Nights in 4-Star Kuta beach resort + 2 Nights in luxury Ubud pool villa",
      "Full Day Nusa Penida speedboat tour with lunch & island transport",
      "Tanjung Benoa water sports pass & Uluwatu Kecak show tickets",
      "Famous Bali Jungle Swing entry ticket",
      "Daily buffet breakfast & Jimbaran Bay sunset dinner",
      "Indonesia Visa on Arrival assistance & electronic customs declaration",
      "Private AC tourist vehicle and English-speaking chauffeur",
    ],
    exclusions: [
      "Indonesia Visa on Arrival fee (IDR 500,000 / approx. $35 USD)",
      "Optional water activities not listed in inclusions",
      "Personal tipping and porterage fees",
    ],
  },
  "dep-003": {
    packageSlug: "/packages/phuket-bangkok-6d",
    duration: "6 Days / 5 Nights",
    overview:
      "The quintessential Thailand holiday package tailored for the Tihar festive break. Soak in the sun on Phuket's tropical islands, snorkel in turquoise waters of Maya Bay, and indulge in shopping and dining in bustling Bangkok.",
    highlights: [
      "Speedboat excursion to Phi Phi Islands, Maya Bay & Khai Island with buffet lunch",
      "Phuket Big Buddha atop Nakkerd Hill & scenic Promthep Cape viewpoint",
      "Bangkok Chaophraya Princess Luxury Dinner Cruise with live band",
      "Guided Golden Buddha (Wat Traimit) and Reclining Buddha (Wat Pho) city tour",
      "Shopping spree at Pratunam wholesale market and Platinum Fashion Mall",
    ],
    itinerary: [
      {
        day: "Day 1",
        title: "Kathmandu to Phuket Flight Arrival",
        desc: "Fly into Phuket International Airport. Warm welcome by our airport guide. Private transfer to 4-star hotel in vibrant Patong. Evening at leisure to explore Bangla Road and night markets.",
      },
      {
        day: "Day 2",
        title: "Phi Phi Islands & Maya Bay Speedboat Adventure",
        desc: "Full-day speedboat excursion to Phi Phi Don and Phi Phi Leh. Swim at Maya Bay, snorkel in crystal lagoons, view Viking Cave, and enjoy beachside Thai buffet lunch.",
      },
      {
        day: "Day 3",
        title: "Phuket City Highlights & Promthep Sunset",
        desc: "Guided tour to Phuket Big Buddha, Wat Chalong historic temple, cashew nut factory, and the dramatic Promthep Cape lookout for panoramic Andaman Sea sunset.",
      },
      {
        day: "Day 4",
        title: "Flight to Bangkok & Chaophraya Dinner Cruise",
        desc: "Morning domestic flight to Bangkok. Check into city center hotel. In the evening, board the grand Chaophraya Princess Cruise for an international buffet dinner with live music gliding past illuminated temples.",
      },
      {
        day: "Day 5",
        title: "Bangkok Cultural Temples & Market Shopping",
        desc: "Visit Wat Traimitr housing the 5.5-ton solid gold Buddha and Wat Pho's gigantic Reclining Buddha. Afternoon dedicated to budget shopping at Platinum Fashion Mall and Pratunam.",
      },
      {
        day: "Day 6",
        title: "Breakfast & Flight Return to Kathmandu",
        desc: "Breakfast at hotel. Free time for last-minute shopping. Private transfer to Suvarnabhumi Airport for return flight to Kathmandu.",
      },
    ],
    inclusions: [
      "Round-trip international flights (Kathmandu ⇄ Phuket / Bangkok ⇄ Kathmandu)",
      "Domestic flight within Thailand (Phuket to Bangkok)",
      "3 Nights in 4-Star Patong Phuket resort + 2 Nights in 4-Star central Bangkok hotel",
      "Full Day Phi Phi Islands tour with speedboat, snorkeling gear & buffet lunch",
      "Phi Phi National Park environmental entry fees",
      "Chaophraya River luxury evening dinner cruise ticket",
      "Bangkok and Phuket guided city & temple sightseeing tours",
      "Full Thailand tourist e-visa assistance from Kathmandu",
    ],
    exclusions: [
      "Thailand visa fee (if applicable depending on season policy)",
      "Personal expenses, drinks and room service",
      "Guide & driver gratuities",
    ],
  },
  "dep-004": {
    packageSlug: "/services/custom",
    duration: "12 Days / 11 Nights",
    overview:
      "Celebrate New Year 2027 in Europe! Experience the romantic lights of Paris, the snow-draped Swiss Alps atop Mount Titlis, Venice's gondola waterways, and the timeless history of Rome and Vatican City on this grand festival departure.",
    highlights: [
      "Eiffel Tower 2nd level admission and illuminated Seine River Cruise in Paris",
      "Mount Titlis revolving Rotair cable car and Glacier Ice Cave in Switzerland",
      "Scenic Lake Zurich, Lucerne Chapel Bridge, and Rhine Falls waterfall",
      "Romantic Grand Canal Gondola ride in Venice, Italy",
      "Rome Colosseum, Roman Forum, Trevi Fountain & Vatican St. Peter's Basilica",
      "Grand New Year Gala Celebration in the heart of Rome",
    ],
    itinerary: [
      {
        day: "Day 1",
        title: "Kathmandu to Paris (France)",
        desc: "Board international flight from Kathmandu to Paris Charles de Gaulle Airport. Meet your European tour director, private coach transfer to 4-star Paris hotel. Evening briefing.",
      },
      {
        day: "Day 2",
        title: "Paris City Panorama, Eiffel Tower & Seine Cruise",
        desc: "Guided city drive past Champs-Élysées, Arc de Triomphe, Louvre exterior, and Notre Dame. Ascend Eiffel Tower to the 2nd level for panoramic city views. Romantic 1-hour cruise along the River Seine.",
      },
      {
        day: "Day 3",
        title: "High-Speed TGV Train Paris to Lucerne (Switzerland)",
        desc: "Board high-speed TGV train across scenic vineyards into Switzerland. Arrive in fairytale Lucerne. Stroll across the 14th-century wooden Chapel Bridge and see the Lion Monument.",
      },
      {
        day: "Day 4",
        title: "Mount Titlis Eternal Snow & Glacier World",
        desc: "Ride the world's first revolving Titlis Rotair gondola to 3,020 meters. Walk through the mystical Glacier Cave, cross Europe's highest suspension bridge (Titlis Cliff Walk), and enjoy snow tubing.",
      },
      {
        day: "Day 5",
        title: "Zurich Highlights & Rhine Falls",
        desc: "Visit the banking capital Zurich, stroll Bahnhofstrasse and Lake Zurich promenade. Continue to Schaffhausen to witness Rhine Falls, the most powerful waterfall in mainland Europe.",
      },
      {
        day: "Day 6",
        title: "Scenic Alpine Crossing into Venice (Italy)",
        desc: "Travel south across the majestic Swiss Alps through the Gotthard route into the Veneto region of Northern Italy. Check into hotel near Venice.",
      },
      {
        day: "Day 7",
        title: "Venice Lagoon, St. Mark's Square & Gondola Ride",
        desc: "Private water taxi to St. Mark's Square. Walking tour of Doge's Palace exterior, Bridge of Sighs, and Murano glass demonstration. Glide through quiet canals on an authentic private Gondola ride.",
      },
      {
        day: "Day 8",
        title: "Venice to Florence (Renaissance Cradle) & Rome",
        desc: "Travel to Florence. Panoramic view from Piazzale Michelangelo, Duomo Cathedral, and Ponte Vecchio bridge. Continue journey to the Eternal City of Rome.",
      },
      {
        day: "Day 9",
        title: "Imperial Rome, Colosseum & Trevi Fountain",
        desc: "Marvel at the monumental Colosseum, Roman Forum, and Piazza Venezia. Walk to the iconic Trevi Fountain to toss a coin, and visit the Spanish Steps.",
      },
      {
        day: "Day 10",
        title: "Vatican City & St. Peter's Basilica",
        desc: "Guided tour inside the world's smallest sovereign state: Vatican City. Visit the magnificent St. Peter's Basilica, Michelangelo's Pieta, and St. Peter's Square.",
      },
      {
        day: "Day 11",
        title: "Grand New Year 2027 Gala Celebration",
        desc: "Day at leisure in Rome for boutique Italian shopping. In the evening, gather for a festive New Year Gala Dinner with champagne, Italian specialties, and live countdown festivities.",
      },
      {
        day: "Day 12",
        title: "Rome Departure to Kathmandu",
        desc: "Enjoy farewell breakfast. Transfer to Rome Fiumicino Airport for return flight to Kathmandu.",
      },
    ],
    inclusions: [
      "Roundtrip international airfare (Kathmandu ⇄ Paris / Rome ⇄ Kathmandu) with baggage",
      "11 Nights premium 4-Star hotel accommodation across France, Switzerland & Italy",
      "Daily buffet breakfast & specialty Indian / Continental dinners",
      "High-speed TGV / Eurail train tickets across European borders",
      "Eiffel Tower 2nd stage ticket & Seine River cruise",
      "Mount Titlis revolving Rotair cable car & Glacier Cave pass",
      "Private Venice Grand Canal Gondola ride and water taxis",
      "Comprehensive Schengen Visa file preparation, cover letter, & VFS booking assistance",
      "Dedicated professional English-speaking tour manager throughout Europe",
    ],
    exclusions: [
      "Schengen Visa consular and VFS processing fees",
      "City tourist taxes (approx. €3 to €6 per person/night payable at hotel reception)",
      "Optional excursions and personal shopping expenses",
    ],
  },
};

export default function DepartureDetailModal({
  departure,
  onClose,
}: DepartureDetailModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (departure) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [departure]);

  if (!mounted || !departure) return null;

  const detailData = DEPARTURE_DETAILS_MAP[departure.id] || {
    packageSlug: "/services/custom",
    duration: "Fixed Group Departure",
    overview: `Experience a fully coordinated group holiday to ${departure.destination} with fixed departure dates, guaranteed flight connections, and premium accommodations curated by Skywalk Holidays.`,
    highlights: [
      `Guaranteed fixed departure date: ${departure.startDate} to ${departure.endDate}`,
      `Hand-picked luxury hotel accommodations in ${departure.destination}`,
      "All-inclusive tour package with meals, transfers, and sightseeing passes",
      "Full visa preparation, appointment booking, and file review assistance",
    ],
    itinerary: [
      {
        day: "Day 1",
        title: `Departure from Kathmandu to ${departure.destination}`,
        desc: `Assemble at Tribhuvan International Airport for flight departure. Meet your Skywalk Holidays tour leader upon arrival and private transfer to your hotel.`,
      },
      {
        day: "Days 2 – 5",
        title: `Guided Exploration & Major Highlights of ${departure.destination}`,
        desc: `Comprehensive sightseeing itinerary including landmark cultural monuments, scenic tours, and all inclusive meals with private air-conditioned coach transfers.`,
      },
      {
        day: "Final Day",
        title: `Return Flight to Kathmandu`,
        desc: `Enjoy breakfast at hotel, final shopping and souvenir collection before private airport transfer for flight back home to Nepal.`,
      },
    ],
    inclusions: [
      "Round-trip international flights with full luggage allowance",
      "All hotel accommodations with daily breakfast and scheduled meals",
      "Airport transfers and guided city excursions in private AC transport",
      "Tourist visa guidance and document review by Skywalk visa desk",
      "24/7 dedicated Nepali & local emergency support desk",
    ],
    exclusions: [
      "Personal shopping, laundry and room services",
      "Optional activities and adventure sports outside official itinerary",
      "Travel insurance (recommended)",
    ],
  };

  const formatDateString = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch (e) {
      return dateStr;
    }
  };

  const whatsAppLink = buildWhatsAppLink({
    service: "Fixed Departure Seat Reservation",
    name: "[Traveler]",
    destination: departure.destination,
    travelDate: `${departure.startDate} to ${departure.endDate}`,
    passengers: "1 Seat",
    whatsappNumber: "",
    additionalDetails: `Inquiring for Departure: ${departure.title} (${departure.seasonTag}) | Fixed Date: ${departure.startDate} to ${departure.endDate} | Price: NPR ${departure.price.toLocaleString("en-US")}`,
  });

  const seatsPercent = Math.round(
    ((departure.totalSeats - departure.availableSeats) / departure.totalSeats) *
      100
  );

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-4xl bg-[#0a1628] text-white rounded-3xl border border-white/20 shadow-2xl overflow-hidden z-10 max-h-[92vh] flex flex-col my-auto"
        >
          {/* Header Image & Badges */}
          <div className="relative h-64 sm:h-72 md:h-80 w-full shrink-0 overflow-hidden">
            <Image
              src={departure.image}
              alt={departure.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 896px"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] via-[#0a1628]/40 to-black/60" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center border border-white/20 transition-all hover:scale-105 active:scale-95"
              aria-label="Close dialog"
            >
              <X size={20} />
            </button>

            {/* Top Badges */}
            <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2 z-10">
              <span className="bg-[#0a1628]/95 backdrop-blur-md text-white text-xs font-bold px-3.5 py-1.5 rounded-full border border-white/20 shadow">
                {departure.seasonTag}
              </span>
              {departure.availableSeats <= 4 && (
                <span className="bg-[#f97316] text-white text-xs font-extrabold px-3 py-1.5 rounded-full shadow animate-pulse">
                  🔥 Only {departure.availableSeats} Seats Left
                </span>
              )}
            </div>

            {/* Title & Location Banner */}
            <div className="absolute bottom-4 left-4 right-4 z-10">
              <div className="flex items-center gap-1.5 text-xs sm:text-sm text-[#38bdf8] font-semibold mb-1.5">
                <MapPin size={15} className="text-[#0ea5e9] shrink-0" />
                <span>{departure.destination}</span>
                <span className="text-white/40">•</span>
                <span className="text-white/80">{detailData.duration}</span>
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white leading-tight">
                {departure.title}
              </h2>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#0d1e37] border-y border-white/10 px-4 sm:px-6 py-3.5 shrink-0 text-xs sm:text-sm">
            <div>
              <span className="text-[#94a3b8] block text-[11px] font-medium">
                Fixed Travel Dates
              </span>
              <span className="font-bold text-white flex items-center gap-1 mt-0.5">
                <Calendar size={13} className="text-[#38bdf8]" />
                {formatDateString(departure.startDate)}
              </span>
            </div>
            <div>
              <span className="text-[#94a3b8] block text-[11px] font-medium">
                Return Date
              </span>
              <span className="font-bold text-white flex items-center gap-1 mt-0.5">
                <Calendar size={13} className="text-[#f97316]" />
                {formatDateString(departure.endDate)}
              </span>
            </div>
            <div>
              <span className="text-[#94a3b8] block text-[11px] font-medium">
                Seat Availability
              </span>
              <span className="font-bold text-white flex items-center gap-1 mt-0.5">
                <Users size={13} className="text-[#0ea5e9]" />
                {departure.availableSeats} / {departure.totalSeats} Open
              </span>
            </div>
            <div>
              <span className="text-[#94a3b8] block text-[11px] font-medium">
                Fixed Price
              </span>
              <span className="font-extrabold text-[#38bdf8] text-sm sm:text-base">
                NPR {departure.price.toLocaleString("en-US")}
              </span>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-sm custom-scrollbar bg-[#0a1628]">
            {/* Overview & Highlights */}
            <div className="space-y-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles size={16} className="text-[#0ea5e9]" /> Tour Overview
              </h3>
              <p className="text-[#cbd5e1] leading-relaxed text-xs sm:text-sm">
                {detailData.overview}
              </p>

              {/* Highlights Chips */}
              <div className="bg-[#0f2444] rounded-2xl p-4 border border-white/10 space-y-2 mt-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#38bdf8]">
                  Key Highlights Included
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {detailData.highlights.map((h, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2 text-xs text-white/90"
                    >
                      <CheckCircle2
                        size={14}
                        className="text-[#0ea5e9] shrink-0 mt-0.5"
                      />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Day-by-Day Detailed Itinerary */}
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Clock size={16} className="text-[#f97316]" /> Day-by-Day Fixed
                Departure Itinerary
              </h3>
              <div className="space-y-3 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#1e3a68]">
                {detailData.itinerary.map((item, idx) => (
                  <div
                    key={idx}
                    className="relative pl-8 space-y-1 bg-[#0d1e37]/40 hover:bg-[#0d1e37] p-3 rounded-xl border border-white/5 transition-colors"
                  >
                    <span className="absolute left-1.5 top-3.5 w-3.5 h-3.5 rounded-full bg-[#0ea5e9] border-2 border-[#0a1628] ring-2 ring-[#0ea5e9]/40" />
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-extrabold text-[#38bdf8] bg-[#0ea5e9]/20 px-2 py-0.5 rounded-md">
                        {item.day}
                      </span>
                      <h4 className="font-bold text-white text-xs sm:text-sm">
                        {item.title}
                      </h4>
                    </div>
                    <p className="text-xs text-[#94a3b8] leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Inclusions and Exclusions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {/* Inclusions */}
              <div className="bg-[#0b2447]/60 rounded-2xl p-4 border border-emerald-500/20 space-y-3">
                <h4 className="font-bold text-emerald-400 text-xs sm:text-sm flex items-center gap-2">
                  <CheckCircle2 size={16} /> What’s Included
                </h4>
                <ul className="space-y-2 text-xs text-white/85">
                  {detailData.inclusions.map((inc, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2
                        size={13}
                        className="text-emerald-400 shrink-0 mt-0.5"
                      />
                      <span>{inc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Exclusions */}
              <div className="bg-[#1b1c2b]/60 rounded-2xl p-4 border border-rose-500/20 space-y-3">
                <h4 className="font-bold text-rose-400 text-xs sm:text-sm flex items-center gap-2">
                  <XCircle size={16} /> What’s Excluded
                </h4>
                <ul className="space-y-2 text-xs text-white/80">
                  {detailData.exclusions.map((exc, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <XCircle
                        size={13}
                        className="text-rose-400 shrink-0 mt-0.5"
                      />
                      <span>{exc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Guaranteed Departure & Visa Assurance */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-sky-950/60 to-blue-950/60 border border-sky-500/25 flex items-center gap-3 text-xs text-sky-200">
              <ShieldCheck size={24} className="text-sky-400 shrink-0" />
              <div>
                <strong className="text-white block font-semibold">
                  Guaranteed Departure & Visa Assistance
                </strong>
                Fixed flight dates with group booking protection. Our Kathmandu
                visa desk provides full document compilation and interview
                preparation.
              </div>
            </div>
          </div>

          {/* Sticky Modal Footer CTA */}
          <div className="p-4 sm:p-5 bg-[#071120] border-t border-white/10 shrink-0 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-baseline gap-2 text-left w-full sm:w-auto">
              <div>
                <span className="text-[10px] text-[#94a3b8] uppercase font-semibold block">
                  All-Inclusive Group Price
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-lg sm:text-xl font-extrabold text-white">
                    NPR {departure.price.toLocaleString("en-US")}
                  </span>
                  <span className="text-xs text-[#94a3b8] line-through">
                    NPR {departure.originalPrice.toLocaleString("en-US")}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2 w-full sm:w-auto">
              {detailData.packageSlug && (
                <Link
                  href={detailData.packageSlug}
                  onClick={onClose}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-white/20 hover:bg-white/10 text-white font-semibold text-xs transition-all"
                >
                  <span>Full Package Guide</span>
                  <ExternalLink size={13} />
                </Link>
              )}

              <a
                href={`tel:${COMPANY.mobile}`}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#0ea5e9] hover:bg-[#0284c7] text-white font-bold text-xs transition-all shadow-md shadow-sky-500/20"
              >
                <Phone size={13} className="fill-white" />
                <span>Call Desk</span>
              </a>

              <a
                href={whatsAppLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[#f97316] hover:bg-[#ea580c] text-white font-extrabold py-2.5 px-4 rounded-xl shadow-lg transition-all text-xs"
              >
                <MessageSquare size={15} className="shrink-0" />
                <span>Reserve on WhatsApp</span>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
}
