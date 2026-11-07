"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface HotelData {
  id?: string;
  name: string;
  location: string;
  rating: number;
  reviews: number;
  price: number;
  category: string;
  image: string;
  amenities: string[];
  status?: string;
}

export default function RecommendedHotelsClient({
  initialHotels,
}: {
  initialHotels: HotelData[];
}) {
  const [hotels, setHotels] = useState<HotelData[]>(initialHotels);

  const fetchLiveHotels = () => {
    fetch("/api/hotels", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.hotels) && data.hotels.length > 0) {
          const active = data.hotels.filter((h: any) => h.status !== "INACTIVE");
          if (active.length > 0) {
            setHotels(active);
          }
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchLiveHotels();

    const handleUpdate = () => fetchLiveHotels();
    window.addEventListener("skywalk-hotels-updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("skywalk-hotels-updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {hotels.map((hotel, index) => (
        <div
          key={hotel.id || hotel.name || index}
          className="bg-white rounded-3xl border border-[#e2e8f0] shadow-sm hover:shadow-2xl hover:border-[#0ea5e9]/40 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between overflow-hidden group"
        >
          <div>
            <div className="relative h-48 w-full overflow-hidden">
              <Image
                src={hotel.image || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80"}
                alt={hotel.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              />
              <div className="absolute top-3 left-3 bg-[#0a1628]/90 text-white text-[11px] font-bold px-2.5 py-1 rounded-full">
                {hotel.category}
              </div>
            </div>

            <div className="p-5">
              <div className="flex items-center gap-1 text-xs text-[#64748b] mb-1.5">
                <MapPin size={12} className="text-[#0ea5e9]" />
                {hotel.location}
              </div>
              <h3 className="font-bold text-[#0a1628] text-base mb-2 group-hover:text-[#0ea5e9] transition-colors leading-snug">
                {hotel.name}
              </h3>

              <div className="flex items-center gap-1 mb-4">
                <Star size={14} className="text-amber-400 fill-amber-400" />
                <span className="text-xs font-bold text-[#0a1628]">{hotel.rating}</span>
                <span className="text-xs text-[#94a3b8]">({hotel.reviews} reviews)</span>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {(hotel.amenities || []).map((amenity) => (
                  <span
                    key={amenity}
                    className="text-[11px] bg-[#f8fafc] text-[#475569] border border-[#e2e8f0] px-2 py-0.5 rounded-full"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="p-5 pt-0 border-t border-[#f1f5f9] mt-auto flex items-center justify-between">
            <div>
              <span className="text-xs text-[#94a3b8] block">From</span>
              <span className="text-base font-extrabold text-[#0a1628]">
                NPR {(hotel.price || 0).toLocaleString()}
              </span>
            </div>
            <Button size="sm" asChild className="bg-[#0ea5e9] hover:bg-[#0284c7]">
              <Link href="#hotel-inquiry">Inquire</Link>
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
