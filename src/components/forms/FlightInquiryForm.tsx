"use client";

import React, { useState } from "react";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { Plane, Calendar, Users, Phone, Mail, User, CheckCircle2, MessageSquare, Send, RefreshCw, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type TripType = "oneway" | "roundtrip" | "multicity";
type TravelClass = "Economy" | "Premium Economy" | "Business" | "First Class";

interface FormData {
  tripType: TripType;
  fromAirport: string;
  toAirport: string;
  departureDate: string;
  returnDate: string;
  adults: number;
  children: number;
  infants: number;
  travelClass: TravelClass;
  fullName: string;
  email: string;
  whatsappNumber: string;
}

export default function FlightInquiryForm() {
  const [formData, setFormData] = useState<FormData>({
    tripType: "roundtrip",
    fromAirport: "Kathmandu (KTM)",
    toAirport: "",
    departureDate: "",
    returnDate: "",
    adults: 1,
    children: 0,
    infants: 0,
    travelClass: "Economy",
    fullName: "",
    email: "",
    whatsappNumber: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [whatsappUrl, setWhatsappUrl] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleInputChange = (field: keyof FormData, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrorMsg("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fromAirport || !formData.toAirport || !formData.departureDate || !formData.fullName || !formData.whatsappNumber) {
      setErrorMsg("Please fill in all required fields (From, To, Departure Date, Full Name, WhatsApp Number).");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      // 1. Post to backend API
      const res = await fetch("/api/inquiries/flight", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tripType: formData.tripType,
          fromCity: formData.fromAirport,
          toCity: formData.toAirport,
          departureDate: formData.departureDate,
          returnDate: formData.returnDate || null,
          passengers: `${formData.adults} Adult(s), ${formData.children} Child(ren), ${formData.infants} Infant(s)`,
          cabinClass: formData.travelClass,
          customerName: formData.fullName,
          whatsappNumber: formData.whatsappNumber,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to save inquiry to database.");
      }

      // 2. Build WhatsApp link
      const waLink = buildWhatsAppLink({
        service: "Flight Booking",
        name: formData.fullName,
        from: formData.fromAirport,
        to: formData.toAirport,
        travelDate: `${formData.departureDate}${formData.returnDate ? ` (Return: ${formData.returnDate})` : ""}`,
        passengers: `${formData.adults} Adult(s), ${formData.children} Child(ren) | Class: ${formData.travelClass}`,
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
      setErrorMsg(err.message || "An unexpected error occurred while submitting.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setFormData({
      tripType: "roundtrip",
      fromAirport: "Kathmandu (KTM)",
      toAirport: "",
      departureDate: "",
      returnDate: "",
      adults: 1,
      children: 0,
      infants: 0,
      travelClass: "Economy",
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
          Flight Inquiry Saved!
        </h3>
        <p className="text-[#64748b] text-base mb-6 leading-relaxed">
          Thank you, <span className="font-bold text-[#0a1628]">{formData.fullName}</span>! Your inquiry has been registered in our database. Our flight specialists will send pre-filled WhatsApp quotes for <span className="font-semibold text-[#0ea5e9]">{formData.fromAirport} → {formData.toAirport}</span>.
        </p>

        {/* Summary Card */}
        <div className="bg-[#f8fafc] rounded-2xl p-5 border border-[#e2e8f0] text-left text-xs md:text-sm text-[#475569] space-y-2 mb-8">
          <div className="flex justify-between border-b border-[#e2e8f0] pb-2">
            <span className="font-semibold text-[#0a1628]">Route &amp; Trip:</span>
            <span>{formData.fromAirport} → {formData.toAirport} ({formData.tripType.toUpperCase()})</span>
          </div>
          <div className="flex justify-between border-b border-[#e2e8f0] pb-2">
            <span className="font-semibold text-[#0a1628]">Departure Date:</span>
            <span>{formData.departureDate} {formData.returnDate ? `(Return: ${formData.returnDate})` : ""}</span>
          </div>
          <div className="flex justify-between border-b border-[#e2e8f0] pb-2">
            <span className="font-semibold text-[#0a1628]">Passengers &amp; Class:</span>
            <span>{formData.adults} Adult(s), {formData.children} Child(ren) | {formData.travelClass}</span>
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
      {/* Form Header */}
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-6 border-b border-[#e2e8f0]">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-[#0a1628]">Flight Quote Request Form</h2>
          <p className="text-xs text-[#64748b] mt-0.5">
            Fill in your trip details below. Our agents will compare fares across 40+ airlines and reply instantly.
          </p>
        </div>
        <span className="text-[11px] font-semibold text-[#0ea5e9] bg-[#e0f2fe] px-3 py-1 rounded-full uppercase tracking-wider shrink-0">
          Inquiry System
        </span>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs md:text-sm flex items-center gap-2.5">
          <AlertCircle size={18} className="shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 1. Trip Type Selector */}
        <div>
          <label className="text-xs font-bold text-[#0a1628] uppercase tracking-wider mb-2.5 block">
            Select Trip Type
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              { id: "roundtrip", label: "Round Trip" },
              { id: "oneway", label: "One Way" },
              { id: "multicity", label: "Multi City" },
            ].map((t) => (
              <button
                type="button"
                key={t.id}
                onClick={() => handleInputChange("tripType", t.id)}
                className={cn(
                  "px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all border cursor-pointer min-h-[44px]",
                  formData.tripType === t.id
                    ? "bg-[#0a1628] text-white border-[#0a1628] shadow-md"
                    : "bg-[#f8fafc] text-[#64748b] border-[#e2e8f0] hover:text-[#0a1628]"
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Route Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-[#0a1628] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Plane size={14} className="text-[#0ea5e9] rotate-45" />
              From Airport *
            </label>
            <Input
              placeholder="e.g. Kathmandu (KTM)"
              value={formData.fromAirport}
              onChange={(e) => handleInputChange("fromAirport", e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#0a1628] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Plane size={14} className="text-[#f97316] rotate-90" />
              To Airport *
            </label>
            <Input
              placeholder="e.g. Bangkok (BKK), Kuala Lumpur (KUL), Pokhara (PKR)"
              value={formData.toAirport}
              onChange={(e) => handleInputChange("toAirport", e.target.value)}
              required
            />
          </div>
        </div>

        {/* 3. Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-[#0a1628] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Calendar size={14} className="text-[#0ea5e9]" />
              Departure Date *
            </label>
            <Input
              type="date"
              value={formData.departureDate}
              onChange={(e) => handleInputChange("departureDate", e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#0a1628] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Calendar size={14} className="text-[#0ea5e9]" />
              Return Date {formData.tripType === "roundtrip" ? "*" : "(Optional)"}
            </label>
            <Input
              type="date"
              disabled={formData.tripType === "oneway"}
              value={formData.returnDate}
              onChange={(e) => handleInputChange("returnDate", e.target.value)}
            />
          </div>
        </div>

        {/* 4. Passengers & Class */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 bg-[#f8fafc] p-4 rounded-2xl border border-[#e2e8f0]">
          <div>
            <label className="text-xs font-bold text-[#0a1628] uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Users size={12} className="text-[#0ea5e9]" />
              Adults (12+ yrs)
            </label>
            <select
              className="w-full h-11 rounded-lg border border-[#e2e8f0] bg-white px-3 text-base sm:text-sm font-semibold text-[#0a1628]"
              value={formData.adults}
              onChange={(e) => handleInputChange("adults", parseInt(e.target.value))}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                <option key={n} value={n}>{n} Adult{n > 1 ? "s" : ""}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-[#0a1628] uppercase tracking-wider mb-1.5 block">
              Children (2-11 yrs)
            </label>
            <select
              className="w-full h-11 rounded-lg border border-[#e2e8f0] bg-white px-3 text-base sm:text-sm font-semibold text-[#0a1628]"
              value={formData.children}
              onChange={(e) => handleInputChange("children", parseInt(e.target.value))}
            >
              {[0, 1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>{n} Child{n !== 1 ? "ren" : ""}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-[#0a1628] uppercase tracking-wider mb-1.5 block">
              Infants (&lt;2 yrs)
            </label>
            <select
              className="w-full h-11 rounded-lg border border-[#e2e8f0] bg-white px-3 text-base sm:text-sm font-semibold text-[#0a1628]"
              value={formData.infants}
              onChange={(e) => handleInputChange("infants", parseInt(e.target.value))}
            >
              {[0, 1, 2, 3].map((n) => (
                <option key={n} value={n}>{n} Infant{n !== 1 ? "s" : ""}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-[#0a1628] uppercase tracking-wider mb-1.5 block">
              Travel Class
            </label>
            <select
              className="w-full h-11 rounded-lg border border-[#e2e8f0] bg-white px-3 text-base sm:text-sm font-semibold text-[#0a1628]"
              value={formData.travelClass}
              onChange={(e) => handleInputChange("travelClass", e.target.value as TravelClass)}
            >
              <option value="Economy">Economy</option>
              <option value="Premium Economy">Premium Economy</option>
              <option value="Business">Business</option>
              <option value="First Class">First Class</option>
            </select>
          </div>
        </div>

        {/* 5. Personal Details */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-bold text-[#0a1628] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <User size={14} className="text-[#0ea5e9]" />
              Full Name *
            </label>
            <Input
              placeholder="As on Passport / ID"
              value={formData.fullName}
              onChange={(e) => handleInputChange("fullName", e.target.value)}
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
              placeholder="your@email.com"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
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
              onChange={(e) => handleInputChange("whatsappNumber", e.target.value)}
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
                Saving Flight Inquiry...
              </>
            ) : (
              <>
                <Send size={20} />
                Request Flight Quote
              </>
            )}
          </Button>
          <p className="text-xs text-center text-[#94a3b8] mt-3">
            🔒 Your details are saved securely. No immediate charge — our agents will email or WhatsApp your quote.
          </p>
        </div>
      </form>
    </div>
  );
}
