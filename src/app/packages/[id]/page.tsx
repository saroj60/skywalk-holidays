import React from "react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  Hotel,
  Car,
  FileText,
  HelpCircle,
  Star,
  ShieldCheck,
  ChevronRight,
  Calendar,
  Briefcase,
  Luggage,
  Shirt,
  FileCheck2,
  AlertCircle,
  Package,
  Play,
  Video,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import PackageInquirySidebar from "@/components/packages/PackageInquirySidebar";
import PackageGallerySection from "@/components/packages/PackageGallerySection";
import PackageSubNav from "@/components/packages/PackageSubNav";
import PackagePdfButton from "@/components/packages/PackagePdfButton";

import { PACKAGES_DICTIONARY } from "@/lib/packagesData";
export { PACKAGES_DICTIONARY };
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  let pkg = PACKAGES_DICTIONARY[id];
  if (!pkg && (id === "1" || id === "bangkok-pattaya")) {
    pkg = PACKAGES_DICTIONARY["bangkok-pattaya-6d"];
  }
  if (!pkg && (id === "2" || id === "bali-malaysia")) {
    pkg = PACKAGES_DICTIONARY["bali-malaysia-7d"];
  }
  if (!pkg && (id === "3" || id === "bangkok-pattaya-8d" || id === "thailand-8d")) {
    pkg = PACKAGES_DICTIONARY["bangkok-pattaya-8d"];
  }
  if (!pkg && (id === "4" || id === "bangkok-pattaya-phuket-8d" || id === "thailand-phuket-8d" || id === "phuket-8d")) {
    pkg = PACKAGES_DICTIONARY["bangkok-pattaya-phuket-8d"];
  }
  if (!pkg && (id === "5" || id === "bangkok-pattaya-5d" || id === "thailand-5d")) {
    pkg = PACKAGES_DICTIONARY["bangkok-pattaya-5d"];
  }
  if (!pkg && (id === "6" || id === "krabi-phuket-bangkok-8d" || id === "krabi-8d" || id === "thailand-krabi-8d")) {
    pkg = PACKAGES_DICTIONARY["krabi-phuket-bangkok-8d"];
  }
  if (!pkg && (id === "7" || id === "malaysia-singapore-6d" || id === "singapore-malaysia-6d" || id === "malaysia-singapore" || id === "singapore-malaysia")) {
    pkg = PACKAGES_DICTIONARY["malaysia-singapore-6d"];
  }
  if (!pkg && (id === "8" || id === "maldives-4d" || id === "maldives-3n4d" || id === "maldives")) {
    pkg = PACKAGES_DICTIONARY["maldives-4d"];
  }
  if (!pkg && (id === "9" || id === "philippines-6d" || id === "philippines-5n6d" || id === "philippines")) {
    pkg = PACKAGES_DICTIONARY["philippines-6d"];
  }
  if (!pkg && (id === "10" || id === "philippines-8d" || id === "philippines-7n8d")) {
    pkg = PACKAGES_DICTIONARY["philippines-8d"];
  }
  if (!pkg && (id === "11" || id === "phuket-bangkok-6d" || id === "bangkok-phuket-6d" || id === "phuket-bangkok")) {
    pkg = PACKAGES_DICTIONARY["phuket-bangkok-6d"];
  }
  if (!pkg && (id === "12" || id === "singapore-4d" || id === "singapore-3n4d" || id === "singapore")) {
    pkg = PACKAGES_DICTIONARY["singapore-4d"];
  }
  if (!pkg && (id === "13" || id === "sri-lanka-thailand-7d" || id === "sri-lanka-thailand" || id === "thailand-sri-lanka-7d" || id === "thailand-sri-lanka")) {
    pkg = PACKAGES_DICTIONARY["sri-lanka-thailand-7d"];
  }
  if (!pkg && (id === "14" || id === "thailand-vietnam-8d" || id === "thailand-vietnam" || id === "vietnam-thailand-8d" || id === "vietnam-thailand" || id === "hanoi-8d")) {
    pkg = PACKAGES_DICTIONARY["thailand-vietnam-8d"];
  }
  if (!pkg && (id === "15" || id === "thailand-malaysia-singapore-9d" || id === "thailand-singapore-malaysia-9d" || id === "thailand-malaysia-singapore" || id === "thailand-singapore-malaysia" || id === "singapore-malaysia-thailand-9d")) {
    pkg = PACKAGES_DICTIONARY["thailand-malaysia-singapore-9d"];
  }
  if (!pkg && (id === "16" || id === "vietnam-6d" || id === "vietnam-5n6d" || id === "vietnam-hanoi-halong-danang-6d" || id === "vietnam" || id === "hanoi-halong-danang-6d" || id === "danang-6d")) {
    pkg = PACKAGES_DICTIONARY["vietnam-6d"];
  }
  if (!pkg && (id === "17" || id === "vietnam-8d" || id === "vietnam-7n8d" || id === "vietnam-premium-8d" || id === "vietnam-danang-8d" || id === "hanoi-halong-danang-8d" || id === "danang-8d")) {
    pkg = PACKAGES_DICTIONARY["vietnam-8d"];
  }

  return {
    title: pkg ? `${pkg.title} (${pkg.duration}) | Skywalks Holidays` : "Holiday Package | Skywalks Holidays",
    description: pkg ? pkg.overview : "Curated holiday packages by Skywalks Holidays.",
  };
}

export default async function PackageDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let pkg = PACKAGES_DICTIONARY[id];
  if (!pkg && (id === "1" || id === "bangkok-pattaya")) {
    pkg = PACKAGES_DICTIONARY["bangkok-pattaya-6d"];
  }
  if (!pkg && (id === "2" || id === "bali-malaysia")) {
    pkg = PACKAGES_DICTIONARY["bali-malaysia-7d"];
  }
  if (!pkg && (id === "3" || id === "bangkok-pattaya-8d" || id === "thailand-8d")) {
    pkg = PACKAGES_DICTIONARY["bangkok-pattaya-8d"];
  }
  if (!pkg && (id === "4" || id === "bangkok-pattaya-phuket-8d" || id === "thailand-phuket-8d" || id === "phuket-8d")) {
    pkg = PACKAGES_DICTIONARY["bangkok-pattaya-phuket-8d"];
  }
  if (!pkg && (id === "5" || id === "bangkok-pattaya-5d" || id === "thailand-5d")) {
    pkg = PACKAGES_DICTIONARY["bangkok-pattaya-5d"];
  }
  if (!pkg && (id === "6" || id === "krabi-phuket-bangkok-8d" || id === "krabi-8d" || id === "thailand-krabi-8d")) {
    pkg = PACKAGES_DICTIONARY["krabi-phuket-bangkok-8d"];
  }
  if (!pkg && (id === "7" || id === "malaysia-singapore-6d" || id === "singapore-malaysia-6d" || id === "malaysia-singapore" || id === "singapore-malaysia")) {
    pkg = PACKAGES_DICTIONARY["malaysia-singapore-6d"];
  }
  if (!pkg && (id === "8" || id === "maldives-4d" || id === "maldives-3n4d" || id === "maldives")) {
    pkg = PACKAGES_DICTIONARY["maldives-4d"];
  }
  if (!pkg && (id === "9" || id === "philippines-6d" || id === "philippines-5n6d" || id === "philippines")) {
    pkg = PACKAGES_DICTIONARY["philippines-6d"];
  }
  if (!pkg && (id === "10" || id === "philippines-8d" || id === "philippines-7n8d")) {
    pkg = PACKAGES_DICTIONARY["philippines-8d"];
  }
  if (!pkg && (id === "11" || id === "phuket-bangkok-6d" || id === "bangkok-phuket-6d" || id === "phuket-bangkok")) {
    pkg = PACKAGES_DICTIONARY["phuket-bangkok-6d"];
  }
  if (!pkg && (id === "12" || id === "singapore-4d" || id === "singapore-3n4d" || id === "singapore")) {
    pkg = PACKAGES_DICTIONARY["singapore-4d"];
  }
  if (!pkg && (id === "13" || id === "sri-lanka-thailand-7d" || id === "sri-lanka-thailand" || id === "thailand-sri-lanka-7d" || id === "thailand-sri-lanka")) {
    pkg = PACKAGES_DICTIONARY["sri-lanka-thailand-7d"];
  }
  if (!pkg && (id === "14" || id === "thailand-vietnam-8d" || id === "thailand-vietnam" || id === "vietnam-thailand-8d" || id === "vietnam-thailand" || id === "hanoi-8d")) {
    pkg = PACKAGES_DICTIONARY["thailand-vietnam-8d"];
  }
  if (!pkg && (id === "15" || id === "thailand-malaysia-singapore-9d" || id === "thailand-singapore-malaysia-9d" || id === "thailand-malaysia-singapore" || id === "thailand-singapore-malaysia" || id === "singapore-malaysia-thailand-9d")) {
    pkg = PACKAGES_DICTIONARY["thailand-malaysia-singapore-9d"];
  }

  if (!pkg) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center container-custom py-20">
        <div className="bg-white rounded-3xl p-10 sm:p-14 text-center border border-[#e2e8f0] shadow-sm space-y-4 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-full bg-sky-50 text-[#0ea5e9] flex items-center justify-center mx-auto text-2xl font-bold">
            ✈️
          </div>
          <h1 className="text-2xl font-bold text-[#0a1628]">Package Not Found</h1>
          <p className="text-sm text-[#64748b] leading-relaxed">
            This package is no longer available or is currently being updated with new seasonal itineraries.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild className="bg-[#0a1628] hover:bg-[#163058] text-white">
              <Link href="/services/packages/international">Browse All Packages</Link>
            </Button>
            <Button variant="outline" asChild className="border-emerald-600 text-emerald-600 hover:bg-emerald-50">
              <a href="https://wa.me/9779714491103" target="_blank" rel="noopener noreferrer">
                Inquire on WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </div>
    );
  }

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
            Holiday Packages
          </Link>
          <ChevronRight size={12} />
          <span className="text-[#0a1628] font-semibold truncate">{pkg.title}</span>
        </div>
      </div>

      <div className="container-custom pt-8">
        {/* Top Header Information */}
        <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs font-bold text-[#0ea5e9] bg-[#e0f2fe] px-3 py-1 rounded-full uppercase tracking-wider">
                International Package
              </span>
              <span className="flex items-center gap-1 text-xs text-amber-500 font-bold bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                <Star size={12} className="fill-amber-400" />
                {pkg.rating} ({pkg.reviewsCount} reviews)
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0a1628] leading-tight">
              {pkg.title.includes(" - ") ? (
                <>
                  <span className="block text-3xl sm:text-4xl font-extrabold">{pkg.title.split(" - ")[0]}</span>
                  <span className="block text-xl sm:text-2xl text-[#0ea5e9] font-bold mt-1">{pkg.title.split(" - ")[1]}</span>
                </>
              ) : (
                pkg.title
              )}
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
            </div>
          </div>

          <div className="flex flex-col items-start md:items-end gap-2">
            <div>
              <span className="text-xs text-[#94a3b8] uppercase font-semibold block text-left md:text-right">Starting From</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-[#0a1628]">
                  NPR {pkg.price.toLocaleString("en-US")}
                </span>
                <span className="text-sm text-[#94a3b8] line-through">
                  NPR {pkg.originalPrice.toLocaleString("en-US")}
                </span>
              </div>
              <span className="text-xs text-[#64748b] block text-left md:text-right">per person (all taxes included)</span>
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
          {/* Left Column: All Detail Modules */}
          <div className="lg:col-span-2 space-y-12 text-left">
            
            {/* 1. Package Introduction & Overview Section */}
            <section id="overview" className="bg-white rounded-3xl p-6 md:p-8 border border-[#e2e8f0] shadow-sm">
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

            {/* 2. Photo Gallery Section */}
            <section id="gallery">
              <PackageGallerySection gallery={pkg.gallery} packageTitle={pkg.title} />
            </section>

            {/* Tour Guide Video Section */}
            {pkg.videoEmbedUrl && (
              <section id="tour-video" className="bg-[#0a1628] rounded-3xl p-6 md:p-8 border border-white/10 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-[#0ea5e9]/10 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
                  <div>
                    <div className="inline-flex items-center gap-2 bg-[#0ea5e9]/20 border border-[#0ea5e9]/40 text-[#38bdf8] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
                      <Video size={14} className="text-[#f97316]" />
                      Official Tour Guide Video
                    </div>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                      {pkg.videoTitle || "Tour Guide Video & Visual Highlights"}
                    </h2>
                    <p className="text-xs text-white/70 mt-1">
                      Official travel experience walkthrough prepared by SkyWalk Tours &amp; Travels.
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
            <section id="outline-itinerary" className="bg-white rounded-3xl p-6 md:p-8 border border-[#e2e8f0] shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-extrabold text-[#0a1628] flex items-center gap-2">
                    <Calendar className="text-[#0ea5e9]" size={24} />
                    Outline Itinerary
                  </h2>
                  <p className="text-xs text-[#64748b] mt-1">
                    At-a-glance high level summary of your travel program.
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
            <section id="detailed-itinerary" className="bg-white rounded-3xl p-6 md:p-8 border border-[#e2e8f0] shadow-sm">
              <h2 className="text-2xl font-extrabold text-[#0a1628] mb-6 flex items-center gap-2">
                <Clock className="text-[#0ea5e9]" size={24} />
                Detailed Day-by-Day Itinerary
              </h2>

              <div className="relative border-l-2 border-[#0ea5e9]/30 pl-6 sm:pl-8 space-y-8 ml-3">
                {pkg.itinerary.map((dayItem: any, idx: number) => (
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
            <div id="inclusions-section" className="scroll-mt-24" />
            <section id="inclusions" className="bg-white rounded-3xl p-6 md:p-8 border border-[#e2e8f0] shadow-sm scroll-mt-24">
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
            <section id="excluding-cost" className="bg-white rounded-3xl p-6 md:p-8 border border-[#e2e8f0] shadow-sm scroll-mt-24">
              <h2 className="text-2xl font-extrabold text-[#0a1628] mb-4 flex items-center gap-2">
                <XCircle className="text-rose-500" size={24} />
                Excluding Cost (What&apos;s Not Included)
              </h2>
              <p className="text-xs text-[#64748b] mb-6">
                The following costs are excluded from the base package fare and remain the traveler&apos;s responsibility:
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
            <section id="visa-requirements" className="bg-white rounded-3xl p-6 md:p-8 border border-[#e2e8f0] shadow-sm scroll-mt-24">
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
                      Clearance guidelines &amp; document preparation managed by SkyWalk Tours and Travels Pvt. Ltd.
                    </p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 rounded-full shrink-0">
                  <CheckCircle2 size={14} className="text-emerald-600" />
                  {pkg.country === "Thailand"
                    ? "Thailand Tourist Visa Fee Included"
                    : pkg.country === "Maldives"
                    ? "Free 30-Day Visa on Arrival Included"
                    : "Visa Documentation Assistance Included"}
                </span>
              </div>

              {/* 4 Core Visa Requirements Highlights */}
              <div className="mb-6">
                <h3 className="text-xs font-extrabold text-[#0ea5e9] uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span>📌 Mandatory Visa &amp; Entry Requirements</span>
                </h3>
                {pkg.country === "Maldives" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="flex items-start gap-3 bg-gradient-to-br from-sky-50/70 to-white border border-sky-100 p-4 rounded-2xl shadow-xs">
                      <span className="text-2xl shrink-0 mt-0.5">📑</span>
                      <div>
                        <h4 className="text-xs font-bold text-[#0a1628] uppercase tracking-wider mb-1">Valid Original Passport</h4>
                        <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                          Original passport valid for minimum 6 months from entry date into the Maldives.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 bg-gradient-to-br from-sky-50/70 to-white border border-sky-100 p-4 rounded-2xl shadow-xs">
                      <span className="text-2xl shrink-0 mt-0.5">✈️</span>
                      <div>
                        <h4 className="text-xs font-bold text-[#0a1628] uppercase tracking-wider mb-1">Confirmed Return Flights</h4>
                        <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                          Confirmed round-trip flight booking to Kathmandu (provided by SkyWalk Tours and Travels).
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 bg-gradient-to-br from-sky-50/70 to-white border border-sky-100 p-4 rounded-2xl shadow-xs">
                      <span className="text-2xl shrink-0 mt-0.5">🏨</span>
                      <div>
                        <h4 className="text-xs font-bold text-[#0a1628] uppercase tracking-wider mb-1">Confirmed Hotel Voucher</h4>
                        <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                          Confirmed 3-star Hulhumalé beachfront hotel booking voucher &amp; itinerary (provided by SkyWalk Tours).
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 bg-gradient-to-br from-sky-50/70 to-white border border-sky-100 p-4 rounded-2xl shadow-xs">
                      <span className="text-2xl shrink-0 mt-0.5">📝</span>
                      <div>
                        <h4 className="text-xs font-bold text-[#0a1628] uppercase tracking-wider mb-1">Online IMUGA Declaration</h4>
                        <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                          Free Maldives Immigration Traveler Declaration (IMUGA) completed online within 96 hours before departure.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="flex items-start gap-3 bg-gradient-to-br from-sky-50/70 to-white border border-sky-100 p-4 rounded-2xl shadow-xs">
                      <span className="text-2xl shrink-0 mt-0.5">📑</span>
                      <div>
                        <h4 className="text-xs font-bold text-[#0a1628] uppercase tracking-wider mb-1">Clear Passport Scan</h4>
                        <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                          Clear passport scan (if old passport, then front &amp; back scan is required). Must be valid for minimum 6 months from travel return date.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 bg-gradient-to-br from-sky-50/70 to-white border border-sky-100 p-4 rounded-2xl shadow-xs">
                      <span className="text-2xl shrink-0 mt-0.5">🪪</span>
                      <div>
                        <h4 className="text-xs font-bold text-[#0a1628] uppercase tracking-wider mb-1">Citizenship Scan</h4>
                        <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                          Clear scan of Citizenship certificate (both sides). In case of a minor, an official government Birth Certificate is required.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 bg-gradient-to-br from-sky-50/70 to-white border border-sky-100 p-4 rounded-2xl shadow-xs">
                      <span className="text-2xl shrink-0 mt-0.5">💰</span>
                      <div>
                        <h4 className="text-xs font-bold text-[#0a1628] uppercase tracking-wider mb-1">
                          {pkg.destination?.includes("Vietnam") || pkg.country?.includes("Vietnam") ? "4 Months Bank Statement" : "3 Months Bank Statement"}
                        </h4>
                        <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                          {pkg.destination?.includes("Vietnam") || pkg.country?.includes("Vietnam")
                            ? "Four (4) months bank statement with a minimum closing balance of NPR 100,000 per person. If you prefer to show one bank account for a family/couple, you must provide a marriage or relationship certificate in English."
                            : `3 months (90 days) bank statement with minimum closing balance of ${
                                pkg.id === "malaysia-singapore-6d" || pkg.destination?.includes("Singapore") || pkg.destination?.includes("Malaysia") || pkg.country === "Philippines" || pkg.id === "philippines-6d"
                                  ? "120K (NPR 120,000)"
                                  : "100K (NPR 100,000)"
                              } per person. If you prefer to show one bank account for a family/couple, you must provide a marriage or relationship certificate in English.`}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 bg-gradient-to-br from-sky-50/70 to-white border border-sky-100 p-4 rounded-2xl shadow-xs">
                      <span className="text-2xl shrink-0 mt-0.5">📸</span>
                      <div>
                        <h4 className="text-xs font-bold text-[#0a1628] uppercase tracking-wider mb-1">Studio Passport Photo</h4>
                        <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                          Soft copy of passport size photo clicked in studio with plain white background, 35mm x 45mm (teeth must not be visible).
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Step-by-Step Documents for Visa Checklist */}
              <div className="bg-[#f8fafc] rounded-2xl p-5 sm:p-6 border border-[#e2e8f0] mb-6 space-y-3">
                <h3 className="text-xs font-extrabold text-[#0a1628] uppercase tracking-wider flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-500" />
                  <span>{pkg.country === "Maldives" ? "Documents Required for Maldives Entry" : "Documents Required for Visa Submission"}</span>
                </h3>
                {pkg.country === "Maldives" ? (
                  <div className="space-y-2.5 text-xs sm:text-sm">
                    <div className="flex items-start gap-3 bg-white p-3.5 rounded-xl border border-[#e2e8f0]">
                      <span className="w-6 h-6 rounded-full bg-[#0a1628] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                        1
                      </span>
                      <div>
                        <strong className="text-[#0a1628]">Passport:</strong> Original passport with minimum 6 months validity from arrival date.
                      </div>
                    </div>

                    <div className="flex items-start gap-3 bg-white p-3.5 rounded-xl border border-[#e2e8f0]">
                      <span className="w-6 h-6 rounded-full bg-[#0a1628] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                        2
                      </span>
                      <div>
                        <strong className="text-[#0a1628]">Air Ticket:</strong> Confirmed round-trip flight ticket Kathmandu ⇄ Malé (provided by SkyWalk).
                      </div>
                    </div>

                    <div className="flex items-start gap-3 bg-white p-3.5 rounded-xl border border-[#e2e8f0]">
                      <span className="w-6 h-6 rounded-full bg-[#0a1628] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                        3
                      </span>
                      <div>
                        <strong className="text-[#0a1628]">Hotel Booking:</strong> Confirmed 3-star Hulhumalé hotel reservation voucher (provided by SkyWalk).
                      </div>
                    </div>

                    <div className="flex items-start gap-3 bg-white p-3.5 rounded-xl border border-[#e2e8f0]">
                      <span className="w-6 h-6 rounded-full bg-[#0a1628] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                        4
                      </span>
                      <div>
                        <strong className="text-[#0a1628]">IMUGA Form &amp; Personal Funds:</strong> Online declaration submitted at imuga.immigration.gov.mv within 96 hours + personal travel funds.
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2.5 text-xs sm:text-sm">
                    <div className="flex items-start gap-3 bg-white p-3.5 rounded-xl border border-[#e2e8f0]">
                      <span className="w-6 h-6 rounded-full bg-[#0a1628] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                        1
                      </span>
                      <div>
                        <strong className="text-[#0a1628]">Passport:</strong> Information and address page (both front &amp; back pages if old passport). Minimum 6 months validity.
                      </div>
                    </div>

                    <div className="flex items-start gap-3 bg-white p-3.5 rounded-xl border border-[#e2e8f0]">
                      <span className="w-6 h-6 rounded-full bg-[#0a1628] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                        2
                      </span>
                      <div>
                        <strong className="text-[#0a1628]">Photo:</strong> Studio-clicked soft copy (plain white background, neutral face, teeth not visible).
                      </div>
                    </div>

                    <div className="flex items-start gap-3 bg-white p-3.5 rounded-xl border border-[#e2e8f0]">
                      <span className="w-6 h-6 rounded-full bg-[#0a1628] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                        3
                      </span>
                      <div>
                        <strong className="text-[#0a1628]">Citizenship:</strong> Clear color scan of both sides / In case of minor, government Birth Certificate.
                      </div>
                    </div>

                    <div className="flex items-start gap-3 bg-white p-3.5 rounded-xl border border-[#e2e8f0]">
                      <span className="w-6 h-6 rounded-full bg-[#0a1628] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                        4
                      </span>
                      <div>
                        <strong className="text-[#0a1628]">Bank Statement:</strong>{" "}
                        {pkg.destination?.includes("Vietnam") || pkg.country?.includes("Vietnam")
                          ? "4 months (120 days) bank statement with NPR 100,000 closing balance per person. If showing one account for a couple/family, provide a marriage/relationship certificate."
                          : `3 months (90 days) bank statement with ${
                              pkg.id === "malaysia-singapore-6d" || pkg.destination?.includes("Singapore") || pkg.destination?.includes("Malaysia") || pkg.country === "Philippines" || pkg.id === "philippines-6d"
                                ? "120K (NPR 120,000)"
                                : "1 Lakh (NPR 100,000)"
                            } closing balance per person. If you prefer to show one single bank account for a family/couple, you must provide a Marriage or Relationship Certificate in English.`}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Embassy & Immigration Terms Alert */}
              <div className="bg-[#fff7ed] border border-[#fed7aa] rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-xs font-extrabold text-[#c2410c] uppercase tracking-wider">
                  <AlertCircle size={16} />
                  <span>Important Terms &amp; Visa / Immigration Notes</span>
                </div>
                {pkg.country === "Maldives" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#7c2d12] leading-relaxed">
                    <div className="flex items-start gap-2 bg-white/70 p-3 rounded-xl border border-[#ffedd5]">
                      <span className="text-[#f97316] font-bold">1.</span>
                      <span><strong>Visa on Arrival:</strong> Free 30-day tourist visa on arrival for Nepali passport holders. No advance embassy application or fee needed.</span>
                    </div>
                    <div className="flex items-start gap-2 bg-white/70 p-3 rounded-xl border border-[#ffedd5]">
                      <span className="text-[#f97316] font-bold">2.</span>
                      <span><strong>Transfers:</strong> Airport meet-and-greet pickup and departure drop are private; in-destination boat and excursion transfers run on shared (SIC) basis.</span>
                    </div>
                    <div className="flex items-start gap-2 bg-white/70 p-3 rounded-xl border border-[#ffedd5]">
                      <span className="text-[#f97316] font-bold">3.</span>
                      <span><strong>Cancellation Policy:</strong> First-night hotel booking cost is non-refundable once booked. Remaining balance will be refunded. Flight tickets per airline policy.</span>
                    </div>
                    <div className="flex items-start gap-2 bg-white/70 p-3 rounded-xl border border-[#ffedd5]">
                      <span className="text-[#f97316] font-bold">4.</span>
                      <span><strong>SkyWalk Support Desk:</strong> Pepsicola, Kathmandu • ☎ 014544343, 9801237798, 9709104784 • 📧 skywalktoursandtravels32@gmail.com</span>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#7c2d12] leading-relaxed">
                    <div className="flex items-start gap-2 bg-white/70 p-3 rounded-xl border border-[#ffedd5]">
                      <span className="text-[#f97316] font-bold">1.</span>
                      <span><strong>Embassy Decision:</strong> Visa approval depends entirely on Embassy decision. Sky Walk Tours is not responsible for visa rejection. Visa fee is non-refundable after application.</span>
                    </div>
                    <div className="flex items-start gap-2 bg-white/70 p-3 rounded-xl border border-[#ffedd5]">
                      <span className="text-[#f97316] font-bold">2.</span>
                      <span><strong>Immigration Authority &amp; Forex:</strong> Immigration officer has final authority for entry or denial. The company is not responsible if entry is denied by immigration. Travelers must carry original passport, tickets, vouchers, and sufficient USD cash or passport currency endorsement stamp.</span>
                    </div>
                    <div className="flex items-start gap-2 bg-white/70 p-3 rounded-xl border border-[#ffedd5]">
                      <span className="text-[#f97316] font-bold">3.</span>
                      <span><strong>Additional Airline Terms:</strong> Airline ticket refunds are subject to airline policy. Package fares and taxes subject to seat availability.</span>
                    </div>
                    <div className="flex items-start gap-2 bg-white/70 p-3 rounded-xl border border-[#ffedd5]">
                      <span className="text-[#f97316] font-bold">4.</span>
                      <span><strong>SkyWalk Support Desk:</strong> Pepsicola, Kathmandu • ☎ 014544343, 9714491103, 9801237798, 9709104784 • 📧 skywalktoursandtravels32@gmail.com</span>
                    </div>
                    {(pkg.destination?.includes("Malaysia") || pkg.country?.includes("Malaysia")) && (
                      <div className="flex items-start gap-2 bg-white/70 p-3 rounded-xl border border-[#ffedd5] sm:col-span-2">
                        <span className="text-[#f97316] font-bold">5.</span>
                        <span><strong>Malaysia Tourism Tax:</strong> A mandatory tourism tax of MYR 10 per room per night is payable directly to hotel reception upon check-in.</span>
                      </div>
                    )}
                    {(pkg.destination?.includes("Vietnam") || pkg.country?.includes("Vietnam")) && (
                      <div className="flex items-start gap-2 bg-white/70 p-3 rounded-xl border border-[#ffedd5] sm:col-span-2">
                        <span className="text-[#f97316] font-bold">5.</span>
                        <span><strong>Package Cancellation Charges:</strong> More than 30 days before departure: 0% cancellation charge • 30–15 days: 40% charge • 14–10 days: 60% charge • Within 3 days: 100% charge. Guaranteed price packages stand at 100% cancellation fee.</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </section>

            {/* 6. Packing List & Travel Essentials Section */}
            <div id="equipment" className="scroll-mt-24" />
            <section id="packing-list" className="bg-white rounded-3xl p-6 md:p-8 border border-[#e2e8f0] shadow-sm scroll-mt-24">
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
                      Expertly curated packing recommendations for clothing, temple visits, beach days, and essential travel gear
                    </p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-[#0ea5e9] bg-[#e0f2fe] px-3.5 py-1.5 rounded-full shrink-0">
                  Ready-to-Pack Guide
                </span>
              </div>

              <div className="space-y-6">
                {(pkg.equipment && pkg.equipment.length > 0 ? pkg.equipment : [
                  {
                    category: "Tropical Beach & Island Wear",
                    items: [
                      "Comfortable cotton clothing, t-shirts, summer dresses & shorts",
                      "Swimwear, rash guard, and flip-flops for Coral Island / Phi Phi / Krabi",
                      "Light jacket or cardigan for air-conditioned flights, vans, and shopping malls",
                      "Comfortable walking sneakers for shopping at Chatuchak & Pratunam",
                    ],
                  },
                  {
                    category: "Temple Etiquette Attire (Wat Pho & Wat Traimitr)",
                    items: [
                      "Modest clothing covering shoulders and knees (strictly enforced at Thai temples)",
                      "Slip-on shoes or comfortable walking sandals (easy to take off before shrine halls)",
                      "Light scarf or wrap-around sarong",
                    ],
                  },
                  {
                    category: "Mandatory Documents & Currency Checklist",
                    items: [
                      "Original passport with 6+ months validity from date of return",
                      "Printed flight e-tickets, hotel booking voucher & itinerary (provided by SkyWalk)",
                      "$500 USD cash stamp/endorsement in passport as per Thai immigration guidelines",
                      "Thai Baht (THB) cash & international debit/credit/forex card",
                    ],
                  },
                  {
                    category: "Sun, Beach & Boat Excursion Gear",
                    items: [
                      "Sunscreen SPF 50+, polarized sunglasses, and wide-brim sun hat",
                      "Waterproof dry-bag and waterproof phone pouch for speedboat tours",
                      "Quick-dry microfiber beach towel",
                    ],
                  },
                  {
                    category: "Electronics, Health & Personal Toiletries",
                    items: [
                      "Universal travel power adapter (Thai two-pin flat/round plug, 220V)",
                      "Power bank (under 20,000 mAh allowed on cabin luggage)",
                      "Motion sickness / sea-sickness tablets for speedboats",
                      "Personal toiletries, mosquito repellent spray & travel first-aid kit",
                    ],
                  },
                ]).map((eqCat: any, idx: number) => (
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

            {/* Hotel & Transport Info */}
            <section id="hotel-info" className="bg-white rounded-3xl p-6 md:p-8 border border-[#e2e8f0] shadow-sm">
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
                      Hotels may be changed depending on availability when booking is confirmed (same or higher category).
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
                  {pkg.hotelInfo.amenities.map((a: string) => (
                    <span key={a} className="text-xs bg-white text-[#334155] border border-[#e2e8f0] px-3 py-1 rounded-full font-medium">
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            </section>

            {/* Cancellation Policy & Official Booking Terms */}
            {pkg.cancellationPolicySchedule && (
              <section id="cancellation-policy" className="bg-white rounded-3xl p-6 md:p-8 border border-[#e2e8f0] shadow-sm scroll-mt-24 space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-[#e2e8f0]">
                  <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                    <ShieldCheck size={22} />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-[#0a1628]">
                      Cancellation &amp; Amendment Policy
                    </h2>
                    <p className="text-xs text-[#64748b] mt-0.5">
                      Clear and transparent booking terms per SkyWalk Holidays standard operating policy.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Category A: Land & Hotel */}
                  <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl p-5 shadow-xs">
                    <h3 className="text-xs font-bold text-[#0a1628] uppercase tracking-wider mb-1 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                      A. Package Including Land &amp; Hotel
                    </h3>
                    <p className="text-[11px] text-[#64748b] mb-3">Cancellation fee structure:</p>
                    <div className="space-y-2 text-xs">
                      {pkg.cancellationPolicySchedule.landAndHotel.map((item: any, idx: number) => (
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
                      B. Land-Only Package
                    </h3>
                    <p className="text-[11px] text-[#64748b] mb-3">Cancellation fee structure:</p>
                    <div className="space-y-2 text-xs">
                      {pkg.cancellationPolicySchedule.landOnly.map((item: any, idx: number) => (
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
                    Terms, Amendments &amp; Force Majeure
                  </h4>
                  <ul className="space-y-1.5 list-disc list-inside text-[#475569] leading-relaxed">
                    {pkg.cancellationPolicySchedule.rules.map((r: string, rIdx: number) => (
                      <li key={rIdx}>{r}</li>
                    ))}
                  </ul>
                </div>
              </section>
            )}

            {/* FAQs */}
            <section id="faq" className="bg-white rounded-3xl p-6 md:p-8 border border-[#e2e8f0] shadow-sm">
              <h2 className="text-2xl font-extrabold text-[#0a1628] mb-6 flex items-center gap-2">
                <HelpCircle className="text-[#0ea5e9]" size={24} />
                Frequently Asked Questions
              </h2>

              <div className="space-y-4">
                {pkg.faqs.map((faq: any, idx: number) => (
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

          {/* Right Column: Sticky Inquiry Sidebar */}
          <div className="lg:col-span-1 sticky top-36 self-start z-20">
            <PackageInquirySidebar
              packageTitle={pkg.title}
              packagePrice={pkg.price}
              destination={pkg.destination}
              duration={pkg.duration}
            />
          </div>

        </div>
      </div>
    </div>
  );
}