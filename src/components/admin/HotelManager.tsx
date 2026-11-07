"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Hotel,
  Plus,
  Edit,
  Trash2,
  Star,
  MapPin,
  Check,
  X,
  RefreshCw,
  Search,
  Tag,
  ImageIcon,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export interface HotelItem {
  id: string;
  name: string;
  location: string;
  rating: number;
  reviews: number;
  price: number;
  category: string;
  image: string;
  amenities: string[];
  status: "ACTIVE" | "INACTIVE";
}

export default function HotelManager() {
  const [hotels, setHotels] = useState<HotelItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingHotel, setEditingHotel] = useState<HotelItem | null>(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  const [formData, setFormData] = useState<Partial<HotelItem>>({
    name: "",
    location: "",
    rating: 4.8,
    reviews: 120,
    price: 12500,
    category: "5-Star Luxury",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
    amenities: ["Spa", "Pool", "Free Wi-Fi", "Airport Transfer"],
    status: "ACTIVE",
  });

  const [amenityInput, setAmenityInput] = useState("");

  const fetchHotels = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/hotels");
      if (res.ok) {
        const data = await res.json();
        setHotels(data.hotels || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
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
          setFormData((prev) => ({ ...prev, image: json.url }));
        }
      } else {
        alert("Upload failed. Please try again.");
      }
    } catch (err) {
      alert("Error uploading image from local device.");
    } finally {
      setUploading(false);
    }
  };

  const handleCreate = async () => {
    if (!formData.name || !formData.location || !formData.price) {
      alert("Please fill in Hotel Name, Location, and Nightly Price.");
      return;
    }

    try {
      const res = await fetch("/api/hotels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const data = await res.json();
        setHotels([data.hotel, ...hotels]);
        setIsNewModalOpen(false);
        resetForm();
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("skywalk-hotels-updated"));
        }
      }
    } catch (error) {
      alert("Failed to save hotel record");
    }
  };

  const handleUpdate = async () => {
    if (!editingHotel) return;
    try {
      const res = await fetch(`/api/hotels/${editingHotel.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setHotels((prev) =>
          prev.map((h) =>
            h.id === editingHotel.id ? ({ ...h, ...formData } as HotelItem) : h
          )
        );
        setEditingHotel(null);
        resetForm();
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("skywalk-hotels-updated"));
        }
      }
    } catch (error) {
      alert("Failed to update hotel record");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this hotel accommodation?")) return;
    try {
      const res = await fetch(`/api/hotels/${id}`, { method: "DELETE" });
      if (res.ok) {
        setHotels((prev) => prev.filter((h) => h.id !== id));
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("skywalk-hotels-updated"));
        }
      }
    } catch (error) {
      alert("Failed to delete hotel");
    }
  };

  const toggleStatus = async (hotel: HotelItem) => {
    const nextStatus = hotel.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    setHotels((prev) =>
      prev.map((h) => (h.id === hotel.id ? { ...h, status: nextStatus } : h))
    );
  };

  const startEdit = (hotel: HotelItem) => {
    setEditingHotel(hotel);
    setFormData({ ...hotel });
  };

  const addAmenity = () => {
    if (!amenityInput.trim()) return;
    const updated = [...(formData.amenities || []), amenityInput.trim()];
    setFormData({ ...formData, amenities: updated });
    setAmenityInput("");
  };

  const removeAmenity = (index: number) => {
    const updated = (formData.amenities || []).filter((_, i) => i !== index);
    setFormData({ ...formData, amenities: updated });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      location: "",
      rating: 4.8,
      reviews: 120,
      price: 12500,
      category: "5-Star Luxury",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
      amenities: ["Spa", "Pool", "Free Wi-Fi", "Airport Transfer"],
      status: "ACTIVE",
    });
    setAmenityInput("");
  };

  const filteredHotels = hotels.filter(
    (h) =>
      h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container-custom py-8 space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#e2e8f0] shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Hotel size={24} className="text-[#0ea5e9]" />
            <h1 className="text-2xl font-extrabold text-[#0a1628]">
              Hotels &amp; Resort Stays Manager
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#64748b] mt-1">
            CRUD luxury hotel stays, upload photos from device or web, set ratings, amenities, and nightly prices.
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
            <Plus size={18} /> Add Hotel Stay
          </Button>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white p-4 rounded-2xl border border-[#e2e8f0] shadow-sm flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-3 text-[#94a3b8]" />
          <Input
            placeholder="Search hotel name, destination, category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 text-xs sm:text-sm"
          />
        </div>
        <Button onClick={fetchHotels} variant="outline" size="sm" className="gap-2 border-[#e2e8f0]">
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh
        </Button>
      </div>

      {/* Hotels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHotels.length === 0 ? (
          <div className="col-span-full bg-white p-12 text-center rounded-3xl border border-[#e2e8f0] text-[#64748b]">
            No hotels found. Click "Add Hotel Stay" to add a new accommodation listing.
          </div>
        ) : (
          filteredHotels.map((hotel) => (
            <div
              key={hotel.id}
              className="bg-white rounded-3xl border border-[#e2e8f0] shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-xl transition-all duration-300 group"
            >
              <div>
                <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                  <Image
                    src={hotel.image}
                    alt={hotel.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-[#0a1628]/80 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
                    <Star size={12} className="text-amber-400 fill-amber-400" />
                    {hotel.rating} ({hotel.reviews})
                  </div>
                  <div className="absolute top-3 right-3">
                    <button
                      onClick={() => toggleStatus(hotel)}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                        hotel.status === "ACTIVE"
                          ? "bg-emerald-500 text-white shadow-md"
                          : "bg-slate-700 text-white"
                      }`}
                    >
                      {hotel.status}
                    </button>
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#0ea5e9]">
                    {hotel.category}
                  </span>
                  <h3 className="text-lg font-extrabold text-[#0a1628] leading-tight">
                    {hotel.name}
                  </h3>
                  <p className="text-xs text-[#64748b] flex items-center gap-1 font-medium">
                    <MapPin size={14} className="text-[#0ea5e9]" /> {hotel.location}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {hotel.amenities.map((am) => (
                      <span
                        key={am}
                        className="bg-[#f1f5f9] text-[#475569] text-[11px] font-semibold px-2.5 py-0.5 rounded-full"
                      >
                        {am}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-5 border-t border-[#e2e8f0] bg-[#f8fafc] flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#64748b] block">Nightly Rate</span>
                  <span className="text-lg font-extrabold text-[#0a1628]">
                    NPR {hotel.price.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => startEdit(hotel)}
                    className="text-[#0ea5e9] hover:bg-[#e0f2fe]"
                  >
                    <Edit size={14} />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(hotel.id)}
                    className="text-rose-600 hover:bg-rose-50"
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Modal */}
      {(isNewModalOpen || editingHotel) && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 space-y-5 shadow-2xl animate-fade-in text-left max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#e2e8f0]">
              <h3 className="text-xl font-bold text-[#0a1628] flex items-center gap-2">
                <Hotel size={20} className="text-[#0ea5e9]" />
                {editingHotel ? "Edit Hotel Stay" : "Add New Hotel Stay"}
              </h3>
              <button
                onClick={() => {
                  setIsNewModalOpen(false);
                  setEditingHotel(null);
                }}
                className="p-2 text-[#64748b] hover:bg-[#f1f5f9] rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#0a1628] uppercase tracking-wider mb-1 block">
                  Hotel / Resort Name
                </label>
                <Input
                  value={formData.name || ""}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Grand Hyatt Kathmandu or Atlantis The Palm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#0a1628] uppercase tracking-wider mb-1 block">
                    Location / City
                  </label>
                  <Input
                    value={formData.location || ""}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Kathmandu, Nepal"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#0a1628] uppercase tracking-wider mb-1 block">
                    Category
                  </label>
                  <select
                    className="w-full h-10 rounded-lg border border-[#e2e8f0] px-3 text-sm font-semibold"
                    value={formData.category || "5-Star Luxury"}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="5-Star Luxury">5-Star Luxury</option>
                    <option value="4-Star Premium">4-Star Premium</option>
                    <option value="Heritage Resort">Heritage Resort</option>
                    <option value="Beachfront Villa">Beachfront Villa</option>
                    <option value="Boutique Stay">Boutique Stay</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#0a1628] uppercase tracking-wider mb-1 block">
                    Nightly Rate (NPR)
                  </label>
                  <Input
                    type="number"
                    value={formData.price || ""}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    placeholder="e.g. 18500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#0a1628] uppercase tracking-wider mb-1 block">
                    Star Rating (1-5)
                  </label>
                  <Input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={formData.rating || 4.8}
                    onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                  />
                </div>
              </div>

              {/* Cover Image Upload & URL Option */}
              <div>
                <label className="text-xs font-bold text-[#0a1628] uppercase tracking-wider mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <ImageIcon size={14} className="text-[#0ea5e9]" />
                    Hotel Cover Image
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
                      value={formData.image || ""}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      placeholder="Or paste external image URL (https://...)"
                      className="text-xs"
                    />
                  </div>
                </div>

                {uploading && (
                  <div className="text-xs text-[#0ea5e9] font-bold flex items-center gap-1.5 mt-2 bg-sky-50 p-2 rounded-lg">
                    <RefreshCw size={14} className="animate-spin" /> Uploading photo from device...
                  </div>
                )}
              </div>

              {/* Amenities tag builder */}
              <div>
                <label className="text-xs font-bold text-[#0a1628] uppercase tracking-wider mb-1 block">
                  Amenities &amp; Features
                </label>
                <div className="flex gap-2 mb-2">
                  <Input
                    placeholder="Add amenity (e.g. Spa, Swimming Pool, Free Wi-Fi)"
                    value={amenityInput}
                    onChange={(e) => setAmenityInput(e.target.value)}
                  />
                  <Button type="button" onClick={addAmenity} variant="outline" className="shrink-0">
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(formData.amenities || []).map((am, i) => (
                    <span
                      key={i}
                      className="bg-[#e0f2fe] text-[#0ea5e9] text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1"
                    >
                      {am}
                      <X size={12} className="cursor-pointer" onClick={() => removeAmenity(i)} />
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#e2e8f0] flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsNewModalOpen(false);
                  setEditingHotel(null);
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={editingHotel ? handleUpdate : handleCreate}
                className="bg-[#0ea5e9] hover:bg-[#0284c7] text-white font-bold"
              >
                {editingHotel ? "Update Hotel" : "Create Hotel"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
