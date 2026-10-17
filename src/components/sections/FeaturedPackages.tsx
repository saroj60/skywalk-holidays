"use client";

import React from "react";
import Link from "next/link";
import { FEATURED_PACKAGES } from "@/lib/constants";
import PackageCard from "@/components/common/PackageCard";
import SectionHeader from "@/components/common/SectionHeader";

export default function FeaturedPackages() {
  if (!FEATURED_PACKAGES || FEATURED_PACKAGES.length === 0) {
    return null;
  }

  return (
    <section className="section-padding">
      <div className="container-custom">
        <SectionHeader
          eyebrow="International Holiday Packages"
          title="Handpicked Worldwide Packages"
          subtitle="Carefully curated luxury & budget holiday packages with all-inclusive pricing."
        />

        {/* Package Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURED_PACKAGES.map((pkg, index) => (
            <PackageCard key={pkg.id} index={index} {...pkg} />
          ))}
        </div>

        {/* View All */}
        <div className="text-center mt-10">
          <Link
            href="/services/packages/international"
            className="inline-flex items-center gap-2 bg-[#0a1628] text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-[#163058] transition-colors"
          >
            View All International Packages →
          </Link>
        </div>
      </div>
    </section>
  );
}
