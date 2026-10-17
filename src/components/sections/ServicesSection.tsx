"use client";

import React from "react";
import { Plane, Hotel, Palmtree, FileText, Shield, Map } from "lucide-react";
import ServiceCard from "@/components/common/ServiceCard";
import SectionHeader from "@/components/common/SectionHeader";

const SERVICES_DATA = [
  {
    icon: Plane,
    title: "Flight Booking",
    description: "International flight ticket assistance at competitive rates with instant e-tickets.",
    href: "/services/flights",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80",
    ctaText: "Book Flights",
    badge: "Instant e-Tickets",
    perks: ["Best Fare Guarantee", "24/7 Airline Support"],
    accentGradient: "from-sky-500 to-blue-600",
  },
  {
    icon: Hotel,
    title: "Hotel Booking",
    description: "Find comfortable stays for business and leisure travel across luxury resorts and hotels.",
    href: "/services/hotels",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
    ctaText: "Book Hotels",
    badge: "Luxury Resorts",
    perks: ["Handpicked 4★ & 5★", "Free Breakfast Deals"],
    accentGradient: "from-amber-500 to-orange-600",
  },
  {
    icon: Palmtree,
    title: "Holiday Packages",
    description: "Explore carefully planned international holiday packages with all-inclusive pricing.",
    href: "/services/packages/international",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
    ctaText: "Explore Packages",
    badge: "All-Inclusive",
    perks: ["Flights & Hotels", "Guided Tours & Meals"],
    accentGradient: "from-emerald-500 to-teal-600",
  },
  {
    icon: FileText,
    title: "Visa Assistance",
    description: "Professional visa documentation, appointment scheduling, and expert approval guidance.",
    href: "/services/visa",
    image: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&q=80",
    ctaText: "Apply for Visa",
    badge: "99% Approval",
    perks: ["Document Checklist", "VFS Fast-Track"],
    accentGradient: "from-indigo-500 to-violet-600",
  },
  {
    icon: Shield,
    title: "Travel Insurance",
    description: "Comprehensive medical emergencies and trip cancellation protection for total peace of mind.",
    href: "/services/insurance",
    image: "/images/services/travel-insurance-real.jpg",
    ctaText: "Get Insurance",
    badge: "Full Protection",
    perks: ["Emergency Medical", "Baggage Loss Cover"],
    accentGradient: "from-blue-600 to-cyan-500",
  },
  {
    icon: Map,
    title: "Customized Tours",
    description: "Personalized travel experiences crafted around your dates, preferences, and group.",
    href: "/services/custom",
    image: "/images/services/customized-tours-real.jpg",
    ctaText: "Customize Trip",
    badge: "Tailor-Made",
    perks: ["Private Vehicle & Guide", "Flexible Daily Itinerary"],
    accentGradient: "from-rose-500 to-pink-600",
  },
];

export default function ServicesSection() {
  return (
    <section id="services" className="section-padding relative overflow-hidden">
      {/* Background ambient sky glow */}
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-sky-200/40 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-blue-200/30 rounded-full blur-[140px] pointer-events-none" />

      <div className="container-custom relative z-10">
        <SectionHeader
          eyebrow="Our Travel Services"
          title="Everything You Need for Your Next Journey"
          subtitle="Explore our comprehensive travel solutions designed to make your journey seamless, memorable, and worry-free."
        />

        {/* 6-Card Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {SERVICES_DATA.map((service, index) => (
            <ServiceCard
              key={service.title}
              index={index}
              icon={service.icon}
              title={service.title}
              description={service.description}
              href={service.href}
              image={service.image}
              ctaText={service.ctaText}
              badge={service.badge}
              perks={service.perks}
              accentGradient={service.accentGradient}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
