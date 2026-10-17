"use client";

import React, { useState } from "react";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { MessageSquare, Calendar, Users, Phone, User, Send, CheckCircle2, Shield, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface PackageInquirySidebarProps {
  packageId?: number;
  packageTitle: string;
  packagePrice: number;
  destination: string;
  duration: string;
}

export default function PackageInquirySidebar({
  packageId,
  packageTitle,
  packagePrice,
  destination,
  duration,
}: PackageInquirySidebarProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    travelDate: "",
    travelers: "2 Adults",
    whatsappNumber: "",
    specialRequirements: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [whatsappUrl, setWhatsappUrl] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (field: string, val: string) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
    setErrorMsg("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.whatsappNumber.trim()) {
      setErrorMsg("Please fill in your Full Name and WhatsApp Number.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    // Build the direct WhatsApp URL
    const waLink = buildWhatsAppLink({
      service: "Holiday Package Booking",
      name: formData.fullName.trim(),
      destination,
      travelDate: formData.travelDate || "Flexible / Soon",
      passengers: formData.travelers || "2 Adults",
      whatsappNumber: formData.whatsappNumber.trim(),
      additionalDetails: `Package: ${packageTitle} (${duration})${
        formData.specialRequirements.trim() ? ` | Notes: ${formData.specialRequirements.trim()}` : ""
      }`,
    });

    setWhatsappUrl(waLink);
    setSubmitted(true);
    setIsSubmitting(false);

    // Directly open WhatsApp window immediately
    if (typeof window !== "undefined") {
      window.open(waLink, "_blank", "noopener,noreferrer");
    }

    // Save inquiry to backend asynchronously in background (non-blocking)
    fetch("/api/inquiries/package", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        packageId: packageId || null,
        packageName: packageTitle,
        destination,
        travelDate: formData.travelDate || "Flexible",
        travelers: formData.travelers,
        customerName: formData.fullName,
        whatsappNumber: formData.whatsappNumber,
        specialRequirements: formData.specialRequirements,
      }),
    }).catch(() => {});
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-2xl border border-[#e2e8f0] text-left">
      {/* Sidebar Header */}
      <div className="pb-5 mb-5 border-b border-[#e2e8f0]">
        <span className="text-[11px] font-extrabold text-[#0ea5e9] bg-[#e0f2fe] px-3 py-1 rounded-full uppercase tracking-wider block w-max mb-2">
          Fast Booking Inquiry
        </span>
        <div className="flex items-baseline justify-between">
          <span className="text-xs text-[#94a3b8] font-semibold uppercase">Starting Price</span>
          <span className="text-2xl font-extrabold text-[#0a1628]">
            NPR {packagePrice.toLocaleString("en-US")}
          </span>
        </div>
        <p className="text-[11px] text-[#64748b] text-right mt-0.5">per person (all inclusive)</p>
      </div>

      {submitted ? (
        <div className="text-center py-6 space-y-4">
          <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 size={32} />
          </div>
          <h4 className="font-bold text-[#0a1628] text-lg">Opening WhatsApp...</h4>
          <p className="text-xs text-[#64748b] leading-relaxed">
            WhatsApp should open automatically. If it did not open or your browser blocked the popup, click below:
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-extrabold py-3.5 px-4 rounded-xl shadow-lg transition-all text-sm min-h-[46px]"
          >
            <MessageSquare size={18} />
            Open WhatsApp Chat Now
          </a>
          <button
            onClick={() => setSubmitted(false)}
            className="text-xs text-[#0ea5e9] font-semibold hover:underline block mx-auto pt-2 cursor-pointer"
          >
            Edit Inquiry Details
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
              {errorMsg}
            </div>
          )}

          {/* Full Name */}
          <div>
            <label className="text-xs font-bold text-[#0a1628] uppercase tracking-wider mb-1 flex items-center gap-1">
              <User size={12} className="text-[#0ea5e9]" />
              Full Name *
            </label>
            <Input
              placeholder="Your full name"
              value={formData.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
              required
            />
          </div>

          {/* Travel Date */}
          <div>
            <label className="text-xs font-bold text-[#0a1628] uppercase tracking-wider mb-1 flex items-center gap-1">
              <Calendar size={12} className="text-[#0ea5e9]" />
              Travel Date *
            </label>
            <Input
              type="date"
              value={formData.travelDate}
              onChange={(e) => handleChange("travelDate", e.target.value)}
              required
            />
          </div>

          {/* Number of Travelers */}
          <div>
            <label className="text-xs font-bold text-[#0a1628] uppercase tracking-wider mb-1 flex items-center gap-1">
              <Users size={12} className="text-[#0ea5e9]" />
              Number of Travelers
            </label>
            <Input
              placeholder="e.g. 2 Adults, 1 Child"
              value={formData.travelers}
              onChange={(e) => handleChange("travelers", e.target.value)}
            />
          </div>

          {/* WhatsApp Number */}
          <div>
            <label className="text-xs font-bold text-[#0a1628] uppercase tracking-wider mb-1 flex items-center gap-1">
              <Phone size={12} className="text-emerald-600" />
              WhatsApp Number *
            </label>
            <Input
              placeholder="+977-98XXXXXXXX"
              value={formData.whatsappNumber}
              onChange={(e) => handleChange("whatsappNumber", e.target.value)}
              required
            />
          </div>

          {/* Special Requirements */}
          <div>
            <label className="text-xs font-bold text-[#0a1628] uppercase tracking-wider mb-1 block">
              Special Requirements
            </label>
            <textarea
              rows={3}
              placeholder="Hotel preferences, flight dietary needs, extra days..."
              className="w-full rounded-lg border border-[#e2e8f0] bg-white px-3 py-2 text-base sm:text-xs text-[#0a1628] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] resize-none"
              value={formData.specialRequirements}
              onChange={(e) => handleChange("specialRequirements", e.target.value)}
            />
          </div>

          {/* CTA */}
          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting}
            className="w-full bg-[#f97316] hover:bg-[#ea580c] text-white font-extrabold shadow-xl shadow-orange-500/25 text-xs sm:text-sm py-3.5 min-h-[44px]"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Saving Package Inquiry...
              </>
            ) : (
              <>
                <Send size={16} />
                Send Inquiry via WhatsApp
              </>
            )}
          </Button>

          <div className="pt-2 text-center border-t border-[#f1f5f9]">
            <span className="text-[11px] text-[#64748b] inline-flex items-center gap-1">
              <Shield size={12} className="text-emerald-500" /> No booking fees. Best price guarantee.
            </span>
          </div>
        </form>
      )}
    </div>
  );
}
