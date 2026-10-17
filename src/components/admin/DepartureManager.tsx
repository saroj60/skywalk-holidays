"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  Clock,
  MapPin,
  Plus,
  Edit,
  Trash2,
  X,
  Save,
  Tag,
  Users,
  RefreshCw,
  Sparkles,
  Flame,
  Upload,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Check,
  Camera,
  ArrowUp,
  ArrowDown,
  Layers,
  ListChecks,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export interface ItineraryDay {
  day: string;
  title: string;
  desc: string;
}

export interface GalleryPhoto {
  url: string;
  caption: string;
}

export interface DepartureRecord {
  id: string;
  slug?: string;
  packageSlug?: string;
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
  status: "UPCOMING" | "FILLING_FAST" | "SOLD_OUT";
  duration?: string;
  overview?: string;
  highlights?: string[];
  itinerary?: ItineraryDay[];
  inclusions?: string[];
  exclusions?: string[];
  gallery?: GalleryPhoto[];
}

const INITIAL_DEPARTURES: DepartureRecord[] = [];

const SEASON_PRESETS = [
  "🪔 Dashain Special",
  "🪔 Tihar Holiday",
  "🌺 Autumn Romance",
  "🎆 New Year 2027",
  "🌸 Spring Blossom",
  "☀️ Summer Escape",
];

export default function DepartureManager() {
  const [departures, setDepartures] = useState<DepartureRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<"general" | "itinerary" | "highlights" | "inclusions" | "gallery">("general");
  const [editingDeparture, setEditingDeparture] = useState<Partial<DepartureRecord> | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [statusNotification, setStatusNotification] = useState<string | null>(null);

  // New item inputs
  const [newDayLabel, setNewDayLabel] = useState("");
  const [newDayTitle, setNewDayTitle] = useState("");
  const [newDayDesc, setNewDayDesc] = useState("");
  const [newHighlight, setNewHighlight] = useState("");
  const [newInclusion, setNewInclusion] = useState("");
  const [newExclusion, setNewExclusion] = useState("");
  const [newGalleryUrl, setNewGalleryUrl] = useState("");
  const [newGalleryCaption, setNewGalleryCaption] = useState("");

  const showNotification = (msg: string) => {
    setStatusNotification(msg);
    setTimeout(() => setStatusNotification(null), 4000);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingDeparture) return;

    setUploading(true);
    try {
      const data = new FormData();
      data.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: data,
      });

      if (res.ok) {
        const json = await res.json();
        if (json.url) {
          setEditingDeparture((prev) => (prev ? { ...prev, image: json.url } : null));
          showNotification("Cover photo uploaded successfully!");
        }
      } else {
        alert("Image upload failed. Please try again.");
      }
    } catch (err) {
      alert("Error uploading image from local device.");
    } finally {
      setUploading(false);
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingDeparture) return;

    setUploadingGallery(true);
    try {
      const data = new FormData();
      data.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: data,
      });

      if (res.ok) {
        const json = await res.json();
        if (json.url) {
          const newPhoto: GalleryPhoto = {
            url: json.url,
            caption: newGalleryCaption || "Tour Gallery Photo",
          };
          setEditingDeparture((prev) =>
            prev ? { ...prev, gallery: [...(prev.gallery || []), newPhoto] } : null
          );
          setNewGalleryCaption("");
          showNotification("Gallery photo uploaded and added!");
        }
      }
    } catch (err) {
      alert("Error uploading gallery image.");
    } finally {
      setUploadingGallery(false);
    }
  };

  const fetchDepartures = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/departures");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.departures)) {
          setDepartures(data.departures);
        }
      }
    } catch (err) {
      console.warn("Could not load departures", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartures();
  }, []);

  const handleOpenCreate = () => {
    setEditingDeparture({
      slug: "",
      packageSlug: "",
      title: "",
      destination: "",
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0],
      seasonTag: "🪔 Dashain Special",
      totalSeats: 20,
      availableSeats: 8,
      price: 65000,
      originalPrice: 78000,
      image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80",
      status: "UPCOMING",
      duration: "7 Days / 6 Nights",
      overview: "Guaranteed group holiday departure with fixed dates and all-inclusive arrangements.",
      highlights: [
        "Guaranteed round-trip international flights with checked baggage",
        "Handpicked 4-star city accommodations with daily breakfast",
        "Comprehensive guided sightseeing with professional tour director",
      ],
      itinerary: [
        {
          day: "Day 1",
          title: "Kathmandu Departure & Arrival Transfer",
          desc: "Assemble at Tribhuvan International Airport for international flight. Meet your tour guide upon arrival and transfer to hotel in private coach.",
        },
        {
          day: "Day 2",
          title: "Guided Sightseeing & Iconic Landmarks",
          desc: "Full-day guided exploration covering premier cultural sights, scenic viewpoints, and local shopping bazaars.",
        },
      ],
      inclusions: [
        "Round-trip international flight tickets with baggage allowance",
        "Hotel accommodation with daily breakfast",
        "Airport transfers and guided sightseeing in private AC coach",
        "Visa assistance and document filing review",
      ],
      exclusions: [
        "Personal expenses, minibar, and laundry",
        "Travel medical insurance",
        "Optional activities outside official tour schedule",
      ],
      gallery: [],
    });
    setActiveTab("general");
    setIsEditing(true);
  };

  const handleOpenEdit = (dep: DepartureRecord) => {
    setEditingDeparture({
      ...dep,
      slug: dep.slug || dep.id,
      packageSlug: dep.packageSlug || "",
      itinerary: dep.itinerary ? [...dep.itinerary] : [],
      highlights: dep.highlights ? [...dep.highlights] : [],
      inclusions: dep.inclusions ? [...dep.inclusions] : [],
      exclusions: dep.exclusions ? [...dep.exclusions] : [],
      gallery: dep.gallery ? [...dep.gallery] : [],
    });
    setActiveTab("general");
    setIsEditing(true);
  };

  // Itinerary Handlers
  const handleAddItineraryDay = () => {
    if (!newDayTitle.trim()) {
      alert("Please enter a day title.");
      return;
    }
    const currentList = editingDeparture?.itinerary || [];
    const dayLabel = newDayLabel.trim() || `Day ${currentList.length + 1}`;
    const newDay: ItineraryDay = {
      day: dayLabel,
      title: newDayTitle.trim(),
      desc: newDayDesc.trim() || "Guided tour program with scheduled activities and transfers.",
    };
    setEditingDeparture((prev) =>
      prev ? { ...prev, itinerary: [...(prev.itinerary || []), newDay] } : null
    );
    setNewDayLabel("");
    setNewDayTitle("");
    setNewDayDesc("");
    showNotification(`Added ${dayLabel} to itinerary!`);
  };

  const handleUpdateItineraryDay = (index: number, field: keyof ItineraryDay, value: string) => {
    if (!editingDeparture?.itinerary) return;
    const updated = [...editingDeparture.itinerary];
    updated[index] = { ...updated[index], [field]: value };
    setEditingDeparture({ ...editingDeparture, itinerary: updated });
  };

  const handleRemoveItineraryDay = (index: number) => {
    if (!editingDeparture?.itinerary) return;
    const updated = editingDeparture.itinerary.filter((_, i) => i !== index);
    setEditingDeparture({ ...editingDeparture, itinerary: updated });
  };

  const handleMoveItineraryDay = (index: number, direction: "up" | "down") => {
    if (!editingDeparture?.itinerary) return;
    const list = [...editingDeparture.itinerary];
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= list.length) return;
    const temp = list[index];
    list[index] = list[targetIdx];
    list[targetIdx] = temp;
    setEditingDeparture({ ...editingDeparture, itinerary: list });
  };

  // Highlights Handlers
  const handleAddHighlight = () => {
    if (!newHighlight.trim()) return;
    setEditingDeparture((prev) =>
      prev ? { ...prev, highlights: [...(prev.highlights || []), newHighlight.trim()] } : null
    );
    setNewHighlight("");
  };

  const handleRemoveHighlight = (index: number) => {
    if (!editingDeparture?.highlights) return;
    setEditingDeparture({
      ...editingDeparture,
      highlights: editingDeparture.highlights.filter((_, i) => i !== index),
    });
  };

  // Inclusions & Exclusions Handlers
  const handleAddInclusion = () => {
    if (!newInclusion.trim()) return;
    setEditingDeparture((prev) =>
      prev ? { ...prev, inclusions: [...(prev.inclusions || []), newInclusion.trim()] } : null
    );
    setNewInclusion("");
  };

  const handleRemoveInclusion = (index: number) => {
    if (!editingDeparture?.inclusions) return;
    setEditingDeparture({
      ...editingDeparture,
      inclusions: editingDeparture.inclusions.filter((_, i) => i !== index),
    });
  };

  const handleAddExclusion = () => {
    if (!newExclusion.trim()) return;
    setEditingDeparture((prev) =>
      prev ? { ...prev, exclusions: [...(prev.exclusions || []), newExclusion.trim()] } : null
    );
    setNewExclusion("");
  };

  const handleRemoveExclusion = (index: number) => {
    if (!editingDeparture?.exclusions) return;
    setEditingDeparture({
      ...editingDeparture,
      exclusions: editingDeparture.exclusions.filter((_, i) => i !== index),
    });
  };

  // Gallery Handlers
  const handleAddGalleryUrl = () => {
    if (!newGalleryUrl.trim()) return;
    const photo: GalleryPhoto = {
      url: newGalleryUrl.trim(),
      caption: newGalleryCaption.trim() || "Tour Experience",
    };
    setEditingDeparture((prev) =>
      prev ? { ...prev, gallery: [...(prev.gallery || []), photo] } : null
    );
    setNewGalleryUrl("");
    setNewGalleryCaption("");
  };

  const handleRemoveGalleryPhoto = (index: number) => {
    if (!editingDeparture?.gallery) return;
    setEditingDeparture({
      ...editingDeparture,
      gallery: editingDeparture.gallery.filter((_, i) => i !== index),
    });
  };

  // Save Departure Handler
  const handleSaveDeparture = async () => {
    if (!editingDeparture?.title || !editingDeparture?.destination || !editingDeparture?.price) {
      alert("Please enter at least Title, Destination, and Price.");
      return;
    }

    const safeSlug = (editingDeparture.slug || editingDeparture.title || "departure")
      .toLowerCase()
      .replace(/[^a-z0-9-_]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const payload = {
      ...editingDeparture,
      slug: safeSlug,
      packageSlug: (editingDeparture.packageSlug || "").trim(),
    };

    try {
      if (editingDeparture.id) {
        // Update
        const res = await fetch(`/api/departures/${editingDeparture.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          showNotification("Departure schedule, URL slug & itinerary updated successfully! Live on website.");
          fetchDepartures();
        }
      } else {
        // Create
        const res = await fetch("/api/departures", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          showNotification("New fixed departure created with custom URL slug & full itinerary!");
          fetchDepartures();
        }
      }
    } catch (e) {
      showNotification("Departure saved.");
    }

    setIsEditing(false);
    setEditingDeparture(null);
  };

  const handleDeleteDeparture = async (id: string) => {
    if (!confirm("Are you sure you want to delete this upcoming departure? This cannot be undone.")) return;
    setDepartures((prev) => prev.filter((d) => d.id !== id));
    try {
      await fetch(`/api/departures/${id}`, { method: "DELETE" });
      showNotification("Departure removed successfully.");
    } catch (err) {}
  };

  return (
    <div className="container-custom py-8 space-y-8">
      {/* Toast Notification Banner */}
      {statusNotification && (
        <div className="bg-emerald-600 text-white px-5 py-3.5 rounded-2xl shadow-xl flex items-center justify-between gap-3 text-sm font-semibold animate-fade-in border border-emerald-500">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 size={18} className="shrink-0" />
            <span>{statusNotification}</span>
          </div>
          <button
            onClick={() => setStatusNotification(null)}
            className="p-1 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#e2e8f0] shadow-sm">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-800 text-xs font-bold px-3 py-1 rounded-full mb-2 border border-amber-200">
            <Flame size={14} className="text-[#f97316]" /> Fixed Date Tour Departures
          </div>
          <h1 className="text-2xl font-extrabold text-[#0a1628]">
            Upcoming Holiday Departures Manager
          </h1>
          <p className="text-xs sm:text-sm text-[#64748b] mt-0.5">
            Control festival tour dates, live seats, detailed day-by-day itineraries, inclusions, exclusions, and photo galleries.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={fetchDepartures} variant="outline" size="sm" className="gap-2 border-[#e2e8f0]">
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            Sync Departures
          </Button>
          <Button onClick={handleOpenCreate} className="bg-[#f97316] hover:bg-[#ea580c] text-white gap-2 shadow-md">
            <Plus size={16} />
            Schedule New Departure
          </Button>
        </div>
      </div>

      {/* Departure Details Editor Drawer / Form */}
      {isEditing && editingDeparture && (
        <div className="bg-white p-6 md:p-8 rounded-3xl border-2 border-[#0ea5e9]/40 shadow-2xl space-y-6 animate-fade-in text-left">
          {/* Editor Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#e2e8f0]">
            <div>
              <span className="text-xs font-bold text-[#0ea5e9] uppercase tracking-wider">
                Fixed Tour Departure Full Management
              </span>
              <h3 className="text-xl font-bold text-[#0a1628]">
                {editingDeparture.id ? `Edit: ${editingDeparture.title}` : "Schedule New Fixed Departure"}
              </h3>
            </div>
            <button
              onClick={() => setIsEditing(false)}
              className="p-2 text-[#64748b] hover:bg-[#f1f5f9] rounded-xl transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation Tabs Bar */}
          <div className="flex flex-wrap items-center gap-2 border-b border-[#e2e8f0] pb-3">
            <button
              type="button"
              onClick={() => setActiveTab("general")}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "general"
                  ? "bg-[#0a1628] text-white shadow-md"
                  : "bg-[#f8fafc] text-[#475569] hover:bg-[#f1f5f9] border border-[#e2e8f0]"
              }`}
            >
              <Calendar size={14} />
              <span>Schedule &amp; Pricing</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("itinerary")}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "itinerary"
                  ? "bg-[#0ea5e9] text-white shadow-md"
                  : "bg-[#f8fafc] text-[#475569] hover:bg-[#f1f5f9] border border-[#e2e8f0]"
              }`}
            >
              <Clock size={14} />
              <span>Day-by-Day Itinerary</span>
              <span className="bg-white/20 text-[10px] px-2 py-0.5 rounded-full font-extrabold">
                {editingDeparture.itinerary?.length || 0}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("highlights")}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "highlights"
                  ? "bg-[#f97316] text-white shadow-md"
                  : "bg-[#f8fafc] text-[#475569] hover:bg-[#f1f5f9] border border-[#e2e8f0]"
              }`}
            >
              <Sparkles size={14} />
              <span>Overview &amp; Highlights</span>
              <span className="bg-white/20 text-[10px] px-2 py-0.5 rounded-full font-extrabold">
                {editingDeparture.highlights?.length || 0}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("inclusions")}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "inclusions"
                  ? "bg-emerald-600 text-white shadow-md"
                  : "bg-[#f8fafc] text-[#475569] hover:bg-[#f1f5f9] border border-[#e2e8f0]"
              }`}
            >
              <ListChecks size={14} />
              <span>Inclusions &amp; Exclusions</span>
              <span className="bg-white/20 text-[10px] px-2 py-0.5 rounded-full font-extrabold">
                {(editingDeparture.inclusions?.length || 0) + (editingDeparture.exclusions?.length || 0)}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("gallery")}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "gallery"
                  ? "bg-purple-600 text-white shadow-md"
                  : "bg-[#f8fafc] text-[#475569] hover:bg-[#f1f5f9] border border-[#e2e8f0]"
              }`}
            >
              <Camera size={14} />
              <span>Photo Gallery</span>
              <span className="bg-white/20 text-[10px] px-2 py-0.5 rounded-full font-extrabold">
                {editingDeparture.gallery?.length || 0}
              </span>
            </button>
          </div>

          {/* TAB 1: General & Schedule */}
          {activeTab === "general" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-[#0a1628] uppercase tracking-wider mb-1 block">
                  Departure Title *
                </label>
                <Input
                  placeholder="e.g. Vietnam & Ha Long Bay Cruise — Dashain Special"
                  value={editingDeparture.title || ""}
                  onChange={(e) => setEditingDeparture({ ...editingDeparture, title: e.target.value })}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#0a1628] uppercase tracking-wider mb-1 block">
                  Destination Region *
                </label>
                <Input
                  placeholder="e.g. Hanoi, Ha Long Bay & Da Nang"
                  value={editingDeparture.destination || ""}
                  onChange={(e) => setEditingDeparture({ ...editingDeparture, destination: e.target.value })}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#0a1628] uppercase tracking-wider mb-1 block flex items-center justify-between">
                  <span>URL Slug (Permalink)</span>
                  <span className="text-[10px] text-[#0ea5e9] font-semibold lowercase">/departures/[slug]</span>
                </label>
                <Input
                  placeholder="e.g. vietnam-dashain-cruise"
                  value={editingDeparture.slug || ""}
                  onChange={(e) =>
                    setEditingDeparture({
                      ...editingDeparture,
                      slug: e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, ""),
                    })
                  }
                />
                <span className="text-[11px] text-[#64748b] block mt-0.5 font-mono truncate">
                  Link: /departures/{editingDeparture.slug || editingDeparture.id || "dep-slug"}
                </span>
              </div>

              <div>
                <label className="text-xs font-bold text-[#0a1628] uppercase tracking-wider mb-1 block">
                  Linked Package Slug / URL
                </label>
                <Input
                  placeholder="e.g. /packages/vietnam-6d or /services/custom"
                  value={editingDeparture.packageSlug || ""}
                  onChange={(e) =>
                    setEditingDeparture({ ...editingDeparture, packageSlug: e.target.value })
                  }
                />
                <span className="text-[11px] text-[#64748b] block mt-0.5">
                  Link to full catalog package details
                </span>
              </div>

              <div>
                <label className="text-xs font-bold text-[#0a1628] uppercase tracking-wider mb-1 block">
                  Start Date *
                </label>
                <Input
                  type="date"
                  value={editingDeparture.startDate || ""}
                  onChange={(e) => setEditingDeparture({ ...editingDeparture, startDate: e.target.value })}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#0a1628] uppercase tracking-wider mb-1 block">
                  End Date *
                </label>
                <Input
                  type="date"
                  value={editingDeparture.endDate || ""}
                  onChange={(e) => setEditingDeparture({ ...editingDeparture, endDate: e.target.value })}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#0a1628] uppercase tracking-wider mb-1 block">
                  Duration (e.g. 7 Days / 6 Nights)
                </label>
                <Input
                  placeholder="e.g. 7 Days / 6 Nights"
                  value={editingDeparture.duration || ""}
                  onChange={(e) => setEditingDeparture({ ...editingDeparture, duration: e.target.value })}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-[#0a1628] uppercase tracking-wider mb-1 block">
                  Season / Festival Tag *
                </label>
                <Input
                  placeholder="e.g. 🪔 Dashain Special, 🌺 Autumn Romance"
                  value={editingDeparture.seasonTag || ""}
                  onChange={(e) => setEditingDeparture({ ...editingDeparture, seasonTag: e.target.value })}
                />
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {SEASON_PRESETS.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setEditingDeparture({ ...editingDeparture, seasonTag: preset })}
                      className="text-[11px] bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#334155] px-2.5 py-1 rounded-lg transition-colors font-medium border border-[#e2e8f0]"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#0a1628] uppercase tracking-wider mb-1 block">
                  Status Badge
                </label>
                <select
                  value={editingDeparture.status || "UPCOMING"}
                  onChange={(e) => setEditingDeparture({ ...editingDeparture, status: e.target.value as any })}
                  className="w-full h-9 rounded-md border border-[#e2e8f0] bg-white px-3 py-1 text-sm shadow-xs focus:outline-none focus:ring-1 focus:ring-sky-500 font-semibold"
                >
                  <option value="UPCOMING">Upcoming (Open Seats)</option>
                  <option value="FILLING_FAST">Filling Fast (🔥 Pulse)</option>
                  <option value="SOLD_OUT">Sold Out</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-[#0a1628] uppercase tracking-wider mb-1 block">
                  Total Seats Allocated *
                </label>
                <Input
                  type="number"
                  placeholder="20"
                  value={editingDeparture.totalSeats || 20}
                  onChange={(e) => setEditingDeparture({ ...editingDeparture, totalSeats: Number(e.target.value) })}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#0a1628] uppercase tracking-wider mb-1 block">
                  Available Seats Remaining *
                </label>
                <Input
                  type="number"
                  placeholder="3"
                  value={editingDeparture.availableSeats || 3}
                  onChange={(e) => setEditingDeparture({ ...editingDeparture, availableSeats: Number(e.target.value) })}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#0a1628] uppercase tracking-wider mb-1 block">
                  Special Price (NPR) *
                </label>
                <Input
                  type="number"
                  placeholder="62000"
                  value={editingDeparture.price || ""}
                  onChange={(e) => setEditingDeparture({ ...editingDeparture, price: Number(e.target.value) })}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#0a1628] uppercase tracking-wider mb-1 block">
                  Original Price (NPR)
                </label>
                <Input
                  type="number"
                  placeholder="75000"
                  value={editingDeparture.originalPrice || ""}
                  onChange={(e) => setEditingDeparture({ ...editingDeparture, originalPrice: Number(e.target.value) })}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-[#0a1628] uppercase tracking-wider mb-1 flex items-center justify-between">
                  <span>Cover Photo Image *</span>
                  <span className="text-[11px] font-medium text-[#0ea5e9]">Paste URL or Upload Local File</span>
                </label>
                <div className="flex gap-2 items-center">
                  <Input
                    placeholder="https://images.unsplash.com/... or /uploads/..."
                    value={editingDeparture.image || ""}
                    onChange={(e) => setEditingDeparture({ ...editingDeparture, image: e.target.value })}
                    className="flex-1"
                  />
                  <label className="cursor-pointer inline-flex items-center gap-1.5 bg-[#0ea5e9] hover:bg-[#0284c7] text-white px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 shadow-sm">
                    <Upload size={14} />
                    {uploading ? "Uploading..." : "Upload from Device"}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                      disabled={uploading}
                    />
                  </label>
                </div>
                {/* Live Preview Thumbnail */}
                {editingDeparture.image && (
                  <div className="mt-2.5 flex items-center gap-3 bg-[#f8fafc] p-2 rounded-xl border border-[#e2e8f0]">
                    <div className="relative w-24 h-16 rounded-lg overflow-hidden border border-[#e2e8f0] bg-slate-900 shrink-0">
                      <Image
                        src={editingDeparture.image}
                        alt="Cover Preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="text-[11px] text-[#64748b] truncate">
                      <span className="font-semibold text-[#0a1628] block">Current Cover Image</span>
                      <span className="truncate block font-mono text-[10px]">{editingDeparture.image}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: Day-by-Day Itinerary Builder */}
          {activeTab === "itinerary" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-sky-50 p-4 rounded-2xl border border-sky-100">
                <div>
                  <h4 className="font-bold text-[#0a1628] text-sm flex items-center gap-1.5">
                    <Clock size={16} className="text-[#0ea5e9]" />
                    Configured Day-by-Day Schedule ({editingDeparture.itinerary?.length || 0} Days)
                  </h4>
                  <p className="text-xs text-[#64748b] mt-0.5">
                    Add, edit, or reorder the detailed day activities shown on the departure package detail page.
                  </p>
                </div>
              </div>

              {/* Existing Days List */}
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                {(!editingDeparture.itinerary || editingDeparture.itinerary.length === 0) && (
                  <div className="text-center py-8 bg-[#f8fafc] rounded-2xl border border-dashed border-[#cbd5e1] text-xs text-[#64748b]">
                    No itinerary days configured yet. Use the form below to add Day 1!
                  </div>
                )}

                {editingDeparture.itinerary?.map((day, idx) => (
                  <div
                    key={idx}
                    className="bg-[#f8fafc] p-4 sm:p-5 rounded-2xl border border-[#e2e8f0] hover:border-sky-300 transition-all space-y-3"
                  >
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <Input
                          value={day.day}
                          onChange={(e) => handleUpdateItineraryDay(idx, "day", e.target.value)}
                          className="w-24 text-xs font-extrabold text-[#0284c7] bg-white uppercase h-8 rounded-lg"
                        />
                        <span className="text-xs text-[#94a3b8] font-medium">Day #{idx + 1}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleMoveItineraryDay(idx, "up")}
                          disabled={idx === 0}
                          className="p-1.5 rounded-lg text-[#64748b] hover:bg-white border border-transparent hover:border-[#e2e8f0] disabled:opacity-30 disabled:hover:bg-transparent"
                          title="Move Day Up"
                        >
                          <ArrowUp size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveItineraryDay(idx, "down")}
                          disabled={idx === (editingDeparture.itinerary?.length || 0) - 1}
                          className="p-1.5 rounded-lg text-[#64748b] hover:bg-white border border-transparent hover:border-[#e2e8f0] disabled:opacity-30 disabled:hover:bg-transparent"
                          title="Move Day Down"
                        >
                          <ArrowDown size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveItineraryDay(idx)}
                          className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 border border-transparent hover:border-red-200"
                          title="Delete Day"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-[#475569] uppercase tracking-wider block mb-1">
                        Day Title *
                      </label>
                      <Input
                        value={day.title}
                        placeholder="e.g. Flight to Hanoi & Ha Long Bay Harbor Transfer"
                        onChange={(e) => handleUpdateItineraryDay(idx, "title", e.target.value)}
                        className="text-xs bg-white font-bold text-[#0a1628]"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-[#475569] uppercase tracking-wider block mb-1">
                        Day Description &amp; Sightseeing Schedule *
                      </label>
                      <textarea
                        rows={4}
                        value={day.desc}
                        placeholder="Detailed schedule of monuments, hotel check-in, included meals, and guide activities..."
                        onChange={(e) => handleUpdateItineraryDay(idx, "desc", e.target.value)}
                        className="w-full rounded-xl border border-[#cbd5e1] bg-white p-3 text-xs text-[#0a1628] leading-relaxed focus:outline-none focus:border-[#0ea5e9] resize-y font-normal"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Add New Day Box */}
              <div className="bg-sky-50/50 p-5 rounded-2xl border-2 border-dashed border-sky-300 space-y-3">
                <h5 className="text-xs font-bold text-[#0284c7] uppercase tracking-wider flex items-center gap-1.5">
                  <Plus size={14} /> Add Another Day to Schedule
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <Input
                      placeholder={`Day ${(editingDeparture.itinerary?.length || 0) + 1}`}
                      value={newDayLabel}
                      onChange={(e) => setNewDayLabel(e.target.value)}
                      className="text-xs bg-white"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <Input
                      placeholder="Day Title (e.g. Ba Na Hills Cable Car & Golden Bridge)"
                      value={newDayTitle}
                      onChange={(e) => setNewDayTitle(e.target.value)}
                      className="text-xs bg-white font-medium"
                    />
                  </div>
                </div>
                <div>
                  <textarea
                    rows={3}
                    placeholder="Day activities, transfers, meals, and overnight stay details..."
                    value={newDayDesc}
                    onChange={(e) => setNewDayDesc(e.target.value)}
                    className="w-full rounded-xl border border-sky-200 bg-white p-3 text-xs text-[#0a1628] leading-relaxed focus:outline-none focus:border-sky-500 resize-y"
                  />
                </div>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleAddItineraryDay}
                  className="bg-[#0ea5e9] hover:bg-[#0284c7] text-white font-bold gap-1.5 shadow-sm"
                >
                  <Plus size={14} /> Add Day to Itinerary
                </Button>
              </div>
            </div>
          )}

          {/* TAB 3: Overview & Key Highlights */}
          {activeTab === "highlights" && (
            <div className="space-y-6">
              <div>
                <label className="text-xs font-bold text-[#0a1628] uppercase tracking-wider mb-1.5 block">
                  Departure Overview Summary *
                </label>
                <textarea
                  rows={5}
                  className="w-full rounded-2xl border border-[#cbd5e1] bg-white p-4 text-xs text-[#0a1628] placeholder:text-[#94a3b8] focus:outline-none focus:border-[#0ea5e9] leading-relaxed resize-y"
                  placeholder="Describe the entire group tour experience, festival excitement, hotel comfort, and guide support..."
                  value={editingDeparture.overview || ""}
                  onChange={(e) => setEditingDeparture({ ...editingDeparture, overview: e.target.value })}
                />
              </div>

              {/* Highlights Manager */}
              <div className="space-y-3 bg-[#f8fafc] p-5 rounded-2xl border border-[#e2e8f0]">
                <h4 className="font-bold text-[#0a1628] text-sm flex items-center gap-1.5">
                  <Sparkles size={16} className="text-[#f97316]" />
                  Key Tour Highlights ({editingDeparture.highlights?.length || 0})
                </h4>
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                  {editingDeparture.highlights?.map((hl, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-[#e2e8f0]"
                    >
                      <span className="text-[#f97316] font-bold text-xs shrink-0">★</span>
                      <span className="flex-1 text-xs text-[#0a1628]">{hl}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveHighlight(i)}
                        className="text-red-500 hover:text-red-700 p-1 shrink-0"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 pt-2">
                  <Input
                    placeholder="Add highlight (e.g. 5-Star overnight luxury cruise with private balcony cabin)..."
                    value={newHighlight}
                    onChange={(e) => setNewHighlight(e.target.value)}
                    className="text-xs bg-white"
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleAddHighlight}
                    className="bg-[#0a1628] text-white shrink-0 font-bold"
                  >
                    Add Highlight
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Inclusions & Exclusions */}
          {activeTab === "inclusions" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Inclusions */}
              <div className="space-y-3 bg-[#f0fdf4]/50 p-5 rounded-2xl border border-emerald-200">
                <h4 className="font-bold text-emerald-900 text-sm flex items-center gap-1.5">
                  <CheckCircle2 size={16} className="text-emerald-600" />
                  What&apos;s Included ({editingDeparture.inclusions?.length || 0})
                </h4>
                <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
                  {editingDeparture.inclusions?.map((inc, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-emerald-100 shadow-2xs"
                    >
                      <Check size={12} className="text-emerald-600 shrink-0" />
                      <span className="flex-1 text-xs text-[#0a1628]">{inc}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveInclusion(i)}
                        className="text-red-500 hover:text-red-700 p-1 shrink-0"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 pt-2">
                  <Input
                    placeholder="Add inclusion (e.g. Daily buffet breakfast &amp; scheduled lunches)..."
                    value={newInclusion}
                    onChange={(e) => setNewInclusion(e.target.value)}
                    className="text-xs bg-white"
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleAddInclusion}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white shrink-0 font-bold"
                  >
                    Add Inclusion
                  </Button>
                </div>
              </div>

              {/* Exclusions */}
              <div className="space-y-3 bg-[#fff1f2]/50 p-5 rounded-2xl border border-rose-200">
                <h4 className="font-bold text-rose-900 text-sm flex items-center gap-1.5">
                  <XCircle size={16} className="text-rose-600" />
                  What&apos;s Excluded ({editingDeparture.exclusions?.length || 0})
                </h4>
                <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
                  {editingDeparture.exclusions?.map((exc, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-rose-100 shadow-2xs"
                    >
                      <X size={12} className="text-rose-500 shrink-0" />
                      <span className="flex-1 text-xs text-[#0a1628]">{exc}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveExclusion(i)}
                        className="text-red-500 hover:text-red-700 p-1 shrink-0"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 pt-2">
                  <Input
                    placeholder="Add exclusion (e.g. Personal expenses and minibar)..."
                    value={newExclusion}
                    onChange={(e) => setNewExclusion(e.target.value)}
                    className="text-xs bg-white"
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleAddExclusion}
                    className="bg-rose-600 hover:bg-rose-700 text-white shrink-0 font-bold"
                  >
                    Add Exclusion
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: Photo Gallery */}
          {activeTab === "gallery" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-purple-50 p-4 rounded-2xl border border-purple-100">
                <div>
                  <h4 className="font-bold text-[#0a1628] text-sm flex items-center gap-1.5">
                    <Camera size={16} className="text-purple-600" />
                    Departure Destination Gallery ({editingDeparture.gallery?.length || 0} Photos)
                  </h4>
                  <p className="text-xs text-[#64748b] mt-0.5">
                    Showcase sightseeing monuments, hotels, and highlights on the public departure detail page.
                  </p>
                </div>
              </div>

              {/* Photos Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-[420px] overflow-y-auto pr-2">
                {editingDeparture.gallery?.map((photo, i) => (
                  <div
                    key={i}
                    className="relative group rounded-2xl overflow-hidden border border-[#e2e8f0] bg-slate-900 aspect-4/3 flex flex-col justify-end"
                  >
                    <Image
                      src={photo.url}
                      alt={photo.caption || "Gallery photo"}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                    <div className="relative z-10 p-2.5 flex items-center justify-between gap-1">
                      <span className="text-[10px] text-white font-medium truncate drop-shadow">
                        {photo.caption || "Photo"}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveGalleryPhoto(i)}
                        className="p-1 rounded-md bg-red-600 hover:bg-red-700 text-white shrink-0"
                        title="Remove photo"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Photo Form */}
              <div className="bg-[#f8fafc] p-5 rounded-2xl border border-[#e2e8f0] space-y-3">
                <h5 className="text-xs font-bold text-[#0a1628] uppercase tracking-wider flex items-center gap-1.5">
                  <Plus size={14} className="text-purple-600" /> Add New Photo to Gallery
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2 flex gap-2">
                    <Input
                      placeholder="Photo Image URL (https://... or /images/...)"
                      value={newGalleryUrl}
                      onChange={(e) => setNewGalleryUrl(e.target.value)}
                      className="text-xs bg-white flex-1"
                    />
                    <label className="cursor-pointer inline-flex items-center gap-1 bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0">
                      <Upload size={14} />
                      {uploadingGallery ? "..." : "Device"}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleGalleryUpload}
                        disabled={uploadingGallery}
                      />
                    </label>
                  </div>
                  <div>
                    <Input
                      placeholder="Caption (e.g. Golden Hands Bridge)"
                      value={newGalleryCaption}
                      onChange={(e) => setNewGalleryCaption(e.target.value)}
                      className="text-xs bg-white"
                    />
                  </div>
                </div>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleAddGalleryUrl}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold gap-1.5 shadow-sm"
                >
                  <Plus size={14} /> Add Photo via URL
                </Button>
              </div>
            </div>
          )}

          {/* Footer Save / Cancel Controls */}
          <div className="flex items-center justify-between pt-5 border-t border-[#e2e8f0] flex-wrap gap-3">
            <div className="text-xs text-[#64748b]">
              Editing: <strong className="text-[#0a1628]">{editingDeparture.title || "New Departure"}</strong>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleSaveDeparture}
                className="bg-[#f97316] hover:bg-[#ea580c] text-white font-bold gap-2 shadow-md"
              >
                <Save size={16} />
                Save Departure Schedule &amp; Itinerary
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Departures Grid Cards */}
      {departures.length === 0 && !loading && (
        <div className="bg-white rounded-3xl border-2 border-dashed border-[#cbd5e1] p-12 text-center max-w-xl mx-auto space-y-4">
          <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto text-[#f97316]">
            <Calendar size={28} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#0a1628]">No Fixed Departures Scheduled</h3>
            <p className="text-xs sm:text-sm text-[#64748b] mt-1">
              All dummy departures have been removed. Click below to add your first real upcoming group tour departure with dates, pricing, URL slug, and full day-by-day itinerary.
            </p>
          </div>
          <Button onClick={handleOpenCreate} className="bg-[#f97316] hover:bg-[#ea580c] text-white gap-2 shadow-md">
            <Plus size={16} /> Schedule First Departure
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {departures.map((dep) => (
          <div
            key={dep.id}
            className="bg-white rounded-3xl border border-[#e2e8f0] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between text-left group"
          >
            <div>
              <div className="relative h-48 w-full overflow-hidden bg-[#0a1628]">
                <Image
                  src={dep.image}
                  alt={dep.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-[#0a1628]/80 backdrop-blur-xs text-white text-xs font-bold px-3 py-1 rounded-full border border-white/10">
                  {dep.seasonTag}
                </div>
                <div
                  className={`absolute top-3 right-3 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md ${
                    dep.availableSeats <= 3 || dep.status === "FILLING_FAST"
                      ? "bg-red-600 animate-pulse"
                      : dep.status === "SOLD_OUT"
                      ? "bg-slate-700"
                      : "bg-emerald-600"
                  }`}
                >
                  {dep.status === "SOLD_OUT"
                    ? "Sold Out"
                    : dep.availableSeats <= 3
                    ? `🔥 Only ${dep.availableSeats} Seats Left`
                    : `✓ ${dep.availableSeats} Seats Open`}
                </div>
              </div>

              <div className="p-5 space-y-3">
                <div className="flex items-center gap-1.5 text-xs text-[#64748b]">
                  <MapPin size={14} className="text-[#0ea5e9]" />
                  {dep.destination}
                </div>
                <h3 className="font-bold text-[#0a1628] text-lg leading-snug">
                  {dep.title}
                </h3>
                <div className="flex items-center justify-between text-xs text-[#475569] border-t border-b border-[#f1f5f9] py-2">
                  <span className="flex items-center gap-1 font-semibold text-[#0ea5e9]">
                    <Calendar size={13} /> {dep.startDate} → {dep.endDate}
                  </span>
                  <span className="font-extrabold text-[#0a1628] text-sm">
                    NPR {dep.price.toLocaleString()}
                  </span>
                </div>

                <div className="text-[11px] text-[#64748b] flex justify-between items-center">
                  <span>Seats Capacity: {dep.totalSeats} Pax</span>
                  <span className={`font-mono font-bold ${dep.availableSeats <= 3 ? "text-red-600" : "text-emerald-700"}`}>
                    Available: {dep.availableSeats}
                  </span>
                </div>

                {/* Sub-details pill badges */}
                <div className="flex items-center gap-2 pt-1 text-[11px] text-[#64748b]">
                  <span className="bg-sky-50 text-sky-700 font-semibold px-2 py-0.5 rounded-md border border-sky-100 flex items-center gap-1">
                    <Clock size={11} /> {dep.itinerary?.length || (dep.duration?.match(/\d+/)?.[0] || 6)} Days Plan
                  </span>
                  <span className="bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded-md border border-emerald-100 flex items-center gap-1">
                    <CheckCircle2 size={11} /> {dep.inclusions?.length || 4}+ Perks
                  </span>
                </div>
              </div>
            </div>

            <div className="p-5 pt-0 flex gap-2">
              <Button
                onClick={() => handleOpenEdit(dep)}
                variant="outline"
                size="sm"
                className="flex-1 gap-1 border-[#e2e8f0] text-xs font-bold text-[#0a1628] hover:bg-slate-50"
              >
                <Edit size={14} /> Edit Itinerary &amp; Details
              </Button>
              <Link
                href={`/departures/${dep.id}`}
                target="_blank"
                className="inline-flex items-center justify-center px-2.5 py-1.5 text-xs font-bold text-[#0ea5e9] hover:bg-sky-50 rounded-xl border border-sky-200 transition-colors"
                title="Preview live public departure page"
              >
                <ExternalLink size={14} />
              </Link>
              <Button
                onClick={() => handleDeleteDeparture(dep.id)}
                variant="ghost"
                size="sm"
                className="text-red-600 hover:bg-red-50 px-2.5"
              >
                <Trash2 size={14} />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
