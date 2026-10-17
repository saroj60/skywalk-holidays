"use client";

import React, { useState } from "react";
import {
  Calendar,
  Users,
  ShieldCheck,
  Phone,
  MessageSquare,
  Sparkles,
  Clock,
  CheckCircle2,
  Send,
  Lock,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { COMPANY } from "@/lib/constants";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { DepartureItem } from "@/lib/departuresData";

interface DepartureSidebarProps {
  departure: DepartureItem;
}

export default function DepartureSidebar({ departure }: DepartureSidebarProps) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    seats: "2 Seats",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showCallbackForm, setShowCallbackForm] = useState(false);

  const seatsPercent = Math.round(
    ((departure.totalSeats - departure.availableSeats) / departure.totalSeats) *
      100
  );

  const whatsAppLink = buildWhatsAppLink({
    service: "Fixed Departure Seat Reservation",
    name: formData.name || "[Traveler]",
    destination: departure.destination,
    travelDate: `${departure.startDate} to ${departure.endDate}`,
    passengers: formData.seats,
    whatsappNumber: formData.phone,
    additionalDetails: `Departure: ${departure.title} (${departure.seasonTag}) | Fixed Date: ${departure.startDate} to ${departure.endDate} | Group Price: NPR ${departure.price.toLocaleString("en-US")}`,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    window.open(whatsAppLink, "_blank");
    setSubmitted(true);
    setLoading(false);
  };

  const formatDateString = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-2xl border border-[#e2e8f0] text-left text-[#0a1628] space-y-4 max-h-[calc(100vh-6rem)] overflow-y-auto scrollbar-thin">
      {/* Price Header */}
      <div className="border-b border-[#e2e8f0] pb-4">
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <span className="text-[11px] uppercase tracking-wider text-[#64748b] font-bold">
            All-Inclusive Group Fare
          </span>
          <span className="bg-[#e0f2fe] text-[#0284c7] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-sky-200">
            Guaranteed Rate
          </span>
        </div>
        <div className="flex items-baseline gap-2.5 flex-wrap">
          <span className="text-2xl sm:text-3xl font-extrabold text-[#0a1628]">
            NPR {departure.price.toLocaleString("en-US")}
          </span>
          <span className="text-xs sm:text-sm text-[#94a3b8] line-through">
            NPR {departure.originalPrice.toLocaleString("en-US")}
          </span>
          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
            Save NPR {(departure.originalPrice - departure.price).toLocaleString("en-US")}
          </span>
        </div>
        <p className="text-[11px] text-[#64748b] mt-1.5 flex items-center gap-1.5">
          <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
          <span>Includes flights, 4★ stays, all meals &amp; visa guidance</span>
        </p>
      </div>

      {/* Date & Seats Live Tracker */}
      <div className="space-y-2.5 bg-[#f8fafc] p-3.5 rounded-2xl border border-[#e2e8f0]">
        <div className="flex items-center justify-between text-xs">
          <span className="text-[#64748b] flex items-center gap-1.5 font-medium">
            <Calendar size={13} className="text-[#0ea5e9]" /> Departure Date:
          </span>
          <span className="font-bold text-[#0a1628]">
            {formatDateString(departure.startDate)}
          </span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-[#64748b] flex items-center gap-1.5 font-medium">
            <Clock size={13} className="text-[#f97316]" /> Return Date:
          </span>
          <span className="font-bold text-[#0a1628]">
            {formatDateString(departure.endDate)}
          </span>
        </div>

        {/* Seat Allocation Progress Bar */}
        <div className="pt-2 border-t border-[#e2e8f0] space-y-1">
          <div className="flex justify-between text-[11px] font-semibold">
            <span className="text-[#64748b] flex items-center gap-1">
              <Users size={12} className="text-[#0ea5e9]" /> Live Seat Availability
            </span>
            <span className="text-[#0a1628] font-extrabold text-[11px]">
              {departure.availableSeats} of {departure.totalSeats} open
            </span>
          </div>
          <div className="w-full bg-[#e2e8f0] rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#0ea5e9] to-[#f97316] h-full transition-all duration-500 rounded-full"
              style={{ width: `${seatsPercent}%` }}
            />
          </div>
          {departure.availableSeats <= 4 && (
            <p className="text-[10px] font-bold text-[#ea580c] animate-pulse text-right">
              🔥 Only {departure.availableSeats} seats remaining!
            </p>
          )}
        </div>
      </div>

      {/* Primary Action Buttons */}
      <div className="space-y-2">
        <a
          href={whatsAppLink}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full inline-flex items-center justify-center gap-2 bg-[#f97316] hover:bg-[#ea580c] text-white font-extrabold py-3.5 px-4 rounded-2xl shadow-lg shadow-orange-500/25 transition-all text-sm hover:scale-[1.01] active:scale-[0.98]"
        >
          <MessageSquare size={16} className="shrink-0" />
          <span>Reserve Seat on WhatsApp</span>
        </a>

        <div className="grid grid-cols-2 gap-2">
          <a
            href={`tel:${COMPANY.mobile}`}
            className="inline-flex items-center justify-center gap-1.5 bg-[#f8fafc] hover:bg-[#f1f5f9] text-[#0a1628] border border-[#e2e8f0] font-bold py-2.5 px-3 rounded-xl transition-all text-[11px]"
          >
            <Phone size={13} className="text-[#0ea5e9] shrink-0" />
            <span>Call Desk</span>
          </a>

          <button
            type="button"
            onClick={() => setShowCallbackForm(!showCallbackForm)}
            className="inline-flex items-center justify-center gap-1 bg-[#f8fafc] hover:bg-[#f1f5f9] text-[#475569] border border-[#e2e8f0] font-bold py-2.5 px-3 rounded-xl transition-all text-[11px]"
          >
            <Sparkles size={13} className="text-[#0ea5e9] shrink-0" />
            <span>Callback</span>
            {showCallbackForm ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>
        </div>
      </div>

      {/* Collapsible Instant Callback Form */}
      {showCallbackForm && (
        <div className="bg-[#f8fafc] rounded-2xl p-3.5 border border-[#e2e8f0] space-y-2.5 animate-fadeIn">
          <div className="flex items-center justify-between text-xs font-bold text-[#0a1628]">
            <span className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-[#0284c7]">
              <Sparkles size={12} className="text-[#0ea5e9]" /> Request Instant Callback
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-2">
            <input
              type="text"
              required
              placeholder="Your Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-[#cbd5e1] rounded-lg text-xs text-[#0a1628] placeholder-[#94a3b8] focus:outline-none focus:border-[#0ea5e9]"
            />
            <input
              type="tel"
              required
              placeholder="WhatsApp / Phone Number"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-[#cbd5e1] rounded-lg text-xs text-[#0a1628] placeholder-[#94a3b8] focus:outline-none focus:border-[#0ea5e9]"
            />
            <select
              value={formData.seats}
              onChange={(e) => setFormData({ ...formData, seats: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-[#cbd5e1] rounded-lg text-xs text-[#0a1628] focus:outline-none focus:border-[#0ea5e9]"
            >
              <option value="1 Seat">1 Traveler (1 Seat)</option>
              <option value="2 Seats">2 Travelers (2 Seats)</option>
              <option value="3 Seats">3 Travelers (3 Seats)</option>
              <option value="4+ Seats">Family / Group (4+ Seats)</option>
            </select>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-[#0ea5e9] hover:bg-[#0284c7] text-white font-bold rounded-lg text-xs transition-all shadow-md flex items-center justify-center gap-1.5"
            >
              <Send size={12} />
              <span>Send Seat Inquiry</span>
            </button>
          </form>
        </div>
      )}

      {/* Trust & Guarantee Badges */}
      <div className="border-t border-[#e2e8f0] pt-3 space-y-1.5 text-[11px] text-[#64748b]">
        <div className="flex items-center gap-2">
          <ShieldCheck size={14} className="text-[#0ea5e9] shrink-0" />
          <span>100% Guaranteed Departure Date</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
          <span>Kathmandu Visa File Preparation Included</span>
        </div>
        <div className="flex items-center gap-2">
          <Lock size={14} className="text-amber-500 shrink-0" />
          <span>Zero Hidden Costs &amp; Dedicated Tour Leader</span>
        </div>
      </div>
    </div>
  );
}
