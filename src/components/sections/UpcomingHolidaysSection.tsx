"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, MapPin, Users, Sparkles, MessageSquare, Clock, ArrowRight, ShieldCheck, Eye } from "lucide-react";
import SectionHeader from "@/components/common/SectionHeader";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { Button } from "@/components/ui/button";

export interface Departure {
  id: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  seasonTag: string;
  totalSeats: number;
  availableSeats: number;
  price: number;
  originalPrice: number;
  image: string;
  status: string;
}

export default function UpcomingHolidaysSection() {
  const [departures, setDepartures] = useState<Departure[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/departures")
      .then((res) => res.json())
      .then((data) => {
        if (data.departures) {
          setDepartures(data.departures);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const formatDateString = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    } catch (e) {
      return dateStr;
    }
  };

  const generateWhatsAppLink = (dep: Departure) => {
    return buildWhatsAppLink({
      service: "Fixed Departure Seat Reservation",
      name: "[Traveler]",
      destination: dep.destination,
      travelDate: `${dep.startDate} to ${dep.endDate}`,
      passengers: "1 Seat",
      whatsappNumber: "",
      additionalDetails: `Departure: ${dep.title} | Season: ${dep.seasonTag} | Fixed Date: ${dep.startDate}`,
    });
  };

  if (!loading && departures.length === 0) return null;

  return (
    <section className="section-padding bg-[#0a1628] text-white relative overflow-hidden">
      {/* Glow Orbs Background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#0ea5e9]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#f97316]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container-custom relative z-10">
        <SectionHeader
          eyebrow="Fixed Departure Dates"
          title="Upcoming Holiday Departures"
          subtitle="Guaranteed flight & tour departures with fixed dates, festival season specials, and live seat tracking."
          light
        />

        {/* Departure Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {departures.map((dep, idx) => {
            const seatsPercent = Math.round(((dep.totalSeats - dep.availableSeats) / dep.totalSeats) * 100);
            return (
              <motion.div
                key={dep.id}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: idx * 0.08, ease: "easeOut" }}
                whileHover={{ y: -8, transition: { duration: 0.25 } }}
                className="bg-[#0f2040] rounded-3xl overflow-hidden border border-[#163058] shadow-xl hover:border-[#0ea5e9]/60 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Image & Date Badge */}
                  <Link
                    href={`/departures/${dep.id}`}
                    className="relative h-52 w-full overflow-hidden block"
                  >
                    <Image
                      src={dep.image}
                      alt={dep.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f2040] via-transparent to-black/30" />

                    {/* Season Tag */}
                    <div className="absolute top-3 left-3 bg-[#0a1628]/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full border border-white/20 shadow">
                      {dep.seasonTag}
                    </div>

                    {/* Urgency Badge */}
                    {dep.availableSeats <= 4 && (
                      <div className="absolute top-3 right-3 bg-[#f97316] text-white text-[11px] font-extrabold px-2.5 py-1 rounded-lg animate-pulse shadow">
                        🔥 Only {dep.availableSeats} Seats Left
                      </div>
                    )}

                    {/* Hover Hint */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
                      <span className="inline-flex items-center gap-1.5 bg-[#0ea5e9] text-white text-xs font-bold px-3.5 py-1.5 rounded-full shadow-lg transform -translate-y-2 group-hover:translate-y-0 transition-transform">
                        <Eye size={13} /> View Full Itinerary & Details
                      </span>
                    </div>

                    {/* Fixed Date Chip */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center gap-1.5 bg-[#0a1628]/95 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-white/10 text-[11px] sm:text-xs font-bold text-[#38bdf8] overflow-hidden">
                      <Calendar size={13} className="text-[#f97316] shrink-0" />
                      <span className="truncate">
                        {formatDateString(dep.startDate)} – {formatDateString(dep.endDate)}
                      </span>
                    </div>
                  </Link>

                  {/* Card Content */}
                  <div className="p-4 sm:p-5 space-y-3">
                    <div className="flex items-center gap-1.5 text-xs text-[#94a3b8]">
                      <MapPin size={12} className="text-[#0ea5e9] shrink-0" />
                      <span className="truncate">{dep.destination}</span>
                    </div>

                    <Link href={`/departures/${dep.id}`}>
                      <h3 className="font-bold text-white text-sm sm:text-base leading-snug group-hover:text-[#38bdf8] transition-colors line-clamp-2">
                        {dep.title}
                      </h3>
                    </Link>

                    {/* Seat Progress Bar */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex justify-between text-[11px] text-[#94a3b8] font-semibold">
                        <span>Seat Allocation</span>
                        <span className="text-white font-bold">
                          {dep.availableSeats} of {dep.totalSeats} seats open
                        </span>
                      </div>
                      <div className="w-full bg-[#163058] rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-[#0ea5e9] to-[#f97316] h-full transition-all duration-500"
                          style={{ width: `${seatsPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Pricing & CTA */}
                <div className="p-4 sm:p-5 pt-0 border-t border-[#163058]/50 mt-auto">
                  <div className="flex flex-wrap items-baseline justify-between py-2.5 sm:py-3 gap-1">
                    <div>
                      <span className="text-[10px] sm:text-[11px] text-[#94a3b8] uppercase font-semibold block">Fixed Price</span>
                      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                        <span className="text-base sm:text-lg font-extrabold text-white">
                          NPR {dep.price.toLocaleString("en-US")}
                        </span>
                        <span className="text-[11px] sm:text-xs text-[#94a3b8] line-through">
                          NPR {dep.originalPrice.toLocaleString("en-US")}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] sm:text-[11px] text-[#38bdf8] font-bold self-end">All Inclusive</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <Link
                      href={`/departures/${dep.id}`}
                      className="inline-flex items-center justify-center gap-1.5 bg-[#0e2444] hover:bg-[#163660] text-[#38bdf8] hover:text-white border border-[#38bdf8]/35 font-bold py-2.5 px-2 rounded-xl transition-all text-xs"
                    >
                      <Eye size={13} className="shrink-0" />
                      <span>View Details</span>
                    </Link>

                    <a
                      href={generateWhatsAppLink(dep)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 bg-[#f97316] hover:bg-[#ea580c] text-white font-extrabold py-2.5 px-2 rounded-xl shadow-lg transition-all text-xs"
                    >
                      <MessageSquare size={13} className="shrink-0" />
                      <span>Reserve</span>
                    </a>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
