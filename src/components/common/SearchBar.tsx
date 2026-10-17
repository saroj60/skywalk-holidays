"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Sparkles, ArrowRight, X } from "lucide-react";

const TOUR_PACKAGE_SUGGESTIONS = [
  { id: "thailand-bangkok-pattaya", title: "Bangkok & Pattaya, Thailand", duration: "5N/6D", price: "NPR 48,000", link: "/packages/bangkok-pattaya-6d", category: "Best Seller" },
  { id: "bali-malaysia", title: "Bali & Malaysia Duo Holiday", duration: "6N/7D", price: "NPR 78,000", link: "/packages/bali-malaysia-7d", category: "Top Rated" },
  { id: "bangkok-phuket", title: "Bangkok, Pattaya & Phuket Combo", duration: "7N/8D", price: "NPR 68,000", link: "/packages/bangkok-pattaya-phuket-8d", category: "Popular" },
  { id: "krabi-phuket", title: "Krabi, Phuket & Bangkok Grand Tour", duration: "7N/8D", price: "NPR 74,000", link: "/packages/krabi-phuket-bangkok-8d", category: "Island Special" },
  { id: "singapore-malaysia", title: "Singapore & Malaysia Duo Holiday", duration: "5N/6D", price: "NPR 72,000", link: "/packages/singapore-6d", category: "Family Tour" },
  { id: "vietnam-hanoi", title: "Vietnam Ha Long Bay & Da Nang Tour", duration: "5N/6D", price: "NPR 58,000", link: "/packages/vietnam-6d", category: "Trending" },
  { id: "maldives-beach", title: "Maldives Overwater Bungalow Experience", duration: "3N/4D", price: "NPR 85,000", link: "/packages/maldives-4d", category: "Luxury" },
  { id: "japan-tokyo", title: "Japan (Tokyo, Kyoto & Mt. Fuji)", duration: "6N/7D", price: "NPR 1,45,000", link: "/services/packages/international?country=Japan", category: "Culture & City" },
  { id: "philippines-boracay", title: "Philippines Boracay & Manila", duration: "5N/6D", price: "NPR 89,000", link: "/services/packages/international?country=Philippines", category: "Tropical Islands" },
];

interface SearchBarProps {
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  className?: string;
  compact?: boolean;
}

export default function SearchBar({ className, compact }: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered = TOUR_PACKAGE_SUGGESTIONS.filter((item) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    );
  });

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) {
      router.push("/services/packages/international");
      return;
    }
    const matched = TOUR_PACKAGE_SUGGESTIONS.find((p) =>
      p.title.toLowerCase().includes(query.toLowerCase())
    );
    if (matched) {
      router.push(matched.link);
    } else {
      router.push(`/services/packages/international?country=${encodeURIComponent(query.trim())}`);
    }
    setIsFocused(false);
  };

  const handleSelect = (item: (typeof TOUR_PACKAGE_SUGGESTIONS)[0]) => {
    setQuery(item.title);
    setIsFocused(false);
    router.push(item.link);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`w-full relative z-30 ${
        compact ? "max-w-md" : "max-w-2xl mx-auto"
      } ${className || ""}`}
    >
      {/* Sleek Pill Search Bar matching user design */}
      <form onSubmit={handleSearch} className="relative w-full">
        <div
          className={`relative w-full flex items-center rounded-full border border-white/30 bg-black/45 hover:bg-black/55 backdrop-blur-md transition-all duration-300 focus-within:border-white/60 focus-within:bg-black/65 focus-within:ring-2 focus-within:ring-white/20 shadow-2xl ${
            compact
              ? "px-3.5 py-1.5 sm:py-2"
              : "px-4 sm:px-5 py-2.5 sm:py-3.5"
          }`}
        >
          <Search
            size={compact ? 15 : 18}
            className="text-white/70 mr-2.5 shrink-0"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder={
              compact
                ? "Search destinations, tours..."
                : "Search destinations, tours, packages..."
            }
            className={`w-full bg-transparent text-white placeholder:text-white/60 font-normal focus:outline-none ${
              compact ? "text-xs sm:text-sm" : "text-sm sm:text-base"
            }`}
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="p-1 rounded-full text-white/50 hover:text-white transition-colors mr-1 cursor-pointer"
            >
              <X size={compact ? 14 : 16} />
            </button>
          )}
        </div>
      </form>

      {/* Autocomplete Dropdown */}
      {isFocused && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-[#0a1628]/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/15 p-2 sm:p-3 z-[9999] max-h-80 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200 text-left">
          <div className="px-3 py-1.5 border-b border-white/10 flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles size={12} className="text-amber-400" />
              <span>Tour Packages ({filtered.length})</span>
            </span>
            <span className="text-[10px] text-white/50">Click to view</span>
          </div>

          <div className="divide-y divide-white/5">
            {filtered.length > 0 ? (
              filtered.map((item) => (
                <div
                  key={item.id}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSelect(item);
                  }}
                  className="p-2.5 hover:bg-white/10 rounded-xl transition-colors cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <MapPin size={14} className="text-[#0ea5e9] shrink-0" />
                    <div className="min-w-0">
                      <h4 className="font-semibold text-xs sm:text-sm text-white group-hover:text-sky-300 transition-colors truncate">
                        {item.title}
                      </h4>
                      <div className="text-[11px] text-white/60 flex items-center gap-2 mt-0.5">
                        <span>{item.duration}</span>
                        <span>•</span>
                        <span className="font-bold text-emerald-400">{item.price}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/10 text-white/80">
                      {item.category}
                    </span>
                    <ArrowRight size={13} className="text-white/40 group-hover:text-sky-300 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-xs text-white/60">
                No matching tour found. Press Enter to view all packages.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
