import React from "react";
import { Metadata } from "next";
import Image from "next/image";
import { Phone, Mail, MapPin, Clock, MessageSquare, Headset, ExternalLink, ShieldCheck, CheckCircle2 } from "lucide-react";
import SectionHeader from "@/components/common/SectionHeader";
import CTABanner from "@/components/common/CTABanner";
import ContactInquiryForm from "@/components/forms/ContactInquiryForm";
import { COMPANY } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contact Skywalk Holidays | Travel Agency in Pepsicola, Kathmandu, Nepal",
  description:
    "Get in touch with Skywalk Holidays Kathmandu. Call +977 971-4491103, chat on WhatsApp, or visit our office in Pepsicola, Kathmandu for international tour packages, flight bookings & visa assistance.",
  keywords: [
    "contact skywalk holidays",
    "travel agency in pepsicola kathmandu",
    "tour and travel company in nepal contact number",
    "kathmandu travel agency phone number",
    "skywalk tours and travels contact",
  ],
  alternates: {
    canonical: "https://skywalkholidays.com/contact",
  },
  openGraph: {
    title: "Contact Skywalk Holidays | Premier Tour & Travel Company in Nepal",
    description: "Visit our office in Pepsicola, Kathmandu or call +977 971-4491103 for instant tour, flight & visa consultations.",
    url: "https://skywalkholidays.com/contact",
    siteName: "Skywalk Holidays Nepal",
    images: [
      {
        url: "https://skywalkholidays.com/images/contact-hero-banner.png",
        width: 1280,
        height: 600,
        alt: "Contact Skywalk Holidays Kathmandu",
      },
    ],
    type: "website",
  },
};

const CONTACT_CHANNELS = [
  {
    icon: Phone,
    title: "Call Now",
    value: "971-4491103",
    subtitle: "+977 971-4491103",
    desc: "Instant telephone bookings",
    href: `tel:${COMPANY.mobile}`,
    color: "bg-[#e0f2fe] text-[#0ea5e9]",
  },
  {
    icon: MessageSquare,
    title: "WhatsApp Chat",
    value: "Chat Online",
    subtitle: "+977 971-4491103",
    desc: "Fast quotes & customized tours",
    href: "https://wa.me/9779714491103",
    color: "bg-[#f0fdf4] text-emerald-600",
    isExternal: true,
  },
  {
    icon: MapPin,
    title: "Visit Office",
    value: "Pepsicola",
    subtitle: "Kathmandu, Nepal",
    desc: "Open Mon-Sat 10:00 AM - 6:00 PM",
    href: "https://maps.app.goo.gl/cSd8z1m3BnbegeSY6",
    color: "bg-[#fff7ed] text-[#f97316]",
    isExternal: true,
  },
  {
    icon: Mail,
    title: "Official Email",
    value: "Send Email",
    subtitle: "skywalktoursandtravels32@...",
    desc: "Response within 2 hours",
    href: `mailto:${COMPANY.email}`,
    color: "bg-[#faf5ff] text-purple-600",
  },
];

/* Social Media SVGs */
const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);
const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);
const YoutubeIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.96-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white" />
  </svg>
);
const XIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const SOCIAL_LINKS = [
  { icon: FacebookIcon, href: "https://www.facebook.com/p/SkyWalk-Holidays-61569789310239/", label: "Facebook" },
  { icon: InstagramIcon, href: "#", label: "Instagram" },
  { icon: YoutubeIcon, href: "#", label: "YouTube" },
  { icon: XIcon, href: "#", label: "X (Twitter)" },
];

export default function ContactPage() {
  return (
    <>
      {/* Hero Section (Proportionally matching About Page hero) */}
      <section className="relative w-full overflow-hidden bg-[#0a1628]">
        <div className="relative w-full min-h-[320px] sm:min-h-[380px] md:min-h-[440px] lg:min-h-[480px] flex items-center justify-center">
          {/* Background Travel Collage Banner Image */}
          <Image
            src="/images/contact-hero-banner.png"
            alt="Contact Skywalks Holidays — 24/7 Travel Assistance"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          {/* Multi-layer atmospheric gradients ensuring high contrast and landmark illumination */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a1628]/92 via-[#0a1628]/70 to-[#0a1628]/85" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628]/90 via-transparent to-[#0a1628]/50" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400/15 via-transparent to-transparent" />

          <div className="container-custom relative z-10 text-center max-w-4xl mx-auto py-12 sm:py-16 pb-20 sm:pb-28">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-1.5 mb-4 sm:mb-5 shadow-lg">
              <Headset size={15} className="text-[#0ea5e9]" />
              <span className="text-white text-xs font-bold tracking-wider uppercase">
                24/7 Travel Assistance &amp; Booking Support
              </span>
            </div>

            {/* Hero Title */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight mb-3 sm:mb-4 leading-tight drop-shadow-md text-white">
              Get In Touch{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0ea5e9] via-[#38bdf8] to-white">
                With Us.
              </span>
            </h1>

            {/* Hero Subtitle */}
            <p className="text-white/90 text-xs sm:text-base md:text-lg leading-relaxed max-w-2xl mx-auto font-medium drop-shadow mb-5 sm:mb-6 px-2">
              Have a question or ready to plan your next dream vacation? Our travel specialists in Kathmandu are here to assist you every step of the way.
            </p>

            {/* Micro Trust Pills */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm font-semibold text-slate-200">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={16} className="text-[#0ea5e9]" />
                Instant WhatsApp Quote
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={16} className="text-emerald-400" />
                Free Vacation Advice
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={16} className="text-[#f97316]" />
                24/7 Emergency Support
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Floating 4-Card Contact Channels Strip (Mirroring About Page 4-card structure) */}
      <section className="relative z-20 -mt-10 sm:-mt-14 md:-mt-16 pb-8 px-4">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {CONTACT_CHANNELS.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.title}
                  href={item.href}
                  target={item.isExternal ? "_blank" : undefined}
                  rel={item.isExternal ? "noopener noreferrer" : undefined}
                  className="bg-white rounded-3xl p-5 sm:p-6 border border-[#e2e8f0] shadow-xl text-center group hover:border-[#0ea5e9] hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 flex flex-col items-center justify-between cursor-pointer"
                >
                  <div
                    className={`w-11 h-11 rounded-2xl ${item.color} flex items-center justify-center mb-3 shadow-sm group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon size={20} />
                  </div>
                  <div className="text-lg sm:text-xl md:text-2xl font-black text-[#0a1628] group-hover:text-[#0ea5e9] transition-colors mb-0.5 tracking-tight">
                    {item.title}
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-[#334155] mb-1 truncate max-w-full">
                    {item.subtitle}
                  </div>
                  <div className="text-[11px] text-[#94a3b8] line-clamp-1">
                    {item.desc}
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main 2-Column Contact Section */}
      <section className="section-padding pt-6 md:pt-10 bg-[#f8fafc]">
        <div className="container-custom">
          <SectionHeader
            eyebrow="Contact &amp; Inquiry"
            title="We Are Here To Help You Travel"
            subtitle="Reach out via phone, email, WhatsApp, or send an inquiry through our form."
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* LEFT SIDE: Company & Business Information (5 cols) */}
            <div className="lg:col-span-5 space-y-6 text-left">
              {/* Office Address Card */}
              <div className="bg-white rounded-3xl p-6 border border-[#e2e8f0] shadow-sm space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#f0fdf4] text-emerald-600 flex items-center justify-center shrink-0">
                    <MapPin size={22} />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#0a1628] text-base">Office Address</h3>
                    <p className="text-xs text-[#64748b]">Headquarters in Kathmandu</p>
                  </div>
                </div>
                <div className="text-sm text-[#475569] leading-relaxed pl-1">
                  <strong>Skywalks Holidays Pvt. Ltd.</strong><br />
                  Pepsicola, Kathmandu, Nepal, 44600
                </div>
              </div>

              {/* Phone & WhatsApp Card */}
              <div className="bg-white rounded-3xl p-6 border border-[#e2e8f0] shadow-sm space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#e0f2fe] text-[#0ea5e9] flex items-center justify-center shrink-0">
                    <Phone size={22} />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#0a1628] text-base">Phone &amp; WhatsApp</h3>
                    <p className="text-xs text-[#64748b]">Direct booking lines</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-[#475569] pl-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#0a1628]">WhatsApp:</span>
                    <a href="https://wa.me/9779714491103" target="_blank" rel="noopener noreferrer" className="text-emerald-600 font-bold hover:underline">
                      +977 971-4491103
                    </a>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#0a1628]">Phone Line:</span>
                    <a href="tel:9714491103" className="text-[#0ea5e9] font-bold hover:underline">
                      971-4491103
                    </a>
                  </div>
                </div>
              </div>

              {/* Email Card */}
              <div className="bg-white rounded-3xl p-6 border border-[#e2e8f0] shadow-sm space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#fff7ed] text-[#f97316] flex items-center justify-center shrink-0">
                    <Mail size={22} />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#0a1628] text-base">Email Address</h3>
                    <p className="text-xs text-[#64748b]">Official agency inbox</p>
                  </div>
                </div>
                <div className="space-y-1.5 text-sm text-[#475569] pl-1">
                  <div>
                    <a href="mailto:skywalktoursandtravels32@gmail.com" className="text-[#0ea5e9] font-bold hover:underline break-all">
                      skywalktoursandtravels32@gmail.com
                    </a>
                  </div>
                </div>
              </div>

              {/* Business Hours & Reviews Card */}
              <div className="bg-white rounded-3xl p-6 border border-[#e2e8f0] shadow-sm space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#faf5ff] text-purple-600 flex items-center justify-center shrink-0">
                    <Clock size={22} />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#0a1628] text-base">Business Hours &amp; Rating</h3>
                    <p className="text-xs text-[#64748b]">24/7 Availability</p>
                  </div>
                </div>
                <div className="space-y-2 text-xs md:text-sm text-[#475569] pl-1">
                  <div className="flex justify-between border-b border-[#f1f5f9] pb-1.5">
                    <span className="font-semibold text-[#0a1628]">Working Hours:</span>
                    <span className="font-bold text-emerald-600">Always Open</span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="font-semibold text-[#0a1628]">Customer Reviews:</span>
                    <span className="font-bold text-amber-500">100% Recommend (8 Reviews)</span>
                  </div>
                </div>
              </div>

              {/* Social Media Links */}
              <div className="bg-white rounded-3xl p-6 border border-[#e2e8f0] shadow-sm">
                <h3 className="font-bold text-[#0a1628] text-sm uppercase tracking-wider mb-4">
                  Follow Us On Social Media
                </h3>
                <div className="flex flex-wrap gap-3">
                  {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="w-11 h-11 rounded-2xl bg-[#f8fafc] border border-[#e2e8f0] flex items-center justify-center text-[#0a1628] hover:bg-[#0ea5e9] hover:text-white hover:border-[#0ea5e9] transition-all duration-200"
                    >
                      <Icon />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT SIDE: Contact Inquiry Form (7 cols) */}
            <div className="lg:col-span-7">
              <ContactInquiryForm />
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Travel Support CTA */}
      <section className="py-10 bg-[#0a1628] text-white">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white/10 p-8 rounded-3xl border border-white/15">
            <div className="flex items-center gap-4 text-left">
              <div className="w-14 h-14 rounded-2xl bg-[#f97316] text-white flex items-center justify-center shrink-0 shadow-lg">
                <Headset size={28} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Need 24/7 Emergency Travel Support?</h3>
                <p className="text-white/70 text-xs sm:text-sm mt-0.5">
                  Currently traveling and need immediate rebooking, flight changes, or transit assistance?
                </p>
              </div>
            </div>
            <a
              href="tel:9714491103"
              className="inline-flex items-center gap-2 bg-[#f97316] hover:bg-[#ea580c] text-white font-extrabold px-6 py-3.5 rounded-2xl shadow-xl transition-all text-sm shrink-0"
            >
              <Phone size={18} />
              Call Helpline: 971-4491103
            </a>
          </div>
        </div>
      </section>

      {/* Google Maps Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <SectionHeader
            eyebrow="Visit Our Office"
            title="Locate Skywalks Holidays in Kathmandu"
            subtitle="We welcome you to visit our office in Pepsicola, Kathmandu for in-person travel consultations."
          />

          <div className="bg-[#f8fafc] rounded-3xl overflow-hidden border border-[#e2e8f0] p-3 sm:p-4 shadow-xl">
            <div className="relative h-80 sm:h-[420px] w-full rounded-2xl overflow-hidden border border-[#e2e8f0] shadow-inner bg-slate-100">
              {/* Interactive Google Map iframe */}
              <iframe
                src="https://maps.google.com/maps?q=Pepsicola,%20Kathmandu,%20Nepal&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Skywalks Holidays Pepsicola Office Map"
                className="w-full h-full rounded-2xl"
              />

              {/* Floating Location Information Badge */}
              <div className="absolute top-4 left-4 z-10 bg-[#0a1628]/95 backdrop-blur-md text-white p-4 rounded-2xl border border-white/20 shadow-2xl max-w-xs text-left hidden sm:block">
                <div className="flex items-center gap-1.5 text-[#38bdf8] text-xs font-bold uppercase tracking-wider mb-1">
                  <MapPin size={14} className="text-[#f97316]" />
                  <span>Headquarters</span>
                </div>
                <h4 className="font-bold text-white text-base">Skywalks Holidays</h4>
                <p className="text-white/80 text-xs mt-1 leading-relaxed">
                  Pepsicola, Kathmandu, Nepal, 44600
                </p>
                <div className="mt-3 pt-2.5 border-t border-white/15 flex items-center gap-2 text-[11px] text-emerald-400 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Always Open (24/7 Service)</span>
                </div>
              </div>

              {/* Direct Link Button */}
              <div className="absolute bottom-4 right-4 z-10">
                <a
                  href="https://maps.app.goo.gl/cSd8z1m3BnbegeSY6"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#0ea5e9] hover:bg-[#0284c7] text-white font-extrabold px-5 py-3 rounded-xl shadow-2xl transition-all duration-300 text-xs sm:text-sm hover:scale-105 border border-white/30"
                >
                  <MapPin size={16} />
                  <span>Open in Google Maps App</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <CTABanner
        title="Prefer Personal Assistance Over Phone or WhatsApp?"
        subtitle="Our travel specialists are available 24/7 to help you plan your dream journey."
        primaryLabel="Plan Your Trip"
        primaryHref="/services/custom"
        secondaryLabel="WhatsApp Us Now"
        secondaryHref="https://wa.me/9779714491103"
      />
    </>
  );
}
