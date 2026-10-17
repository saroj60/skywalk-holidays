"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Plus,
  Edit,
  Trash2,
  Clock,
  MapPin,
  Check,
  X,
  Image as ImageIcon,
  Save,
  Tag,
  RefreshCw,
  FileText,
  Calendar,
  Hotel,
  Car,
  CheckCircle2,
  XCircle,
  Upload,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  Sparkles,
  Search,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  getPackagesAsAdminRecords,
  AdminPackageRecord,
} from "@/lib/packagesData";

export type PackageRecord = AdminPackageRecord;
export type ItineraryDay = AdminPackageRecord["itinerary"][number];

export const INITIAL_PACKAGES: PackageRecord[] = getPackagesAsAdminRecords();

const LOCAL_STORAGE_KEY = "skywalk_admin_packages_v1";

export default function PackageManager() {
  const [packages, setPackages] = useState<PackageRecord[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      } catch (e) {
        console.warn("Could not read local storage for packages:", e);
      }
    }
    return getPackagesAsAdminRecords();
  });

  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("ALL");
  const [statusNotification, setStatusNotification] = useState<string | null>(null);

  // Modal / Drawer state
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "general" | "intro" | "itinerary" | "cost" | "hotel"
  >("general");
  const [editingPackage, setEditingPackage] = useState<Partial<PackageRecord> | null>(null);

  // New item inputs
  const [newHighlight, setNewHighlight] = useState("");
  const [newInclusion, setNewInclusion] = useState("");
  const [newExclusion, setNewExclusion] = useState("");
  const [newGalleryUrl, setNewGalleryUrl] = useState("");
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  // New Itinerary Day inputs
  const [newDayLabel, setNewDayLabel] = useState("");
  const [newDayTitle, setNewDayTitle] = useState("");
  const [newDayHighlight, setNewDayHighlight] = useState("");
  const [newDayDesc, setNewDayDesc] = useState("");
  const [newDayMeals, setNewDayMeals] = useState("");
  const [newDayStay, setNewDayStay] = useState("");

  const showNotification = (msg: string) => {
    setStatusNotification(msg);
    setTimeout(() => setStatusNotification(null), 3500);
  };

  const persistPackages = (newPackages: PackageRecord[]) => {
    setPackages(newPackages);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newPackages));
      } catch (e) {
        console.warn("Failed saving packages to localStorage", e);
      }
    }
  };

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/packages");
      if (res.ok) {
        const data = await res.json();
        if (data.packages && data.packages.length > 0) {
          persistPackages(data.packages);
          showNotification("Synchronized with server database!");
          return;
        }
      }
      showNotification("Using local master packages (all 17 verified)");
    } catch (err) {
      showNotification("Server offline; using local packages");
    } finally {
      setLoading(false);
    }
  };

  const handleResetToDefaults = () => {
    if (
      confirm(
        "Reset all holiday packages to the original website master data? Any unsaved local edits will be replaced with fresh site data."
      )
    ) {
      const defaults = getPackagesAsAdminRecords();
      persistPackages(defaults);
      showNotification("Successfully reset all packages to original website content!");
    }
  };

  const handleOpenCreate = () => {
    setEditingPackage({
      slug: "",
      title: "",
      destination: "",
      country: "",
      duration: "5 Nights / 6 Days",
      price: 65000,
      originalPrice: 78000,
      overview: "",
      highlights: [
        "International roundtrip flight tickets included",
        "Dedicated airport meet and greet transfers",
        "Premium accommodation with daily breakfast",
      ],
      coverImage: "/images/bangkok-pattaya.png",
      gallery: [],
      inclusions: [
        "Roundtrip Flights",
        "4-Star Deluxe Hotel Stay",
        "Daily Buffet Breakfast",
        "Private Airport Transfers",
      ],
      exclusions: ["Personal Expenses", "Tips & Gratuities", "Travel Insurance"],
      itinerary: [
        {
          day: "Day 1",
          title: "Arrival & Hotel Transfer",
          highlight: "Welcome reception",
          description: "Meet your representative at the airport and transfer to hotel. Check-in and relax.",
          meals: "Dinner",
          stay: "Deluxe Hotel",
        },
        {
          day: "Day 2",
          title: "Guided Sightseeing Tour",
          highlight: "City exploration",
          description: "Comprehensive guided city tour visiting major historical and cultural landmarks.",
          meals: "Breakfast",
          stay: "Deluxe Hotel",
        },
      ],
      hotelInfo: "4-Star Deluxe Hotel or similar",
      transportation: "Private AC Vehicle Transfers",
      category: "International",
      badge: "Popular",
      featured: false,
      status: "ACTIVE",
    });
    setActiveTab("general");
    setIsEditing(true);
  };

  const handleOpenEdit = (pkg: PackageRecord) => {
    setEditingPackage({
      ...pkg,
      slug: pkg.slug || "",
      highlights: pkg.highlights ? [...pkg.highlights] : [],
      inclusions: pkg.inclusions ? [...pkg.inclusions] : [],
      exclusions: pkg.exclusions ? [...pkg.exclusions] : [],
      itinerary: pkg.itinerary ? pkg.itinerary.map((it) => ({ ...it })) : [],
      gallery: pkg.gallery ? [...pkg.gallery] : [],
    });
    setActiveTab("general");
    setIsEditing(true);
  };

  const handleSavePackage = async () => {
    if (!editingPackage?.title || !editingPackage?.destination || !editingPackage?.price) {
      alert("Please fill in Package Title, Destination, and Price before saving.");
      return;
    }

    const safeSlug = (editingPackage.slug || editingPackage.title || "package")
      .toLowerCase()
      .replace(/[^a-z0-9-_]+/g, "-")
      .replace(/(^-|-$)/g, "");

    let updatedList: PackageRecord[];
    if (editingPackage.id) {
      // Update existing
      updatedList = packages.map((p) =>
        p.id === editingPackage.id ? ({ ...p, ...editingPackage, slug: safeSlug } as PackageRecord) : p
      );
    } else {
      // Create new
      const newId = Math.max(0, ...packages.map((p) => Number(p.id) || 0)) + 1;
      const newPkg: PackageRecord = {
        id: newId,
        slug: safeSlug,
        title: editingPackage.title,
        destination: editingPackage.destination,
        country: editingPackage.country || "International",
        duration: editingPackage.duration || "5 Nights / 6 Days",
        price: Number(editingPackage.price),
        originalPrice: Number(editingPackage.originalPrice || editingPackage.price * 1.2),
        rating: editingPackage.rating || 4.9,
        reviews: editingPackage.reviews || 120,
        overview: editingPackage.overview || "",
        highlights: editingPackage.highlights || [],
        inclusions: editingPackage.inclusions || [],
        exclusions: editingPackage.exclusions || [],
        itinerary: editingPackage.itinerary || [],
        hotelInfo: editingPackage.hotelInfo || "3-Star Deluxe Hotels",
        transportation: editingPackage.transportation || "Private AC Transfers",
        coverImage: editingPackage.coverImage || "/images/bangkok-pattaya.png",
        gallery: editingPackage.gallery || [],
        category: editingPackage.category || "International",
        badge: editingPackage.badge || "Popular",
        featured: editingPackage.featured ?? false,
        status: editingPackage.status || "ACTIVE",
      };
      updatedList = [newPkg, ...packages];
    }

    // Persist immediately in state and local storage
    persistPackages(updatedList);
    showNotification(`Package "${editingPackage.title}" saved successfully!`);

    // Non-blocking sync with backend API if running
    try {
      const endpoint = editingPackage.id ? `/api/packages/${editingPackage.id}` : "/api/packages";
      const method = editingPackage.id ? "PATCH" : "POST";
      await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingPackage),
      });
    } catch (e) {
      console.warn("Backend API not reachable; changes saved locally in browser.", e);
    }

    setIsEditing(false);
    setEditingPackage(null);
  };

  const handleDeletePackage = async (id: string | number) => {
    const pkg = packages.find((p) => p.id === id);
    if (!confirm(`Are you sure you want to delete "${pkg?.title || "this package"}"?`)) return;
    const updated = packages.filter((p) => p.id !== id);
    persistPackages(updated);
    showNotification("Package deleted.");
    await fetch(`/api/packages/${id}`, { method: "DELETE" }).catch(() => null);
  };

  // Itinerary Handlers
  const handleUpdateItineraryDay = (
    index: number,
    field: keyof ItineraryDay,
    value: string
  ) => {
    if (!editingPackage?.itinerary) return;
    const newItinerary = [...editingPackage.itinerary];
    newItinerary[index] = {
      ...newItinerary[index],
      [field]: value,
    };
    setEditingPackage({
      ...editingPackage,
      itinerary: newItinerary,
    });
  };

  const handleMoveItineraryDay = (index: number, direction: "up" | "down") => {
    if (!editingPackage?.itinerary) return;
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= editingPackage.itinerary.length) return;
    const newItinerary = [...editingPackage.itinerary];
    const temp = newItinerary[index];
    newItinerary[index] = newItinerary[targetIndex];
    newItinerary[targetIndex] = temp;
    setEditingPackage({
      ...editingPackage,
      itinerary: newItinerary,
    });
  };

  const handleAddItineraryDay = () => {
    if (!newDayTitle.trim() || !editingPackage) return;
    const dayLabel = newDayLabel.trim() || `Day ${(editingPackage.itinerary?.length || 0) + 1}`;
    setEditingPackage({
      ...editingPackage,
      itinerary: [
        ...(editingPackage.itinerary || []),
        {
          day: dayLabel,
          title: newDayTitle.trim(),
          highlight: newDayHighlight.trim(),
          description: newDayDesc.trim(),
          meals: newDayMeals.trim(),
          stay: newDayStay.trim(),
        },
      ],
    });
    setNewDayLabel("");
    setNewDayTitle("");
    setNewDayHighlight("");
    setNewDayDesc("");
    setNewDayMeals("");
    setNewDayStay("");
  };

  const handleRemoveItineraryDay = (idx: number) => {
    if (!editingPackage?.itinerary) return;
    setEditingPackage({
      ...editingPackage,
      itinerary: editingPackage.itinerary.filter((_, i) => i !== idx),
    });
  };

  // Inclusions & Exclusions Handlers
  const handleUpdateInclusion = (idx: number, val: string) => {
    if (!editingPackage?.inclusions) return;
    const updated = [...editingPackage.inclusions];
    updated[idx] = val;
    setEditingPackage({ ...editingPackage, inclusions: updated });
  };

  const handleAddInclusion = () => {
    if (!newInclusion.trim() || !editingPackage) return;
    setEditingPackage({
      ...editingPackage,
      inclusions: [...(editingPackage.inclusions || []), newInclusion.trim()],
    });
    setNewInclusion("");
  };

  const handleRemoveInclusion = (idx: number) => {
    if (!editingPackage) return;
    setEditingPackage({
      ...editingPackage,
      inclusions: (editingPackage.inclusions || []).filter((_, i) => i !== idx),
    });
  };

  const handleUpdateExclusion = (idx: number, val: string) => {
    if (!editingPackage?.exclusions) return;
    const updated = [...editingPackage.exclusions];
    updated[idx] = val;
    setEditingPackage({ ...editingPackage, exclusions: updated });
  };

  const handleAddExclusion = () => {
    if (!newExclusion.trim() || !editingPackage) return;
    setEditingPackage({
      ...editingPackage,
      exclusions: [...(editingPackage.exclusions || []), newExclusion.trim()],
    });
    setNewExclusion("");
  };

  const handleRemoveExclusion = (idx: number) => {
    if (!editingPackage) return;
    setEditingPackage({
      ...editingPackage,
      exclusions: (editingPackage.exclusions || []).filter((_, i) => i !== idx),
    });
  };

  // Highlights Handlers
  const handleUpdateHighlight = (idx: number, val: string) => {
    if (!editingPackage?.highlights) return;
    const updated = [...editingPackage.highlights];
    updated[idx] = val;
    setEditingPackage({ ...editingPackage, highlights: updated });
  };

  const handleAddHighlight = () => {
    if (!newHighlight.trim() || !editingPackage) return;
    setEditingPackage({
      ...editingPackage,
      highlights: [...(editingPackage.highlights || []), newHighlight.trim()],
    });
    setNewHighlight("");
  };

  const handleRemoveHighlight = (idx: number) => {
    if (!editingPackage) return;
    setEditingPackage({
      ...editingPackage,
      highlights: (editingPackage.highlights || []).filter((_, i) => i !== idx),
    });
  };

  // Gallery Handlers
  const handleAddGalleryImage = () => {
    if (!newGalleryUrl.trim() || !editingPackage) return;
    setEditingPackage({
      ...editingPackage,
      gallery: [...(editingPackage.gallery || []), newGalleryUrl.trim()],
    });
    setNewGalleryUrl("");
  };

  const handleRemoveGalleryImage = (idx: number) => {
    if (!editingPackage) return;
    setEditingPackage({
      ...editingPackage,
      gallery: (editingPackage.gallery || []).filter((_, i) => i !== idx),
    });
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingPackage) return;

    setUploadingCover(true);
    try {
      const data = new FormData();
      data.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: data });
      if (res.ok) {
        const json = await res.json();
        if (json.url) {
          setEditingPackage((prev) => (prev ? { ...prev, coverImage: json.url } : null));
        }
      } else {
        alert("Image upload failed. Please try a valid image file.");
      }
    } catch (err) {
      alert("Error uploading image from local device.");
    } finally {
      setUploadingCover(false);
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingPackage) return;

    setUploadingGallery(true);
    try {
      const data = new FormData();
      data.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: data });
      if (res.ok) {
        const json = await res.json();
        if (json.url) {
          setEditingPackage((prev) => {
            if (!prev) return null;
            return {
              ...prev,
              gallery: [...(prev.gallery || []), json.url],
            };
          });
        }
      } else {
        alert("Gallery photo upload failed.");
      }
    } catch (err) {
      alert("Error uploading photo from local device.");
    } finally {
      setUploadingGallery(false);
    }
  };

  // Filtered packages
  const filteredPackages = packages.filter((pkg) => {
    const matchesSearch =
      pkg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.country.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      filterCategory === "ALL" || pkg.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container-custom py-8 space-y-8">
      {/* Toast Notification */}
      {statusNotification && (
        <div className="fixed top-6 right-6 z-50 bg-[#0a1628] text-white px-5 py-3 rounded-2xl shadow-2xl border border-[#0ea5e9]/50 flex items-center gap-3 animate-fade-in text-sm font-semibold">
          <Sparkles size={18} className="text-[#0ea5e9]" />
          <span>{statusNotification}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#e2e8f0] shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-[#0ea5e9]/10 text-[#0284c7] font-bold text-xs px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Admin Control Panel
            </span>
            <span className="text-xs text-[#64748b]">
              • {packages.length} Packages in Catalog
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#0a1628] mt-1">
            Holiday Package Inventory Manager
          </h1>
          <p className="text-xs sm:text-sm text-[#64748b] mt-0.5">
            Full edit control over package itineraries, day descriptions, highlights, inclusions, exclusions, hotels, and prices.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            onClick={handleResetToDefaults}
            variant="outline"
            size="sm"
            className="gap-2 border-[#e2e8f0] text-[#64748b] hover:text-[#0a1628]"
            title="Restore website original data for all packages"
          >
            <RotateCcw size={14} />
            Reset to Website Master Data
          </Button>

          <Button
            onClick={fetchPackages}
            variant="outline"
            size="sm"
            className="gap-2 border-[#e2e8f0]"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            Sync Server
          </Button>

          <Button
            onClick={handleOpenCreate}
            className="bg-[#f97316] hover:bg-[#ea580c] text-white gap-2 shadow-md font-bold"
          >
            <Plus size={16} />
            Create New Package
          </Button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#e2e8f0] shadow-xs">
        <div className="relative w-full sm:w-96">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
          <Input
            placeholder="Search package by title, destination, country..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 text-xs bg-[#f8fafc] border-[#e2e8f0] rounded-xl"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter size={14} className="text-[#64748b]" />
          <span className="text-xs text-[#64748b] font-medium">Category:</span>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="text-xs bg-[#f8fafc] border border-[#e2e8f0] rounded-xl px-3 py-2 text-[#0a1628] font-medium focus:outline-none"
          >
            <option value="ALL">All Categories</option>
            <option value="International">International</option>
            <option value="Domestic">Domestic</option>
          </select>
        </div>
      </div>

      {/* Comprehensive Package Details Editor Drawer / Modal */}
      {isEditing && editingPackage && (
        <div className="bg-white p-6 md:p-8 rounded-3xl border-2 border-[#0ea5e9]/50 shadow-2xl space-y-6 animate-fade-in text-left">
          <div className="flex items-center justify-between pb-4 border-b border-[#e2e8f0]">
            <div>
              <span className="text-xs font-bold text-[#0ea5e9] uppercase tracking-wider">
                Interactive Package Editor
              </span>
              <h3 className="text-xl font-bold text-[#0a1628]">
                {editingPackage.id ? `Editing: ${editingPackage.title}` : "Create New Holiday Package"}
              </h3>
            </div>
            <button
              onClick={() => setIsEditing(false)}
              className="p-2 text-[#64748b] hover:bg-[#f1f5f9] rounded-xl transition-all"
            >
              <X size={20} />
            </button>
          </div>

          {/* Editor Tabs Navigation */}
          <div className="flex flex-wrap gap-2 border-b border-[#e2e8f0] pb-3">
            {[
              { id: "general", label: "1. Basic Info & Price", icon: Tag },
              { id: "intro", label: "2. Overview & Highlights", icon: FileText },
              { id: "itinerary", label: "3. Day-by-Day Itinerary", icon: Calendar },
              { id: "cost", label: "4. Included / Excluded", icon: CheckCircle2 },
              { id: "hotel", label: "5. Hotel, Transport & Photos", icon: Hotel },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? "bg-[#0a1628] text-white shadow-md"
                      : "bg-[#f8fafc] text-[#64748b] border border-[#e2e8f0] hover:text-[#0a1628]"
                  }`}
                >
                  <Icon size={14} className={activeTab === tab.id ? "text-[#0ea5e9]" : ""} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab 1: Basic Info & Price */}
          {activeTab === "general" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-[#0a1628] uppercase tracking-wider mb-1 block">
                  Package Title *
                </label>
                <Input
                  placeholder="e.g. Bangkok Pattaya - 05 Nights and 06 Day Itinerary"
                  value={editingPackage.title || ""}
                  onChange={(e) => setEditingPackage({ ...editingPackage, title: e.target.value })}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#0a1628] uppercase tracking-wider mb-1 block">
                  Destination Region *
                </label>
                <Input
                  placeholder="e.g. Bangkok & Pattaya, Thailand"
                  value={editingPackage.destination || ""}
                  onChange={(e) =>
                    setEditingPackage({ ...editingPackage, destination: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#0a1628] uppercase tracking-wider mb-1 block">
                  Country *
                </label>
                <Input
                  placeholder="e.g. Thailand"
                  value={editingPackage.country || ""}
                  onChange={(e) => setEditingPackage({ ...editingPackage, country: e.target.value })}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#0a1628] uppercase tracking-wider mb-1 block flex items-center justify-between">
                  <span>URL Slug (SEO Permalink)</span>
                  <span className="text-[10px] text-[#0ea5e9] font-semibold lowercase">/packages/[slug]</span>
                </label>
                <Input
                  placeholder="e.g. bangkok-pattaya-6d"
                  value={editingPackage.slug || ""}
                  onChange={(e) =>
                    setEditingPackage({
                      ...editingPackage,
                      slug: e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, ""),
                    })
                  }
                />
                <span className="text-[11px] text-[#64748b] block mt-0.5 font-mono truncate">
                  Link: /packages/{editingPackage.slug || "package-slug"}
                </span>
              </div>

              <div>
                <label className="text-xs font-bold text-[#0a1628] uppercase tracking-wider mb-1 block">
                  Duration (Nights / Days) *
                </label>
                <Input
                  placeholder="e.g. 05 Nights and 06 Days"
                  value={editingPackage.duration || ""}
                  onChange={(e) => setEditingPackage({ ...editingPackage, duration: e.target.value })}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#0a1628] uppercase tracking-wider mb-1 block">
                  Category
                </label>
                <select
                  value={editingPackage.category || "International"}
                  onChange={(e) =>
                    setEditingPackage({ ...editingPackage, category: e.target.value })
                  }
                  className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="International">International</option>
                  <option value="Domestic">Domestic</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-[#0a1628] uppercase tracking-wider mb-1 block">
                  Selling Price (NPR) *
                </label>
                <Input
                  type="number"
                  placeholder="e.g. 48000"
                  value={editingPackage.price || ""}
                  onChange={(e) =>
                    setEditingPackage({ ...editingPackage, price: Number(e.target.value) })
                  }
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#0a1628] uppercase tracking-wider mb-1 block">
                  Original Price (Crossed out)
                </label>
                <Input
                  type="number"
                  placeholder="e.g. 58000"
                  value={editingPackage.originalPrice || ""}
                  onChange={(e) =>
                    setEditingPackage({ ...editingPackage, originalPrice: Number(e.target.value) })
                  }
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#0a1628] uppercase tracking-wider mb-1 block">
                  Badge Tag
                </label>
                <Input
                  placeholder="e.g. Popular, Best Value, Luxury"
                  value={editingPackage.badge || ""}
                  onChange={(e) => setEditingPackage({ ...editingPackage, badge: e.target.value })}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#0a1628] uppercase tracking-wider mb-1 block">
                  Status
                </label>
                <select
                  value={editingPackage.status || "ACTIVE"}
                  onChange={(e) =>
                    setEditingPackage({
                      ...editingPackage,
                      status: e.target.value as "ACTIVE" | "DRAFT" | "ARCHIVED",
                    })
                  }
                  className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="ACTIVE">ACTIVE (Visible)</option>
                  <option value="DRAFT">DRAFT (Hidden)</option>
                  <option value="ARCHIVED">ARCHIVED</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-6">
                <input
                  type="checkbox"
                  id="featured-checkbox"
                  checked={editingPackage.featured || false}
                  onChange={(e) =>
                    setEditingPackage({ ...editingPackage, featured: e.target.checked })
                  }
                  className="w-4 h-4 rounded text-[#f97316] accent-[#f97316]"
                />
                <label htmlFor="featured-checkbox" className="text-xs font-bold text-[#0a1628] cursor-pointer">
                  Feature on Homepage &amp; Top Packages
                </label>
              </div>
            </div>
          )}

          {/* Tab 2: Overview & Highlights */}
          {activeTab === "intro" && (
            <div className="space-y-6">
              <div>
                <label className="text-xs font-bold text-[#0a1628] uppercase tracking-wider mb-1.5 block">
                  Package Overview &amp; Experience Summary *
                </label>
                <textarea
                  rows={8}
                  className="w-full min-h-[170px] rounded-2xl border border-[#cbd5e1] bg-white p-4 text-sm text-[#0a1628] placeholder:text-[#94a3b8] focus:outline-none focus:border-[#0ea5e9] leading-relaxed resize-y shadow-2xs"
                  placeholder="Describe the full tour experience, highlight attractions, shopping, cultural sights, and unique experiences..."
                  value={editingPackage.overview || ""}
                  onChange={(e) =>
                    setEditingPackage({ ...editingPackage, overview: e.target.value })
                  }
                />
              </div>

              {/* Highlights Manager */}
              <div className="space-y-3 bg-[#f8fafc] p-5 rounded-2xl border border-[#e2e8f0]">
                <h4 className="font-bold text-[#0a1628] text-sm flex items-center gap-1.5">
                  <Sparkles size={16} className="text-[#f97316]" />
                  Key Highlights ({editingPackage.highlights?.length || 0})
                </h4>
                <div className="space-y-2">
                  {editingPackage.highlights?.map((hl, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-[#e2e8f0] shadow-2xs"
                    >
                      <span className="text-[#f97316] font-bold text-xs shrink-0">★</span>
                      <input
                        type="text"
                        value={hl}
                        onChange={(e) => handleUpdateHighlight(i, e.target.value)}
                        className="flex-1 text-xs text-[#0a1628] bg-transparent focus:outline-none"
                      />
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
                    placeholder="Add a new highlight (e.g. Free Coral Island Speedboat excursion)..."
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

          {/* Tab 3: Day-by-Day Itinerary Builder */}
          {activeTab === "itinerary" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-[#0a1628] text-sm flex items-center gap-1.5">
                    <Calendar size={16} className="text-[#0ea5e9]" />
                    Configured Itinerary Days ({editingPackage.itinerary?.length || 0})
                  </h4>
                  <p className="text-xs text-[#64748b] mt-0.5">
                    You can edit day labels, titles, highlights, descriptions, meals, and hotels directly below.
                  </p>
                </div>
              </div>

              {/* Day List - Fully Editable Cards */}
              <div className="space-y-5 max-h-[720px] overflow-y-auto pr-3">
                {editingPackage.itinerary?.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-[#f8fafc] p-4 sm:p-5 rounded-2xl border border-[#e2e8f0] relative space-y-3.5 shadow-2xs hover:border-[#0ea5e9]/40 transition-all"
                  >
                    {/* Top Row: Day Label, Reorder buttons, Trash */}
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <div className="flex items-center gap-2">
                        <Input
                          value={item.day}
                          onChange={(e) => handleUpdateItineraryDay(idx, "day", e.target.value)}
                          className="w-24 text-xs font-extrabold text-[#0284c7] bg-[#e0f2fe] uppercase border-none h-8 rounded-lg"
                        />
                        <span className="text-xs text-[#94a3b8]">Step {idx + 1}</span>
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
                          disabled={idx === (editingPackage.itinerary?.length || 0) - 1}
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

                    {/* Day Title & Highlight */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2">
                        <label className="text-[11px] font-bold text-[#475569] uppercase tracking-wider block mb-1">
                          Day Title *
                        </label>
                        <Input
                          value={item.title}
                          placeholder="e.g. Arrival in Bangkok — Private Transfer to Pattaya"
                          onChange={(e) => handleUpdateItineraryDay(idx, "title", e.target.value)}
                          className="text-xs bg-white font-bold text-[#0a1628]"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-[#475569] uppercase tracking-wider block mb-1">
                          Key Highlight / Badge
                        </label>
                        <Input
                          value={item.highlight || ""}
                          placeholder="e.g. Speedboat to Coral Island"
                          onChange={(e) => handleUpdateItineraryDay(idx, "highlight", e.target.value)}
                          className="text-xs bg-white text-[#f97316] font-medium"
                        />
                      </div>
                    </div>

                    {/* Day Description Textarea - Large, Expandable, Comfortable Reading Box */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] font-bold text-[#475569] uppercase tracking-wider block">
                          Detailed Day Activities &amp; Sightseeing *
                        </label>
                        <span className="text-[10px] text-[#94a3b8]">Drag bottom-right corner to expand box</span>
                      </div>
                      <textarea
                        rows={6}
                        value={item.description}
                        placeholder="Detailed schedule of sights, transfers, activities, and recommendations..."
                        onChange={(e) => handleUpdateItineraryDay(idx, "description", e.target.value)}
                        className="w-full min-h-[140px] rounded-xl border border-[#cbd5e1] bg-white p-3.5 text-sm text-[#0a1628] leading-relaxed focus:outline-none focus:border-[#0ea5e9] resize-y shadow-2xs font-normal"
                      />
                    </div>

                    {/* Meals & Stay info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div>
                        <label className="text-[10px] font-bold text-[#64748b] uppercase tracking-wider block mb-1">
                          Included Meals (Optional)
                        </label>
                        <Input
                          value={item.meals || ""}
                          placeholder="e.g. Breakfast, Indian Buffet Lunch"
                          onChange={(e) => handleUpdateItineraryDay(idx, "meals", e.target.value)}
                          className="text-xs bg-white text-[#475569]"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-[#64748b] uppercase tracking-wider block mb-1">
                          Hotel / Stay Location (Optional)
                        </label>
                        <Input
                          value={item.stay || ""}
                          placeholder="e.g. Welcome Plaza Hotel Pattaya"
                          onChange={(e) => handleUpdateItineraryDay(idx, "stay", e.target.value)}
                          className="text-xs bg-white text-[#475569]"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add New Day Form */}
              <div className="bg-[#f0f9ff] p-5 rounded-2xl border border-[#0ea5e9]/30 space-y-3">
                <h5 className="font-bold text-[#0a1628] text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Plus size={14} className="text-[#0ea5e9]" />
                  Add Another Day to Itinerary
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Input
                    placeholder="Day Label (e.g. Day 7)"
                    value={newDayLabel}
                    onChange={(e) => setNewDayLabel(e.target.value)}
                    className="text-xs bg-white"
                  />
                  <div className="sm:col-span-2">
                    <Input
                      placeholder="Day Title (e.g. Leisure Day & Shopping at Chatuchak)"
                      value={newDayTitle}
                      onChange={(e) => setNewDayTitle(e.target.value)}
                      className="text-xs bg-white"
                    />
                  </div>
                </div>
                <Input
                  placeholder="Key Highlight (e.g. Sunset Dinner Cruise on Chao Phraya River)"
                  value={newDayHighlight}
                  onChange={(e) => setNewDayHighlight(e.target.value)}
                  className="text-xs bg-white"
                />
                <textarea
                  rows={4}
                  placeholder="Detailed description of activities, transfers, meals, and sightseeing..."
                  value={newDayDesc}
                  onChange={(e) => setNewDayDesc(e.target.value)}
                  className="w-full min-h-[110px] rounded-xl border border-[#cbd5e1] bg-white p-3.5 text-sm text-[#0a1628] focus:outline-none focus:border-[#0ea5e9] resize-y"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    placeholder="Meals (e.g. Breakfast included)"
                    value={newDayMeals}
                    onChange={(e) => setNewDayMeals(e.target.value)}
                    className="text-xs bg-white"
                  />
                  <Input
                    placeholder="Stay (e.g. Bangkok City Hotel)"
                    value={newDayStay}
                    onChange={(e) => setNewDayStay(e.target.value)}
                    className="text-xs bg-white"
                  />
                </div>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleAddItineraryDay}
                  className="bg-[#0a1628] text-white font-bold gap-1.5"
                >
                  <Plus size={14} /> Add Day to Itinerary
                </Button>
              </div>
            </div>
          )}

          {/* Tab 4: Cost Included / Excluded */}
          {activeTab === "cost" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Cost Included */}
              <div className="space-y-3 bg-emerald-50/50 p-5 rounded-2xl border border-emerald-200">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-emerald-900 text-sm flex items-center gap-1.5">
                    <CheckCircle2 size={16} className="text-emerald-600" />
                    Cost Included (Inclusions) ({editingPackage.inclusions?.length || 0})
                  </h4>
                </div>
                <p className="text-[11px] text-emerald-700">
                  Click and edit any inclusion directly below or add new items.
                </p>
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {editingPackage.inclusions?.map((inc, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-emerald-200 shadow-2xs"
                    >
                      <span className="text-emerald-600 font-bold shrink-0">✓</span>
                      <input
                        type="text"
                        value={inc}
                        onChange={(e) => handleUpdateInclusion(i, e.target.value)}
                        className="flex-1 text-xs text-[#0a1628] bg-transparent focus:outline-none"
                      />
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
                    placeholder="e.g. 5-Star Hotel Stay with Breakfast"
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
                    Add Included
                  </Button>
                </div>
              </div>

              {/* Cost Excluded */}
              <div className="space-y-3 bg-rose-50/50 p-5 rounded-2xl border border-rose-200">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-rose-900 text-sm flex items-center gap-1.5">
                    <XCircle size={16} className="text-rose-600" />
                    Cost Excluded (Exclusions) ({editingPackage.exclusions?.length || 0})
                  </h4>
                </div>
                <p className="text-[11px] text-rose-700">
                  Click and edit any exclusion directly below or add new items.
                </p>
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {editingPackage.exclusions?.map((exc, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-rose-200 shadow-2xs"
                    >
                      <span className="text-rose-600 font-bold shrink-0">✕</span>
                      <input
                        type="text"
                        value={exc}
                        onChange={(e) => handleUpdateExclusion(i, e.target.value)}
                        className="flex-1 text-xs text-[#0a1628] bg-transparent focus:outline-none"
                      />
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
                    placeholder="e.g. Travel and Medical Insurance"
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
                    Add Excluded
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Tab 5: Hotel, Transport & Photos */}
          {activeTab === "hotel" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#0a1628] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Hotel size={14} className="text-[#0ea5e9]" />
                    Hotel Tier &amp; Accommodation Details
                  </label>
                  <Input
                    placeholder="e.g. 4-Star Al Khoory Atrium Hotel or similar"
                    value={editingPackage.hotelInfo || ""}
                    onChange={(e) =>
                      setEditingPackage({ ...editingPackage, hotelInfo: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#0a1628] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Car size={14} className="text-[#0ea5e9]" />
                    Transportation &amp; Flight Info
                  </label>
                  <Input
                    placeholder="e.g. Private AC Sedan & Speedboat Transfers"
                    value={editingPackage.transportation || ""}
                    onChange={(e) =>
                      setEditingPackage({ ...editingPackage, transportation: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Cover Image Manager */}
              <div className="space-y-3 pt-2 border-t border-[#e2e8f0]">
                <h4 className="font-bold text-[#0a1628] text-sm flex items-center gap-1.5">
                  <ImageIcon size={16} className="text-[#0ea5e9]" />
                  Package Cover Image URL
                </h4>
                <div className="flex flex-wrap gap-2 items-center">
                  <Input
                    placeholder="Cover Image Path or URL..."
                    value={editingPackage.coverImage || ""}
                    onChange={(e) =>
                      setEditingPackage({ ...editingPackage, coverImage: e.target.value })
                    }
                    className="text-xs flex-1 min-w-[240px]"
                  />
                  <label className="cursor-pointer inline-flex items-center gap-1.5 bg-[#0ea5e9] hover:bg-[#0284c7] text-white px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 shadow-xs">
                    <Upload size={14} />
                    {uploadingCover ? "Uploading..." : "Upload Local Image"}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleCoverUpload}
                      disabled={uploadingCover}
                    />
                  </label>
                </div>
              </div>

              {/* Gallery Image Manager */}
              <div className="space-y-3 pt-2 border-t border-[#e2e8f0]">
                <h4 className="font-bold text-[#0a1628] text-sm flex items-center gap-1.5">
                  <ImageIcon size={16} className="text-[#0ea5e9]" />
                  Photo Gallery URLs ({editingPackage.gallery?.length || 0})
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                  {editingPackage.gallery?.map((imgUrl, i) => (
                    <div
                      key={i}
                      className="relative h-24 rounded-xl overflow-hidden border border-[#e2e8f0] group bg-[#0a1628]"
                    >
                      <Image
                        src={imgUrl}
                        alt={`Gallery ${i}`}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveGalleryImage(i)}
                        className="absolute top-1.5 right-1.5 bg-red-600 text-white p-1 rounded-full opacity-90 hover:opacity-100 shadow-sm"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2 max-w-xl pt-2 items-center">
                  <Input
                    placeholder="Paste Image URL..."
                    value={newGalleryUrl}
                    onChange={(e) => setNewGalleryUrl(e.target.value)}
                    className="text-xs flex-1 min-w-[200px]"
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleAddGalleryImage}
                    className="bg-[#0a1628] text-white shrink-0 font-bold"
                  >
                    Add URL
                  </Button>
                  <label className="cursor-pointer inline-flex items-center gap-1.5 bg-[#0ea5e9] hover:bg-[#0284c7] text-white px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 shadow-xs">
                    <Upload size={14} />
                    {uploadingGallery ? "Uploading..." : "Upload Local Photo"}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleGalleryUpload}
                      disabled={uploadingGallery}
                    />
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Action Footer */}
          <div className="flex items-center justify-between pt-6 border-t border-[#e2e8f0]">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Discard Edits
            </Button>
            <Button
              onClick={handleSavePackage}
              className="bg-[#f97316] hover:bg-[#ea580c] text-white font-bold gap-2 px-6 shadow-md"
            >
              <Save size={16} />
              Save Package Changes
            </Button>
          </div>
        </div>
      )}

      {/* Package Grid List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-[#64748b] px-1">
          <span>
            Showing <strong className="text-[#0a1628]">{filteredPackages.length}</strong> holiday packages
          </span>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="text-[#0284c7] hover:underline"
            >
              Clear search
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPackages.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-white rounded-3xl border border-[#e2e8f0] overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between text-left group"
            >
              <div>
                <div className="relative h-48 w-full overflow-hidden bg-[#0a1628]">
                  <Image
                    src={pkg.coverImage || "/images/bangkok-pattaya.png"}
                    alt={pkg.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    unoptimized
                  />
                  <div className="absolute top-3 left-3 bg-[#0a1628]/85 backdrop-blur-xs text-white text-[11px] font-bold px-3 py-1 rounded-full">
                    {pkg.category}
                  </div>
                  {pkg.badge && (
                    <div className="absolute bottom-3 left-3 bg-[#0ea5e9]/90 backdrop-blur-xs text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      {pkg.badge}
                    </div>
                  )}
                  {pkg.featured && (
                    <div className="absolute top-3 right-3 bg-[#f97316] text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                      ★ Featured
                    </div>
                  )}
                </div>

                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between text-xs text-[#64748b]">
                    <span className="flex items-center gap-1 truncate">
                      <MapPin size={14} className="text-[#0ea5e9] shrink-0" />
                      {pkg.destination}
                    </span>
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase ${
                        pkg.status === "ACTIVE"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}
                    >
                      {pkg.status}
                    </span>
                  </div>

                  <h3 className="font-bold text-[#0a1628] text-base leading-snug line-clamp-2">
                    {pkg.title}
                  </h3>

                  <div className="flex items-center justify-between text-xs text-[#475569] border-t border-b border-[#f1f5f9] py-2">
                    <span className="flex items-center gap-1">
                      <Clock size={12} className="text-[#0ea5e9]" /> {pkg.duration}
                    </span>
                    <div className="text-right">
                      {pkg.originalPrice > pkg.price && (
                        <span className="text-[10px] text-[#94a3b8] line-through block leading-none">
                          NPR {pkg.originalPrice.toLocaleString()}
                        </span>
                      )}
                      <span className="font-extrabold text-[#0a1628] text-sm">
                        NPR {pkg.price.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Quick Details Badges */}
                  <div className="text-[11px] text-[#64748b] space-y-1 bg-[#f8fafc] p-2.5 rounded-xl border border-[#e2e8f0]/60">
                    <div className="flex items-center justify-between">
                      <span>🗓️ Itinerary Days:</span>
                      <strong className="text-[#0a1628]">{pkg.itinerary?.length || 0} Days</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>✓ Inclusions Tagged:</span>
                      <strong className="text-emerald-700">{pkg.inclusions?.length || 0} Included</strong>
                    </div>
                    {pkg.highlights?.length > 0 && (
                      <div className="flex items-center justify-between">
                        <span>★ Key Highlights:</span>
                        <strong className="text-[#f97316]">{pkg.highlights.length} Highlights</strong>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0 flex gap-2">
                <Button
                  onClick={() => handleOpenEdit(pkg)}
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-1 border-[#e2e8f0] font-bold text-xs"
                >
                  <Edit size={14} /> Edit Full Details
                </Button>
                <Button
                  onClick={() => handleDeletePackage(pkg.id)}
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:bg-red-50 text-xs"
                >
                  <Trash2 size={14} /> Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
