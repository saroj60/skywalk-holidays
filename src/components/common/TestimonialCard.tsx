"use client";

import React from "react";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface TestimonialCardProps {
  name: string;
  location?: string;
  role?: string;
  rating: number;
  text?: string;
  content?: string;
  avatar: string;
  package: string;
  index?: number;
}

export default function TestimonialCard({
  name,
  location,
  role,
  rating,
  text,
  content,
  avatar,
  package: pkg,
  index = 0,
}: TestimonialCardProps) {
  const displayLocation = location || role || "Traveler";
  const displayText = text || content || "";
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
      whileHover={{ y: -6, transition: { duration: 0.25 } }}
      className="bg-white rounded-2xl p-6 border border-[#e2e8f0] shadow-sm hover:shadow-xl hover:border-sky-300/60 transition-all duration-300 flex flex-col h-full text-left group"
    >
      {/* Quote icon */}
      <div className="w-10 h-10 rounded-xl bg-[#e0f2fe] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shadow-sm">
        <Quote size={18} className="text-[#0ea5e9]" />
      </div>

      {/* Stars */}
      <div className="flex gap-0.5 mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={14}
            className={
              i < rating
                ? "text-amber-400 fill-amber-400"
                : "text-[#e2e8f0] fill-[#e2e8f0]"
            }
          />
        ))}
      </div>

      {/* Text */}
      <p className="text-sm text-[#475569] leading-relaxed flex-1 italic">
        &ldquo;{displayText}&rdquo;
      </p>

      {/* Package tag */}
      <div className="mt-4 mb-5">
        <span className="text-xs text-[#0ea5e9] bg-[#e0f2fe] px-2.5 py-1 rounded-full font-medium">
          {pkg}
        </span>
      </div>

      {/* Author */}
      <div className="flex items-center gap-3 pt-4 border-t border-[#f1f5f9]">
        <Avatar className="w-10 h-10 ring-2 ring-sky-100">
          <AvatarFallback className="bg-[#0ea5e9] text-white font-bold text-sm">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold text-[#0a1628] text-sm group-hover:text-[#0ea5e9] transition-colors">{name}</p>
          <p className="text-xs text-[#94a3b8]">{displayLocation}</p>
        </div>
      </div>
    </motion.div>
  );
}
