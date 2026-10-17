"use client";

import React, { useState } from "react";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { User, Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare, RefreshCw, AlertCircle, HelpCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ContactInquiryForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    serviceInterested: "Flight Booking",
    destination: "",
    message: "",
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
    if (!formData.name || !formData.email || !formData.phone || !formData.message) {
      setErrorMsg("Please fill in all mandatory fields (Name, Email, Phone, Message).");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/reach-us", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to submit message.");
      }

      const waLink = buildWhatsAppLink({
        service: formData.serviceInterested,
        name: formData.name,
        destination: formData.destination || "General Inquiry",
        whatsappNumber: formData.phone,
        additionalDetails: `Email: ${formData.email} | Note: ${formData.message}`,
      });

      setWhatsappUrl(waLink);
      setSubmitted(true);
    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred while sending your message.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setFormData({
      name: "",
      email: "",
      phone: "",
      serviceInterested: "Flight Booking",
      destination: "",
      message: "",
    });
    setErrorMsg("");
  };

  if (submitted) {
    return (
      <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-emerald-100 text-center animate-fade-in text-left">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={36} />
        </div>
        <h3 className="text-2xl md:text-3xl font-extrabold text-[#0a1628] mb-3 text-center">
          Inquiry Sent Successfully!
        </h3>
        <p className="text-[#64748b] text-base mb-6 leading-relaxed text-center">
          Thank you, <span className="font-bold text-[#0a1628]">{formData.name}</span>! Your message regarding <span className="font-semibold text-[#0ea5e9]">{formData.serviceInterested}</span> has been logged. Our customer service desk will reply via email and WhatsApp.
        </p>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3.5 rounded-xl shadow-lg transition-all text-sm min-h-[44px]"
          >
            <MessageSquare size={18} />
            Instant WhatsApp Chat
          </a>
          <Button variant="outline" onClick={handleReset} className="gap-2 border-[#e2e8f0] min-h-[44px]">
            <RefreshCw size={16} />
            Send Another Message
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-6 md:p-10 shadow-xl border border-[#e2e8f0] text-left">
      <div className="mb-6 pb-6 border-b border-[#e2e8f0]">
        <h3 className="text-xl md:text-2xl font-bold text-[#0a1628]">Send Us a Message</h3>
        <p className="text-xs text-[#64748b] mt-1">
          Have a custom itinerary request or general question? Send your inquiry below.
        </p>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs md:text-sm flex items-center gap-2.5">
          <AlertCircle size={18} className="shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name & Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-[#0a1628] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <User size={14} className="text-[#0ea5e9]" />
              Your Full Name *
            </label>
            <Input
              placeholder="e.g. Saroj Adhikari"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#0a1628] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Mail size={14} className="text-[#0ea5e9]" />
              Email Address *
            </label>
            <Input
              type="email"
              placeholder="saroj@example.com"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              required
            />
          </div>
        </div>

        {/* Phone & Service Interested In */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-[#0a1628] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Phone size={14} className="text-emerald-600" />
              Phone / WhatsApp *
            </label>
            <Input
              placeholder="+977-98XXXXXXXX"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#0a1628] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <HelpCircle size={14} className="text-[#0ea5e9]" />
              Service Interested In
            </label>
            <select
              className="w-full h-11 rounded-lg border border-[#e2e8f0] bg-white px-3 text-base sm:text-sm font-semibold text-[#0a1628]"
              value={formData.serviceInterested}
              onChange={(e) => handleChange("serviceInterested", e.target.value)}
            >
              <option value="Flight Booking">Flight Booking</option>
              <option value="Hotel Booking">Hotel Reservation</option>
              <option value="International Tour Package">International Tour Package</option>
              <option value="Visa Assistance">Visa Assistance</option>
              <option value="General Inquiry">General / Custom Request</option>
            </select>
          </div>
        </div>

        {/* Travel Destination */}
        <div>
          <label className="text-xs font-bold text-[#0a1628] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <MapPin size={14} className="text-[#f97316]" />
            Travel Destination (Optional)
          </label>
          <Input
            placeholder="e.g. Thailand, Bali, Europe, Mustang, Pokhara"
            value={formData.destination}
            onChange={(e) => handleChange("destination", e.target.value)}
          />
        </div>

        {/* Message */}
        <div>
          <label className="text-xs font-bold text-[#0a1628] uppercase tracking-wider mb-1.5 block">
            Message / Specific Travel Requirements *
          </label>
          <textarea
            rows={4}
            className="w-full rounded-xl border border-[#e2e8f0] bg-white p-3 text-base sm:text-sm text-[#0a1628] placeholder:text-[#94a3b8] focus:outline-none focus:border-[#0ea5e9]"
            placeholder="Describe your trip plans, dates, budget, or any special preferences..."
            value={formData.message}
            onChange={(e) => handleChange("message", e.target.value)}
            required
          />
        </div>

        {/* Submit */}
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
                Sending Inquiry...
              </>
            ) : (
              <>
                <Send size={20} />
                Send Inquiry
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
