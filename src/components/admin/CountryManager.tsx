"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Globe,
  Plus,
  Edit,
  Trash2,
  Package as PackageIcon,
  MapPin,
  Upload,
  X,
  Save,
  RefreshCw,
  CheckCircle2,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { POPULAR_COUNTRIES } from "@/lib/constants";
import PackageManager, { PackageRecord, INITIAL_PACKAGES } from "./PackageManager";

export interface CountryRecord {
  id: string;
  name: string;
  flag: string;
  subtitle: string;
  packagesCount: number;
  startingPrice: number;
  image: string;
  badge: string;
  href: string;
  featured?: boolean;
}

export default function CountryManager() {
  const [countries, setCountries] = useState<CountryRecord[]>([]);
  const [packages, setPackages] = useState<PackageRecord[]>([]);
  const [isEditingCountry, setIsEditingCountry] = useState(false);
  const [editingCountry, setEditingCountry] = useState<Partial<CountryRecord> | null>(null);
  const [expandedCountryId, setExpandedCountryId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState("");

  // Load countries & packages from localStorage or defaults
  useEffect(() => {
    if (typeof window !== "undefined") {
      // 1. Countries
      const storedCountries = localStorage.getItem("skywalk_countries");
      if (storedCountries) {
        try {
          setCountries(JSON.parse(storedCountries));
        } catch (e) {
          setCountries(POPULAR_COUNTRIES as CountryRecord[]);
        }
      } else {
        setCountries(POPULAR_COUNTRIES as CountryRecord[]);
      }

      // 2. Packages
      const storedPackages = localStorage.getItem("skywalk_packages");
      if (storedPackages) {
        try {
          setPackages(JSON.parse(storedPackages));
        } catch (e) {
          setPackages(INITIAL_PACKAGES);
        }
      } else {
        setPackages(INITIAL_PACKAGES);
      }
    }
  }, []);

  // Save countries state to localStorage
  const saveCountriesState = (updatedCountries: CountryRecord[]) => {
    setCountries(updatedCountries);
    if (typeof window !== "undefined") {
      localStorage.setItem("skywalk_countries", JSON.stringify(updatedCountries));
    }
  };

  const handleOpenCreateCountry = () => {
    setEditingCountry({
      id: "",
      name: "",
      flag: "✈️",
      subtitle: "Popular Destinations & Sightseeing",
      packagesCount: 0,
      startingPrice: 35000,
      image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80",
      badge: "Top Pick",
      href: "",
      featured: true,
    });
    setIsEditingCountry(true);
  };

  const handleOpenEditCountry = (country: CountryRecord) => {
    setEditingCountry({ ...country });
    setIsEditingCountry(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingCountry) return;

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
          setEditingCountry((prev) => (prev ? { ...prev, image: json.url } : null));
        }
      } else {
        alert("Image upload failed. Please try again.");
      }
    } catch (err) {
      alert("Error uploading file from local device.");
    } finally {
      setUploading(false);
    }
  };

  const handleSaveCountry = () => {
    if (!editingCountry || !editingCountry.name || !editingCountry.image) {
      alert("Please fill in Country Name and Cover Image.");
      return;
    }

    const countrySlug =
      editingCountry.id || editingCountry.name.toLowerCase().replace(/[^a-z0-9]/g, "-");

    const formattedHref = `/services/packages/international?country=${encodeURIComponent(
      editingCountry.name
    )}`;

    if (editingCountry.id && countries.some((c) => c.id === editingCountry.id)) {
      // Edit existing country
      const updated = countries.map((c) =>
        c.id === editingCountry.id
          ? ({
              ...editingCountry,
              id: countrySlug,
              href: formattedHref,
            } as CountryRecord)
          : c
      );
      saveCountriesState(updated);
      setSavedSuccess(`Updated country "${editingCountry.name}" successfully!`);
    } else {
      // Create new country
      const newCountryRecord: CountryRecord = {
        id: countrySlug,
        name: editingCountry.name,
        flag: editingCountry.flag || "✈️",
        subtitle: editingCountry.subtitle || "Popular Destinations",
        packagesCount: editingCountry.packagesCount || 0,
        startingPrice: Number(editingCountry.startingPrice) || 35000,
        image: editingCountry.image || "",
        badge: editingCountry.badge || "Top Pick",
        href: formattedHref,
        featured: editingCountry.featured !== false,
      };
      saveCountriesState([newCountryRecord, ...countries]);
      setSavedSuccess(`Created new country "${editingCountry.name}" successfully!`);
    }

    setIsEditingCountry(false);
    setEditingCountry(null);
    setTimeout(() => setSavedSuccess(""), 3500);
  };

  const handleDeleteCountry = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete country "${name}"?`)) {
      const updated = countries.filter((c) => c.id !== id);
      saveCountriesState(updated);
      setSavedSuccess(`Deleted country "${name}".`);
      setTimeout(() => setSavedSuccess(""), 3500);
    }
  };

  const handleResetDefaults = () => {
    if (confirm("Reset countries list to default showcase destinations?")) {
      saveCountriesState(POPULAR_COUNTRIES as CountryRecord[]);
      setSavedSuccess("Reset to default countries.");
      setTimeout(() => setSavedSuccess(""), 3500);
    }
  };

  // Get packages belonging to a country name filter
  const getPackagesForCountry = (countryName: string) => {
    const query = countryName.toLowerCase();
    return packages.filter((pkg) => {
      const c = (pkg.country || "").toLowerCase();
      const d = (pkg.destination || "").toLowerCase();
      const t = (pkg.title || "").toLowerCase();
      return c.includes(query) || d.includes(query) || t.includes(query);
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#e2e8f0] shadow-sm">
        <div>
          <h2 className="text-xl font-extrabold text-[#0a1628] flex items-center gap-2">
            <Globe className="text-[#0ea5e9]" size={22} />
            Country &amp; Destination Management System
          </h2>
          <p className="text-xs text-[#64748b] mt-1">
            Create, edit, and manage destination countries. Group tour packages under each country for the website.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleResetDefaults} className="gap-1.5 text-xs text-[#64748b]">
            <RefreshCw size={14} /> Reset Defaults
          </Button>
          <Button onClick={handleOpenCreateCountry} className="bg-[#f97316] hover:bg-[#ea580c] text-white font-bold text-xs gap-1.5 rounded-xl">
            <Plus size={16} /> Add New Country
          </Button>
        </div>
      </div>

      {savedSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl flex items-center gap-2 text-xs font-bold">
          <CheckCircle2 size={16} className="text-emerald-600" />
          {savedSuccess}
        </div>
      )}

      {/* Country Editor Modal Box */}
      {isEditingCountry && editingCountry && (
        <div className="bg-white p-6 rounded-3xl border-2 border-[#0ea5e9] shadow-xl space-y-5">
          <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-4">
            <h3 className="text-base font-bold text-[#0a1628]">
              {editingCountry.id ? `Edit Country (${editingCountry.name})` : "Add New Destination Country"}
            </h3>
            <button onClick={() => setIsEditingCountry(false)} className="text-[#94a3b8] hover:text-[#0a1628]">
              <X size={18} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-[#0a1628] uppercase tracking-wider mb-1 block">
                Country Name *
              </label>
              <Input
                placeholder="e.g. Vietnam, Thailand, Malaysia, Japan"
                value={editingCountry.name || ""}
                onChange={(e) => setEditingCountry({ ...editingCountry, name: e.target.value })}
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#0a1628] uppercase tracking-wider mb-1 block">
                Flag Emoji / Icon
              </label>
              <Input
                placeholder="e.g. 🇻🇳 or 🇹🇭 or 🇦🇪"
                value={editingCountry.flag || ""}
                onChange={(e) => setEditingCountry({ ...editingCountry, flag: e.target.value })}
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#0a1628] uppercase tracking-wider mb-1 block">
                Badge Tag
              </label>
              <Input
                placeholder="e.g. Top Pick, Best Seller, Honeymoon"
                value={editingCountry.badge || ""}
                onChange={(e) => setEditingCountry({ ...editingCountry, badge: e.target.value })}
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-bold text-[#0a1628] uppercase tracking-wider mb-1 block">
                Subtitle / Highlights
              </label>
              <Input
                placeholder="e.g. Hanoi, Halong Bay & Da Nang Beaches"
                value={editingCountry.subtitle || ""}
                onChange={(e) => setEditingCountry({ ...editingCountry, subtitle: e.target.value })}
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#0a1628] uppercase tracking-wider mb-1 block">
                Starting Package Price (NPR) *
              </label>
              <Input
                type="number"
                placeholder="35000"
                value={editingCountry.startingPrice || ""}
                onChange={(e) => setEditingCountry({ ...editingCountry, startingPrice: Number(e.target.value) })}
              />
            </div>

            <div className="md:col-span-3">
              <label className="text-xs font-bold text-[#0a1628] uppercase tracking-wider mb-1 flex items-center justify-between">
                <span>Country Card Cover Image *</span>
                <span className="text-[11px] font-medium text-[#0ea5e9]">Paste Image URL or Upload Local File</span>
              </label>
              <div className="flex gap-2 items-center">
                <Input
                  placeholder="https://images.unsplash.com/... or /uploads/..."
                  value={editingCountry.image || ""}
                  onChange={(e) => setEditingCountry({ ...editingCountry, image: e.target.value })}
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

              {/* Preview Thumbnail */}
              {editingCountry.image && (
                <div className="mt-3 flex items-center gap-3 bg-[#f8fafc] p-2 rounded-xl border border-[#e2e8f0]">
                  <div className="relative w-28 h-20 rounded-lg overflow-hidden border border-[#e2e8f0] bg-slate-900 shrink-0">
                    <Image src={editingCountry.image} alt="Cover Preview" fill className="object-cover" />
                  </div>
                  <div className="text-[11px] text-[#64748b] truncate">
                    <span className="font-semibold text-[#0a1628] block">Country Cover Image</span>
                    <span className="truncate block font-mono text-[10px]">{editingCountry.image}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-[#e2e8f0]">
            <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-bold text-[#0a1628]">
              <input
                type="checkbox"
                checked={editingCountry.featured !== false}
                onChange={(e) => setEditingCountry({ ...editingCountry, featured: e.target.checked })}
                className="w-4 h-4 rounded text-[#0ea5e9]"
              />
              Show on Homepage Popular Destinations Grid
            </label>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setIsEditingCountry(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveCountry} className="bg-[#f97316] hover:bg-[#ea580c] text-white font-bold gap-2">
                <Save size={16} />
                Save Country Details
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Countries Inventory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {countries.map((country) => {
          const countryPackages = getPackagesForCountry(country.name);
          const isExpanded = expandedCountryId === country.id;

          return (
            <div
              key={country.id}
              className="bg-white rounded-3xl border border-[#e2e8f0] overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header Image Box */}
                <div className="relative aspect-[16/9] w-full bg-slate-900 overflow-hidden">
                  <Image src={country.image} alt={country.name} fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] via-transparent to-black/30" />

                  <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-extrabold text-[#0a1628] shadow">
                    <span>{country.flag}</span>
                    <span>{country.badge}</span>
                  </div>

                  <div className="absolute top-3 right-3 bg-[#0ea5e9] text-white px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <PackageIcon size={12} />
                    <span>{countryPackages.length} Packages</span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <div className="text-[11px] text-sky-300 font-semibold">{country.subtitle}</div>
                    <h3 className="text-xl font-black">{country.name}</h3>
                  </div>
                </div>

                {/* Country Info Bar */}
                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between text-xs text-[#64748b] border-b border-[#e2e8f0] pb-3">
                    <span>Starting Price:</span>
                    <span className="font-extrabold text-[#0a1628] text-sm">
                      NPR {country.startingPrice?.toLocaleString("en-US")}
                    </span>
                  </div>

                  {/* Toggle Expand Packages List */}
                  <button
                    onClick={() => setExpandedCountryId(isExpanded ? null : country.id)}
                    className="w-full flex items-center justify-between py-2 text-xs font-bold text-[#0ea5e9] hover:text-[#0284c7] cursor-pointer"
                  >
                    <span>View Packages inside {country.name} ({countryPackages.length})</span>
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>

                  {/* Expandable Package Cards inside Country */}
                  {isExpanded && (
                    <div className="space-y-2 pt-2 border-t border-[#e2e8f0] bg-[#f8fafc] p-3 rounded-2xl">
                      {countryPackages.length === 0 ? (
                        <p className="text-xs text-[#94a3b8] italic text-center py-2">
                          No packages assigned to {country.name} yet.
                        </p>
                      ) : (
                        countryPackages.map((pkg) => (
                          <div
                            key={pkg.id}
                            className="bg-white p-2.5 rounded-xl border border-[#e2e8f0] flex items-center justify-between gap-2"
                          >
                            <div className="min-w-0">
                              <span className="font-bold text-[#0a1628] text-xs block truncate">{pkg.title}</span>
                              <span className="text-[10px] text-[#64748b]">
                                {pkg.duration} • NPR {pkg.price?.toLocaleString("en-US")}
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Bar */}
              <div className="p-4 bg-[#f8fafc] border-t border-[#e2e8f0] flex items-center justify-between gap-2">
                <span className="text-[10px] font-mono text-[#94a3b8]">ID: {country.id}</span>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleOpenEditCountry(country)} className="gap-1 text-xs">
                    <Edit size={12} /> Edit
                  </Button>
                  <Button size="sm" onClick={() => handleDeleteCountry(country.id, country.name)} className="gap-1 text-xs bg-red-600 hover:bg-red-700 text-white font-bold">
                    <Trash2 size={12} />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
