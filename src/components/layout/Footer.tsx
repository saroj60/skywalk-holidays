"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Plane, Phone, Mail, MapPin, Lock } from "lucide-react";
import { COMPANY, FOOTER_LINKS } from "@/lib/constants";
import { buildCustomWhatsAppLink } from "@/lib/whatsapp";

/* Inline SVG social icons (lucide-react doesn't ship brand icons) */
const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
  </svg>
);
const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);
const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);
const YoutubeIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.96-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white" />
  </svg>
);
const XIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export default function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer className="bg-[#0a1628] text-white">
      {/* WhatsApp Action Bar */}
      <div className="bg-gradient-to-r from-[#0ea5e9] via-[#0284c7] to-[#0a1628] border-b border-white/10">
        <div className="container-custom py-8 sm:py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                Planning a Trip? Talk With Our Travel Specialists
              </h3>
              <p className="text-white/80 text-sm mt-1 max-w-xl">
                Chat directly on WhatsApp for instant flight booking, custom holiday packages, visa assistance &amp; group discounts.
              </p>
            </div>
            <a
              href={buildCustomWhatsAppLink(
                `Hello ${COMPANY.name}! I am contacting you from your website for travel booking and assistance.`
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-[#25D366] hover:bg-[#20ba5a] text-white px-7 py-3.5 rounded-2xl font-bold text-sm sm:text-base shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 shrink-0 border border-white/25 cursor-pointer group"
            >
              <WhatsAppIcon />
              <span className="font-extrabold">Chat on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container-custom py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-5 group">
              <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-xl overflow-hidden shadow-md border border-white/20 group-hover:scale-105 group-hover:border-[#0ea5e9] transition-all shrink-0 bg-white p-0.5">
                <Image
                  src="/images/logo.png"
                  alt="SkyWalk Tours & Travels Logo"
                  fill
                  className="object-contain"
                  sizes="48px"
                />
              </div>
              <div>
                <span className="font-extrabold text-white text-lg leading-tight block group-hover:text-[#0ea5e9] transition-colors">
                  SkyWalk
                </span>
                <span className="text-[#0ea5e9] text-[10px] font-extrabold tracking-widest uppercase leading-none block mt-0.5">
                  Tours &amp; Travels
                </span>
              </div>
            </Link>
            <p className="text-[#94a3b8] text-sm leading-relaxed mb-5">
              {COMPANY.description} We make travel seamless, memorable, and accessible for everyone.
            </p>
            <div className="space-y-2">
              <a
                href={`tel:${COMPANY.mobile}`}
                className="flex items-center gap-2 text-sm text-[#94a3b8] hover:text-[#0ea5e9] transition-colors"
              >
                <Phone size={14} className="text-[#0ea5e9]" />
                {COMPANY.mobile}
              </a>
              <a
                href={`mailto:${COMPANY.email}`}
                className="flex items-center gap-2 text-sm text-[#94a3b8] hover:text-[#0ea5e9] transition-colors"
              >
                <Mail size={14} className="text-[#0ea5e9]" />
                {COMPANY.email}
              </a>
              <div className="flex items-start gap-2 text-sm text-[#94a3b8]">
                <MapPin size={14} className="text-[#0ea5e9] mt-0.5 shrink-0" />
                {COMPANY.address}
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-3 mt-6">
              {[
                { icon: FacebookIcon, href: "https://www.facebook.com/p/SkyWalk-Holidays-61569789310239/", label: "Facebook" },
                { icon: InstagramIcon, href: "#", label: "Instagram" },
                { icon: YoutubeIcon, href: "#", label: "YouTube" },
                { icon: XIcon, href: "#", label: "X (Twitter)" },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-[#94a3b8] hover:bg-[#0ea5e9] hover:text-white transition-all"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-white mb-5 text-sm uppercase tracking-wider">
              Our Services
            </h4>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.services.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#94a3b8] hover:text-[#0ea5e9] transition-colors flex items-center gap-2"
                  >
                    <span className="w-1 h-1 rounded-full bg-[#0ea5e9]" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-white mb-5 text-sm uppercase tracking-wider">
              Company
            </h4>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#94a3b8] hover:text-[#0ea5e9] transition-colors flex items-center gap-2"
                  >
                    <span className="w-1 h-1 rounded-full bg-[#0ea5e9]" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-white mb-5 text-sm uppercase tracking-wider">
              Support
            </h4>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.support.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#94a3b8] hover:text-[#0ea5e9] transition-colors flex items-center gap-2"
                  >
                    <span className="w-1 h-1 rounded-full bg-[#0ea5e9]" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Trust Badges */}
            <div className="mt-6 space-y-2">
              <div className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
                Certified & Trusted
              </div>
              <div className="flex flex-wrap gap-2">
                {["IATA Certified", "NTB Licensed", "TAAN Member"].map((badge) => (
                  <span
                    key={badge}
                    className="text-xs px-2.5 py-1 rounded-full border border-[#0ea5e9]/40 text-[#0ea5e9] bg-[#0ea5e9]/10"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container-custom py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[#64748b] text-center" suppressHydrationWarning>
            © {new Date().getFullYear()} {COMPANY.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-3 text-xs text-[#64748b]">
            <Link
              href="/login"
              className="hover:text-[#0ea5e9] transition-colors flex items-center gap-1 font-medium"
            >
              <Lock size={12} />
              <span>Staff Login</span>
            </Link>
            <span>•</span>
            <p>Made with ❤️ in Nepal</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
