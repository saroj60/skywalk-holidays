"use client";

import React, { useState } from "react";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { Hotel, MapPin, Calendar, Users, Phone, Mail, User, CheckCircle2, MessageSquare, Send, RefreshCw, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface FormData {
  destination: string;
  checkInDate: string;
  checkOutDate: string;
  guests: string;
  rooms: string;
  fullName: string;
  email: string;
  whatsappNumber: string;
}

export default function HotelInquiryForm() {
  const [formData, setFormData] = useState<FormData>({
    destination: "",
    checkInDate: "",
    checkOutDate: "",
    guests: "2 Guests",
    rooms: "1 Room",
    fullName: "",
    email: "",
    whatsappNumber: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [whatsappUrl, setWhatsappUrl] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrorMsg("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.destination || !formData.checkInDate || !formData.fullName || !formData.whatsappNumber) {
      setErrorMsg("Please fill in all required fields (Destination, Check-in Date, Full Name, WhatsApp Number).");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/inquiries/hotel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination: formData.destination,
          checkIn: formData.checkInDate,
          checkOut: formData.checkOutDate || null,
          guests: formData.guests,
          rooms: formData.rooms,
          customerName: formData.fullName,
          whatsappNumber: formData.whatsappNumber,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to save hotel inquiry.");
      }

      const waLink = buildWhatsAppLink({
        service: "Hotel Booking",
        name: formData.fullName,
        destination: formData.destination,
        travelDate: `${formData.checkInDate}${formData.checkOutDate ? ` to ${formData.checkOutDate}` : ""}`,
        passengers: `${formData.guests}, ${formData.rooms}`,
        whatsappNumber: formData.whatsappNumber,
        additionalDetails: `Email: ${formData.email || "N/A"}`,
      });

      setWhatsappUrl(waLink);
      setSubmitted(true);

      // Automatically launch WhatsApp with pre-filled inquiry details
      if (typeof window !== "undefined") {
        window.open(waLink, "_blank");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred while submitting hotel inquiry.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setFormData({
      destination: "",
      checkInDate: "",
      checkOutDate: "",
      guests: "2 Guests",
      rooms: "1 Room",
      fullName: "",
      email: "",
      whatsappNumber: "",
    });
    setErrorMsg("");
  };

  if (submitted) {
    return (
      <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl border border-emerald-100 text-center max-w-2xl mx-auto animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={36} />
        </div>
        <h3 className="text-2xl md:text-3xl font-extrabold text-[#0a1628] mb-3">
          Hotel Inquiry Saved!
        </h3>
        <p className="text-[#64748b] text-base mb-6 leading-relaxed">
          Thank you, <span className="font-bold text-[#0a1628]">{formData.fullName}</span>! Our hotel reservations desk has logged your request for <span className="font-semibold text-[#0ea5e9]">{formData.destination}</span>.
        </p>

        {/* Summary Card */}
        <div className="bg-[#f8fafc] rounded-2xl p-5 border border-[#e2e8f0] text-left text-xs md:text-sm text-[#475569] space-y-2 mb-8">
          <div className="flex justify-between border-b border-[#e2e8f0] pb-2">
            <span className="font-semibold text-[#0a1628]">Destination:</span>
            <span>{formData.destination}</span>
          </div>
          <div className="flex justify-between border-b border-[#e2e8f0] pb-2">
            <span className="font-semibold text-[#0a1628]">Check-in / Out:</span>
            <span>{formData.checkInDate} {formData.checkOutDate ? `to ${formData.checkOutDate}` : ""}</span>
          </div>
          <div className="flex justify-between border-b border-[#e2e8f0] pb-2">
            <span className="font-semibold text-[#0a1628]">Guests &amp; Rooms:</span>
            <span>{formData.guests}, {formData.rooms}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-[#0a1628]">Contact Phone:</span>
            <span>{formData.whatsappNumber}</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3.5 rounded-xl shadow-lg transition-all text-sm min-h-[44px]"
          >
            <MessageSquare size={18} />
            Connect via WhatsApp Now
          </a>
          <Button variant="outline" onClick={handleReset} className="gap-2 border-[#e2e8f0] min-h-[44px]">
            <RefreshCw size={16} />
            New Inquiry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-6 md:p-10 shadow-2xl border border-[#e2e8f0] max-w-4xl mx-auto">
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-6 border-b border-[#e2e8f0]">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-[#0a1628]">Hotel Reservation Request</h2>
          <p className="text-xs text-[#64748b] mt-0.5">
            Tell us your destination and dates. We compare rates across luxury resorts &amp; boutique hotels worldwide.
          </p>
        </div>
        <span className="text-[11px] font-semibold text-[#0ea5e9] bg-[#e0f2fe] px-3 py-1 rounded-full uppercase tracking-wider shrink-0">
          Hotel Desk
        </span>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs md:text-sm flex items-center gap-2.5">
          <AlertCircle size={18} className="shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Row 1: Destination & Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-bold text-[#0a1628] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <MapPin size={14} className="text-[#0ea5e9]" />
              Destination City / Hotel *
            </label>
            <Input
              placeholder="e.g. Bali, Pokhara, Bangkok, Singapore"
              value={formData.destination}
              onChange={(e) => handleChange("destination", e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#0a1628] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Calendar size={14} className="text-[#0ea5e9]" />
              Check-in Date *
            </label>
            <Input
              type="date"
              value={formData.checkInDate}
              onChange={(e) => handleChange("checkInDate", e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#0a1628] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Calendar size={14} className="text-[#0ea5e9]" />
              Check-out Date (Optional)
            </label>
            <Input
              type="date"
              value={formData.checkOutDate}
              onChange={(e) => handleChange("checkOutDate", e.target.value)}
            />
          </div>
        </div>

        {/* Row 2: Guests & Rooms */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-[#f8fafc] p-4 rounded-2xl border border-[#e2e8f0]">
          <div>
            <label className="text-xs font-bold text-[#0a1628] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Users size={14} className="text-[#0ea5e9]" />
              Guests
            </label>
            <select
              className="w-full h-11 rounded-lg border border-[#e2e8f0] bg-white px-3 text-base sm:text-sm font-semibold text-[#0a1628]"
              value={formData.guests}
              onChange={(e) => handleChange("guests", e.target.value)}
            >
              <option value="1 Guest">1 Guest</option>
              <option value="2 Guests">2 Guests</option>
              <option value="3 Guests">3 Guests</option>
              <option value="4+ Guests">4+ Guests (Family)</option>
              <option value="Group (10+)">Group (10+ Guests)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-[#0a1628] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Hotel size={14} className="text-[#0ea5e9]" />
              Rooms Required
            </label>
            <select
              className="w-full h-11 rounded-lg border border-[#e2e8f0] bg-white px-3 text-base sm:text-sm font-semibold text-[#0a1628]"
              value={formData.rooms}
              onChange={(e) => handleChange("rooms", e.target.value)}
            >
              <option value="1 Room">1 Room</option>
              <option value="2 Rooms">2 Rooms</option>
              <option value="3 Rooms">3 Rooms</option>
              <option value="4+ Rooms">4+ Rooms</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-[#0a1628] uppercase tracking-wider mb-1.5 block">
              Hotel Category Preference
            </label>
            <select className="w-full h-11 rounded-lg border border-[#e2e8f0] bg-white px-3 text-base sm:text-sm font-semibold text-[#0a1628]">
              <option value="3 Star">3 Star (Comfort)</option>
              <option value="4 Star">4 Star (Deluxe)</option>
              <option value="5 Star">5 Star (Luxury Resort)</option>
              <option value="Boutique">Boutique / Heritage</option>
            </select>
          </div>
        </div>

        {/* Row 3: Personal Details */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-bold text-[#0a1628] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <User size={14} className="text-[#0ea5e9]" />
              Full Name *
            </label>
            <Input
              placeholder="e.g. Suman Thapa"
              value={formData.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#0a1628] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Mail size={14} className="text-[#0ea5e9]" />
              Email Address
            </label>
            <Input
              type="email"
              placeholder="suman@example.com"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#0a1628] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Phone size={14} className="text-emerald-600" />
              WhatsApp Number *
            </label>
            <Input
              placeholder="+977-98XXXXXXXX"
              value={formData.whatsappNumber}
              onChange={(e) => handleChange("whatsappNumber", e.target.value)}
              required
            />
          </div>
        </div>

        {/* Submit CTA */}
        <div className="pt-2">
          <Button
            type="submit"
            size="xl"
            disabled={isSubmitting}
            className="w-full bg-[#f97316] hover:bg-[#ea580c] text-white font-extrabold shadow-xl shadow-orange-500/25 text-base md:text-lg min-h-[48px]"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Saving Hotel Request...
              </>
            ) : (
              <>
                <Send size={20} />
                Send Hotel Inquiry
              </>
            )}
          </Button>
          <p className="text-xs text-center text-[#94a3b8] mt-3">
            🔒 Direct hotel rate comparison with no hidden service charges.
          </p>
        </div>
      </form>
    </div>
  );
}
