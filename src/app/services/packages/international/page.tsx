import React, { Suspense } from "react";
import { Metadata } from "next";
import Image from "next/image";
import { Globe, Sparkles } from "lucide-react";
import SectionHeader from "@/components/common/SectionHeader";
import CTABanner from "@/components/common/CTABanner";
import HolidayPackagesListing from "@/components/packages/HolidayPackagesListing";
import AutoScrollToPackages from "@/components/packages/AutoScrollToPackages";

export const metadata: Metadata = {
  title: "Explore Our Holiday Packages | Skywalks Holidays",
  description: "Curated domestic Nepal tours and international holiday packages. Thailand, Bali, Vietnam, Pokhara, Mustang, Europe & more.",
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
