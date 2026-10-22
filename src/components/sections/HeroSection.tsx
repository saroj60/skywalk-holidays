"use client";

import React, { useRef, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Compass,
  ShieldCheck,
  Sparkles,
  MapPin,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import SearchBar from "@/components/common/SearchBar";
import CloudDivider from "@/components/common/CloudDivider";
import { COMPANY } from "@/lib/constants";

const POPULAR_DESTINATIONS = [
  { label: "Thailand", href: "/services/packages/international?country=Thailand" },
  { label: "Bali", href: "/services/packages/international?country=Bali" },
  { label: "Vietnam", href: "/services/packages/international?country=Vietnam" },
  { label: "Malaysia", href: "/services/packages/international?country=Malaysia" },
  { label: "Singapore", href: "/services/packages/international?country=Singapore" },
  { label: "Maldives", href: "/services/packages/international?country=Maldives" },
];

export default function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Ensure seamless autoplay on all mobile browsers (iOS Safari, Android Chrome)
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.defaultMuted = true;
      video.muted = true;
      video.setAttribute("playsinline", "true");
      video.setAttribute("webkit-playsinline", "true");

      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Fallback if mobile browser blocks initial autoplay (e.g. battery saver mode)
          const unlock = () => {
            if (videoRef.current) {
              videoRef.current.play().catch(() => {});
            }
            window.removeEventListener("touchstart", unlock);
            window.removeEventListener("click", unlock);
            window.removeEventListener("scroll", unlock);
          };
          window.addEventListener("touchstart", unlock, { passive: true, once: true });
          window.addEventListener("click", unlock, { once: true });
          window.addEventListener("scroll", unlock, { passive: true, once: true });
        });
      }
    }
  }, []);

  return (
    <section className="relative min-h-[68vh] sm:min-h-[75vh] md:min-h-[85vh] flex flex-col justify-between overflow-visible bg-[#0a1628] select-none">
      {/* Background Video Layer: Fills the entire section so video is visible behind controls */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-cover object-center"
        >
          <source src="/gemini_generated_video_cb5c99e8.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Crisp, clean, lightweight overlay for text contrast without dark muddy blocks */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/25 z-10 pointer-events-none" />
      </div>

      {/* Main Content Area: Positioned directly on the bottom part of the video */}
      <div className="relative z-20 container-custom flex-1 flex flex-col justify-end items-start px-4 sm:px-6 md:px-8 pt-16 sm:pt-20 pb-4 sm:pb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between w-full gap-3 sm:gap-6">
          
          {/* Bottom Left Corner: Action Buttons, Search Bar & Popular Tags */}
          <div className="flex flex-col items-start text-left max-w-md sm:max-w-lg w-full">
            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Button
                size="sm"
                asChild
                className="bg-[#0ea5e9] hover:bg-[#0284c7] text-white font-bold shadow-lg shadow-sky-500/30 text-xs py-1.5 px-3.5 rounded-full shrink-0 h-auto"
              >
                <Link href="/services/packages/international" className="flex items-center gap-1.5">
                  <span>Explore Packages</span>
                  <ArrowRight size={13} className="shrink-0" />
                </Link>
              </Button>

              <Button
                size="sm"
                variant="outline-white"
                asChild
                className="text-xs backdrop-blur-md bg-black/40 border-white/35 hover:bg-white/20 text-white py-1.5 px-3 rounded-full shrink-0 h-auto"
              >
                <Link href="/services/custom" className="flex items-center gap-1.5">
                  <Compass size={13} className="text-[#0ea5e9] shrink-0" />
                  <span>Custom Tour</span>
                </Link>
              </Button>

              <Button
                size="sm"
                asChild
                className="bg-[#f97316] hover:bg-[#ea580c] text-white font-bold text-xs py-1.5 px-3 rounded-full shrink-0 shadow-md shadow-orange-500/30 h-auto"
              >
                <a href={`tel:${COMPANY.mobile}`} className="flex items-center gap-1.5">
                  <Phone size={13} className="fill-white shrink-0" />
                  <span>Call Expert</span>
                </a>
              </Button>
            </div>

            {/* Search Bar */}
            <div className="w-full mb-2">
              <SearchBar compact />
            </div>

            {/* Popular Tour Destination Tags */}
            <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-white/90 font-medium">
              <span className="text-sky-300 flex items-center gap-1 font-semibold text-[10px] sm:text-[11px]">
                <MapPin size={11} className="text-[#0ea5e9]" /> Popular:
              </span>
              {POPULAR_DESTINATIONS.map((dest) => (
                <Link
                  key={dest.label}
                  href={dest.href}
                  className="px-2 py-0.5 rounded-full bg-black/50 hover:bg-[#0ea5e9] text-white border border-white/20 transition-all backdrop-blur-md text-[10px] sm:text-[11px] hover:scale-105"
                >
                  {dest.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Bottom Right Corner: Trust Badges */}
          <div className="flex flex-col items-start md:items-end gap-2.5 shrink-0">
            {/* Compact Trust Badges */}
            <div className="hidden md:flex items-center gap-4 text-white/75 text-[11px] font-semibold tracking-wide uppercase">
              <div className="flex items-center gap-1.5">
                <ShieldCheck size={13} className="text-[#0ea5e9]" />
                100% Guaranteed Booking
              </div>
              <div className="w-1 h-1 rounded-full bg-white/30" />
              <div className="flex items-center gap-1.5">
                <span className="text-amber-400">★★★★★</span>
                1500+ Travelers
              </div>
              <div className="w-1 h-1 rounded-full bg-white/30" />
              <div className="flex items-center gap-1.5">
                <Sparkles size={12} className="text-[#f97316]" />
                24/7 Support
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Fluffy Sky Clouds transition horizon */}
      <CloudDivider fillColor="#f8fbff" className="relative z-10 -mt-6 sm:-mt-8" />
    </section>
  );
}
