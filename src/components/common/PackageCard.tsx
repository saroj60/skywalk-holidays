"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, Clock, MapPin, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface PackageCardProps {
  id: number | string;
  title: string;
  image: string;
  destination: string;
  duration: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  inclusions: string[];
  badge?: string;
  index?: number;
}

const badgeVariantMap: Record<string, "default" | "orange" | "navy" | "success" | "muted"> = {
  "Best Seller": "orange",
  "Top Rated": "orange",
  "Family Pick": "default",
  "New": "success",
  "Premium": "navy",
  "Best Value": "success",
  "Adventure": "default",
  "Culture": "muted",
};

export default function PackageCard({
  id,
  title,
  image,
  destination,
  duration,
  price,
  originalPrice,
  rating,
  reviews,
  inclusions,
  badge,
  index = 0,
}: PackageCardProps) {
  const discount = Math.round(((originalPrice - price) / originalPrice) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: "easeOut" }}
      whileHover={{ y: -8, transition: { duration: 0.25 } }}
      className="group relative bg-white rounded-2xl overflow-hidden border border-[#e2e8f0] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer"
    >
      {/* 100% Stretched Link covering the ENTIRE card area */}
      <Link href={`/packages/${id}`} className="absolute inset-0 z-10" aria-label={`View package details for ${title}`} />

      {/* Image */}
      <div className="relative h-52 overflow-hidden bg-[#0a1628] pointer-events-none">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          {badge ? (
            <Badge variant={badgeVariantMap[badge] || "default"}>{badge}</Badge>
          ) : (
            <div />
          )}
          {discount > 0 && (
            <span className="bg-[#f97316] text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">
              {discount}% OFF
            </span>
          )}
        </div>

        {/* Destination Chip */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full">
          <MapPin size={12} className="text-[#0ea5e9]" />
          <span>{destination}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 flex flex-col flex-1">
        {/* Rating and Duration */}
        <div className="flex items-center justify-between text-xs text-[#64748b] mb-2">
          <div className="flex items-center gap-1">
            <Star size={13} className="text-amber-400 fill-amber-400" />
            <span className="font-bold text-[#0a1628]">{rating}</span>
            <span>({reviews})</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={13} />
            <span>{duration}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-bold text-[#0a1628] text-base leading-snug mb-3 group-hover:text-[#0ea5e9] transition-colors line-clamp-2">
          {title}
        </h3>

        {/* Inclusions */}
        {inclusions && inclusions.length > 0 && (
          <div className="space-y-1 mb-4 flex-1">
            {inclusions.slice(0, 3).map((inc, i) => (
              <div key={i} className="flex items-center gap-1.5 text-xs text-[#64748b]">
                <Check size={13} className="text-emerald-500 shrink-0" />
                <span className="truncate">{inc}</span>
              </div>
            ))}
          </div>
        )}

        {/* Pricing and Action */}
        <div className="pt-3 border-t border-[#f1f5f9] flex items-center justify-between mt-auto">
          <div>
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
              <span className="text-base sm:text-xl font-bold text-[#0a1628] whitespace-nowrap">
                NPR {price.toLocaleString("en-US")}
              </span>
              {originalPrice > price && (
                <span className="text-[11px] sm:text-xs text-[#94a3b8] line-through whitespace-nowrap">
                  NPR {originalPrice.toLocaleString("en-US")}
                </span>
              )}
            </div>
            <p className="text-[11px] sm:text-xs text-[#64748b]">per person</p>
          </div>

          <Button size="sm" className="relative z-20 pointer-events-auto shrink-0 text-xs px-3.5 py-2 min-h-[36px]">
            Book Now
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
