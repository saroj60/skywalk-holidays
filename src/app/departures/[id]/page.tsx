import React from "react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  Hotel,
  FileText,
  HelpCircle,
  Star,
  ShieldCheck,
  ChevronRight,
  Calendar,
  Briefcase,
  Luggage,
  FileCheck2,
  AlertCircle,
  Play,
  Video,
  ArrowRight,
} from "lucide-react";
import { getDepartureById, SAMPLE_DEPARTURES } from "@/lib/departuresData";
import { PACKAGES_DICTIONARY } from "@/lib/packagesData";
import DepartureSidebar from "@/components/departures/DepartureSidebar";
import PackageGallerySection from "@/components/packages/PackageGallerySection";
import PackageSubNav from "@/components/packages/PackageSubNav";
import PackagePdfButton from "@/components/packages/PackagePdfButton";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const departure = await getDepartureById(id);

  if (!departure) {
    return {
      title: "Holiday Departure | Skywalks Holidays",
      description: "Explore guaranteed upcoming fixed holiday departures with Skywalks Holidays.",
    };
  }

  return {
    title: `${departure.title} (${departure.duration}) | Fixed Holiday Departure | Skywalks Holidays`,
    description: departure.overview,
    openGraph: {
      title: `${departure.title} - ${departure.seasonTag}`,
      description: departure.overview,
      images: [
        {
          url: departure.image,
          width: 1200,
          height: 630,
          alt: departure.title,
        },
      ],
    },
  };
}

export default async function DepartureDetailPage({ params }: PageProps) {
  const { id } = await params;
  const departure = await getDepartureById(id);

  if (!departure) {
    notFound();
  }

  // Look up matching full package dictionary entry if available
  const pkgKey = departure.packageSlug?.replace("/packages/", "");
  const linked = pkgKey ? PACKAGES_DICTIONARY[pkgKey] : null;

  // Build unified package object with all fields matching normal package structure
  const pkg: any = {
    ...linked,
    ...departure,
    id: departure.id,
    title: departure.title,
    destination: departure.destination,
    duration: departure.duration || linked?.duration || "6 Days / 5 Nights",
    price: departure.price,
    originalPrice: departure.originalPrice,
    country: linked?.country || (departure.destination.includes("Vietnam") ? "Vietnam" : departure.destination.includes("Bali") ? "Indonesia" : departure.destination.includes("Thailand") ? "Thailand" : "Europe"),
    rating: linked?.rating || 4.9,
    reviewsCount: linked?.reviewsCount || linked?.reviews || 192,
    overview: departure.overview || linked?.overview,
    highlights: departure.highlights && departure.highlights.length > 0 ? departure.highlights : linked?.highlights || [],
    gallery: departure.gallery && departure.gallery.length > 0 ? departure.gallery : linked?.gallery || [{ url: departure.image, caption: departure.title }],
    outlineItinerary: linked?.outlineItinerary || departure.itinerary?.map((it, idx) => ({
      day: it.day || `Day ${idx + 1}`,
      title: it.title,
      activity: it.desc,
    })) || [],
    itinerary: linked?.itinerary || departure.itinerary?.map((it) => ({
      day: it.day,
      title: it.title,
      description: it.desc,
      meals: "Breakfast & Dinner Included",
      stay: "4-Star Hotel / Deluxe Cruise",
    })) || [],
    inclusions: departure.inclusions && departure.inclusions.length > 0 ? departure.inclusions : linked?.inclusions || [],
    exclusions: departure.exclusions && departure.exclusions.length > 0 ? departure.exclusions : linked?.exclusions || [],
    hotelInfo: linked?.hotelInfo || {
      name: "Handpicked 4-Star Central Hotel & Deluxe Accommodations",
      rating: "4-Star Verified Hospitality",
      location: departure.destination,
      checkIn: "2:00 PM",
      checkOut: "12:00 PM",
      roomType: "Deluxe Twin / Double Room with Air Conditioning",
      amenities: [
        "Outdoor Swimming Pool",
        "Free High-Speed Wi-Fi",
        "Daily Buffet Breakfast",
        "Air Conditioning",
        "En-suite Bathroom with Hot Water",
        "24-Hour Reception & Security",
      ],
    },
    hotelAccommodation: linked?.hotelAccommodation || [
      {
        destination: departure.destination.split(",")[0] || departure.destination,
        hotel: "Selected 4-Star Premium City Hotel",
        roomType: "Deluxe Room",
        category: "4-Star Deluxe",
      },
      {
        destination: departure.destination.split(",")[1] || departure.destination,
        hotel: "Luxury Resort / Scenic Stay",
        roomType: "Superior View Room",
        category: "4★ / 5★ Verified",
      },
    ],
    equipment: linked?.equipment || [
      {
        category: "Travel Essentials & Clothing",
        items: [
          "Comfortable cotton clothing, casual t-shirts & shorts",
          "Comfortable walking shoes or sneakers for city exploration",
          "Light jacket or cardigan for air-conditioned flights and evenings",
          "Swimwear and sun protection gear for beach / pool days",
        ],
      },
      {
        category: "Mandatory Documents & Currency Checklist",
        items: [
          "Original passport with minimum 6 months validity from return date",
          "Printed flight e-tickets, hotel booking vouchers & itinerary (provided by Skywalk)",
          "Required forex currency / cash & international debit or credit card",
          "Universal travel power adapter & electronic accessories",
        ],
      },
    ],
    cancellationPolicySchedule: linked?.cancellationPolicySchedule || {
      landAndHotel: [
        { period: "30+ days before departure", charge: "0% Cancellation Fee" },
        { period: "29 to 15 days before departure", charge: "40% Cancellation Fee" },
        { period: "14 to 7 days before departure", charge: "75% Cancellation Fee" },
        { period: "Within 6 days of departure", charge: "100% Non-refundable" },
      ],
      landOnly: [
        { period: "21+ days before arrival", charge: "No Cancellation Fee" },
        { period: "20 to 10 days before arrival", charge: "50% Fee" },
        { period: "Within 9 days of arrival", charge: "100% Fee" },
      ],
      rules: [
        "International flight ticket cancellation is strictly subject to individual airline policies.",
        "Guaranteed group departure seat reservations are non-transferable after ticket issuance.",
        "Visa fees paid to embassies or immigration departments are strictly non-refundable.",
      ],
    },
    faqs: linked?.faqs || [
      {
        q: "How do I secure my seat on this fixed departure date?",
        a: "Click 'Reserve Seat on WhatsApp' or call our Kathmandu desk. Submit your passport copy along with a 25% deposit to lock in your flight ticket and guaranteed group seat.",
      },
      {
        q: "Does Skywalk Holidays handle visa processing from Kathmandu?",
        a: "Yes! Our Kathmandu visa desk handles document verification, cover letters, embassy appointments, and approval letters.",
      },
      {
        q: "Can solo travelers join this group departure?",
        a: "Yes, solo travelers can either be paired for twin-sharing with a fellow traveler or opt for a single-room supplement.",
      },
    ],
    videoEmbedUrl: linked?.videoEmbedUrl,
    videoTitle: linked?.videoTitle,
    videoShortUrl: linked?.videoShortUrl,
    isShort: linked?.isShort,
  };

  const otherDepartures = SAMPLE_DEPARTURES.filter((d) => d.id !== departure.id);

  const formatDateString = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="bg-[#f8fafc] pb-20 font-sans">
      {/* Breadcrumb Bar */}
      <div className="bg-white border-b border-[#e2e8f0] py-3 text-xs text-[#64748b]">
        <div className="container-custom flex items-center gap-2">
          <Link href="/" className="hover:text-[#0ea5e9]">
            Home
          </Link>
          <ChevronRight size={12} />
          <Link href="/services/packages/international" className="hover:text-[#0ea5e9]">
            Fixed Holiday Departures
          </Link>
          <ChevronRight size={12} />
          <span className="text-[#0284c7] font-semibold truncate">{pkg.title}</span>
        </div>
      </div>

      <div className="container-custom pt-8">
        {/* Top Header Information */}
        <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs font-bold text-[#0ea5e9] bg-[#e0f2fe] px-3 py-1 rounded-full uppercase tracking-wider">
                {departure.seasonTag || "Fixed Holiday Departure"}
              </span>
              <span className="bg-[#0ea5e9] text-white text-xs font-bold px-3 py-1 rounded-full shadow-xs flex items-center gap-1.5">
                <ShieldCheck size={13} /> Guaranteed Fixed Departure
              </span>
              {departure.availableSeats <= 4 && (
                <span className="bg-[#f97316] text-white text-xs font-extrabold px-3 py-1 rounded-full shadow-xs animate-pulse">
                  🔥 Only {departure.availableSeats} Seats Left
                </span>
              )}
              <span className="flex items-center gap-1 text-xs text-amber-500 font-bold bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                <Star size={12} className="fill-amber-400" />
                {pkg.rating} ({pkg.reviewsCount} reviews)
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0a1628] leading-tight">
              {pkg.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs md:text-sm text-[#64748b] mt-2">
              <span className="flex items-center gap-1.5 font-medium">
                <MapPin size={14} className="text-[#0ea5e9]" />
                {pkg.destination}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#cbd5e1]" />
              <span className="flex items-center gap-1.5 font-medium">
                <Clock size={14} className="text-[#0ea5e9]" />
                {pkg.duration}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#cbd5e1]" />
              <span className="flex items-center gap-1.5 font-bold text-[#0ea5e9]">
                <Calendar size={14} className="text-[#0ea5e9]" />
                Fixed: {formatDateString(departure.startDate)} – {formatDateString(departure.endDate)}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-start md:items-end gap-2">
            <div>
              <span className="text-xs text-[#94a3b8] uppercase font-semibold block text-left md:text-right">
                All-Inclusive Fixed Fare
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-[#0a1628]">
                  NPR {pkg.price.toLocaleString("en-US")}
                </span>
                <span className="text-sm text-[#94a3b8] line-through">
                  NPR {pkg.originalPrice.toLocaleString("en-US")}
                </span>
              </div>
              <span className="text-xs text-[#64748b] block text-left md:text-right">
                per person (flights &amp; taxes included)
              </span>
            </div>
            <div className="mt-1">
              <PackagePdfButton pkg={pkg} />
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Quick-Jump Sub-Navigation Bar */}
      <PackageSubNav pkg={pkg} />

      <div className="container-custom">
        {/* Main Content Layout with Sticky Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          {/* Left Column: All Detail Modules (2 Cols) */}
          <div className="lg:col-span-2 space-y-12 text-left">
            
            {/* 1. Package Introduction & Overview Section */}
            <section id="overview" className="bg-white rounded-3xl p-6 md:p-8 border border-[#e2e8f0] shadow-sm scroll-mt-36">
              <h2 className="text-2xl font-extrabold text-[#0a1628] mb-4 flex items-center gap-2">
                <FileText className="text-[#0ea5e9]" size={24} />
                Package Introduction &amp; Overview
              </h2>
              <p className="text-sm md:text-base text-[#475569] leading-relaxed mb-6">
                {pkg.overview}
              </p>

              <h3 className="font-bold text-[#0a1628] text-sm uppercase tracking-wider mb-3">
                Key Trip Highlights
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {pkg.highlights.map((item: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs md:text-sm text-[#334155] bg-[#f8fafc] p-3 rounded-2xl border border-[#e2e8f0]">
                    <ShieldCheck size={16} className="text-[#0ea5e9] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* 2. Photo Gallery Section with Lightbox */}
            <div id="gallery" className="scroll-mt-36">
              <PackageGallerySection gallery={pkg.gallery} packageTitle={pkg.title} />
            </div>

            {/* Tour Guide Video Section */}
            {pkg.videoEmbedUrl && (
              <section id="tour-video" className="bg-[#0a1628] rounded-3xl p-6 md:p-8 border border-white/10 text-white shadow-xl relative overflow-hidden scroll-mt-36">
                <div className="absolute top-0 right-0 w-80 h-80 bg-[#0ea5e9]/10 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
                  <div>
                    <div className="inline-flex items-center gap-2 bg-[#0ea5e9]/20 border border-[#0ea5e9]/40 text-[#38bdf8] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
                      <Video size={14} className="text-[#f97316]" />
                      Official Tour Guide Video
                    </div>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                      {pkg.videoTitle || "Tour Experience & Visual Highlights"}
                    </h2>
                    <p className="text-xs text-white/70 mt-1">
                      Official travel experience walkthrough prepared by Skywalk Holidays.
                    </p>
                  </div>
                  {pkg.videoShortUrl && (
                    <a
                      href={pkg.videoShortUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-xl transition-colors shrink-0 shadow-md"
                    >
                      <Play size={14} className="fill-white" />
                      Watch on YouTube
                    </a>
                  )}
                </div>

                <div className={`relative w-full ${pkg.isShort ? "max-w-sm sm:max-w-md mx-auto aspect-[9/16] max-h-[640px]" : "aspect-video"} rounded-2xl overflow-hidden shadow-2xl bg-black border border-white/15`}>
                  <iframe
                    src={pkg.videoEmbedUrl}
                    title={pkg.videoTitle || pkg.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                </div>
              </section>
            )}

            {/* 3. Outline Itinerary Section */}
            <section id="outline-itinerary" className="bg-white rounded-3xl p-6 md:p-8 border border-[#e2e8f0] shadow-sm scroll-mt-36">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-extrabold text-[#0a1628] flex items-center gap-2">
                    <Calendar className="text-[#0ea5e9]" size={24} />
                    Outline Itinerary
                  </h2>
                  <p className="text-xs text-[#64748b] mt-1">
                    At-a-glance high level schedule for this guaranteed fixed departure.
                  </p>
                </div>
                <span className="text-xs font-bold text-[#0ea5e9] bg-[#e0f2fe] px-3 py-1 rounded-full">
                  {pkg.duration}
                </span>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-[#e2e8f0]">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-[#0a1628] text-white uppercase text-[11px] font-bold tracking-wider">
                      <th className="py-3 px-4 w-24">Day</th>
                      <th className="py-3 px-4">Title &amp; Destination</th>
                      <th className="py-3 px-4">Key Activity Summary</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e2e8f0] bg-white">
                    {pkg.outlineItinerary?.map((out: any, idx: number) => (
                      <tr key={idx} className="hover:bg-[#f8fafc] transition-colors">
                        <td className="py-3.5 px-4 font-extrabold text-[#0ea5e9] whitespace-nowrap">
                          {out.day}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-[#0a1628]">
                          {out.title}
                        </td>
                        <td className="py-3.5 px-4 text-[#475569]">
                          {out.activity}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* 4. Detailed Day-by-Day Itinerary Section */}
            <section id="detailed-itinerary" className="bg-white rounded-3xl p-6 md:p-8 border border-[#e2e8f0] shadow-sm scroll-mt-36">
              <h2 className="text-2xl font-extrabold text-[#0a1628] mb-6 flex items-center gap-2">
                <Clock className="text-[#0ea5e9]" size={24} />
                Detailed Day-by-Day Itinerary
              </h2>

              <div className="relative border-l-2 border-[#0ea5e9]/30 pl-6 sm:pl-8 space-y-8 ml-3">
                {pkg.itinerary?.map((dayItem: any, idx: number) => (
                  <div key={idx} className="relative">
                    {/* Circle Node */}
                    <div className="absolute -left-[31px] sm:-left-[39px] top-0 w-8 h-8 rounded-full bg-[#0a1628] text-white font-extrabold text-xs flex items-center justify-center border-4 border-white shadow-md">
                      {idx + 1}
                    </div>

                    <div className="bg-[#f8fafc] rounded-2xl p-5 sm:p-6 border border-[#e2e8f0] space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-block text-xs font-extrabold text-[#0ea5e9] bg-[#e0f2fe] px-3 py-1 rounded-full">
                          {dayItem.day}
                        </span>
                        {dayItem.highlight && (
                          <span className="text-[11px] font-semibold text-[#0284c7] bg-white border border-[#e0f2fe] px-2.5 py-1 rounded-full shadow-xs">
                            ✨ {dayItem.highlight}
                          </span>
                        )}
                      </div>

                      <h3 className="text-lg font-bold text-[#0a1628]">{dayItem.title}</h3>

                      <p className="text-xs sm:text-sm text-[#475569] leading-relaxed whitespace-pre-line">
                        {dayItem.desc || dayItem.description}
                      </p>

                      {(dayItem.meals || dayItem.stay) && (
                        <div className="pt-3 border-t border-[#e2e8f0] flex flex-wrap items-center gap-4 text-xs text-[#64748b]">
                          {dayItem.meals && (
                            <span className="flex items-center gap-1.5 font-medium">
                              <span className="text-amber-500">🍽️</span>
                              <strong className="text-[#0a1628]">Meals:</strong> {dayItem.meals}
                            </span>
                          )}
                          {dayItem.stay && (
                            <span className="flex items-center gap-1.5 font-medium">
                              <span className="text-sky-500">🏨</span>
                              <strong className="text-[#0a1628]">Stay:</strong> {dayItem.stay}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Inclusions Card */}
            <div id="inclusions-section" className="scroll-mt-36" />
            <section id="inclusions" className="bg-white rounded-3xl p-6 md:p-8 border border-[#e2e8f0] shadow-sm scroll-mt-36">
              <h2 className="text-2xl font-extrabold text-[#0a1628] mb-6 flex items-center gap-2">
                <CheckCircle2 className="text-emerald-500" size={24} />
                What&apos;s Included In This Package
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {pkg.inclusions.map((item: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#334155] bg-emerald-50/60 border border-emerald-200/70 p-3.5 rounded-2xl">
                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* 5. Excluding Cost / Exclusions Section */}
            <section id="excluding-cost" className="bg-white rounded-3xl p-6 md:p-8 border border-[#e2e8f0] shadow-sm scroll-mt-36">
              <h2 className="text-2xl font-extrabold text-[#0a1628] mb-4 flex items-center gap-2">
                <XCircle className="text-rose-500" size={24} />
                Excluding Cost (What&apos;s Not Included)
              </h2>
              <p className="text-xs text-[#64748b] mb-6">
                The following costs are excluded from the base departure fare and remain the traveler&apos;s responsibility:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {pkg.exclusions.map((item: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#475569] bg-rose-50/60 border border-rose-200/70 p-3.5 rounded-2xl">
                    <XCircle size={16} className="text-rose-500 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Visa Requirements Section */}
            <section id="visa-requirements" className="bg-white rounded-3xl p-6 md:p-8 border border-[#e2e8f0] shadow-sm scroll-mt-36">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-[#e2e8f0]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-sky-50 text-[#0ea5e9] flex items-center justify-center font-bold">
                    <FileCheck2 size={22} />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-[#0a1628]">
                      Visa Requirements &amp; Mandatory Documents
                    </h2>
                    <p className="text-xs text-[#64748b] mt-0.5">
                      Clearance guidelines &amp; document preparation managed by Skywalk Holidays.
                    </p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 rounded-full shrink-0">
                  <CheckCircle2 size={14} className="text-emerald-600" />
                  Visa Guidance Included
                </span>
              </div>

              {/* 4 Core Visa Cards */}
              <div className="mb-6">
                <h3 className="text-xs font-extrabold text-[#0ea5e9] uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span>📌 Mandatory Visa &amp; Entry Requirements</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="flex items-start gap-3 bg-gradient-to-br from-sky-50/70 to-white border border-sky-100 p-4 rounded-2xl shadow-xs">
                    <span className="text-2xl shrink-0 mt-0.5">📑</span>
                    <div>
                      <h4 className="text-xs font-bold text-[#0a1628] uppercase tracking-wider mb-1">Clear Passport Scan</h4>
                      <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                        Clear passport scan (if old passport, front &amp; back scan is required). Must be valid for minimum 6 months from travel return date.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-gradient-to-br from-sky-50/70 to-white border border-sky-100 p-4 rounded-2xl shadow-xs">
                    <span className="text-2xl shrink-0 mt-0.5">🪪</span>
                    <div>
                      <h4 className="text-xs font-bold text-[#0a1628] uppercase tracking-wider mb-1">Citizenship Scan</h4>
                      <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                        Clear scan of Nepali Citizenship certificate (both sides). In case of a minor, an official government Birth Certificate is required.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-gradient-to-br from-sky-50/70 to-white border border-sky-100 p-4 rounded-2xl shadow-xs">
                    <span className="text-2xl shrink-0 mt-0.5">💰</span>
                    <div>
                      <h4 className="text-xs font-bold text-[#0a1628] uppercase tracking-wider mb-1">
                        Bank Statement (3–4 Months)
                      </h4>
                      <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                        3 to 4 months bank statement with minimum closing balance of NPR 100,000 to 120,000 per person with official bank stamp. If showing one account for a family, provide relationship certificate.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-gradient-to-br from-sky-50/70 to-white border border-sky-100 p-4 rounded-2xl shadow-xs">
                    <span className="text-2xl shrink-0 mt-0.5">📸</span>
                    <div>
                      <h4 className="text-xs font-bold text-[#0a1628] uppercase tracking-wider mb-1">Studio Passport Photo</h4>
                      <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                        Soft copy of passport size photo clicked in studio with plain white background, 35mm x 45mm (neutral face, teeth not visible).
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step-by-Step Documents Checklist */}
              <div className="bg-[#f8fafc] rounded-2xl p-5 sm:p-6 border border-[#e2e8f0] mb-6 space-y-3">
                <h3 className="text-xs font-extrabold text-[#0a1628] uppercase tracking-wider flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-500" />
                  <span>Documents Required for Visa File Submission</span>
                </h3>
                <div className="space-y-2.5 text-xs sm:text-sm">
                  <div className="flex items-start gap-3 bg-white p-3.5 rounded-xl border border-[#e2e8f0]">
                    <span className="w-6 h-6 rounded-full bg-[#0a1628] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      1
                    </span>
                    <div>
                      <strong className="text-[#0a1628]">Original Passport:</strong> Minimum 6 months validity with at least 2 blank pages.
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-white p-3.5 rounded-xl border border-[#e2e8f0]">
                    <span className="w-6 h-6 rounded-full bg-[#0a1628] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      2
                    </span>
                    <div>
                      <strong className="text-[#0a1628]">Air Ticket &amp; Vouchers:</strong> Confirmed round-trip flight ticket and hotel vouchers (provided by Skywalk Holidays).
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-white p-3.5 rounded-xl border border-[#e2e8f0]">
                    <span className="w-6 h-6 rounded-full bg-[#0a1628] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      3
                    </span>
                    <div>
                      <strong className="text-[#0a1628]">Citizenship &amp; Photos:</strong> Color citizenship copy and studio-clicked soft-copy photographs.
                    </div>
                  </div>
                </div>
              </div>

              {/* Embassy & Immigration Terms Alert */}
              <div className="bg-[#fff7ed] border border-[#fed7aa] rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-xs font-extrabold text-[#c2410c] uppercase tracking-wider">
                  <AlertCircle size={16} />
                  <span>Important Terms &amp; Immigration Notes</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#7c2d12] leading-relaxed">
                  <div className="flex items-start gap-2 bg-white/70 p-3 rounded-xl border border-[#ffedd5]">
                    <span className="text-[#f97316] font-bold">1.</span>
                    <span><strong>Embassy Authority:</strong> Visa approval is under the sole discretion of the respective embassy or immigration authority. Skywalk Holidays assists with full file compilation.</span>
                  </div>
                  <div className="flex items-start gap-2 bg-white/70 p-3 rounded-xl border border-[#ffedd5]">
                    <span className="text-[#f97316] font-bold">2.</span>
                    <span><strong>Travel Documents:</strong> Travelers must carry original passports, confirmed tickets, hotel vouchers, and required foreign currency endorsements.</span>
                  </div>
                </div>
              </div>
            </section>

            {/* 6. Packing List & Travel Essentials Section */}
            <div id="equipment" className="scroll-mt-36" />
            <section id="packing-list" className="bg-white rounded-3xl p-6 md:p-8 border border-[#e2e8f0] shadow-sm scroll-mt-36">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-[#e2e8f0]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                    <Briefcase size={22} />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-[#0a1628]">
                      Packing List &amp; Travel Essentials
                    </h2>
                    <p className="text-xs text-[#64748b] mt-0.5">
                      Curated recommendations for clothing, destination activities, and travel gear.
                    </p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-[#0ea5e9] bg-[#e0f2fe] px-3.5 py-1.5 rounded-full shrink-0">
                  Ready-to-Pack Guide
                </span>
              </div>

              <div className="space-y-6">
                {pkg.equipment?.map((eqCat: any, idx: number) => (
                  <div key={idx} className="bg-[#f8fafc] rounded-2xl p-5 sm:p-6 border border-[#e2e8f0]">
                    <h3 className="text-sm font-extrabold text-[#0a1628] uppercase tracking-wider mb-3.5 flex items-center gap-2">
                      <Luggage size={16} className="text-[#0ea5e9]" />
                      {eqCat.category}
                    </h3>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs sm:text-sm text-[#334155]">
                      {eqCat.items.map((itemStr: string, iIdx: number) => (
                        <li key={iIdx} className="flex items-start gap-2.5 bg-white p-3 rounded-xl border border-[#e2e8f0] shadow-xs">
                          <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{itemStr}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            {/* 7. Hotel & Accommodation Details Section */}
            <section id="hotel-info" className="bg-white rounded-3xl p-6 md:p-8 border border-[#e2e8f0] shadow-sm scroll-mt-36">
              <h2 className="text-2xl font-extrabold text-[#0a1628] mb-6 flex items-center gap-2">
                <Hotel className="text-[#0ea5e9]" size={24} />
                Hotel &amp; Accommodation Details
              </h2>

              {/* Multi-Hotel Accommodation Breakdown Table */}
              {pkg.hotelAccommodation && pkg.hotelAccommodation.length > 0 && (
                <div className="mb-6 overflow-hidden rounded-2xl border border-[#e2e8f0] shadow-xs">
                  <div className="bg-gradient-to-r from-[#0a1628] to-[#1e293b] text-white p-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                      <span>🏨</span>
                      Official 4-Star Hotel &amp; Cruise Accommodations
                    </h3>
                    <p className="text-[11px] text-slate-300 mt-0.5">
                      Hotels are confirmed 4-star category or luxury cruise private cabins with daily buffet breakfast.
                    </p>
                  </div>
                  <div className="overflow-x-auto bg-white">
                    <table className="w-full text-left text-xs sm:text-sm">
                      <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                        <tr>
                          <th className="py-3 px-4">Destination</th>
                          <th className="py-3 px-4">Hotel / Cruise</th>
                          <th className="py-3 px-4">Room Type</th>
                          <th className="py-3 px-4">Category</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {pkg.hotelAccommodation.map((h: any, hIdx: number) => (
                          <tr key={hIdx} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-3.5 px-4 font-bold text-[#0a1628]">{h.destination}</td>
                            <td className="py-3.5 px-4 font-semibold text-[#0ea5e9]">{h.hotel}</td>
                            <td className="py-3.5 px-4 text-[#334155]">{h.roomType}</td>
                            <td className="py-3.5 px-4">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                {h.category}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <div className="bg-[#f8fafc] rounded-2xl p-6 border border-[#e2e8f0]">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4 pb-4 border-b border-[#e2e8f0]">
                  <div>
                    <h3 className="text-lg font-bold text-[#0a1628]">{pkg.hotelInfo.name}</h3>
                    <p className="text-xs text-[#0ea5e9] font-semibold mt-0.5">{pkg.hotelInfo.rating}</p>
                  </div>
                  <span className="text-xs bg-[#0a1628] text-white px-3 py-1 rounded-full font-bold">
                    {pkg.hotelInfo.roomType}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs md:text-sm mb-5 text-[#475569]">
                  <div>
                    <strong className="text-[#0a1628]">Standard Check-in:</strong> {pkg.hotelInfo.checkIn}
                  </div>
                  <div>
                    <strong className="text-[#0a1628]">Standard Check-out:</strong> {pkg.hotelInfo.checkOut}
                  </div>
                </div>

                <h4 className="text-xs font-bold text-[#0a1628] uppercase tracking-wider mb-2">
                  Hotel Amenities:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {pkg.hotelInfo.amenities?.map((a: string) => (
                    <span key={a} className="text-xs bg-white text-[#334155] border border-[#e2e8f0] px-3 py-1 rounded-full font-medium">
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            </section>

            {/* 8. Cancellation Policy & Official Booking Terms */}
            {pkg.cancellationPolicySchedule && (
              <section id="cancellation-policy" className="bg-white rounded-3xl p-6 md:p-8 border border-[#e2e8f0] shadow-sm scroll-mt-36 space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-[#e2e8f0]">
                  <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                    <ShieldCheck size={22} />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-[#0a1628]">
                      Cancellation &amp; Amendment Policy
                    </h2>
                    <p className="text-xs text-[#64748b] mt-0.5">
                      Transparent booking terms for fixed group departures.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Category A: Land & Hotel */}
                  <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl p-5 shadow-xs">
                    <h3 className="text-xs font-bold text-[#0a1628] uppercase tracking-wider mb-1 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                      A. Group Tour &amp; Hotel Package
                    </h3>
                    <p className="text-[11px] text-[#64748b] mb-3">Cancellation fee structure:</p>
                    <div className="space-y-2 text-xs">
                      {pkg.cancellationPolicySchedule.landAndHotel?.map((item: any, idx: number) => (
                        <div key={idx} className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-slate-200">
                          <span className="text-slate-700 font-medium">{item.period}</span>
                          <span className="font-bold text-rose-600 shrink-0 ml-2">{item.charge}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Category B: Land-Only */}
                  <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl p-5 shadow-xs">
                    <h3 className="text-xs font-bold text-[#0a1628] uppercase tracking-wider mb-1 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                      B. Land-Only Option
                    </h3>
                    <p className="text-[11px] text-[#64748b] mb-3">Cancellation fee structure:</p>
                    <div className="space-y-2 text-xs">
                      {pkg.cancellationPolicySchedule.landOnly?.map((item: any, idx: number) => (
                        <div key={idx} className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-slate-200">
                          <span className="text-slate-700 font-medium">{item.period}</span>
                          <span className="font-bold text-amber-600 shrink-0 ml-2">{item.charge}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Terms and Force Majeure Rules */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-xs text-slate-700 space-y-2">
                  <h4 className="font-bold text-[#0a1628] uppercase tracking-wider text-[11px]">
                    Terms, Amendments &amp; Flight Rules
                  </h4>
                  <ul className="space-y-1.5 list-disc list-inside text-[#475569] leading-relaxed">
                    {pkg.cancellationPolicySchedule.rules?.map((r: string, rIdx: number) => (
                      <li key={rIdx}>{r}</li>
                    ))}
                  </ul>
                </div>
              </section>
            )}

            {/* 9. FAQs Section */}
            <section id="faq" className="bg-white rounded-3xl p-6 md:p-8 border border-[#e2e8f0] shadow-sm scroll-mt-36">
              <h2 className="text-2xl font-extrabold text-[#0a1628] mb-6 flex items-center gap-2">
                <HelpCircle className="text-[#0ea5e9]" size={24} />
                Frequently Asked Questions
              </h2>

              <div className="space-y-4">
                {pkg.faqs?.map((faq: any, idx: number) => (
                  <div key={idx} className="p-5 bg-[#f8fafc] rounded-2xl border border-[#e2e8f0]">
                    <h3 className="font-bold text-[#0a1628] text-sm md:text-base mb-2">
                      Q: {faq.q}
                    </h3>
                    <p className="text-xs md:text-sm text-[#64748b] leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                ))}
              </div>
            </section>

          </div>

          {/* Right Column: Sticky Pinned Sidebar (1 Col) */}
          <div className="lg:col-span-1 sticky top-36 self-start z-20">
            <DepartureSidebar departure={departure} />
          </div>

        </div>
      </div>

      {/* Other Upcoming Fixed Departures Section */}
      {otherDepartures.length > 0 && (
        <section className="bg-white py-14 border-t border-[#e2e8f0] mt-16">
          <div className="container-custom">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <span className="text-xs font-bold text-[#0ea5e9] bg-[#e0f2fe] px-3 py-1 rounded-full uppercase tracking-wider">
                  More Festival Dates
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0a1628] mt-2">
                  Other Upcoming Holiday Departures
                </h2>
              </div>
              <Link
                href="/services/packages/international"
                className="text-xs font-bold text-[#0ea5e9] hover:text-[#0284c7] flex items-center gap-1 transition-colors"
              >
                <span>View All Tour Packages</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {otherDepartures.slice(0, 3).map((dep) => (
                <Link
                  key={dep.id}
                  href={`/departures/${dep.id}`}
                  className="bg-white rounded-3xl overflow-hidden border border-[#e2e8f0] hover:border-[#0ea5e9]/60 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group hover:-translate-y-1.5"
                >
                  <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                    <Image
                      src={dep.image}
                      alt={dep.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-md text-[#0a1628] text-[11px] font-extrabold px-3 py-1 rounded-full border border-slate-200 shadow-sm">
                      {dep.seasonTag}
                    </span>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center gap-1 text-xs text-[#64748b] mb-1">
                        <MapPin size={12} className="text-[#0ea5e9]" />
                        <span>{dep.destination}</span>
                      </div>
                      <h3 className="font-bold text-[#0a1628] text-sm sm:text-base group-hover:text-[#0ea5e9] transition-colors line-clamp-2">
                        {dep.title}
                      </h3>
                    </div>

                    <div className="pt-3 border-t border-[#e2e8f0] flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-[#94a3b8] uppercase font-semibold block">Fixed Price</span>
                        <span className="text-base font-extrabold text-[#0a1628]">
                          NPR {dep.price.toLocaleString("en-US")}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-[#0ea5e9] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Details <ArrowRight size={13} />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
