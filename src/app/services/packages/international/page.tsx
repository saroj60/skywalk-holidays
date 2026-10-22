import React, { Suspense } from "react";
import { Metadata } from "next";
import Image from "next/image";
import { Globe, Sparkles } from "lucide-react";
import SectionHeader from "@/components/common/SectionHeader";
import CTABanner from "@/components/common/CTABanner";
import HolidayPackagesListing from "@/components/packages/HolidayPackagesListing";
import AutoScrollToPackages from "@/components/packages/AutoScrollToPackages";

export const metadata: Metadata = {
  title: "International Holiday Packages from Nepal | Thailand, Bali, China & Vietnam — Skywalk Holidays",
  description:
    "Explore premier international holiday tour packages from Nepal. All-inclusive tours to Bangkok & Pattaya Thailand, Bali Indonesia, China (Beijing & Shanghai), Vietnam, and Europe with flights, hotels, and visa assistance from Kathmandu.",
  keywords: [
    "international holiday packages from nepal",
    "thailand tour package from nepal",
    "bangkok pattaya tour package from nepal",
    "bali indonesia tour package from nepal",
    "bali honeymoon package from nepal",
    "china tour packages from nepal",
    "vietnam tour package from kathmandu",
    "tour and travel company in nepal",
    "best travel agency in kathmandu",
    "cheap international tour packages nepal",
  ],
  alternates: {
    canonical: "https://skywalkholidays.com/services/packages/international",
  },
  openGraph: {
    title: "International Holiday Packages from Nepal — Skywalk Holidays",
    description:
      "All-inclusive holiday tour packages from Kathmandu to Thailand, Bali Indonesia, China, Vietnam & Europe. Flights, deluxe stays & visa included.",
    url: "https://skywalkholidays.com/services/packages/international",
    siteName: "Skywalk Holidays Nepal",
    images: [
      {
        url: "https://skywalkholidays.com/uploads/Explore%20Holiday%20Packages.png",
        width: 1200,
        height: 630,
        alt: "International Holiday Packages — Skywalk Holidays Nepal",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "International Holiday Packages from Nepal — Skywalk Holidays",
    description: "All-inclusive tour packages to Thailand, Bali Indonesia, China & Vietnam from Kathmandu.",
    images: ["https://skywalkholidays.com/uploads/Explore%20Holiday%20Packages.png"],
  },
};

export default function HolidayPackagesPage() {
  return (
    <>
      <AutoScrollToPackages />
      {/* Hero Banner Section (Full Width, No Blank Gaps) */}
      <section className="relative w-full overflow-hidden bg-[#0a1628]">
        <div className="relative w-full h-[200px] sm:h-[280px] md:h-[360px] lg:h-[420px] xl:h-[480px]">
          <Image
            src="/uploads/Explore%20Holiday%20Packages.png"
            alt="Explore Holiday Packages — Skywalks Holidays"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
        </div>
      </section>

      {/* Main Listing & Filters Section */}
      <section id="packages-section" className="section-padding bg-[#f8fafc] scroll-mt-20">
        <div className="container-custom">
          <SectionHeader
            eyebrow="Handcrafted Journeys"
            title="Choose Your Next Destination"
            subtitle="Filter by destination, duration, budget, or category to find your ideal holiday package."
          />

          <Suspense fallback={<div className="text-center py-12 font-medium text-slate-500">Loading holiday packages...</div>}>
            <HolidayPackagesListing />
          </Suspense>
        </div>
      </section>

      {/* CTA Banner */}
      <CTABanner
        title="Looking for a Completely Customized Holiday?"
        subtitle="Our travel designers craft bespoke private itineraries tailored precisely to your preferences, dates, and budget."
        primaryLabel="Design Custom Package"
        primaryHref="/services/custom"
        secondaryLabel="Talk to Tour Expert"
        secondaryHref="tel:+97798XXXXXXXX"
      />
    </>
  );
}
