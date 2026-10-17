"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Camera, X, Maximize2, Sparkles } from "lucide-react";

interface GalleryImage {
  url: string;
  caption: string;
}

interface PackageGallerySectionProps {
  gallery: (string | GalleryImage)[];
  packageTitle: string;
}

export default function PackageGallerySection({
  gallery,
  packageTitle,
}: PackageGallerySectionProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const formattedGallery: GalleryImage[] = gallery.map((item, idx) => {
    if (typeof item === "string") {
      const defaultCaptions = [
        "Iconic Destination Skyline & Attractions",
        "Thrilling Desert Safari Dune Bashing & Sunset",
        "Marina Luxury Sunset Dinner Cruise",
        "4-Star Deluxe Resort Accommodations",
        "Cultural Sightseeing & Heritage Exploration",
      ];
      return {
        url: item,
        caption: defaultCaptions[idx % defaultCaptions.length],
      };
    }
    return item;
  });

  return (
    <section id="gallery" className="bg-white rounded-3xl p-6 md:p-8 border border-[#e2e8f0] shadow-sm text-left">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#e2e8f0]">
        <div>
          <span className="text-xs font-bold text-[#0ea5e9] bg-[#e0f2fe] px-3 py-1 rounded-full uppercase tracking-wider">
            Visual Tour
          </span>
          <h2 className="text-2xl font-bold text-[#0a1628] mt-2 flex items-center gap-2">
            <Camera className="text-[#0ea5e9]" size={22} />
            Destination &amp; Tour Photo Highlights
          </h2>
        </div>
        <span className="text-xs text-[#64748b] font-semibold hidden sm:block">
          Tap any photo to expand
        </span>
      </div>

      {/* Responsive Gallery Grid (2 columns on mobile, 3 on large screens) */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4">
        {formattedGallery.map((img, idx) => (
          <div
            key={idx}
            onClick={() => setSelectedImage(img.url)}
            className="group relative h-40 sm:h-56 rounded-xl sm:rounded-2xl overflow-hidden bg-[#0a1628] cursor-pointer border border-[#e2e8f0] shadow-sm hover:shadow-xl transition-all duration-300"
          >
            <Image
              src={img.url}
              alt={`${packageTitle} photo ${idx + 1}`}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent opacity-85 group-hover:opacity-95 transition-opacity" />

            {/* Hover Expand Icon */}
            <div className="absolute top-2 right-2 sm:top-3 sm:right-3 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
              <Maximize2 size={12} className="sm:w-3.5 sm:h-3.5" />
            </div>

            {/* Caption Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-2.5 sm:p-4">
              <span className="text-[9px] sm:text-[10px] font-extrabold text-[#38bdf8] uppercase tracking-wider block mb-0.5">
                Highlight #{idx + 1}
              </span>
              <p className="text-[11px] sm:text-xs font-bold text-white leading-tight sm:leading-snug drop-shadow-sm line-clamp-2">
                {img.caption}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Zoom Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center">
            <button
              type="button"
              suppressHydrationWarning
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 text-white hover:text-[#0ea5e9] p-2 bg-white/10 rounded-full backdrop-blur-md"
            >
              <X size={24} />
            </button>
            <div className="relative w-full h-[75vh] rounded-2xl overflow-hidden shadow-2xl border border-white/20">
              <Image
                src={selectedImage}
                alt="Enlarged photo view"
                fill
                sizes="100vw"
                className="object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
