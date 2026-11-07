"use client";

import React, { useState, useEffect } from "react";
import {
  Building,
  Phone,
  Mail,
  MapPin,
  Clock,
  Save,
  CheckCircle2,
  Globe,
  Bell,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { COMPANY } from "@/lib/constants";

export interface SiteSettingsForm {
  name: string;
  tagline: string;
  description: string;
  phone: string;
  mobile: string;
  email: string;
  address: string;
  mapsUrl: string;
  facebook: string;
  instagram: string;
  hours: string;
  announcement: string;
  announcementActive: boolean;
}

export default function SettingsManager() {
  const [formData, setFormData] = useState<SiteSettingsForm>({
    name: COMPANY.name,
    tagline: COMPANY.tagline,
    description: COMPANY.description,
    phone: COMPANY.phone,
    mobile: COMPANY.mobile,
    email: COMPANY.email,
    address: COMPANY.address,
    mapsUrl: COMPANY.mapsUrl,
    facebook: COMPANY.facebook,
    instagram: COMPANY.instagram,
    hours: COMPANY.hours,
    announcement: "Special seasonal festival departures now open for booking!",
    announcementActive: false,
  });

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState("");

  useEffect(() => {
    fetch("/api/settings", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.settings) {
          setFormData((prev) => ({ ...prev, ...data.settings }));
        }
      })
      .catch(() => {});
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess("");

    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        if (typeof window !== "undefined") {
          localStorage.setItem("skywalk_site_settings", JSON.stringify(formData));
          window.dispatchEvent(new Event("skywalk-settings-updated"));
        }
        setSavedSuccess("Site contact settings and information updated successfully!");
        setTimeout(() => setSavedSuccess(""), 4000);
      } else {
        alert("Failed to update site settings.");
      }
    } catch (err) {
      alert("Error saving settings.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Building className="text-[#0ea5e9]" size={22} />
            Site Settings &amp; Contact Information
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Update phone numbers, WhatsApp, office address, and live announcement banners across the website.
          </p>
        </div>
      </div>

      {savedSuccess && (
        <div className="flex items-center gap-2 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span>{savedSuccess}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
        {/* Section 1: Brand Info */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
            <Globe size={16} className="text-[#0ea5e9]" />
            Company Identity
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Company Name</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tagline</label>
              <Input
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={2}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]"
            />
          </div>
        </div>

        {/* Section 2: Contact Numbers & WhatsApp */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
            <Phone size={16} className="text-[#0ea5e9]" />
            Direct Phone &amp; WhatsApp Hotlines
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Landline / Office Phone</label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile / WhatsApp Number</label>
              <Input
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Official Email Address</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Office Hours</label>
              <Input
                value={formData.hours}
                onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Section 3: Office Address & Location */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
            <MapPin size={16} className="text-[#0ea5e9]" />
            Physical Address &amp; Maps
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Office Address</label>
              <Input
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Google Maps Link</label>
              <Input
                value={formData.mapsUrl}
                onChange={(e) => setFormData({ ...formData, mapsUrl: e.target.value })}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Facebook Page URL</label>
              <Input
                value={formData.facebook}
                onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Instagram Profile URL</label>
              <Input
                value={formData.instagram}
                onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Section 4: Live Announcement Banner */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
            <Bell size={16} className="text-[#0ea5e9]" />
            Top Announcement Banner
          </h2>
          <div>
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 mb-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.announcementActive}
                onChange={(e) => setFormData({ ...formData, announcementActive: e.target.checked })}
                className="rounded border-slate-300 text-[#0ea5e9] focus:ring-[#0ea5e9]"
              />
              Show Top Announcement Bar on Live Website
            </label>
            <Input
              value={formData.announcement}
              onChange={(e) => setFormData({ ...formData, announcement: e.target.value })}
              placeholder="e.g. Dashain & Tihar Fixed Group Departures Open! Book with NPR 10,000 token."
            />
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
          <Button
            type="submit"
            disabled={saving}
            className="bg-[#0ea5e9] hover:bg-[#0284c7] text-white font-bold gap-2 px-6 shadow-md"
          >
            {saving ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
            {saving ? "Saving Changes..." : "Save Site Settings"}
          </Button>
        </div>
      </form>
    </div>
  );
}
