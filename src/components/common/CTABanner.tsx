"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight } from "lucide-react";

interface CTABannerProps {
  title?: string;
  subtitle?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  bgImage?: string;
}

export default function CTABanner({
  title = "Ready for Your Dream Vacation?",
  subtitle = "Let our travel experts craft the perfect itinerary for you. Personalized, affordable, unforgettable.",
  primaryLabel = "Plan My Trip",
  primaryHref = "/services/custom",
  secondaryLabel = "Talk to an Expert",
  secondaryHref = "/contact",
  bgImage = "/images/cta-tropical-beach-swing.jpg",
}: CTABannerProps) {
  return (
    <section className="relative overflow-hidden bg-[#0a1628]">
      {/* Background Image */}
      <Image
        src={bgImage}
        alt="Travel Background"
        fill
        className="object-cover object-center scale-105"
        sizes="100vw"
      />

      {/* Light Overlay for clear image visibility & text contrast */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0a1628]/70 via-[#0a1628]/45 to-[#0a1628]/70" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a1628]/45 via-transparent to-[#0a1628]/75" />

      <div className="relative container-custom py-20 text-center z-10">
        {/* Animated Floating Icon */}
        <motion.div
          animate={{ y: [0, -7, 0] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
          className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/25 mb-6 mx-auto shadow-2xl"
        >
          <Sparkles size={24} className="text-[#f97316]" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-5 max-w-3xl mx-auto leading-tight drop-shadow-md tracking-tight"
        >
          {title}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
          className="text-white/90 text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed font-medium drop-shadow"
        >
          {subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, delay: 0.25, ease: "easeOut" }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.98 }}>
            <Button size="xl" asChild className="bg-[#f97316] hover:bg-[#ea580c] shadow-2xl shadow-orange-500/40 text-white font-extrabold text-base py-3.5 px-8 rounded-full">
              <Link href={primaryHref} className="flex items-center gap-2">
                <span>{primaryLabel}</span>
                <ArrowRight size={18} />
              </Link>
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.98 }}>
            <Button size="xl" variant="outline-white" asChild className="bg-white/10 backdrop-blur-md border-white/35 hover:bg-white hover:text-[#0a1628] font-bold text-base py-3.5 px-7 rounded-full">
              <Link href={secondaryHref}>{secondaryLabel}</Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
