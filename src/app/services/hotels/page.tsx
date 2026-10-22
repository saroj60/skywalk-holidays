import React from "react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Hotel, Star, MapPin, Tag, ShieldCheck, Headphones, Wifi, Coffee, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionHeader from "@/components/common/SectionHeader";
import CTABanner from "@/components/common/CTABanner";
import HotelInquiryForm from "@/components/forms/HotelInquiryForm";

export const metadata: Metadata = {
  title: "Hotel Booking in Nepal & Worldwide | Best Agency Rates — Skywalk Holidays",
  description:
    "Book handpicked 3-star, 4-star, and 5-star luxury hotels in Bangkok, Bali, Kuala Lumpur, Singapore, Kathmandu & Pokhara with Skywalk Holidays. Save up to 30% with exclusive agency contracted rates.",
  keywords: [
    "hotel booking in nepal",
    "cheap hotels bangkok from nepal",
    "bali hotel and villa booking kathmandu",
    "singapore hotels travel agency nepal",
    "kathmandu hotels booking",
    "pokhara resort booking",
    "best travel agency hotel booking nepal",
  ],
  alternates: {
    canonical: "https://skywalkholidays.com/services/hotels",
  },
  openGraph: {
    title: "Hotel Booking in Nepal & Worldwide — Skywalk Holidays",
    description:
      "Save up to 30% on verified hotels and luxury private pool villas worldwide with Skywalk Holidays Kathmandu.",
    url: "https://skywalkholidays.com/services/hotels",
    siteName: "Skywalk Holidays Nepal",
    type: "website",
  },
};

const POPULAR_DESTINATIONS = [
  {
    name: "Kuala Lumpur",
    country: "Malaysia",
    image: "/images/gallery/malaysia-petronas-towers-flag-night.png",
    hotelsCount: "210+ Hotels",
    startingFrom: "NPR 5,500",
  },
  {
    name: "Bangkok",
    country: "Thailand",
    image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800&q=80",
    hotelsCount: "320+ Hotels",
    startingFrom: "NPR 4,200",
  },
  {
    name: "Singapore",
    country: "Singapore",
    image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&q=80",
    hotelsCount: "180+ Hotels",
    startingFrom: "NPR 12,000",
  },
  {
    name: "Kathmandu",
    country: "Nepal",
    image: "https://images.unsplash.com/photo-1572783428294-65fddbab5b4c?w=800&q=80",
    hotelsCount: "150+ Hotels",
    startingFrom: "NPR 2,500",
  },
  {
    name: "Pokhara",
    country: "Nepal",
    image: "https://images.unsplash.com/photo-1580502304784-8985b7eb7260?w=800&q=80",
    hotelsCount: "120+ Hotels",
    startingFrom: "NPR 3,000",
  },
  {
    name: "Bali",
    country: "Indonesia",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80",
    hotelsCount: "280+ Hotels & Villas",
    startingFrom: "NPR 5,500",
  },
];

const RECOMMENDED_HOTELS = [
  {
    id: 1,
    name: "Grand Hyatt Kathmandu",
    location: "Kathmandu, Nepal",
    rating: 4.9,
    reviews: 240,
    price: 18500,
    category: "5-Star Luxury",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
    amenities: ["Spa", "Pool", "Free Wi-Fi", "Airport Transfer"],
  },
  {
    name: "Marina Bay Sands Hotel",
    location: "Marina Bay, Singapore",
    rating: 4.9,
    reviews: 512,
    price: 45000,
    category: "5-Star Luxury Resort",
    image: "https://images.unsplash.com/photo-1565967511849-76a60a516170?w=800&q=80",
    amenities: ["Infinity Pool", "SkyPark", "Fine Dining", "Casino"],
  },
  {
    name: "Fishtail Lodge Pokhara",
    location: "Lakeside, Pokhara",
    rating: 4.8,
    reviews: 189,
    price: 12500,
    category: "Heritage Resort",
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80",
    amenities: ["Lake View", "Garden", "Restaurant", "Boating"],
  },
  {
    name: "Marina Bay Luxury Suites",
    location: "Marina Bay, Singapore",
    rating: 4.9,
    reviews: 380,
    price: 38000,
    category: "5-Star Hotel",
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80",
    amenities: ["Infinity Pool", "Rooftop Bar", "Gym", "Breakfast"],
  },
];

const WHY_BOOK_HOTELS = [
  {
    icon: Tag,
    title: "Exclusive Agency Rates",
    description: "Save up to 30% compared to online booking platforms through our direct hotel contracts.",
    color: "bg-[#fff7ed] text-[#f97316]",
  },
  {
    icon: ShieldCheck,
    title: "100% Verified Properties",
    description: "Every hotel in our portfolio is hand-checked for hygiene, safety, comfort, and service standard.",
    color: "bg-[#e0f2fe] text-[#0ea5e9]",
  },
  {
    icon: Sparkles,
    title: "Flexible Cancellation",
    description: "Enjoy stress-free travel planning with flexible refund and date change policies on most stays.",
    color: "bg-[#f0fdf4] text-emerald-600",
  },
  {
    icon: Headphones,
    title: "24/7 Local Support",
    description: "Our dedicated accommodation desk is available round-the-clock for special requests and room upgrades.",
    color: "bg-[#faf5ff] text-purple-600",
  },
];

export default function HotelsPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#0a1628] via-[#163058] to-[#0ea5e9] py-20 md:py-28 text-white relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="container-custom relative z-10 text-center max-w-4xl mx-auto">
          {/* Tag */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 mb-6">
            <Hotel size={16} className="text-[#0ea5e9]" />
            <span className="text-white text-xs font-semibold tracking-wider uppercase">
              Handpicked Accommodations Worldwide
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
            Find Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0ea5e9] via-[#38bdf8] to-white">
              Perfect Stay.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-white/80 text-base sm:text-xl leading-relaxed max-w-2xl mx-auto font-normal">
            Handpicked hotels from cozy budget guesthouses to luxury 5-star resorts worldwide. Exclusive rates and verified quality for every traveler.
          </p>
        </div>
      </section>

      {/* Hotel Inquiry Form Container */}
      <section className="relative z-20 -mt-10 pb-16 px-4">
        <div className="container-custom">
          <HotelInquiryForm />
        </div>
      </section>

      {/* 1. Popular Destinations Section */}
      <section className="section-padding bg-[#f8fafc]">
        <div className="container-custom">
          <SectionHeader
            eyebrow="Popular Destinations"
            title="Explore Hotels in Top Travel Destinations"
            subtitle="Browse verified stays in the world's most sought-after cities and holiday hotspots."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {POPULAR_DESTINATIONS.map((dest) => (
              <div
                key={dest.name}
                className="group relative rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl border border-[#e2e8f0] bg-white transition-all duration-300 hover:-translate-y-1.5 cursor-pointer"
              >
                {/* Image */}
                <div className="relative h-64 w-full overflow-hidden">
                  <Image
                    src={dest.image}
                    alt={dest.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Top Badge */}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-[#0a1628] text-xs font-bold px-3 py-1 rounded-full shadow">
                    {dest.hotelsCount}
                  </div>

                  {/* Bottom Info */}
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="flex items-center gap-1.5 text-xs text-white/80 mb-1">
                      <MapPin size={12} className="text-[#0ea5e9]" />
                      {dest.country}
                    </div>
                    <h3 className="text-2xl font-bold">{dest.name}</h3>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/20">
                      <span className="text-xs text-white/70">Starting from</span>
                      <span className="text-sm font-extrabold text-[#38bdf8]">{dest.startingFrom} / night</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Recommended Hotels Section */}
      <section className="section-padding">
        <div className="container-custom">
          <SectionHeader
            eyebrow="Curated Stays"
            title="Recommended Hotels &amp; Luxury Resorts"
            subtitle="Top-rated accommodations handpicked for superior comfort, exceptional amenities, and prime location."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {RECOMMENDED_HOTELS.map((hotel) => (
              <div
                key={hotel.name}
                className="bg-white rounded-3xl border border-[#e2e8f0] shadow-sm hover:shadow-2xl hover:border-[#0ea5e9]/40 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between overflow-hidden group"
              >
                <div>
                  <div className="relative h-48 w-full overflow-hidden">
                    <Image
                      src={hotel.image}
                      alt={hotel.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                    <div className="absolute top-3 left-3 bg-[#0a1628]/90 text-white text-[11px] font-bold px-2.5 py-1 rounded-full">
                      {hotel.category}
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-center gap-1 text-xs text-[#64748b] mb-1.5">
                      <MapPin size={12} className="text-[#0ea5e9]" />
                      {hotel.location}
                    </div>
                    <h3 className="font-bold text-[#0a1628] text-base mb-2 group-hover:text-[#0ea5e9] transition-colors leading-snug">
                      {hotel.name}
                    </h3>

                    <div className="flex items-center gap-1 mb-4">
                      <Star size={14} className="text-amber-400 fill-amber-400" />
                      <span className="text-xs font-bold text-[#0a1628]">{hotel.rating}</span>
                      <span className="text-xs text-[#94a3b8]">({hotel.reviews} reviews)</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {hotel.amenities.map((amenity) => (
                        <span key={amenity} className="text-[11px] bg-[#f8fafc] text-[#475569] border border-[#e2e8f0] px-2 py-0.5 rounded-full">
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-[#f1f5f9] mt-auto flex items-center justify-between">
                  <div>
                    <span className="text-xs text-[#94a3b8] block">From</span>
                    <span className="text-base font-extrabold text-[#0a1628]">NPR {hotel.price.toLocaleString()}</span>
                  </div>
                  <Button size="sm" asChild className="bg-[#0ea5e9] hover:bg-[#0284c7]">
                    <Link href="#hotel-inquiry">Inquire</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Why Book Hotels Through Us Section */}
      <section className="section-padding bg-[#f8fafc]">
        <div className="container-custom">
          <SectionHeader
            eyebrow="Why Choose Us"
            title="Why Book Hotels Through Skywalks Holidays?"
            subtitle="We provide direct hotel contracts, local concierge assistance, and price transparency for every stay."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHY_BOOK_HOTELS.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="bg-white rounded-3xl p-7 border border-[#e2e8f0] shadow-sm hover:shadow-xl hover:border-[#0ea5e9]/40 transition-all duration-300 group"
                >
                  <div className={`w-14 h-14 rounded-2xl ${item.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <Icon size={26} />
                  </div>
                  <h3 className="text-lg font-bold text-[#0a1628] mb-3 group-hover:text-[#0ea5e9] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[#64748b] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <CTABanner
        title="Planning a Group Stay or Resort Event?"
        subtitle="Our hotel specialists handle group allocations, corporate conferences, and luxury villa rentals."
        primaryLabel="Get Group Rates"
        primaryHref="/contact"
        secondaryLabel="Talk to Hotel Desk"
        secondaryHref="tel:+97798XXXXXXXX"
      />
    </>
  );
}
