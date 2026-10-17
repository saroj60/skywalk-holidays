"use client";

import React from "react";
import { motion } from "framer-motion";
import { TESTIMONIALS } from "@/lib/constants";
import TestimonialCard from "@/components/common/TestimonialCard";
import SectionHeader from "@/components/common/SectionHeader";

export default function Testimonials() {
  return (
    <section className="section-padding relative overflow-hidden">
      {/* Ambient sky glow */}
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-sky-200/35 rounded-full blur-[140px] pointer-events-none" />
      <div className="container-custom relative z-10">
        <SectionHeader
          eyebrow="Traveler Stories"
          title="What Our Customers Say"
          subtitle="Don't just take our word for it — hear from thousands of travelers who chose Skywalks Holidays."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {TESTIMONIALS.map((t, index) => (
            <TestimonialCard key={t.name} index={index} {...t} />
          ))}
        </div>

        {/* Rating summary bar */}
        <motion.div
          initial={{ opacity: 0, y: 25, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.55, delay: 0.25, ease: "easeOut" }}
          className="mt-12 bg-white rounded-3xl border border-[#e2e8f0] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-center gap-8 text-center sm:text-left shadow-lg shadow-sky-500/5 hover:border-sky-300/60 transition-all duration-300"
        >
          <div>
            <div className="text-5xl font-black text-[#0a1628] tracking-tight">4.9</div>
            <div className="flex justify-center sm:justify-start gap-1 my-1.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className="text-amber-400 text-xl">★</span>
              ))}
            </div>
            <div className="text-xs sm:text-sm font-semibold text-[#64748b]">Average Verified Rating</div>
          </div>
          <div className="w-px h-16 bg-[#e2e8f0] hidden sm:block" />
          <div className="grid grid-cols-3 gap-6 sm:gap-8">
            {[
              { label: "Google Reviews", value: "2,400+" },
              { label: "TripAdvisor", value: "1,800+" },
              { label: "Facebook", value: "3,200+" },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-2xl sm:text-3xl font-extrabold text-[#0a1628]">{s.value}</div>
                <div className="text-xs font-medium text-[#64748b] mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
