import React from "react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Compass,
  Target,
  Eye,
  Award,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Plane,
  Hotel,
  Globe,
  MapPin,
  FileCheck,
  Shield,
  Sparkles,
  Users,
  MessageSquare,
  Phone,
  Mail,
  Crown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionHeader from "@/components/common/SectionHeader";
import CTABanner from "@/components/common/CTABanner";
import { COMPANY } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About Us | Skywalks Holidays — Nepal's Premier Travel Agency",
  description: "Discover Skywalks Holidays. 2+ years of experience delivering flight booking, hotel stays, international holidays & visa assistance from Kathmandu.",
};

const STATS_CARDS = [
  { value: "2+", label: "Years of Experience", desc: "Dedicated travel service in Nepal", icon: Award, color: "bg-[#e0f2fe] text-[#0ea5e9]" },
  { value: "1500+", label: "Happy Travelers", desc: "Trusted by travelers worldwide", icon: Users, color: "bg-[#f0fdf4] text-emerald-600" },
  { value: "14+", label: "Destinations Covered", desc: "Across Asia & Worldwide", icon: Globe, color: "bg-[#fff7ed] text-[#f97316]" },
  { value: "8", label: "Travel Services", desc: "Complete end-to-end travel solutions", icon: ShieldCheck, color: "bg-[#faf5ff] text-purple-600" },
];

const SERVICES_GRID = [
  { icon: Plane, name: "Flight Ticket Booking", href: "/services/flights" },
  { icon: Hotel, name: "Hotel Booking", href: "/services/hotels" },
  { icon: Globe, name: "International Packages", href: "/services/packages/international" },
  { icon: MapPin, name: "Domestic Holiday Packages", href: "/services/packages/domestic" },
  { icon: FileCheck, name: "Visa Assistance", href: "/services/visa" },
  { icon: Shield, name: "Travel Insurance", href: "/services/insurance" },
  { icon: Sparkles, name: "Customized Tour Packages", href: "/services/custom" },
];

const WHY_CHOOSE_US_PILLARS = [
  {
    icon: Award,
    title: "2+ Years Dedicated Experience",
    description: "Deep-rooted local knowledge in Nepal combined with international airline and hotel contracts.",
    color: "bg-[#e0f2fe] text-[#0ea5e9]",
  },
  {
    icon: ShieldCheck,
    title: "100% Transparent & Price Matched",
    description: "Zero hidden charges. Complete price breakdown with guaranteed competitive pricing.",
    color: "bg-[#fff7ed] text-[#f97316]",
  },
  {
    icon: Compass,
    title: "End-to-End Travel Logistics",
    description: "From flights, hotels, and visas to tour guides and transport — we manage every detail.",
    color: "bg-[#f0fdf4] text-emerald-600",
  },
  {
    icon: CheckCircle2,
    title: "24/7 Dedicated Support Desk",
    description: "Our travel specialists provide round-the-clock emergency support wherever you are.",
    color: "bg-[#faf5ff] text-purple-600",
  },
];

const TEAM_MEMBERS = [
  {
    name: "Mr. Nirdosh Sapkota",
    role: "Travel Expert",
    department: "Lead Travel Expert",
    isLead: true,
    image: "/images/team/nirdosh-sapkota.png",
    whatsapp: "9779714491103",
    phone: COMPANY.phone,
    email: COMPANY.email,
  },
  {
    name: "Mr. Sudesh Karki",
    role: "Ticketing and Package Operative",
    department: "Ticketing & Packages",
    isLead: false,
    image: "/images/team/sudesh-karki.jpg",
    whatsapp: "9779707054143",
    phone: "+977 970-7054143",
    email: COMPANY.email,
  },
  {
    name: "Mr. Johnson Yadav",
    role: "Sales Officer",
    department: "Sales & Client Relations",
    isLead: false,
    image: "/images/team/johnson-yadav.png",
    whatsapp: "9779707054144",
    phone: "+977 970-7054144",
    email: COMPANY.email,
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero Banner Section (Full Width, No Black Gaps) */}
      <section className="relative w-full overflow-hidden bg-[#0a1628]">
        <div className="relative w-full h-[240px] sm:h-[320px] md:h-[380px] lg:h-[440px] xl:h-[480px]">
          <Image
            src="/images/about-hero-banner.png"
            alt="About Skywalks Holidays — Your Trusted Travel Partner"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
        </div>
      </section>

      {/* Statistics Cards Strip (Elevated floating cards) */}
      <section className="relative z-20 -mt-10 sm:-mt-14 md:-mt-16 pb-12 px-4">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {STATS_CARDS.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="bg-white rounded-3xl p-5 sm:p-6 border border-[#e2e8f0] shadow-xl text-center group hover:border-[#0ea5e9] hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 flex flex-col items-center justify-between"
                >
                  <div
                    className={`w-11 h-11 rounded-2xl ${stat.color} flex items-center justify-center mb-3 shadow-sm group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon size={20} />
                  </div>
                  <div className="text-2xl sm:text-3xl md:text-4xl font-black text-[#0a1628] group-hover:text-[#0ea5e9] transition-colors mb-1 tracking-tight">
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-[#334155] mb-1">
                    {stat.label}
                  </div>
                  <div className="text-[11px] text-[#94a3b8] line-clamp-1">
                    {stat.desc}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 1. Company Introduction */}
      <section id="introduction" className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Official Logo Brand Card */}
            <div className="relative h-80 sm:h-96 md:h-[450px] w-full rounded-3xl overflow-hidden shadow-2xl border border-[#e2e8f0] bg-gradient-to-b from-white via-sky-50/40 to-slate-100 flex flex-col justify-between p-6 sm:p-8">
              {/* Ambient radial sky glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-sky-200/40 rounded-full blur-3xl pointer-events-none" />

              {/* Top Trust Badges */}
              <div className="relative z-10 flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#0a1628] bg-white/90 backdrop-blur-md px-3 py-1 rounded-full shadow-sm border border-slate-200/80">
                  <ShieldCheck size={14} className="text-emerald-500" />
                  Government Registered Agency
                </span>
                <span className="text-xs font-bold text-[#0ea5e9] bg-[#e0f2fe] px-2.5 py-1 rounded-full">
                  Since {COMPANY.founded}
                </span>
              </div>

              {/* Central Official Logo Showcase */}
              <div className="relative z-10 w-full flex-1 flex items-center justify-center py-4 my-auto">
                <div className="relative w-full max-w-[280px] sm:max-w-[340px] md:max-w-[380px] h-48 sm:h-56 md:h-64 transition-transform duration-500 hover:scale-105">
                  <Image
                    src="/images/logo-transparent.png"
                    alt="SkyWalk Tours & Travels Official Logo"
                    fill
                    priority
                    className="object-contain drop-shadow-md"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              </div>

              {/* Bottom Headquarters & Travelers Info */}
              <div className="relative z-10 bg-white/95 backdrop-blur-md rounded-2xl p-4 border border-slate-200/80 shadow-md">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#0ea5e9]">
                  <MapPin size={13} className="text-[#f97316] shrink-0" />
                  <span>Headquartered in Thamel, Kathmandu</span>
                </div>
                <p className="text-xs sm:text-sm font-semibold text-[#0a1628] mt-1">
                  Serving over 1500+ happy travelers across 14+ global destinations.
                </p>
              </div>
            </div>

            {/* Copy */}
            <div className="text-left space-y-5">
              <span className="inline-block text-xs font-bold tracking-[0.2em] uppercase text-[#0ea5e9] bg-[#e0f2fe] px-3 py-1.5 rounded-full">
                Company Introduction
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0a1628] leading-tight">
                Nepal&apos;s Trusted Gateway to World Travel
              </h2>
              <p className="text-sm md:text-base text-[#475569] leading-relaxed">
                Founded in {COMPANY.founded} in the vibrant tourism hub of Thamel, Kathmandu, <strong>Skywalks Holidays</strong> has grown into Nepal&apos;s most comprehensive travel service agency.
              </p>
              <p className="text-sm md:text-base text-[#475569] leading-relaxed">
                What began as a dedicated mountain trekking outfit has expanded into a full-scale travel company handling international flight ticketing, luxury hotel reservations, visa documentation assistance, domestic and international holiday packages worldwide.
              </p>
              <p className="text-sm md:text-base text-[#475569] leading-relaxed">
                Our approach is rooted in personal service, absolute transparency, and uncompromised quality. We treat every trip as if it were our own.
              </p>

              <div className="pt-2">
                <Button size="lg" asChild className="bg-[#0a1628] hover:bg-[#163058]">
                  <Link href="/services/custom">
                    Plan Your Journey With Us
                    <ArrowRight size={18} />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2 & 3. Mission & Vision */}
      <section id="mission-vision" className="section-padding bg-[#f8fafc]">
        <div className="container-custom">
          <SectionHeader
            eyebrow="Our Core Purpose"
            title="Our Mission &amp; Vision"
            subtitle="The principles that guide our team in serving every traveler with excellence."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Mission */}
            <div className="bg-white rounded-3xl p-8 border border-[#e2e8f0] shadow-sm hover:shadow-xl transition-all text-left flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-[#e0f2fe] text-[#0ea5e9] flex items-center justify-center mb-6">
                  <Target size={28} />
                </div>
                <h3 className="text-2xl font-bold text-[#0a1628] mb-4">Our Mission</h3>
                <p className="text-sm md:text-base text-[#475569] leading-relaxed mb-6">
                  To deliver seamless, accessible, and transparent travel experiences for Nepali and international travelers. We strive to combine competitive pricing with personalized customer care, making every journey memorable and worry-free.
                </p>
              </div>
              <ul className="space-y-2 text-xs md:text-sm text-[#334155] border-t border-[#f1f5f9] pt-4">
                <li className="flex items-center gap-2">✓ 100% Transparent, No Hidden Fees</li>
                <li className="flex items-center gap-2">✓ Personalized Itinerary Design</li>
                <li className="flex items-center gap-2">✓ 24/7 Traveller Safety Support</li>
              </ul>
            </div>

            {/* Vision */}
            <div className="bg-white rounded-3xl p-8 border border-[#e2e8f0] shadow-sm hover:shadow-xl transition-all text-left flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-[#fff7ed] text-[#f97316] flex items-center justify-center mb-6">
                  <Eye size={28} />
                </div>
                <h3 className="text-2xl font-bold text-[#0a1628] mb-4">Our Vision</h3>
                <p className="text-sm md:text-base text-[#475569] leading-relaxed mb-6">
                  To become Nepal&apos;s most trusted and recognized global travel brand — connecting the breathtaking beauty of the Himalayas to international destinations worldwide while maintaining the highest standard of service integrity.
                </p>
              </div>
              <ul className="space-y-2 text-xs md:text-sm text-[#334155] border-t border-[#f1f5f9] pt-4">
                <li className="flex items-center gap-2">✓ Connecting Nepal to 100+ World Destinations</li>
                <li className="flex items-center gap-2">✓ Digital-first Travel Booking Assistance</li>
                <li className="flex items-center gap-2">✓ Sustainable Tourism Advocacy</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Why Choose Us? */}
      <section id="why-choose-us" className="section-padding bg-white">
        <div className="container-custom">
          <SectionHeader
            eyebrow="Why Choose Us"
            title="Why Travelers Choose Skywalks Holidays"
            subtitle="Four core pillars that set us apart as Nepal's leading travel agency."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHY_CHOOSE_US_PILLARS.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.title}
                  className="bg-[#f8fafc] rounded-3xl p-7 border border-[#e2e8f0] hover:bg-white hover:shadow-xl hover:border-[#0ea5e9]/40 transition-all duration-300 text-left group"
                >
                  <div className={`w-14 h-14 rounded-2xl ${pillar.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <Icon size={26} />
                  </div>
                  <h3 className="text-lg font-bold text-[#0a1628] mb-3 group-hover:text-[#0ea5e9] transition-colors">
                    {pillar.title}
                  </h3>
                  <p className="text-sm text-[#64748b] leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Our Services Grid */}
      <section id="our-services" className="section-padding bg-[#f8fafc]">
        <div className="container-custom">
          <SectionHeader
            eyebrow="Full Range of Services"
            title="Comprehensive Travel Solutions"
            subtitle="Explore our 8 specialized services designed for seamless individual, family, and group travel."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SERVICES_GRID.map((s) => {
              const Icon = s.icon;
              return (
                <Link
                  key={s.name}
                  href={s.href}
                  className="bg-white rounded-2xl p-5 border border-[#e2e8f0] shadow-sm hover:shadow-lg hover:border-[#0ea5e9] transition-all flex items-center gap-4 group text-left"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#e0f2fe] text-[#0ea5e9] flex items-center justify-center shrink-0 group-hover:bg-[#0ea5e9] group-hover:text-white transition-colors">
                    <Icon size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#0a1628] text-sm group-hover:text-[#0ea5e9] transition-colors">
                      {s.name}
                    </h3>
                    <span className="text-xs text-[#94a3b8] flex items-center gap-1 mt-0.5 group-hover:text-[#0ea5e9]">
                      Learn More →
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. Meet Our Team */}
      <section id="our-team" className="section-padding bg-white border-t border-slate-100">
        <div className="container-custom">
          <SectionHeader
            eyebrow="Our Dedicated Professionals"
            title="Meet Our Team"
            subtitle="The experienced travel professionals behind every seamless journey and unforgettable holiday."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
            {TEAM_MEMBERS.map((member) => (
              <div
                key={member.name}
                className={`w-full bg-white rounded-3xl p-5 sm:p-6 border transition-all duration-300 group flex flex-col justify-between ${
                  member.isLead
                    ? "border-[#0ea5e9]/60 shadow-xl shadow-sky-500/10 ring-2 ring-[#0ea5e9]/25 hover:border-[#0ea5e9] hover:shadow-2xl"
                    : "border-[#e2e8f0] shadow-md hover:shadow-xl hover:border-[#0ea5e9]/40"
                }`}
              >
                <div>
                  {/* Portrait Image with Badges */}
                  <div className="relative w-full aspect-[4/5] sm:aspect-[3/4] overflow-hidden rounded-2xl bg-slate-100 mb-5 shadow-sm">
                    <Image
                      src={member.image}
                      alt={`${member.name} - ${member.role} at Skywalks Holidays`}
                      fill
                      className="object-cover object-top brightness-[1.04] contrast-[1.02] group-hover:scale-105 transition-all duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 380px"
                    />
                    <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

                    {/* Top Department Badge */}
                    <div className="absolute top-3.5 left-3.5 z-10">
                      <span
                        className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1 rounded-full border backdrop-blur-md shadow-sm ${
                          member.isLead
                            ? "bg-slate-950/90 text-amber-300 border-amber-400/30"
                            : "text-white bg-slate-900/80 border-white/20"
                        }`}
                      >
                        {member.isLead ? (
                          <Crown size={12} className="text-amber-400" />
                        ) : (
                          <Sparkles size={12} className="text-[#0ea5e9]" />
                        )}
                        {member.department}
                      </span>
                    </div>

                    {/* Bottom Overlay Info */}
                    <div className="absolute bottom-4 left-4 right-4 text-white z-10 text-left">
                      <h3 className="text-xl sm:text-2xl font-black leading-tight text-white drop-shadow-sm">
                        {member.name}
                      </h3>
                      <p className="text-xs sm:text-sm font-bold text-sky-300 mt-1">
                        {member.role}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Direct Connect Buttons */}
                <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-2">
                  <a
                    href={`https://wa.me/${member.whatsapp}?text=${encodeURIComponent(
                      `Namaste ${member.name}! I would like to inquire about flight tickets and holiday packages.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs transition-colors shadow-sm shadow-emerald-500/20"
                  >
                    <MessageSquare size={13} />
                    <span>WhatsApp</span>
                  </a>
                  <a
                    href={`tel:${member.phone}`}
                    className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-[#0ea5e9] text-white font-bold text-xs transition-colors"
                  >
                    <Phone size={13} />
                    <span>Call Desk</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Customer Trust & Accreditations */}
      <section id="trust" className="section-padding bg-slate-50/60">
        <div className="container-custom">
          <SectionHeader
            eyebrow="Customer Trust &amp; Credentials"
            title="Certified, Accredited &amp; Rated 4.9/5"
            subtitle="Recognized by tourism authorities and trusted by over 1500+ happy travelers."
          />

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto">
            {[
              { title: "IATA Certified", detail: "Authorized ticketing agent" },
              { title: "NTB Licensed", detail: "Nepal Tourism Board registered" },
              { title: "TAAN Member", detail: "Trekking Agencies Association" },
              { title: "4.9 ★ Customer Rating", detail: "Verified reviews across platforms" },
            ].map((badge) => (
              <div key={badge.title} className="bg-[#f8fafc] rounded-2xl p-6 border border-[#e2e8f0] text-center">
                <div className="text-lg font-bold text-[#0a1628] mb-1">{badge.title}</div>
                <div className="text-xs text-[#64748b]">{badge.detail}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Contact CTA Banner */}
      <CTABanner
        title="Ready for Your Next Great Adventure?"
        subtitle="Let our experienced travel team design your perfect itinerary. Contact us today."
        primaryLabel="Plan Your Journey With Us"
        primaryHref="/services/custom"
        secondaryLabel="Contact Us"
        secondaryHref="/contact"
      />
    </>
  );
}
