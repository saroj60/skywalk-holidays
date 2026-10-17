"use client";

import React, { useState } from "react";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { User, Globe, Phone, Mail, Send, CheckCircle2, MessageSquare, RefreshCw, AlertCircle, ShieldAlert, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function VisaInquiryForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    nationality: "Nepalese",
    destinationCountry: "Australia",
    visaType: "Tourist Visa",
    travelPurpose: "Holiday / Sightseeing",
    whatsappNumber: "",
    email: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [whatsappUrl, setWhatsappUrl] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (field: string, val: string) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
    setErrorMsg("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.destinationCountry || !formData.whatsappNumber) {
      setErrorMsg("Please fill in your Full Name, Destination Country, and WhatsApp Number.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/inquiries/visa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName,
          nationality: formData.nationality,
          destinationCountry: formData.destinationCountry,
          visaType: formData.visaType,
          travelPurpose: formData.travelPurpose,
          whatsappNumber: formData.whatsappNumber,
          email: formData.email,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to submit visa application.");
      }

      const waLink = buildWhatsAppLink({
        service: "Visa Assistance",
        name: formData.fullName,
        to: formData.destinationCountry,
        whatsappNumber: formData.whatsappNumber,
        additionalDetails: `Visa Category: ${formData.visaType} | Purpose: ${formData.travelPurpose} | Nationality: ${formData.nationality} | Email: ${formData.email || "N/A"}`,
      });
      setWhatsappUrl(waLink);
      setSubmitted(true);

      // Automatically launch WhatsApp with pre-filled inquiry details
      if (typeof window !== "undefined") {
        window.open(waLink, "_blank");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred while submitting visa application.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setFormData({
      fullName: "",
      nationality: "Nepalese",
      destinationCountry: "Australia",
      visaType: "Tourist Visa",
      travelPurpose: "Holiday / Sightseeing",
      whatsappNumber: "",
      email: "",
    });
    setErrorMsg("");
  };

  if (submitted) {
    return (
      <div id="visa-form" className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl border border-emerald-100 text-center max-w-2xl mx-auto animate-fade-in text-left">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={36} />
        </div>
        <h3 className="text-2xl md:text-3xl font-extrabold text-[#0a1628] mb-3 text-center">
          Visa Application Submitted!
        </h3>
        <p className="text-[#64748b] text-base mb-6 leading-relaxed text-center">
          Thank you, <span className="font-bold text-[#0a1628]">{formData.fullName}</span>! Your visa application details for <span className="font-semibold text-[#0ea5e9]">{formData.destinationCountry} ({formData.visaType})</span> have been saved in our system. Our specialists will review your application.
        </p>

        {/* Summary Card */}
        <div className="bg-[#f8fafc] rounded-2xl p-5 border border-[#e2e8f0] text-left text-xs md:text-sm text-[#475569] space-y-2 mb-8">
          <div className="flex justify-between border-b border-[#e2e8f0] pb-2">
            <span className="font-semibold text-[#0a1628]">Destination &amp; Visa Type:</span>
            <span>{formData.destinationCountry} ({formData.visaType})</span>
          </div>
          <div className="flex justify-between border-b border-[#e2e8f0] pb-2">
            <span className="font-semibold text-[#0a1628]">Applicant &amp; Nationality:</span>
            <span>{formData.fullName} ({formData.nationality})</span>
          </div>
          <div className="flex justify-between border-b border-[#e2e8f0] pb-2">
            <span className="font-semibold text-[#0a1628]">Purpose of Travel:</span>
            <span>{formData.travelPurpose}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-[#0a1628]">WhatsApp Contact:</span>
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
            Connect with Visa Specialist on WhatsApp
          </a>
          <Button variant="outline" onClick={handleReset} className="gap-2 border-[#e2e8f0] min-h-[44px]">
            <RefreshCw size={16} />
            New Visa Inquiry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div id="visa-form" className="bg-white rounded-3xl p-6 md:p-10 shadow-2xl border border-[#e2e8f0] max-w-4xl mx-auto text-left">
      <div className="mb-6 pb-6 border-b border-[#e2e8f0] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-[#0a1628]">Visa Consultation &amp; Inquiry Form</h2>
          <p className="text-xs text-[#64748b] mt-0.5">
            Get personalized document checklists, embassy interview tips, and application assistance from our certified visa desk.
          </p>
        </div>
        <span className="text-[11px] font-semibold text-[#0ea5e9] bg-[#e0f2fe] px-3 py-1 rounded-full uppercase tracking-wider shrink-0 w-max">
          Certified Guidance
        </span>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs md:text-sm flex items-center gap-2.5">
          <AlertCircle size={18} className="shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Row 1: Full Name, Nationality */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-[#0a1628] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <User size={14} className="text-[#0ea5e9]" />
              Full Name (As on Passport) *
            </label>
            <Input
              placeholder="e.g. Ramesh Shrestha"
              value={formData.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#0a1628] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Globe size={14} className="text-[#0ea5e9]" />
              Applicant Nationality *
            </label>
            <Input
              placeholder="e.g. Nepalese"
              value={formData.nationality}
              onChange={(e) => handleChange("nationality", e.target.value)}
              required
            />
          </div>
        </div>

        {/* Row 2: Destination Country, Visa Type, Travel Purpose */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-[#f8fafc] p-4 rounded-2xl border border-[#e2e8f0]">
          <div>
            <label className="text-xs font-bold text-[#0a1628] uppercase tracking-wider mb-1.5 block">
              Destination Country *
            </label>
            <select
              className="w-full h-11 rounded-lg border border-[#e2e8f0] bg-white px-3 text-base sm:text-sm font-semibold text-[#0a1628]"
              value={formData.destinationCountry}
              onChange={(e) => handleChange("destinationCountry", e.target.value)}
            >
              <option value="Australia">Australia</option>
              <option value="Japan">Japan</option>
              <option value="South Korea">South Korea</option>
              <option value="Canada">Canada</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="USA">USA</option>
              <option value="Schengen Europe">Schengen Europe</option>
              <option value="Thailand">Thailand</option>
              <option value="Malaysia">Malaysia</option>
              <option value="Other Country">Other Country</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-[#0a1628] uppercase tracking-wider mb-1.5 block">
              Visa Category *
            </label>
            <select
              className="w-full h-11 rounded-lg border border-[#e2e8f0] bg-white px-3 text-base sm:text-sm font-semibold text-[#0a1628]"
              value={formData.visaType}
              onChange={(e) => handleChange("visaType", e.target.value)}
            >
              <option value="Tourist Visa">Tourist Visa</option>
              <option value="Student Visa">Student Visa</option>
              <option value="Work Visa">Work Visa</option>
              <option value="Business Visa">Business Visa</option>
              <option value="Visit Visa">Visit Visa</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-[#0a1628] uppercase tracking-wider mb-1.5 block">
              Travel Purpose *
            </label>
            <Input
              placeholder="e.g. Holiday, Studies, Conference"
              value={formData.travelPurpose}
              onChange={(e) => handleChange("travelPurpose", e.target.value)}
              required
            />
          </div>
        </div>

        {/* Row 3: WhatsApp Number, Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

          <div>
            <label className="text-xs font-bold text-[#0a1628] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Mail size={14} className="text-[#0ea5e9]" />
              Email Address
            </label>
            <Input
              type="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
          </div>
        </div>

        {/* Disclaimer Notice */}
        <div className="p-4 rounded-2xl bg-[#f8fafc] border border-[#e2e8f0] text-[#64748b] text-xs flex items-start gap-2.5">
          <ShieldAlert size={18} className="shrink-0 text-[#f97316] mt-0.5" />
          <span>
            <strong>Important Disclaimer:</strong> Visa approval is strictly subject to the sole approval and discretion of respective embassies, consulates, and immigration authorities. Skywalks Holidays provides professional documentation review, form filing, and appointment scheduling assistance.
          </span>
        </div>

        {/* Submit Button */}
        <div>
          <Button
            type="submit"
            size="xl"
            disabled={isSubmitting}
            className="w-full bg-[#f97316] hover:bg-[#ea580c] text-white font-extrabold shadow-xl shadow-orange-500/25 text-base md:text-lg min-h-[48px]"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Submitting Visa Application...
              </>
            ) : (
              <>
                <Send size={20} />
                Get Visa Consultation
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
