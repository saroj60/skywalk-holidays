"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Plane,
  Headset,
  Tag,
  RefreshCw,
  Globe2,
  CheckCircle2,
  Phone,
  ArrowRight,
  MapPin,
} from "lucide-react";
import SectionHeader from "@/components/common/SectionHeader";
import CTABanner from "@/components/common/CTABanner";
import FlightInquiryForm from "@/components/forms/FlightInquiryForm";
import { COMPANY } from "@/lib/constants";

const AIRLINES = [
  {
    name: "Qatar Airways",
    routes: "Kathmandu → Doha & 150+ Global Destinations",
    code: "QR",
    logo: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=200&q=80",
  },
  {
    name: "Emirates",
    routes: "Kathmandu → International Hubs, Europe & USA",
    code: "EK",
    logo: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=200&q=80",
  },
  {
    name: "Air Arabia",
    routes: "Kathmandu → Sharjah & Middle East",
    code: "G9",
    logo: "https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?w=200&q=80",
  },
  {
    name: "IndiGo",
    routes: "Kathmandu → Delhi, Mumbai & India Network",
    code: "6E",
    logo: "https://images.unsplash.com/photo-1488085061387-422e29b40080?w=200&q=80",
  },
  {
    name: "Nepal Airlines",
    routes: "Kathmandu → Narita, Bangkok, Kuala Lumpur & Domestic",
    code: "RA",
    logo: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=200&q=80",
  },
  {
    name: "Buddha Air",
    routes: "Pokhara, Biratnagar, Bhairahawa, Nepalgunj & Mountain Flights",
    code: "U4",
    logo: "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=200&q=80",
  },
  {
    name: "Thai Airways",
    routes: "Kathmandu → Bangkok, East Asia & Australia",
    code: "TG",
    logo: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=200&q=80",
  },
  {
    name: "Singapore Airlines",
    routes: "Kathmandu → Singapore, Australia & Pacific",
    code: "SQ",
    logo: "https://images.unsplash.com/photo-1524592714635-d77511a4834d?w=200&q=80",
  },
  {
    name: "Yeti Airlines",
    routes: "Pokhara, Everest View & Major Nepal Hubs",
    code: "YT",
    logo: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=200&q=80",
  },
];

const WHY_BOOK_WITH_US = [
  {
    icon: Headset,
    title: "Expert Travel Assistance",
    description: "Dedicated flight specialists to assist with optimal transit routes, baggage allowances, seat preferences, and visa requirements.",
    color: "bg-[#e0f2fe] text-[#0ea5e9]",
  },
  {
    icon: Tag,
    title: "Competitive Pricing",
    description: "Exclusive group fares, corporate discounts, and unpublished agency rates for both domestic Nepal and international flights.",
    color: "bg-[#fff7ed] text-[#f97316]",
  },
  {
    icon: RefreshCw,
    title: "Flexible Booking Support",
    description: "Hassle-free date change assistance, quick ticket cancellations, refund tracking, and 24/7 emergency rebooking support.",
    color: "bg-[#f0fdf4] text-emerald-600",
  },
  {
    icon: Globe2,
    title: "International & Domestic Routes",
    description: "Full ticketing coverage across 40+ domestic and international airlines operating out of Nepal with seamless connections.",
    color: "bg-[#faf5ff] text-purple-600",
  },
];

export default function FlightsPage() {
  const [failedLogos, setFailedLogos] = useState<Record<string, boolean>>({});

  return (
    <>
      {/* 1. Enhanced Hero Banner Section */}
      <section className="bg-[#0a1628] pt-4 sm:pt-6 pb-20 sm:pb-24 overflow-hidden relative">
        {/* Subtle background ambient lighting */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#0ea5e9]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-[#f97316]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="container-custom relative z-10">
          <div className="relative w-full min-h-[420px] sm:min-h-[460px] md:min-h-[500px] rounded-3xl overflow-hidden shadow-2xl border border-white/15 bg-[#0a1628] flex flex-col justify-center">
            {/* Background Image */}
            <Image
              src="/images/flights-hero-banner.png"
              alt="Flight Ticket Booking Assistance — Skywalks Holidays"
              fill
              priority
              className="object-cover object-[70%_center] md:object-center"
              sizes="(max-width: 1280px) 100vw, 1280px"
            />

            {/* Gradient Overlay for exceptional contrast & depth */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a1628] via-[#0a1628]/90 sm:via-[#0a1628]/80 to-transparent z-10" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628]/80 via-transparent to-black/30 z-10 md:hidden" />

            {/* Hero Content */}
            <div className="relative z-20 p-6 sm:p-8 md:p-12 lg:p-14 max-w-2xl text-left flex flex-col items-start gap-4 sm:gap-5">
              
              {/* Pill Badge */}
              <div className="inline-flex items-center gap-2 bg-sky-500/20 border border-sky-400/40 backdrop-blur-md px-3.5 py-1.5 rounded-full text-sky-200 text-xs font-bold tracking-wide uppercase shadow-lg shadow-sky-500/10">
                <Plane size={14} className="text-[#38bdf8] animate-pulse" />
                <span>Official IATA Air Ticketing Partner</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.18]">
                Fly Anywhere with{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#38bdf8] via-[#0ea5e9] to-amber-300">
                  Guaranteed Best Fares
                </span>
              </h1>

              {/* Description */}
              <p className="text-xs sm:text-sm md:text-base text-slate-200/95 leading-relaxed font-normal">
                Compare live schedules and unpublished agency discounts across 40+ domestic &amp; international airlines. Seamless booking, quick date changes, and 24/7 flight desk support from Kathmandu.
              </p>

              {/* Value Highlights */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] sm:text-xs font-medium text-white/90">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-emerald-400 shrink-0" /> Exclusive Agency Discounts
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-emerald-400 shrink-0" /> Free Date Change Assistance
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-emerald-400 shrink-0" /> 0% Hidden Fees
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <a
                  href="#flight-form"
                  className="inline-flex items-center gap-2 bg-[#f97316] hover:bg-[#ea580c] text-white text-xs sm:text-sm font-bold py-2.5 px-5 rounded-full shadow-lg shadow-orange-500/30 transition-all hover:scale-105 cursor-pointer"
                >
                  <span>Request Flight Quote</span>
                  <ArrowRight size={14} />
                </a>

                <a
                  href={`tel:${COMPANY.mobile}`}
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/25 text-white text-xs sm:text-sm font-semibold py-2.5 px-4 rounded-full backdrop-blur-md transition-all hover:scale-105"
                >
                  <Phone size={13} className="text-[#38bdf8]" />
                  <span>Call Desk: {COMPANY.mobile}</span>
                </a>
              </div>

              {/* Popular Routes */}
              <div className="flex flex-wrap items-center gap-1.5 text-[10px] sm:text-[11px] text-white/80 pt-1">
                <span className="text-sky-300 font-semibold flex items-center gap-1">
                  <MapPin size={11} className="text-[#38bdf8]" /> Popular Routes:
                </span>
                {["KTM ⇄ Bangkok", "KTM ⇄ Dubai", "KTM ⇄ Delhi", "KTM ⇄ Kuala Lumpur", "KTM ⇄ Singapore", "KTM ⇄ Pokhara"].map((route) => (
                  <span
                    key={route}
                    className="px-2.5 py-0.5 rounded-full bg-black/50 border border-white/20 text-white/90 backdrop-blur-md hover:border-sky-400/60 transition-colors"
                  >
                    {route}
                  </span>
                ))}
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 2. Flight Inquiry Form Section */}
      <section id="flight-form" className="relative z-20 -mt-14 sm:-mt-16 pb-16 px-4">
        <div className="container-custom">
          <FlightInquiryForm />
        </div>
      </section>

      {/* 3. Why Book Through Us Section */}
      <section className="section-padding bg-[#f8fafc]">
        <div className="container-custom">
          <SectionHeader
            eyebrow="Why Choose Skywalks Holidays"
            title="Why Book Your Flights Through Us?"
            subtitle="We handle your flight reservations with precision, care, and industry-leading support so your travel is always stress-free."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHY_BOOK_WITH_US.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="bg-white rounded-3xl p-7 border border-[#e2e8f0] shadow-sm hover:shadow-xl hover:border-[#0ea5e9]/40 transition-all duration-300 group flex flex-col justify-between"
                >
                  <div>
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
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Airlines We Book */}
      <section className="section-padding">
        <div className="container-custom">
          <SectionHeader
            eyebrow="Airlines Network"
            title="Domestic &amp; International Airline Partners"
            subtitle="We issue direct tickets across leading international carriers and domestic Nepal airlines."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {AIRLINES.map((airline) => {
              const hasFailed = failedLogos[airline.name];
              return (
                <div
                  key={airline.name}
                  className="bg-white border border-[#e2e8f0] rounded-2xl p-6 hover:shadow-lg hover:border-[#0ea5e9] transition-all group flex items-center gap-4"
                >
                  <div className="relative w-14 h-14 rounded-2xl bg-[#0a1628] text-white flex items-center justify-center font-extrabold text-base shrink-0 group-hover:bg-[#0ea5e9] transition-colors overflow-hidden">
                    {airline.logo && !hasFailed ? (
                      <Image
                        src={airline.logo}
                        alt={airline.name}
                        fill
                        className="object-cover"
                        onError={() => setFailedLogos((prev) => ({ ...prev, [airline.name]: true }))}
                        sizes="56px"
                      />
                    ) : (
                      <span>{airline.code}</span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-[#0a1628] text-base mb-1 group-hover:text-[#0ea5e9] transition-colors flex items-center gap-1.5">
                      {airline.name}
                      <span className="text-xs font-mono font-normal text-[#94a3b8]">[{airline.code}]</span>
                    </h3>
                    <p className="text-xs text-[#64748b] leading-relaxed">
                      {airline.routes}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <CTABanner
        title="Need Group Flight Booking or Urgent Assistance?"
        subtitle="Speak directly with our flight desk for group rates, corporate ticketing, or emergency rebooking."
        primaryLabel="Call Flight Desk"
        primaryHref="tel:9714491103"
        secondaryLabel="WhatsApp Us"
        secondaryHref="https://wa.me/9779714491103"
      />
    </>
  );
}
