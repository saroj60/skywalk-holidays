import React from "react";
import { Metadata } from "next";
import Image from "next/image";
import { FileCheck, ShieldCheck, Clock, ArrowRight, ShieldAlert, CheckCircle2, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionHeader from "@/components/common/SectionHeader";
import CTABanner from "@/components/common/CTABanner";
import VisaInquiryForm from "@/components/forms/VisaInquiryForm";
import IatsVisaGuideBook from "@/components/visa/IatsVisaGuideBook";

export const metadata: Metadata = {
  title: "Visa Assistance Made Simple | Skywalks Holidays",
  description: "Expert guidance for your international travel documentation. Australia, Japan, South Korea, Canada, UK, USA, Schengen, Thailand, Malaysia.",
};

const VISA_CATEGORIES = [
  "Tourist Visa",
  "Student Visa",
  "Work Visa",
  "Business Visa",
  "Visit Visa",
] as const;

const VISA_COUNTRIES = [
  {
    name: "Australia",
    flag: "🇦🇺",
    image: "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=800&q=80",
    visaType: "Tourist (Subclass 600) / Student / Business",
    processingTime: "2 – 4 Weeks",
    description: "Complete document verification, bank statement guidance, Statement of Purpose (SOP) support, and online IMMI account filing.",
    assistanceInfo: "Includes biometrics appointment booking & health checkup guidance.",
  },
  {
    name: "Japan",
    flag: "🇯🇵",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80",
    visaType: "Short-Term Tourist / Business Visa",
    processingTime: "5 – 7 Business Days",
    description: "Official Japan embassy VFS document organization, itinerary drafting, and guarantee letter assistance.",
    assistanceInfo: "High approval rate with complete itinerary & hotel reservation support.",
  },
  {
    name: "South Korea",
    flag: "🇰🇷",
    image: "https://images.unsplash.com/photo-1538485399081-7191377e8241?w=800&q=80",
    visaType: "C-3-9 Tourist / Business / Work",
    processingTime: "5 – 7 Business Days",
    description: "KVAC (Korea Visa Application Center) application submission, tax clearance verification, and cover letter support.",
    assistanceInfo: "KVAC appointment scheduling and documentation check.",
  },
  {
    name: "Canada",
    flag: "🇨🇦",
    image: "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=800&q=80",
    visaType: "Temporary Resident Visa (TRV) / Student / Visit",
    processingTime: "2 – 8 Weeks",
    description: "GCKey online portal filing, financial proof structure, travel history documentation, and ties-to-home country evidence.",
    assistanceInfo: "VFS Biometrics appointment scheduling in Kathmandu.",
  },
  {
    name: "United Kingdom",
    flag: "🇬🇧",
    image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80",
    visaType: "Standard Visitor Visa / Student (Tier 4)",
    processingTime: "2 – 3 Weeks",
    description: "GOV.UK online form completion, document upload to VFS portal, financial sponsor proof, and appointment booking.",
    assistanceInfo: "Fast-track priority visa assistance available upon request.",
  },
  {
    name: "USA",
    flag: "🇺🇸",
    image: "https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=800&q=80",
    visaType: "B1/B2 Tourist & Business / F1 Student",
    processingTime: "3 – 6 Weeks (Appt dependent)",
    description: "DS-160 form filling, US embassy interview preparation, fee payment, and early interview slot tracking.",
    assistanceInfo: "Includes 1-on-1 mock interview preparation session.",
  },
  {
    name: "Singapore",
    flag: "🇸🇬",
    image: "/images/gallery/singapore-merlion-park-marina-bay.jpg",
    visaType: "Tourist & Business Entry Visa",
    processingTime: "3 – 5 Business Days",
    description: "ICA portal submission, invitation document verification, and complete SG arrival card guidance.",
    assistanceInfo: "High approval rate with authorized submission channel.",
  },
  {
    name: "Schengen Europe",
    flag: "🇪🇺",
    image: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800&q=80",
    visaType: "Short Stay Tourist (Type C) / Business",
    processingTime: "10 – 15 Business Days",
    description: "Comprehensive Schengen file preparation: flight itinerary, 4-star hotel vouchers, EUR 30,000 travel insurance & VFS appointment.",
    assistanceInfo: "Valid for 29 Schengen member countries across Europe.",
  },
  {
    name: "Thailand",
    flag: "🇹🇭",
    image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800&q=80",
    visaType: "Single Entry Tourist Visa / Visa on Arrival",
    processingTime: "1 – 3 Business Days",
    description: "VFS Thailand Kathmandu application filing, confirmed flight & hotel voucher issuance, and bank statement verification.",
    assistanceInfo: "Hassle-free 3-day turnaround with high approval guarantee.",
  },
  {
    name: "Malaysia",
    flag: "🇲🇾",
    image: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800&q=80",
    visaType: "eVISA Tourist & Business",
    processingTime: "1 – 3 Business Days",
    description: "Official Malaysia eVISA portal online application, photo formatting, flight booking & hotel voucher validation.",
    assistanceInfo: "100% online application without passport physical submission.",
  },
];

export default function VisaPage() {
  return (
    <>
      {/* 1. Hero Section */}
      <section className="relative py-20 md:py-28 text-white overflow-hidden bg-[#0a1628]">
        {/* Background Travel Banner Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/visa-hero-banner.png"
            alt="Visa Assistance & Worldwide Travel - Skywalk Holidays"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          {/* Multi-layer gradient overlays ensuring high contrast, readability, and seamless landmark visibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a1628]/90 via-[#0a1628]/70 to-[#0a1628]/85" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] via-transparent to-[#0a1628]/60" />
        </div>

        <div className="container-custom relative z-10 text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 mb-6">
            <FileCheck size={16} className="text-[#0ea5e9]" />
            <span className="text-white text-xs font-semibold tracking-wider uppercase">
              Certified Documentation &amp; Filing Desk
            </span>
          </div>

          {/* Hero Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
            Visa Assistance{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0ea5e9] via-[#38bdf8] to-white">
              Made Simple.
            </span>
          </h1>

          {/* Hero Subtitle */}
          <p className="text-white/80 text-base sm:text-xl leading-relaxed max-w-2xl mx-auto font-normal">
            Expert guidance for your international travel documentation. From Tourist and Student visas to Business permits — we make filing stress-free.
          </p>

          <div className="flex flex-wrap justify-center gap-3 mt-8">
            {["98% High Success Rate", "50+ Global Destinations", "1-on-1 Document Review", "VFS & Embassy Support"].map((item) => (
              <span key={item} className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/20 px-3.5 py-1.5 rounded-full text-xs text-white/90">
                <CheckCircle2 size={14} className="text-emerald-400" />
                {item}
              </span>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href="#iats-visa-guidebook"
              className="inline-flex items-center gap-2 bg-[#f97316] hover:bg-[#ea580c] text-white font-bold px-6 py-3 rounded-2xl text-xs sm:text-sm shadow-xl transition-transform hover:scale-105"
            >
              <GraduationCap size={18} />
              Open IATS 2026 Tourist Visa Guide Book (17 Countries)
            </a>
            <a
              href="#visa-form"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-3 rounded-2xl text-xs sm:text-sm border border-white/20 backdrop-blur-md transition-colors"
            >
              Book 1-on-1 Visa Consultation
            </a>
          </div>
        </div>
      </section>

      {/* Visa Categories Bar */}
      <section className="py-8 bg-white border-b border-[#e2e8f0]">
        <div className="container-custom">
          <p className="text-center text-xs font-bold uppercase tracking-widest text-[#94a3b8] mb-4">
            Visa Categories We Assist With
          </p>
          <div className="flex flex-wrap justify-center gap-2 md:gap-3">
            {VISA_CATEGORIES.map((cat) => (
              <span
                key={cat}
                className="px-5 py-2.5 rounded-2xl bg-[#f8fafc] border border-[#e2e8f0] text-xs md:text-sm font-bold text-[#0a1628] hover:border-[#0ea5e9] hover:text-[#0ea5e9] transition-all cursor-default"
              >
                🛂 {cat}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Institute for Aviation and Tourism Skills (IATS) 2026 Tourist Visa Guide Book */}
      <IatsVisaGuideBook />

      {/* 3. Country-Based Visa Service Cards */}
      <section className="section-padding bg-[#f8fafc]">
        <div className="container-custom">
          <SectionHeader
            eyebrow="Embassy &amp; eVisa Services"
            title="Visa Assistance Services By Country"
            subtitle="Explore visa processing requirements, documentation guidance, and timelines for your destination country."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {VISA_COUNTRIES.map((country) => (
              <div
                key={country.name}
                className="group bg-white rounded-3xl overflow-hidden border border-[#e2e8f0] shadow-sm hover:shadow-2xl hover:border-[#0ea5e9]/40 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between"
              >
                <div>
                  {/* Destination Header Image & Flag */}
                  <div className="relative h-48 w-full overflow-hidden bg-[#0a1628]">
                    <Image
                      src={country.image}
                      alt={country.name}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-110 opacity-90 group-hover:opacity-100"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                    {/* Flag & Name Overlay */}
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                      <div className="flex items-center gap-2">
                        <span className="text-3xl drop-shadow">{country.flag}</span>
                        <h3 className="text-2xl font-bold">{country.name}</h3>
                      </div>
                      <div className="flex items-center gap-1 bg-white/90 backdrop-blur-md text-[#0a1628] text-xs font-extrabold px-3 py-1 rounded-full shadow">
                        <Clock size={12} className="text-[#0ea5e9]" />
                        {country.processingTime}
                      </div>
                    </div>
                  </div>

                  {/* Card Details */}
                  <div className="p-6 text-left">
                    <div className="mb-3">
                      <span className="text-xs font-bold text-[#0ea5e9] bg-[#e0f2fe] px-3 py-1 rounded-full uppercase tracking-wider block w-max">
                        {country.visaType}
                      </span>
                    </div>

                    <p className="text-xs text-[#64748b] leading-relaxed mb-4">
                      {country.description}
                    </p>

                    <div className="p-3 bg-[#f8fafc] rounded-2xl border border-[#e2e8f0] text-xs text-[#475569] flex items-start gap-2 mb-4">
                      <ShieldCheck size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                      <span>{country.assistanceInfo}</span>
                    </div>
                  </div>
                </div>

                {/* Apply Now Button */}
                <div className="p-6 pt-0 border-t border-[#f1f5f9] mt-auto">
                  <Button
                    asChild
                    className="w-full justify-center bg-[#0a1628] hover:bg-[#163058] text-white font-bold rounded-xl py-3.5"
                  >
                    <a href="#visa-form">
                      Apply Now / Consultation
                      <ArrowRight size={16} />
                    </a>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Visa Inquiry Form Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <SectionHeader
            eyebrow="Request Assistance"
            title="Book Your Visa Consultation"
            subtitle="Fill out the form below to get exact document checklists, fee structure, and step-by-step guidance."
          />

          <VisaInquiryForm />
        </div>
      </section>

      {/* 4. Mandatory Disclaimer Banner */}
      <section className="py-8 bg-[#0a1628] text-white">
        <div className="container-custom">
          <div className="flex flex-col sm:flex-row items-center gap-4 bg-white/10 p-5 rounded-2xl border border-white/15 text-xs text-white/80">
            <ShieldAlert size={28} className="text-[#f97316] shrink-0" />
            <div>
              <strong className="text-white block mb-0.5 uppercase tracking-wider">Official Legal Disclaimer:</strong>
              Visa issuance and final approval are strictly subject to the sole decision and discretion of respective embassies, consulates, and immigration authorities. Skywalks Holidays provides professional documentation review, form preparation, appointment scheduling, and submission guidance.
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <CTABanner
        title="Need Urgent Visa Guidance?"
        subtitle="Our senior visa officers are available for express consultation on Australia, Schengen, UK & USA visas."
        primaryLabel="Call Visa Desk"
        primaryHref="tel:+97798XXXXXXXX"
        secondaryLabel="WhatsApp Us"
        secondaryHref="https://wa.me/977980000000"
      />
    </>
  );
}
