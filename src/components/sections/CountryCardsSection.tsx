"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Package, MapPin, Sparkles, Star, ChevronDown, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { POPULAR_COUNTRIES, FEATURED_PACKAGES } from "@/lib/constants";
import PackageCard from "@/components/common/PackageCard";
import SectionHeader from "@/components/common/SectionHeader";
import { Button } from "@/components/ui/button";
import TravelFlightAnimation from "@/components/common/TravelFlightAnimation";

// Comprehensive Country Package Mapping
const COUNTRY_PACKAGES_MAP: Record<string, any[]> = {
  thailand: [
    {
      id: "bangkok-pattaya-6d",
      title: "Bangkok Pattaya - 05 Nights and 06 Day Itinerary",
      image: "/images/bangkok-pattaya.png",
      destination: "Bangkok & Pattaya, Thailand",
      duration: "05 Nights and 06 Days",
      price: 48000,
      originalPrice: 58000,
      rating: 4.9,
      reviews: 218,
      inclusions: ["Round-trip Flights", "3-Star Hotels", "Coral Island with Lunch", "City & Temple Tour"],
      badge: "Best Seller",
    },
    {
      id: "bangkok-pattaya-8d",
      title: "Bangkok Pattaya - 07 Nights and 08 Day Itinerary",
      image: "/images/gallery/sanctuary-of-truth-pattaya.png",
      destination: "Bangkok & Pattaya, Thailand",
      duration: "07 Nights and 08 Days",
      price: 56000,
      originalPrice: 68000,
      rating: 4.9,
      reviews: 142,
      inclusions: ["Round-trip Flights", "Welcome Plaza Hotel", "Coral Island with Lunch", "3 Free Shopping Days"],
      badge: "Extended Holiday",
    },
    {
      id: "bangkok-pattaya-phuket-8d",
      title: "Bangkok Pattaya Phuket - 07 Nights and 08 Day Itinerary",
      image: "/images/gallery/thailand-phi-phi-maya-bay.png",
      destination: "Bangkok, Pattaya & Phuket, Thailand",
      duration: "07 Nights and 08 Days",
      price: 68000,
      originalPrice: 82000,
      rating: 4.9,
      reviews: 196,
      inclusions: ["All Flights Included", "Coral Island with Lunch", "Phi Phi Islands & Maya Bay", "Bangkok City & Temples"],
      badge: "Island & City Combo",
    },
    {
      id: "krabi-phuket-bangkok-8d",
      title: "Krabi Phuket Bangkok - 07 Nights and 08 Day Itinerary",
      image: "/images/gallery/thailand-krabi-island-boat.jpg",
      destination: "Krabi, Phuket & Bangkok, Thailand",
      duration: "07 Nights and 08 Days",
      price: 74000,
      originalPrice: 89000,
      rating: 4.9,
      reviews: 175,
      inclusions: ["All Domestic & Int'l Flights", "Phi Phi Islands Tour with Lunch", "Krabi 4 Island Tour with Lunch", "Thailand Visa Included"],
      badge: "Ultimate Islands",
    },
    {
      id: "bangkok-pattaya-5d",
      title: "Bangkok Pattaya - 04 Nights and 05 Day Itinerary",
      image: "/images/gallery/pattaya-coral-island-platinum-speedboat.jpg",
      destination: "Bangkok & Pattaya, Thailand",
      duration: "04 Nights and 05 Days",
      price: 42000,
      originalPrice: 52000,
      rating: 4.9,
      reviews: 168,
      inclusions: ["Round-trip Flights", "Welcome Plaza / Phuphaya", "Coral Island with Lunch", "Thailand Visa Included"],
      badge: "Value Deal",
    },
    {
      id: "phuket-bangkok-6d",
      title: "Phuket & Bangkok - 05 Nights and 06 Day Itinerary",
      image: "/images/gallery/phuket-phi-phi-maya-bay-boats.png",
      destination: "Phuket & Bangkok, Thailand",
      duration: "05 Nights and 06 Days",
      price: 58000,
      originalPrice: 70000,
      rating: 4.9,
      reviews: 188,
      inclusions: ["All Int'l & Domestic Flights", "Phi Phi Islands Tour with Lunch", "Bangkok Reclining & Golden Buddha", "Thailand Visa Included"],
      badge: "Island & City Escape",
    },
  ],
  bali: [
    {
      id: "bali-malaysia-7d",
      title: "Bali Malaysia - 06 Nights and 07 Day Itinerary",
      image: "/images/bali-kelingking.jpg",
      destination: "Bali, Indonesia & Kuala Lumpur, Malaysia",
      duration: "06 Nights and 07 Days",
      price: 78000,
      originalPrice: 92000,
      rating: 4.9,
      reviews: 184,
      inclusions: ["Round-trip Airfare", "3-Star Hotels + Breakfast", "Batu Caves & Genting", "Ubud & Kintamani Tour"],
      badge: "Top Rated",
    },
    {
      id: "bali-7d",
      title: "Bali Honeymoon & Tropical Villa - 06 Nights and 07 Days",
      image: "/images/gallery/bali-kelingking-t-rex-cliff-turquoise.png",
      destination: "Seminyak & Ubud, Bali",
      duration: "06 Nights and 07 Days",
      price: 82000,
      originalPrice: 96000,
      rating: 4.9,
      reviews: 165,
      inclusions: ["Round-trip Flights", "Private Pool Villa Stay", "Flower Bath & Candlelight Dinner", "Ubud Swings & Rice Terraces"],
      badge: "Honeymoon Special",
    },
  ],
  "singapore-malaysia": [
    {
      id: "thailand-malaysia-singapore-9d",
      title: "Thailand, Malaysia & Singapore - 08 Nights and 09 Days Itinerary",
      image: "/images/gallery/thailand-malaysia-singapore-trio.jpg",
      destination: "Bangkok, Pattaya, Singapore & Kuala Lumpur",
      duration: "08 Nights and 09 Days",
      price: 88000,
      originalPrice: 106000,
      rating: 4.9,
      reviews: 194,
      inclusions: ["All Flights & Coach Transfers", "Coral Island Tour with Lunch", "Sentosa Cable Car & Wings of Time", "Genting Skyway & Batu Caves Tour"],
      badge: "Tri-Country Grand Tour",
    },
    {
      id: "malaysia-singapore-6d",
      title: "Malaysia Singapore - 05 Nights and 06 Day Itinerary",
      image: "/images/gallery/malaysia-petronas-towers-flag-night.png",
      destination: "Singapore & Kuala Lumpur, Malaysia",
      duration: "05 Nights and 06 Days",
      price: 68000,
      originalPrice: 82000,
      rating: 4.9,
      reviews: 152,
      inclusions: ["Round-trip Airfare", "Value Thomson Singapore Hotel", "Sentosa Cable Car & Wings of Time", "Genting Skyway & Batu Caves"],
      badge: "City & Thrills",
    },
    {
      id: "singapore-4d",
      title: "Singapore - 03 Nights and 04 Days Itinerary",
      image: "/images/gallery/singapore-merlion-park-marina-bay.jpg",
      destination: "Singapore",
      duration: "03 Nights and 04 Days",
      price: 54000,
      originalPrice: 66000,
      rating: 4.9,
      reviews: 145,
      inclusions: ["Round-trip Airfare", "Value Thomson 3* Hotel", "Sentosa Cable Car & Wings of Time", "Singapore City Tour & Merlion"],
      badge: "Futuristic Metropolis",
    },
  ],
  vietnam: [
    {
      id: "vietnam-6d",
      title: "Let's Explore Vietnam - 05 Nights and 06 Days Itinerary",
      image: "/images/gallery/vietnam-highlights-collage-card.jpg",
      destination: "Hanoi, Ha Long Bay & Da Nang",
      duration: "05 Nights and 06 Days",
      price: 54000,
      originalPrice: 65000,
      rating: 4.9,
      reviews: 172,
      inclusions: ["Hanoi City Tour & Train Street", "Ha Long Bay Luxury Overnight Cruise", "Cam Thanh Coconut Basket Boat", "Hoi An Ancient Town Walking Tour"],
      badge: "Trending Tour",
    },
    {
      id: "vietnam-8d",
      title: "Let's Explore Vietnam Premium - 07 Nights and 08 Days Itinerary",
      image: "/images/gallery/vietnam-danang-golden-bridge-hands.jpg",
      destination: "Hanoi, Ha Long Bay, Da Nang & Hoi An",
      duration: "07 Nights and 08 Days",
      price: 72000,
      originalPrice: 86000,
      rating: 4.9,
      reviews: 189,
      inclusions: ["Ha Long Bay Luxury Overnight Cruise", "Ba Na Hills & Golden Giant Hands Bridge", "Cam Thanh Coconut Basket Boat", "Hoi An Lantern Boat Release"],
      badge: "Premium Experience",
    },
    {
      id: "thailand-vietnam-8d",
      title: "Thailand & Vietnam - 07 Nights and 08 Days Itinerary — Hanoi",
      image: "/images/gallery/halong-bay-luxury-yacht-cruise-sunset.png",
      destination: "Bangkok, Pattaya, Hanoi & Halong Bay",
      duration: "07 Nights and 08 Days",
      price: 78000,
      originalPrice: 94000,
      rating: 4.9,
      reviews: 176,
      inclusions: ["All Flights & Inter-Country Airfare", "Overnight Halong Bay Luxury Cruise", "Coral Island Tour with Indian Lunch", "Bangkok Temples & Hanoi City Tour"],
      badge: "Cruise & Twin Country",
    },
  ],
  maldives: [
    {
      id: "maldives-4d",
      title: "Maldives - 03 Nights and 04 Day Itinerary",
      image: "/images/gallery/maldives-overwater-bungalows-aerial-lagoon.png",
      destination: "Malé & Hulhumalé, Maldives",
      duration: "03 Nights and 04 Days",
      price: 85000,
      originalPrice: 105000,
      rating: 4.9,
      reviews: 138,
      inclusions: ["Round-trip Flights", "3-Star Hulhumalé Hotel", "Sandbank & Snorkeling", "Sunset Dolphin Cruise"],
      badge: "Ocean Getaway",
    },
  ],
  philippines: [
    {
      id: "philippines-6d",
      title: "Philippines - 05 Nights and 06 Day Itinerary",
      image: "/images/gallery/philippines-boracay-beach-bangka-boats.png",
      destination: "Manila & Boracay, Philippines",
      duration: "05 Nights and 06 Days",
      price: 89000,
      originalPrice: 108000,
      rating: 4.9,
      reviews: 164,
      inclusions: ["All Flights Included", "3-Star Hotel & Boracay Resort", "Boracay Island Hopping with Lunch", "Manila Intramuros Tour"],
      badge: "Tropical Islands",
    },
    {
      id: "philippines-8d",
      title: "Philippines - 07 Nights and 08 Day Itinerary",
      image: "/images/gallery/philippines-el-nido-palawan-aerial-lagoon.png",
      destination: "Manila & Boracay, Philippines",
      duration: "07 Nights and 08 Days",
      price: 98000,
      originalPrice: 118000,
      rating: 4.9,
      reviews: 182,
      inclusions: ["All Int'l & Domestic Flights", "Boracay Island Hopping with Lunch", "2 Free Days (Boracay & Manila)", "Manila Heritage City Tour"],
      badge: "Extended Island Escape",
    },
  ],
  china: [
    {
      id: "china-beijing-shanghai-8d",
      title: "China Wonders: Beijing, Great Wall & Shanghai - 07 Nights and 08 Days",
      image: "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800&q=80",
      destination: "Beijing & Shanghai, China",
      duration: "07 Nights and 08 Days",
      price: 135000,
      originalPrice: 155000,
      rating: 4.9,
      reviews: 128,
      inclusions: ["Round-trip Flights from Kathmandu", "Great Wall Cable Car Tour", "Bullet Train Beijing to Shanghai", "China Visa Assistance"],
      badge: "Wonders of the World",
    },
  ],
};

// Handpicked initial packages shown in the user's screenshot
const INITIAL_FEATURED_FOUR = [
  {
    id: "bangkok-pattaya-6d",
    title: "Bangkok Pattaya - 05 Nights and 06 Day Itinerary",
    image: "/images/bangkok-pattaya.png",
    destination: "Bangkok & Pattaya, Thailand",
    duration: "05 Nights and 06 Days",
    price: 48000,
    originalPrice: 58000,
    rating: 4.9,
    reviews: 218,
    inclusions: ["Round-trip Flights", "3-Star Hotels", "Coral Island with Lunch", "City & Temple Tour"],
    badge: "Best Seller",
  },
  {
    id: "bali-malaysia-7d",
    title: "Bali Malaysia - 06 Nights and 07 Day Itinerary",
    image: "/images/bali-kelingking.jpg",
    destination: "Bali, Indonesia & Kuala Lumpur, Malaysia",
    duration: "06 Nights and 07 Days",
    price: 78000,
    originalPrice: 92000,
    rating: 4.9,
    reviews: 184,
    inclusions: ["Round-trip Airfare", "3-Star Hotels + Breakfast", "Batu Caves & Genting", "Ubud & Kintamani Tour"],
    badge: "Top Rated",
  },
  {
    id: "bangkok-pattaya-8d",
    title: "Bangkok Pattaya - 07 Nights and 08 Day Itinerary",
    image: "/images/gallery/sanctuary-of-truth-pattaya.png",
    destination: "Bangkok & Pattaya, Thailand",
    duration: "07 Nights and 08 Days",
    price: 56000,
    originalPrice: 68000,
    rating: 4.9,
    reviews: 142,
    inclusions: ["Round-trip Flights", "Welcome Plaza Hotel", "Coral Island with Lunch", "3 Free Shopping Days"],
    badge: "Extended Holiday",
  },
  {
    id: "bangkok-pattaya-phuket-8d",
    title: "Bangkok Pattaya Phuket - 07 Nights and 08 Day Itinerary",
    image: "/images/gallery/thailand-phi-phi-maya-bay.png",
    destination: "Bangkok, Pattaya & Phuket, Thailand",
    duration: "07 Nights and 08 Days",
    price: 68000,
    originalPrice: 82000,
    rating: 4.9,
    reviews: 196,
    inclusions: ["All Flights Included", "Coral Island with Lunch", "Phi Phi Islands & Maya Bay", "Bangkok City & Temples"],
    badge: "Island & City Combo",
  },
];

export default function CountryCardsSection() {
  const [countriesList, setCountriesList] = useState(POPULAR_COUNTRIES);
  const [selectedCountryId, setSelectedCountryId] = useState<string>("all");
  const packagesGridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("skywalk_countries");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setCountriesList(
              parsed.filter((c: any) => c.featured !== false)
            );
          }
        } catch (e) {}
      }
    }
  }, []);

  const handleSelectCountry = (countryId: string) => {
    setSelectedCountryId(countryId);
    if (packagesGridRef.current) {
      packagesGridRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  };

  const selectedCountry = countriesList.find((c) => c.id === selectedCountryId);

  // Determine packages to show
  const activePackages =
    selectedCountryId === "all"
      ? INITIAL_FEATURED_FOUR
      : COUNTRY_PACKAGES_MAP[selectedCountryId] ||
        FEATURED_PACKAGES.filter((p) => {
          const target = (selectedCountry?.name || "").toLowerCase();
          return (
            (p.destination || "").toLowerCase().includes(target) ||
            (p.title || "").toLowerCase().includes(target)
          );
        });

  return (
    <section className="section-padding relative overflow-hidden bg-gradient-to-b from-transparent via-sky-50/35 to-transparent">
      {/* Background ambient radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[850px] h-[550px] bg-sky-200/40 rounded-full blur-[140px] pointer-events-none" />

      {/* Live Animated Travel Flight Background with Towing Logo Banner */}
      <TravelFlightAnimation />

      <div className="container-custom relative z-10">
        <SectionHeader
          eyebrow="Explore by Country"
          title="Popular Travel Destinations & Packages"
          subtitle="Choose a country below to explore its handpicked holiday packages with all-inclusive pricing."
        />

        {/* 1. Country Cards Grid with Staggered Entrance & Interactive Hover Animations */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
          {countriesList.slice(0, 8).map((country, index) => {
            const isSelected = selectedCountryId === country.id;
            const packageCount =
              COUNTRY_PACKAGES_MAP[country.id]?.length || country.packagesCount || 3;

            return (
              <motion.div
                key={country.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: index * 0.07, ease: "easeOut" }}
                whileHover={{ y: -8, scale: 1.015 }}
                onClick={() => handleSelectCountry(country.id)}
                className={`group relative min-h-[300px] sm:h-[340px] rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col justify-between p-4 sm:p-5 ${
                  isSelected
                    ? "ring-4 ring-[#0ea5e9] shadow-2xl shadow-sky-500/25 border-transparent"
                    : "border border-slate-200/80 hover:border-sky-400/60"
                }`}
              >
                {/* Country Background Image */}
                <Image
                  src={country.image}
                  alt={`${country.name} holiday packages`}
                  fill
                  className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-110"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />

                {/* Gradient Dark Overlay */}
                <div
                  className={`absolute inset-0 bg-gradient-to-t from-[#0a1628] via-[#0a1628]/40 to-transparent transition-opacity duration-300 ${
                    isSelected ? "opacity-95" : "group-hover:opacity-90"
                  }`}
                />

                {/* Top Badges Row */}
                <div className="relative z-10 flex flex-wrap items-center justify-between gap-1.5 w-full">
                  {/* Flag + Badge */}
                  <div className="inline-flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold text-[#0a1628] shadow-lg border border-white/60 transition-transform duration-300 group-hover:scale-105">
                    <span className="text-sm">{country.flag}</span>
                    <span>{country.badge}</span>
                  </div>

                  {/* Number of Packages Pill / Active Badge */}
                  <div
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-extrabold shadow-md transition-all duration-300 ${
                      isSelected
                        ? "bg-emerald-500 text-white shadow-emerald-500/30 ring-2 ring-white scale-105"
                        : "bg-[#0ea5e9] text-white shadow-sky-500/30 group-hover:bg-[#f97316] group-hover:scale-105"
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <CheckCircle2 size={12} className="animate-pulse" />
                        <span>Viewing Packages</span>
                      </>
                    ) : (
                      <>
                        <Package size={12} />
                        <span>{packageCount} Packages</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Bottom Content Area */}
                <div className="relative z-10 text-left mt-auto pt-6">
                  <div className="text-[11px] sm:text-xs font-medium text-sky-300 flex items-center gap-1 mb-1">
                    <MapPin size={11} className="text-sky-400 shrink-0" />
                    <span className="truncate">{country.subtitle}</span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug mb-2 group-hover:text-sky-300 transition-colors">
                    {country.name}
                  </h3>

                  <div className="pt-3 border-t border-white/15 flex flex-wrap items-center justify-between gap-2 text-white/90">
                    <div>
                      <span className="text-[10px] text-slate-300 uppercase tracking-wider block font-semibold">
                        Packages From
                      </span>
                      <span className="text-sm font-extrabold text-white whitespace-nowrap">
                        NPR {country.startingPrice?.toLocaleString("en-US")}
                      </span>
                    </div>

                    <div
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300 flex items-center gap-1 shrink-0 ${
                        isSelected
                          ? "bg-[#0ea5e9] text-white shadow-lg shadow-sky-500/30"
                          : "bg-white/15 backdrop-blur-sm text-white group-hover:bg-[#0ea5e9]"
                      }`}
                    >
                      <span>{isSelected ? "Packages Below" : "See Packages"}</span>
                      <ChevronDown
                        size={14}
                        className={`transition-transform duration-300 ${isSelected ? "rotate-180" : "group-hover:translate-y-0.5"}`}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* 2. Interactive Packages Showcase Connected to Country Cards */}
        <div ref={packagesGridRef} className="pt-4 scroll-mt-24">
          {/* Filter Pills Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-md mb-8 flex flex-col md:flex-row items-center justify-between gap-4"
          >
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#0ea5e9] animate-pulse shrink-0" />
              <div className="text-left">
                <h4 className="text-sm sm:text-base font-extrabold text-[#0a1628]">
                  {selectedCountryId === "all"
                    ? "Handpicked Worldwide Packages"
                    : `${selectedCountry?.name} Holiday Packages (${activePackages.length})`}
                </h4>
                <p className="text-xs text-[#64748b]">
                  {selectedCountryId === "all"
                    ? "Carefully curated luxury & budget holiday packages with all-inclusive pricing."
                    : `Best price guaranteed packages for ${selectedCountry?.name} with flights and hotels.`}
                </p>
              </div>
            </div>

            {/* Quick Country Pill Switchers */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full md:w-auto py-1">
              <button
                type="button"
                suppressHydrationWarning
                onClick={() => setSelectedCountryId("all")}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all cursor-pointer ${
                  selectedCountryId === "all"
                    ? "bg-[#0a1628] text-white shadow-md"
                    : "bg-slate-100 text-[#475569] hover:bg-slate-200"
                }`}
              >
                ★ All Featured (4)
              </button>
              {countriesList.slice(0, 6).map((c) => {
                const count = COUNTRY_PACKAGES_MAP[c.id]?.length || c.packagesCount;
                return (
                  <button
                    key={c.id}
                    type="button"
                    suppressHydrationWarning
                    onClick={() => setSelectedCountryId(c.id)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all flex items-center gap-1.5 cursor-pointer ${
                      selectedCountryId === c.id
                        ? "bg-[#0ea5e9] text-white shadow-md shadow-sky-500/30"
                        : "bg-slate-100 text-[#475569] hover:bg-slate-200"
                    }`}
                  >
                    <span>{c.flag}</span>
                    <span>{c.name}</span>
                    <span className="text-[10px] opacity-80 font-mono">({count})</span>
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Package Cards Grid (The 4 packages from home section + country packages) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <AnimatePresence mode="popLayout">
              {activePackages.map((pkg) => (
                <motion.div
                  key={pkg.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                >
                  <PackageCard {...pkg} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Bottom Actions Row */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
            {selectedCountryId !== "all" && (
              <Button
                variant="outline"
                onClick={() => setSelectedCountryId("all")}
                className="rounded-full text-xs font-bold border-slate-300 text-[#0a1628] hover:bg-slate-100"
              >
                Show All Featured Packages
              </Button>
            )}
            <Link
              href={
                selectedCountryId !== "all" && selectedCountry
                  ? `/services/packages/international?country=${encodeURIComponent(
                      selectedCountry.name
                    )}`
                  : "/services/packages/international"
              }
              className="inline-flex items-center gap-2.5 bg-[#0a1628] hover:bg-[#0ea5e9] text-white px-7 py-3.5 rounded-full font-bold text-xs sm:text-sm shadow-xl hover:shadow-sky-500/20 transition-all duration-300 hover:-translate-y-0.5"
            >
              <Sparkles size={16} className="text-amber-400" />
              <span>
                {selectedCountryId !== "all" && selectedCountry
                  ? `View All ${selectedCountry.name} Packages`
                  : "View All International Packages"}
              </span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
