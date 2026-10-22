import React from "react";
import { Metadata } from "next";
import Image from "next/image";
import { Sparkles, MessageSquare, Map, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SectionHeader from "@/components/common/SectionHeader";
import CTABanner from "@/components/common/CTABanner";

export const metadata: Metadata = {
  title: "Tailor-Made & Custom Holiday Tour Packages from Nepal | Skywalk Holidays",
  description:
    "Design your dream international or domestic holiday with Skywalk Holidays Kathmandu. Personalized itineraries for Thailand, Bali Indonesia, China, Europe & Nepal tailored to your budget and travel dates.",
  keywords: [
    "custom tour package from nepal",
    "tailor made holiday packages kathmandu",
    "personalized tour and travel company in nepal",
    "customized thailand tour package from nepal",
    "customized bali honeymoon tour nepal",
  ],
  alternates: {
    canonical: "https://skywalkholidays.com/services/custom",
  },
};

const STEPS = [
  { icon: MessageSquare, step: "01", title: "Share Your Dream", desc: "Tell us your destination, dates, budget & preferences" },
  { icon: Map, step: "02", title: "We Design It", desc: "Our experts craft a tailored itinerary just for you" },
  { icon: CheckCircle, step: "03", title: "Review & Confirm", desc: "Review your itinerary, suggest changes, and confirm" },
  { icon: Sparkles, step: "04", title: "Enjoy Your Trip!", desc: "We handle all bookings — you just pack and travel!" },
];

const POPULAR_CUSTOMIZATIONS = [
  "Honeymoon Packages", "Family Holidays", "Solo Adventures",
  "Group Tours", "Corporate Retreats", "Anniversary Trips",
  "Pilgrimage Tours", "Adventure Expeditions", "Luxury Escapes",
];

export default function CustomToursPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative py-20 md:py-28 text-white overflow-hidden bg-[#0a1628]">
        {/* Background Travel Banner Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/custom-tours-hero-banner.png"
            alt="Customized Tour Packages — Skywalk Holidays"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          {/* Multi-layer gradient overlays ensuring high contrast, readability, and landmark visibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a1628]/90 via-[#0a1628]/65 to-[#0a1628]/85" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] via-transparent to-[#0a1628]/60" />
        </div>

        <div className="container-custom relative z-10 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 mb-6 shadow-lg">
            <Sparkles size={28} className="text-[#f97316]" />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 drop-shadow-md">
            Customized Tour Packages
          </h1>
          <p className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed drop-shadow font-medium">
            Your dream trip, your way. Tell us your vision and our experts will make it a reality.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="py-14 bg-[#f8fafc]">
        <div className="container-custom">
          <SectionHeader eyebrow="How It Works" title="From Idea to Itinerary in 4 Easy Steps" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {STEPS.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.step} className="bg-white rounded-2xl p-6 border border-[#e2e8f0] text-center hover:shadow-lg transition-shadow group">
                  <div className="relative mx-auto w-14 h-14 mb-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#0ea5e9] to-[#0a1628] flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon size={22} className="text-white" />
                    </div>
                    <span className="absolute -top-1 -right-1 w-6 h-6 bg-[#f97316] text-white text-xs font-bold rounded-full flex items-center justify-center">
                      {s.step}
                    </span>
                  </div>
                  <h3 className="font-bold text-[#0a1628] mb-2">{s.title}</h3>
                  <p className="text-sm text-[#64748b]">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Popular Types */}
      <section className="py-12">
        <div className="container-custom">
          <SectionHeader eyebrow="Trip Types" title="What Can We Customize?" subtitle="No two travelers are alike. We specialize in all types of personalized travel experiences." />
          <div className="flex flex-wrap justify-center gap-3">
            {POPULAR_CUSTOMIZATIONS.map((c) => (
              <span key={c} className="px-5 py-2.5 rounded-full border-2 border-[#e2e8f0] text-sm font-semibold text-[#334155] hover:border-[#0ea5e9] hover:text-[#0ea5e9] hover:bg-[#f0f9ff] transition-all cursor-pointer">
                {c}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Custom Trip Form */}
      <section className="py-14 bg-[#f8fafc]">
        <div className="container-custom max-w-3xl">
          <SectionHeader eyebrow="Build Your Trip" title="Tell Us About Your Dream Vacation" />
          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-8 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-xs font-semibold text-[#64748b] uppercase tracking-wider mb-1.5 block">Your Name</label>
                <Input placeholder="Full name" />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#64748b] uppercase tracking-wider mb-1.5 block">Phone / WhatsApp</label>
                <Input placeholder="+977-98XXXXXXXX" />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#64748b] uppercase tracking-wider mb-1.5 block">Email Address</label>
                <Input type="email" placeholder="your@email.com" />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#64748b] uppercase tracking-wider mb-1.5 block">Dream Destination</label>
                <Input placeholder="Where do you want to go?" />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#64748b] uppercase tracking-wider mb-1.5 block">Travel Dates</label>
                <Input type="date" />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#64748b] uppercase tracking-wider mb-1.5 block">Number of Travelers</label>
                <Input placeholder="e.g. 2 Adults, 1 Child" />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#64748b] uppercase tracking-wider mb-1.5 block">Approximate Budget (NPR)</label>
                <Input placeholder="e.g. 50,000 per person" />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#64748b] uppercase tracking-wider mb-1.5 block">Trip Type</label>
                <Input placeholder="e.g. Honeymoon, Family, Adventure" />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-semibold text-[#64748b] uppercase tracking-wider mb-1.5 block">Special Requirements / Notes</label>
                <textarea
                  rows={4}
                  placeholder="Tell us your preferences, interests, dietary needs, accessibility requirements..."
                  className="w-full rounded-lg border border-[#e2e8f0] bg-white px-4 py-3 text-sm text-[#0a1628] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] focus:border-[#0ea5e9] transition-colors resize-none"
                />
              </div>
            </div>
            <Button size="lg" className="w-full text-base">
              <Sparkles size={18} />
              Submit My Trip Request
            </Button>
            <p className="text-xs text-center text-[#94a3b8] mt-3">
              Our travel designer will contact you within 24 hours with a personalized proposal.
            </p>
          </div>
        </div>
      </section>

      <CTABanner
        title="Every Dream Trip Deserves a Personal Touch"
        subtitle="Over 10,000 customized tours delivered. Your perfect journey is just one form away."
        primaryLabel="Start Planning"
        primaryHref="#"
        secondaryLabel="See Sample Itineraries"
        secondaryHref="/services/packages/international"
      />
    </>
  );
}
