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
    <div className="bg-white rounded-2xl p-4 shadow-xl border border-[#e2e8f0] text-left">
      {/* Sidebar Header */}
      <div className="pb-3 mb-3 border-b border-[#e2e8f0]">
        <span className="text-[10px] font-extrabold text-[#0ea5e9] bg-[#e0f2fe] px-2.5 py-0.5 rounded-full uppercase tracking-wider block w-max mb-1.5">
          Fast Booking Inquiry
        </span>
        <div className="flex items-baseline justify-between">
          <span className="text-[11px] text-[#94a3b8] font-semibold uppercase">Starting Price</span>
          <span className="text-xl font-extrabold text-[#0a1628]">
            NPR {packagePrice.toLocaleString("en-US")}
          </span>
        </div>
        <p className="text-[10px] text-[#64748b] text-right">per person (all inclusive)</p>
      </div>

      {submitted ? (
        <div className="text-center py-4 space-y-3">
          <div className="w-11 h-11 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 size={24} />
          </div>
          <h4 className="font-bold text-[#0a1628] text-base">Opening WhatsApp...</h4>
          <p className="text-xs text-[#64748b] leading-relaxed">
            WhatsApp should open automatically. If it did not open, click below:
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-extrabold py-2.5 px-4 rounded-xl shadow-md transition-all text-xs min-h-[40px]"
          >
            <MessageSquare size={16} />
            Open WhatsApp Chat Now
          </a>
          <button
            onClick={() => setSubmitted(false)}
            className="text-xs text-[#0ea5e9] font-semibold hover:underline block mx-auto pt-1 cursor-pointer"
          >
            Edit Inquiry Details
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-2.5">
          {errorMsg && (
            <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-[11px]">
              {errorMsg}
            </div>
          )}

          {/* Full Name */}
          <div>
            <label className="text-[11px] font-bold text-[#0a1628] uppercase tracking-wider mb-1 flex items-center gap-1">
              <User size={11} className="text-[#0ea5e9]" />
              Full Name *
            </label>
            <Input
              placeholder="Your full name"
              value={formData.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
              className="h-9 text-xs"
              required
            />
          </div>

          {/* Travel Date & Travelers (2-column compact row) */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="text-[11px] font-bold text-[#0a1628] uppercase tracking-wider mb-1 flex items-center gap-1">
                <Calendar size={11} className="text-[#0ea5e9]" />
                Travel Date *
              </label>
              <Input
                type="date"
                value={formData.travelDate}
                onChange={(e) => handleChange("travelDate", e.target.value)}
                className="h-9 text-xs px-2"
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#0a1628] uppercase tracking-wider mb-1 flex items-center gap-1">
                <Users size={11} className="text-[#0ea5e9]" />
                Travelers
              </label>
              <Input
                placeholder="2 Adults"
                value={formData.travelers}
                onChange={(e) => handleChange("travelers", e.target.value)}
                className="h-9 text-xs"
              />
            </div>
          </div>

          {/* WhatsApp Number */}
          <div>
            <label className="text-[11px] font-bold text-[#0a1628] uppercase tracking-wider mb-1 flex items-center gap-1">
              <Phone size={11} className="text-emerald-600" />
              WhatsApp Number *
            </label>
            <Input
              placeholder="+977-98XXXXXXXX"
              value={formData.whatsappNumber}
              onChange={(e) => handleChange("whatsappNumber", e.target.value)}
              className="h-9 text-xs"
              required
            />
          </div>

          {/* Special Requirements */}
          <div>
            <label className="text-[11px] font-bold text-[#0a1628] uppercase tracking-wider mb-1 block">
              Special Requirements
            </label>
            <textarea
              rows={2}
              placeholder="Hotel preferences, flight dietary needs..."
              className="w-full rounded-lg border border-[#e2e8f0] bg-white px-2.5 py-1.5 text-xs text-[#0a1628] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] resize-none"
              value={formData.specialRequirements}
              onChange={(e) => handleChange("specialRequirements", e.target.value)}
            />
          </div>

          {/* CTA */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#f97316] hover:bg-[#ea580c] text-white font-extrabold shadow-lg shadow-orange-500/25 text-xs py-2.5 h-10"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Saving Inquiry...
              </>
            ) : (
              <>
                <Send size={14} />
                Send Inquiry
              </>
            )}
          </Button>

          <div className="pt-1.5 text-center border-t border-[#f1f5f9]">
            <span className="text-[10px] text-[#64748b] inline-flex items-center gap-1">
              <Shield size={11} className="text-emerald-500" /> No booking fees. Best price guarantee.
            </span>
          </div>
        </form>
      )}
    </div>
  );
}
