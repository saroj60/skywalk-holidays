"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Plane,
  Plus,
  Edit,
  Trash2,
  Check,
  X,
  RefreshCw,
  Search,
  Tag,
  Globe2,
  ImageIcon,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export interface FlightItem {
  id: string;
  name: string;
  code: string;
  routes: string;
  category: "International" | "Domestic" | string;
  price?: number;
  logo?: string;
  status: "ACTIVE" | "INACTIVE";
}

export default function FlightManager() {
  const [flights, setFlights] = useState<FlightItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingFlight, setEditingFlight] = useState<FlightItem | null>(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  const [formData, setFormData] = useState<Partial<FlightItem>>({
    name: "",
    code: "",
    routes: "",
    category: "International",
    price: 45000,
    logo: "",
    status: "ACTIVE",
  });

  const fetchFlights = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/flights");
      if (res.ok) {
        const data = await res.json();
        setFlights(data.flights || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlights();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

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
          setFormData((prev) => ({ ...prev, logo: json.url }));
        }
      } else {
        alert("Upload failed. Please try again.");
      }
    } catch (err) {
      alert("Error uploading file from local device.");
    } finally {
      setUploading(false);
    }
  };

  const handleCreate = async () => {
    if (!formData.name || !formData.code || !formData.routes) {
      alert("Please fill in Airline Name, Code, and Routes.");
      return;
    }

    try {
      const res = await fetch("/api/flights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const data = await res.json();
        setFlights([data.flight, ...flights]);
        setIsNewModalOpen(false);
        resetForm();
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("skywalk-flights-updated"));
        }
      }
    } catch (error) {
      alert("Failed to save flight deal");
    }
  };

  const handleUpdate = async () => {
    if (!editingFlight) return;
    try {
      const res = await fetch(`/api/flights/${editingFlight.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setFlights((prev) =>
          prev.map((f) =>
            f.id === editingFlight.id ? ({ ...f, ...formData } as FlightItem) : f
          )
        );
        setEditingFlight(null);
        resetForm();
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("skywalk-flights-updated"));
        }
      }
    } catch (error) {
      alert("Failed to update flight deal");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this flight route deal?")) return;
    try {
      const res = await fetch(`/api/flights/${id}`, { method: "DELETE" });
      if (res.ok) {
        setFlights((prev) => prev.filter((f) => f.id !== id));
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("skywalk-flights-updated"));
        }
      }
    } catch (error) {
      alert("Failed to delete flight deal");
    }
  };

  const toggleStatus = async (flight: FlightItem) => {
    const nextStatus = flight.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    setFlights((prev) =>
      prev.map((f) => (f.id === flight.id ? { ...f, status: nextStatus } : f))
    );
  };

  const startEdit = (flight: FlightItem) => {
    setEditingFlight(flight);
    setFormData({ ...flight });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      code: "",
      routes: "",
      category: "International",
      price: 45000,
      logo: "",
      status: "ACTIVE",
    });
  };

  const filteredFlights = flights.filter(
    (f) =>
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.routes.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container-custom py-8 space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#e2e8f0] shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Plane size={24} className="text-[#0ea5e9]" />
            <h1 className="text-2xl font-extrabold text-[#0a1628]">
              Flight Ticket Deals &amp; Airlines Manager
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#64748b] mt-1">
            Upload local airline logos or paste image URLs, update routes, flight codes, and starting fares.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => {
              resetForm();
              setIsNewModalOpen(true);
            }}
            className="bg-[#0ea5e9] hover:bg-[#0284c7] text-white font-bold gap-2 min-h-[44px]"
          >
            <Plus size={18} /> Add Flight Deal
          </Button>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white p-4 rounded-2xl border border-[#e2e8f0] shadow-sm flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-3 text-[#94a3b8]" />
          <Input
            placeholder="Search airline, code, route..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 text-xs sm:text-sm"
          />
        </div>
        <Button onClick={fetchFlights} variant="outline" size="sm" className="gap-2 border-[#e2e8f0]">
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh
        </Button>
      </div>

      {/* Flights Table */}
      <div className="bg-white rounded-3xl border border-[#e2e8f0] shadow-sm overflow-hidden">
        <div className="p-5 border-b border-[#e2e8f0] flex items-center justify-between">
          <h2 className="font-bold text-[#0a1628] text-base flex items-center gap-2">
            <Globe2 size={18} className="text-[#0ea5e9]" /> Active Airline Routes ({filteredFlights.length})
          </h2>
        </div>

        <div className="overflow-x-auto max-w-full">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="bg-[#f8fafc] text-[#64748b] border-b border-[#e2e8f0] uppercase tracking-wider text-[11px] font-bold">
                <th className="py-3.5 px-4">Logo / Code</th>
                <th className="py-3.5 px-4">Airline Partner</th>
                <th className="py-3.5 px-4">Route &amp; Destination Coverage</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Est. Starting Fare</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9]">
              {filteredFlights.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#64748b]">
                    No flight deals found. Click "Add Flight Deal" to create one.
                  </td>
                </tr>
              ) : (
                filteredFlights.map((flight) => (
                  <tr key={flight.id} className="hover:bg-[#f8fafc] transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#0ea5e9]">
                      {flight.logo ? (
                        <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-white border border-[#e2e8f0] shadow-xs p-1">
                          <Image
                            src={flight.logo}
                            alt={flight.name}
                            fill
                            className="object-contain p-0.5"
                          />
                        </div>
                      ) : (
                        <span className="w-10 h-10 rounded-xl bg-[#0a1628] text-white inline-flex items-center justify-center font-extrabold text-xs shadow-xs">
                          {flight.code}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-extrabold text-[#0a1628]">
                      {flight.name}
                      <span className="text-xs font-normal text-[#64748b] block font-mono">
                        [{flight.code}]
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[#475569] font-medium max-w-xs">
                      {flight.routes}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 bg-[#e0f2fe] text-[#0ea5e9] px-2.5 py-1 rounded-full text-xs font-semibold">
                        <Tag size={12} /> {flight.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#0a1628]">
                      {flight.price ? `NPR ${flight.price.toLocaleString()}` : "N/A"}
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => toggleStatus(flight)}
                        className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                          flight.status === "ACTIVE"
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                            : "bg-slate-100 text-slate-600 border border-slate-300"
                        }`}
                      >
                        {flight.status}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => startEdit(flight)}
                          className="text-[#0ea5e9] hover:bg-[#e0f2fe]"
                        >
                          <Edit size={14} /> Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(flight.id)}
                          className="text-rose-600 hover:bg-rose-50"
                        >
                          <Trash2 size={14} /> Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {(isNewModalOpen || editingFlight) && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 space-y-5 shadow-2xl animate-fade-in text-left max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#e2e8f0]">
              <h3 className="text-xl font-bold text-[#0a1628] flex items-center gap-2">
                <Plane size={20} className="text-[#0ea5e9]" />
                {editingFlight ? "Edit Flight Deal" : "Add New Flight Deal"}
              </h3>
              <button
                onClick={() => {
                  setIsNewModalOpen(false);
                  setEditingFlight(null);
                }}
                className="p-2 text-[#64748b] hover:bg-[#f1f5f9] rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#0a1628] uppercase tracking-wider mb-1 block">
                  Airline Name
                </label>
                <Input
                  value={formData.name || ""}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Qatar Airways or Buddha Air"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#0a1628] uppercase tracking-wider mb-1 block">
                    Airline Code (2-letter)
                  </label>
                  <Input
                    value={formData.code || ""}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    placeholder="e.g. QR"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#0a1628] uppercase tracking-wider mb-1 block">
                    Category
                  </label>
                  <select
                    className="w-full h-10 rounded-lg border border-[#e2e8f0] px-3 text-sm font-semibold"
                    value={formData.category || "International"}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="International">International</option>
                    <option value="Domestic">Domestic</option>
                  </select>
                </div>
              </div>

              {/* Airline Logo Upload & URL option */}
              <div>
                <label className="text-xs font-bold text-[#0a1628] uppercase tracking-wider mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <ImageIcon size={14} className="text-[#0ea5e9]" />
                    Airline Logo Image
                  </span>
                  <span className="text-[11px] text-[#64748b] font-normal">Upload file OR paste URL</span>
                </label>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 bg-[#f8fafc] p-2 rounded-xl border border-dashed border-[#cbd5e1] hover:border-[#0ea5e9] transition-colors">
                    <Upload size={18} className="text-[#0ea5e9] shrink-0 ml-1" />
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="text-xs border-0 bg-transparent shadow-none p-0 cursor-pointer file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-[#0ea5e9] file:text-white hover:file:bg-[#0284c7]"
                      disabled={uploading}
                    />
                  </div>

                  <div className="relative">
                    <Input
                      value={formData.logo || ""}
                      onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                      placeholder="Or paste external image URL (https://...)"
                      className="text-xs"
                    />
                  </div>
                </div>

                {uploading && (
                  <div className="text-xs text-[#0ea5e9] font-bold flex items-center gap-1.5 mt-2 bg-sky-50 p-2 rounded-lg">
                    <RefreshCw size={14} className="animate-spin" /> Uploading image from local folder...
                  </div>
                )}

                {formData.logo && !uploading && (
                  <div className="mt-2.5 flex items-center justify-between bg-slate-50 p-2.5 rounded-2xl border border-[#e2e8f0]">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-white border border-[#e2e8f0] p-1 shadow-xs">
                        <Image
                          src={formData.logo}
                          alt="Logo Preview"
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div className="max-w-[200px]">
                        <span className="text-xs text-emerald-700 font-bold block">✓ Image Selected</span>
                        <span className="text-[10px] text-[#64748b] truncate block font-mono">{formData.logo}</span>
                      </div>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => setFormData({ ...formData, logo: "" })}
                      className="text-rose-600 hover:bg-rose-50 text-xs h-8 px-2.5 rounded-lg"
                    >
                      Remove
                    </Button>
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs font-bold text-[#0a1628] uppercase tracking-wider mb-1 block">
                  Route Coverage Details
                </label>
                <Input
                  value={formData.routes || ""}
                  onChange={(e) => setFormData({ ...formData, routes: e.target.value })}
                  placeholder="e.g. Kathmandu → Doha & 150+ Global Destinations"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#0a1628] uppercase tracking-wider mb-1 block">
                  Estimated Starting Fare (NPR)
                </label>
                <Input
                  type="number"
                  value={formData.price || ""}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  placeholder="e.g. 45000"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-[#e2e8f0] flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsNewModalOpen(false);
                  setEditingFlight(null);
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={editingFlight ? handleUpdate : handleCreate}
                className="bg-[#0ea5e9] hover:bg-[#0284c7] text-white font-bold"
              >
                {editingFlight ? "Update Deal" : "Create Deal"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
