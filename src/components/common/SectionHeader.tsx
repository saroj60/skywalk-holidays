"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
  light?: boolean;
  className?: string;
}

export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
  centered = true,
  light = false,
  className,
}: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={cn(centered && "text-center", "mb-12", className)}
    >
      {eyebrow && (
        <motion.span
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="inline-block text-xs font-bold tracking-[0.2em] uppercase text-[#0ea5e9] bg-[#e0f2fe] px-3.5 py-1.5 rounded-full mb-3 shadow-sm border border-sky-200/50"
        >
          {eyebrow}
        </motion.span>
      )}
      <motion.h2
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55, delay: 0.15 }}
        className={cn(
          "text-3xl md:text-4xl lg:text-[42px] font-extrabold leading-tight tracking-tight",
          light ? "text-white" : "text-[#0a1628]"
        )}
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.22 }}
          className={cn(
            "mt-4 text-base md:text-lg leading-relaxed max-w-2xl font-normal",
            centered && "mx-auto",
            light ? "text-white/80" : "text-[#64748b]"
          )}
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
}
