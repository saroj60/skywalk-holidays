"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { FEATURED_PACKAGES } from "@/lib/constants";
import PackageCard from "@/components/common/PackageCard";
import SectionHeader from "@/components/common/SectionHeader";

export default function FeaturedPackages() {
  const [livePackages, setLivePackages] = useState<any[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("skywalk_admin_packages_v1");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {}
    }
    return [];
  });

  const loadLivePackages = useCallback(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("skywalk_admin_packages_v1");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) setLivePackages(parsed);
        }
      } catch (e) {}
    }

    fetch("/api/packages", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.packages) && data.packages.length > 0) {
          setLivePackages(data.packages);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    loadLivePackages();
    const handleUpdate = () => loadLivePackages();
    window.addEventListener("skywalk-packages-updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("skywalk-packages-updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, [loadLivePackages]);

  const mergeWithLive = useCallback(
    (pkg: any) => {
      if (!livePackages || livePackages.length === 0) return pkg;
      const match = livePackages.find((lp) => {
        if (!lp) return false;
        if (String(lp.id) === String(pkg.id)) return true;
        if (lp.slug && (lp.slug === pkg.id || lp.slug === pkg.slug)) return true;
        const lpTitle = (lp.title || "").toLowerCase().trim();
        const pkgTitle = (pkg.title || "").toLowerCase().trim();
        return (
          lpTitle &&
          pkgTitle &&
          (lpTitle === pkgTitle || lpTitle.includes(pkgTitle) || pkgTitle.includes(lpTitle))
        );
      });
      if (!match) return pkg;
      return {
        ...pkg,
        title: match.title || pkg.title,
        price: Number(match.price) || pkg.price,
        originalPrice: Number(match.originalPrice) || pkg.originalPrice,
        duration: match.duration || pkg.duration,
        destination: match.destination || pkg.destination,
        badge: match.badge || pkg.badge,
        rating: Number(match.rating) || pkg.rating,
        reviews: Number(match.reviews) || pkg.reviews,
        image: match.coverImage || match.image || pkg.image,
      };
    },
    [livePackages]
  );

  const activePackages = useMemo(() => {
    return (FEATURED_PACKAGES || []).map(mergeWithLive);
  }, [mergeWithLive]);

  if (!activePackages || activePackages.length === 0) {
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
          {activePackages.map((pkg, index) => (
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
