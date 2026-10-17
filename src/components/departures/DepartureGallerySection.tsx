"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Camera, X, Maximize2, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";

export interface GalleryPhoto {
  url: string;
  caption: string;
}

interface DepartureGallerySectionProps {
  photos: GalleryPhoto[];
  title: string;
}

export default function DepartureGallerySection({
  photos,
  title,
}: DepartureGallerySectionProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (!photos || photos.length === 0) return null;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((prev) => (prev! === 0 ? photos.length - 1 : prev! - 1));
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((prev) => (prev! === photos.length - 1 ? 0 : prev! + 1));
    }
  };

  return (
    <div id="gallery" className="bg-[#0a1628] rounded-3xl p-6 sm:p-8 border border-white/10 shadow-xl space-y-5">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-2">
        <div>
          <span className="text-xs font-bold text-[#0ea5e9] bg-[#0ea5e9]/20 px-3 py-1 rounded-full uppercase tracking-wider">
            Visual Tour
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-2 flex items-center gap-2.5">
            <Camera className="text-[#0ea5e9]" size={22} />
            Destination &amp; Tour Photo Gallery
          </h2>
        </div>
        <span className="text-xs text-[#94a3b8] font-medium hidden sm:flex items-center gap-1.5">
          <Sparkles size={13} className="text-[#38bdf8]" /> Tap any photo to expand in full view
        </span>
      </div>

      {/* Responsive Gallery Grid: 2 cols on mobile, 3 cols on desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {photos.map((photo, idx) => (
          <div
            key={idx}
            onClick={() => setLightboxIndex(idx)}
            className="group relative h-40 sm:h-52 rounded-2xl overflow-hidden bg-[#0f2040] cursor-pointer border border-white/10 shadow-md hover:border-[#0ea5e9]/60 hover:shadow-xl transition-all duration-300"
          >
            <Image
              src={photo.url}
              alt={photo.caption || `${title} photo ${idx + 1}`}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
            />
            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

            {/* Hover Expand Icon */}
            <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
              <Maximize2 size={13} />
            </div>

            {/* Caption & Tag */}
            <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-3.5">
              <span className="text-[9px] sm:text-[10px] font-extrabold text-[#38bdf8] uppercase tracking-wider block mb-0.5">
                Highlight #{idx + 1}
              </span>
              <p className="text-[11px] sm:text-xs font-bold text-white leading-snug line-clamp-2 drop-shadow">
                {photo.caption}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Zoom Modal */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[99999] bg-black/95 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 select-none animate-fade-in"
          onClick={() => setLightboxIndex(null)}
        >
          {/* Close button */}
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute top-5 right-5 z-20 w-11 h-11 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center border border-white/20 transition-all hover:scale-105"
            aria-label="Close image zoom"
          >
            <X size={22} />
          </button>

          {/* Left Chevron */}
          <button
            onClick={handlePrev}
            className="absolute left-3 sm:left-6 z-20 w-11 h-11 rounded-full bg-black/60 hover:bg-[#0ea5e9] text-white flex items-center justify-center border border-white/20 transition-all hover:scale-110"
            aria-label="Previous photo"
          >
            <ChevronLeft size={24} />
          </button>

          {/* Right Chevron */}
          <button
            onClick={handleNext}
            className="absolute right-3 sm:right-6 z-20 w-11 h-11 rounded-full bg-black/60 hover:bg-[#0ea5e9] text-white flex items-center justify-center border border-white/20 transition-all hover:scale-110"
            aria-label="Next photo"
          >
            <ChevronRight size={24} />
          </button>

          {/* Image Display */}
          <div
            className="relative max-w-5xl w-full max-h-[82vh] h-[75vh] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-full rounded-2xl overflow-hidden border border-white/20 shadow-2xl">
              <Image
                src={photos[lightboxIndex].url}
                alt={photos[lightboxIndex].caption}
                fill
                className="object-contain"
                sizes="(max-width: 1200px) 100vw, 1200px"
                priority
              />
            </div>

            {/* Caption bar at bottom */}
            <div className="mt-3.5 px-4 py-2 bg-black/70 backdrop-blur-md rounded-full border border-white/20 text-center max-w-2xl">
              <span className="text-xs text-[#38bdf8] font-bold mr-2">
                {lightboxIndex + 1} / {photos.length}
              </span>
              <span className="text-xs sm:text-sm text-white font-semibold">
                {photos[lightboxIndex].caption}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
