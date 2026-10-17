"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Plane, Hotel, Building2, Shield } from "lucide-react";

interface Partner {
  name: string;
  code: string;
  category: "Airline" | "Hotel";
  logo?: string;
  color: string;
  bgColor: string;
}

const PARTNERS: Partner[] = [
  {
    name: "Qatar Airways",
    code: "QR",
    category: "Airline",
    logo: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=200&q=80",
    color: "text-[#5C0632]",
    bgColor: "bg-[#5C0632]/10 border-[#5C0632]/20",
  },
  {
    name: "Emirates",
    code: "EK",
    category: "Airline",
    logo: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=200&q=80",
    color: "text-[#D71921]",
    bgColor: "bg-[#D71921]/10 border-[#D71921]/20",
  },
  {
    name: "Air Arabia",
    code: "G9",
    category: "Airline",
    logo: "https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?w=200&q=80",
    color: "text-[#E30613]",
    bgColor: "bg-[#E30613]/10 border-[#E30613]/20",
  },
  {
    name: "IndiGo",
    code: "6E",
    category: "Airline",
    logo: "https://images.unsplash.com/photo-1488085061387-422e29b40080?w=200&q=80",
    color: "text-[#001B94]",
    bgColor: "bg-[#001B94]/10 border-[#001B94]/20",
  },
  {
    name: "Nepal Airlines",
    code: "RA",
    category: "Airline",
    logo: "https://images.unsplash.com/photo-1517649763962-0c623266010b?w=200&q=80",
    color: "text-[#002B7F]",
    bgColor: "bg-[#002B7F]/10 border-[#002B7F]/20",
  },
  {
    name: "Singapore Airlines",
    code: "SQ",
    category: "Airline",
    logo: "https://images.unsplash.com/photo-1524592714635-d77511a4834d?w=200&q=80",
    color: "text-[#00266B]",
    bgColor: "bg-[#00266B]/10 border-[#00266B]/20",
  },
  {
    name: "Thai Airways",
    code: "TG",
    category: "Airline",
    logo: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=200&q=80",
    color: "text-[#4A154B]",
    bgColor: "bg-[#4A154B]/10 border-[#4A154B]/20",
  },
  {
    name: "Buddha Air",
    code: "U4",
    category: "Airline",
    logo: "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=200&q=80",
    color: "text-[#1E3A8A]",
    bgColor: "bg-[#1E3A8A]/10 border-[#1E3A8A]/20",
  },
  {
    name: "Marriott Hotels",
    code: "MAR",
    category: "Hotel",
    logo: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&q=80",
    color: "text-[#B30000]",
    bgColor: "bg-[#B30000]/10 border-[#B30000]/20",
  },
  {
    name: "Hilton Hotels",
    code: "HLT",
    category: "Hotel",
    logo: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=200&q=80",
    color: "text-[#002663]",
    bgColor: "bg-[#002663]/10 border-[#002663]/20",
  },
];

export default function PartnersStrip() {
  const [failedLogos, setFailedLogos] = useState<Record<string, boolean>>({});

  const handleError = (partnerName: string) => {
    setFailedLogos((prev) => ({ ...prev, [partnerName]: true }));
  };

  return (
    <section className="py-12 bg-white border-t border-b border-[#e2e8f0]">
      <div className="container-custom">
        <p className="text-center text-xs font-extrabold tracking-[0.25em] uppercase text-[#94a3b8] mb-8">
          Our Trusted Airlines &amp; Hospitality Partners
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 md:gap-8">
          {PARTNERS.map((partner, idx) => {
            const hasFailed = failedLogos[partner.name];

            return (
              <motion.div
                key={partner.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: idx * 0.05, ease: "easeOut" }}
                whileHover={{ y: -4, scale: 1.03, transition: { duration: 0.2 } }}
                className="group relative flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-[#f8fafc] border border-[#e2e8f0] hover:border-[#0ea5e9]/40 hover:bg-white hover:shadow-lg transition-all duration-300 cursor-pointer select-none"
              >
                {/* Logo Image or Code Badge */}
                <div className="relative w-9 h-9 rounded-xl overflow-hidden bg-white border border-[#e2e8f0] shadow-xs flex items-center justify-center shrink-0">
                  {partner.logo && !hasFailed ? (
                    <Image
                      src={partner.logo}
                      alt={`${partner.name} logo`}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={() => handleError(partner.name)}
                      sizes="36px"
                    />
                  ) : (
                    <span className={`font-mono font-extrabold text-xs ${partner.color}`}>
                      {partner.code}
                    </span>
                  )}
                </div>

                {/* Partner Name & Category */}
                <div className="text-left">
                  <span className="font-extrabold text-[#0a1628] text-xs sm:text-sm block leading-snug group-hover:text-[#0ea5e9] transition-colors">
                    {partner.name}
                  </span>
                  <span className="text-[10px] text-[#94a3b8] font-semibold uppercase tracking-wider block">
                    {partner.category}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
