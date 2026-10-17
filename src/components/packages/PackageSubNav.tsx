"use client";

import React, { useState, useEffect } from "react";
import { FileText, Image as ImageIcon, Calendar, Clock, XCircle, Briefcase, FileCheck2, Video } from "lucide-react";

import PackagePdfButton from "@/components/packages/PackagePdfButton";

const BASE_NAV_ITEMS = [
  { id: "overview", label: "Overview", icon: FileText },
  { id: "gallery", label: "Gallery", icon: ImageIcon },
  { id: "outline-itinerary", label: "Outline", icon: Calendar },
  { id: "detailed-itinerary", label: "Day-by-Day", icon: Clock },
  { id: "inclusions-section", label: "Cost & Inclusions", icon: XCircle },
  { id: "visa-requirements", label: "Visa Requirements", icon: FileCheck2 },
  { id: "packing-list", label: "Packing List", icon: Briefcase },
];

interface PackageSubNavProps {
  pkg?: any;
}

export default function PackageSubNav({ pkg }: PackageSubNavProps) {
  const [activeId, setActiveId] = useState("overview");

  const navItems = React.useMemo(() => {
    if (!pkg?.videoEmbedUrl) return BASE_NAV_ITEMS;
    const items = [...BASE_NAV_ITEMS];
    items.splice(2, 0, { id: "tour-video", label: "Tour Video", icon: Video });
    return items;
  }, [pkg?.videoEmbedUrl]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 140;
      for (const item of navItems) {
        const el = document.getElementById(item.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveId(item.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [navItems]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offsetTop = el.offsetTop - 135;
      window.scrollTo({ top: offsetTop, behavior: "smooth" });
      setActiveId(id);
    }
  };

  return (
    <div className="sticky top-16 z-30 bg-white border-b border-[#e2e8f0] shadow-sm mb-8 py-2.5">
      <div className="container-custom flex items-center justify-between gap-4">
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar py-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeId === item.id;
            return (
              <button
                key={item.id}
                type="button"
                suppressHydrationWarning
                onClick={() => scrollTo(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 cursor-pointer min-h-[40px] text-[#0284c7] ${
                  isActive
                    ? "bg-[#e0f2fe] text-[#0284c7] border-2 border-[#0284c7] shadow-sm font-extrabold"
                    : "bg-[#f0f9ff] text-[#0284c7] hover:bg-[#e0f2fe] hover:text-[#0369a1] border border-[#bae6fd]"
                }`}
              >
                <Icon size={16} className="text-[#0284c7] shrink-0" />
                <span className="text-[#0284c7] font-bold">{item.label}</span>
              </button>
            );
          })}
        </div>
        {pkg && (
          <div className="hidden lg:block shrink-0">
            <PackagePdfButton pkg={pkg} variant="outline" size="sm" />
          </div>
        )}
      </div>
    </div>
  );
}
