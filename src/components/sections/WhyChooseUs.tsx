"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Headphones,
  CreditCard,
  Award,
  Clock,
  Globe,
} from "lucide-react";
import SectionHeader from "@/components/common/SectionHeader";

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "100% Secure Booking",
    description:
      "Your payments and personal data are fully protected with bank-grade security.",
    color: "text-emerald-500 bg-emerald-50",
  },
  {
    icon: Headphones,
    title: "24/7 Expert Support",
    description:
      "Our travel experts are available round the clock to assist you anytime.",
    color: "text-[#0ea5e9] bg-[#e0f2fe]",
  },
  {
    icon: CreditCard,
    title: "Best Price Guarantee",
    description:
      "We match any lower price you find. No hidden charges, no surprises.",
    color: "text-[#f97316] bg-[#fff7ed]",
  },
  {
    icon: Award,
    title: "Award Winning Service",
    description:
      "Recognized as Nepal's top travel agency for 5 consecutive years.",
    color: "text-amber-500 bg-amber-50",
  },
  {
    icon: Clock,
    title: "Quick Visa Processing",
    description:
      "Fast-track visa assistance for 50+ countries with high success rates.",
    color: "text-violet-500 bg-violet-50",
  },
  {
    icon: Globe,
    title: "80+ Global Destinations",
    description:
      "From Nepal's peaks to European capitals — we cover the world for you.",
    color: "text-[#0a1628] bg-[#e8edf5]",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="section-padding relative overflow-hidden">
      {/* Ambient sky glow */}
      <div className="absolute bottom-0 left-1/3 w-[550px] h-[550px] bg-sky-200/35 rounded-full blur-[140px] pointer-events-none" />
      <div className="container-custom relative z-10">
        <SectionHeader
          eyebrow="Why Skywalks Holidays"
          title="Travel Smart, Travel with Confidence"
          subtitle="Thousands of travelers trust us every year. Here's why Skywalks Holidays is Nepal's preferred travel partner."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
                whileHover={{ y: -6, scale: 1.015, transition: { duration: 0.25 } }}
                className="flex gap-5 p-6 rounded-2xl bg-white border border-[#f1f5f9] hover:shadow-xl hover:border-sky-300/60 transition-all duration-300 group"
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${feature.color} transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6 shadow-sm`}
                >
                  <Icon size={22} />
                </div>
                <div>
                  <h3 className="font-bold text-[#0a1628] mb-2 group-hover:text-[#0ea5e9] transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-[#64748b] leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
