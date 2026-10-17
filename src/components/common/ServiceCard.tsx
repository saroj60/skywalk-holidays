"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { LucideIcon, ArrowRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
  image: string;
  ctaText?: string;
  badge?: string;
  perks?: string[];
  accentGradient?: string;
  index?: number;
  className?: string;
}

export default function ServiceCard({
  icon: Icon,
  title,
  description,
  href,
  image,
  ctaText = "Explore Service",
  badge,
  perks,
  accentGradient = "from-[#0ea5e9] to-[#0284c7]",
  index = 0,
  className,
}: ServiceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
      whileHover={{ y: -8 }}
      className={cn(
        "group relative bg-white/95 backdrop-blur-sm rounded-3xl overflow-hidden border border-slate-200/90 hover:border-sky-400/60 shadow-md hover:shadow-2xl hover:shadow-sky-500/15 transition-all duration-300 flex flex-col h-full",
        className
      )}
    >
      {/* Top Image Banner */}
      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-900">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110 opacity-90 group-hover:opacity-100"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* Subtle Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628]/85 via-black/25 to-transparent" />

        {/* Top-Right Badge Pill */}
        {badge && (
          <div className="absolute top-3.5 right-3.5 bg-white/95 backdrop-blur-md text-[#0a1628] text-[11px] font-extrabold px-3 py-1 rounded-full shadow-lg border border-white/60">
            {badge}
          </div>
        )}

        {/* Floating Gradient Icon Badge */}
        <div
          className={cn(
            "absolute -bottom-6 left-5 sm:left-6 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr text-white shadow-xl ring-4 ring-white flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3",
            accentGradient
          )}
        >
          <Icon size={24} className="sm:w-7 sm:h-7 drop-shadow-sm" />
        </div>
      </div>

      {/* Card Body */}
      <div className="pt-8 p-5 sm:pt-9 sm:p-6 flex flex-col flex-1 justify-between text-left">
        <div>
          <h3 className="text-xl sm:text-2xl font-black text-[#0a1628] mb-2 group-hover:text-[#0ea5e9] transition-colors leading-snug">
            {title}
          </h3>
          <p className="text-xs sm:text-sm text-[#64748b] leading-relaxed mb-4">
            {description}
          </p>

          {/* Micro-Perks / Key Features */}
          {perks && perks.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {perks.map((perk, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-700 bg-slate-100/90 px-2.5 py-1 rounded-lg border border-slate-200/60"
                >
                  <CheckCircle2 size={12} className="text-[#0ea5e9] shrink-0" />
                  <span>{perk}</span>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Magnetic Interactive CTA Button */}
        <div>
          <Link
            href={href}
            className="group/btn w-full flex items-center justify-between px-4 sm:px-5 py-3 sm:py-3.5 rounded-2xl bg-slate-50 hover:bg-[#0a1628] text-[#0a1628] hover:text-white border border-slate-200 hover:border-[#0a1628] font-bold text-xs sm:text-sm transition-all duration-300 shadow-sm hover:shadow-lg"
          >
            <span>{ctaText}</span>
            <div className="w-8 h-8 rounded-full bg-white group-hover/btn:bg-[#0ea5e9] text-[#0a1628] group-hover/btn:text-white flex items-center justify-center transition-all duration-300 shadow-sm shrink-0">
              <ArrowRight size={14} className="group-hover/btn:translate-x-0.5 transition-transform" />
            </div>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
