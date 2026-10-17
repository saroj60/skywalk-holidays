"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { STATS } from "@/lib/constants";
import { Sparkles } from "lucide-react";

function CounterItem({
  stat,
  index,
}: {
  stat: (typeof STATS)[0];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const [count, setCount] = useState(0);

  const targetValue =
    typeof stat.value === "number"
      ? stat.value
      : parseInt(String(stat.value).replace(/[^0-9]/g, ""), 10) || 0;

  useEffect(() => {
    if (!isInView || targetValue <= 0) return;

    let startTime: number | null = null;
    const duration = 2000; // 2 seconds

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // easeOutExpo
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(easeProgress * targetValue));

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setCount(targetValue);
      }
    };

    requestAnimationFrame(step);
  }, [isInView, targetValue]);

  const IconComponent = stat.icon || Sparkles;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay: index * 0.1, ease: "easeOut" }}
      whileHover={{ y: -6, scale: 1.02, transition: { duration: 0.25 } }}
      className="group relative bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-sky-500/40 rounded-3xl p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-sky-500/15 backdrop-blur-md overflow-hidden flex flex-col justify-between"
    >
      {/* Subtle card glow on hover */}
      <div className="absolute -top-20 -right-20 w-36 h-36 bg-gradient-to-br from-sky-400/20 to-blue-600/0 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500 pointer-events-none" />

      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-400/20 flex items-center justify-center text-sky-400 group-hover:scale-110 group-hover:bg-sky-500 group-hover:text-white transition-all duration-300 shadow-lg shadow-sky-500/10">
          <IconComponent className="w-6 h-6 transition-transform duration-300 group-hover:rotate-6" />
        </div>
        <Sparkles className="w-4 h-4 text-sky-400/40 group-hover:text-sky-400 transition-colors" />
      </div>

      <div>
        <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-1 flex items-baseline gap-0.5">
          <span>{isInView ? count.toLocaleString("en-US") : "0"}</span>
          <span className="text-sky-400 font-extrabold">{stat.suffix}</span>
        </div>
        <div className="text-xs sm:text-sm font-semibold text-slate-400 uppercase tracking-wider group-hover:text-slate-200 transition-colors">
          {stat.label}
        </div>
      </div>
    </motion.div>
  );
}

export default function StatsCounter() {
  return (
    <section className="relative bg-[#070e1b] py-16 md:py-20 overflow-hidden border-y border-white/10">
      {/* Background radial glow spots */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-sky-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="container-custom relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {STATS.map((stat, index) => (
            <CounterItem key={index} stat={stat} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
