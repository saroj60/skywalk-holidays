"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, Eye, Clock, ArrowRight, X, Sparkles, Video } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SectionHeader from "@/components/common/SectionHeader";
import { Button } from "@/components/ui/button";

const FEATURED_VIDEOS = [
  {
    id: "vlog-thailand-malaysia-singapore",
    title: "Thailand, Malaysia & Singapore Tour — Official Guide & Travel Highlights",
    destination: "Thailand, Malaysia & Singapore",
    categoryLabel: "Official Tour Guide",
    thumbnail: "/images/gallery/thailand-malaysia-singapore-trio.jpg",
    videoEmbedUrl: "https://www.youtube-nocookie.com/embed/S3-Mrb6BSyc?autoplay=1&rel=0",
    duration: "0:58",
    views: "Official Reel",
    host: "SkyWalk Holiday Official",
    isShort: true,
    packageLink: "/packages/thailand-malaysia-singapore-9d",
    description: "Official tour walkthrough of our 8 Nights / 9 Days package: Pattaya Coral Island, Bangkok sacred temples, Singapore Sentosa cable car & Malaysia Genting Highlands.",
  },
  {
    id: "vlog-bangkok-pattaya",
    title: "Bangkok & Pattaya 5N/6D Holiday Tour Package — Visual Travel Guide",
    destination: "Bangkok & Pattaya, Thailand",
    categoryLabel: "Official Tour Guide",
    thumbnail: "/images/gallery/coral-island-tropical-lagoon-view.png",
    videoEmbedUrl: "https://www.youtube-nocookie.com/embed/uef3bmZmiZk?autoplay=1&rel=0",
    duration: "0:59",
    views: "Official Reel",
    host: "SkyWalk Holiday Official",
    isShort: true,
    packageLink: "/packages/bangkok-pattaya-6d",
    description: "Coral Island speedboat adventure, Indian buffet lunch, Wat Traimitr & Wat Pho temple tours, and vibrant Bangkok shopping.",
  },
  {
    id: "vlog-vietnam-guide",
    title: "Vietnam 4K Tour Experience — Hanoi, Ha Long Bay & Da Nang Highlights",
    destination: "Vietnam (Hanoi, Ha Long, Da Nang)",
    categoryLabel: "Destination Guide",
    thumbnail: "/images/gallery/vietnam-highlights-collage-card.jpg",
    videoEmbedUrl: "https://www.youtube-nocookie.com/embed/MgbupV25I60?autoplay=1&rel=0",
    duration: "22:15",
    views: "52K views",
    host: "SkyWalk Travel Desk",
    isShort: false,
    packageLink: "/packages/vietnam-8d",
    description: "Hanoi Old Quarter, overnight luxury cruise through limestone karsts in Ha Long Bay, Sung Sot Cave, and Da Nang Golden Bridge.",
  },
];

export default function VideoGuidesSection() {
  const [activeVideo, setActiveVideo] = useState<(typeof FEATURED_VIDEOS)[0] | null>(null);

  return (
    <section className="section-padding bg-[#0a1628] text-white relative overflow-hidden">
      {/* Subtle Background Accent Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#0ea5e9]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#f97316]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container-custom relative z-10">
        <SectionHeader
          eyebrow="Visual Travel Guides"
          title="Watch Our Travel Video Guides & Vlogs"
          subtitle="Authentic video walkthroughs of tour destinations, luxury resort stays, and visa application procedures from Nepal."
          centered
          light
        />

        {/* Video Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          {/* Main Hero Featured Video (Spans 2 cols on lg) */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="lg:col-span-2 relative group rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-slate-900 aspect-[16/9] sm:aspect-[2.1/1] flex flex-col justify-end"
          >
            <Image
              src={FEATURED_VIDEOS[0].thumbnail}
              alt={FEATURED_VIDEOS[0].title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-80"
              sizes="(max-width: 1024px) 100vw, 66vw"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] via-[#0a1628]/40 to-transparent" />

            {/* Play Button Trigger */}
            <button
              onClick={() => setActiveVideo(FEATURED_VIDEOS[0])}
              className="absolute inset-0 m-auto w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#0ea5e9] hover:bg-[#38bdf8] text-white flex items-center justify-center shadow-2xl transition-all duration-300 group-hover:scale-110 border-4 border-white/30 cursor-pointer z-10"
              aria-label="Play Featured Video"
            >
              <Play size={28} className="fill-current ml-1" />
            </button>

            {/* Content Overlay */}
            <div className="relative z-10 p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span className="bg-[#0ea5e9] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  {FEATURED_VIDEOS[0].categoryLabel}
                </span>
                <span className="bg-white/20 backdrop-blur-md text-white text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1.5">
                  <Clock size={13} />
                  {FEATURED_VIDEOS[0].duration}
                </span>
                <span className="bg-white/20 backdrop-blur-md text-white/90 text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1.5">
                  <Eye size={13} />
                  {FEATURED_VIDEOS[0].views}
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-extrabold text-white mb-2 leading-tight">
                {FEATURED_VIDEOS[0].title}
              </h3>
              <p className="text-white/80 text-xs sm:text-sm line-clamp-2 max-w-2xl font-normal">
                {FEATURED_VIDEOS[0].description}
              </p>
            </div>
          </motion.div>

          {/* Secondary Video Cards Column */}
          <div className="flex flex-col gap-6 justify-between">
            {FEATURED_VIDEOS.slice(1).map((vlog, idx) => (
              <motion.div
                key={vlog.id}
                initial={{ opacity: 0, x: 25 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: idx * 0.12, ease: "easeOut" }}
                whileHover={{ scale: 1.02, x: 4, transition: { duration: 0.2 } }}
                onClick={() => setActiveVideo(vlog)}
                className="bg-white/5 border border-white/10 hover:border-[#0ea5e9]/50 rounded-2xl p-4 flex gap-4 items-center group cursor-pointer transition-all duration-300 hover:bg-white/10 shadow-lg"
              >
                {/* Thumbnail */}
                <div className="relative w-28 sm:w-36 aspect-[16/10] rounded-xl overflow-hidden shrink-0">
                  <Image
                    src={vlog.thumbnail}
                    alt={vlog.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="144px"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-[#0ea5e9] text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Play size={14} className="fill-current ml-0.5" />
                    </div>
                  </div>
                  <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                    {vlog.duration}
                  </span>
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-extrabold text-[#0ea5e9] uppercase tracking-wider block mb-1">
                    {vlog.categoryLabel}
                  </span>
                  <h4 className="text-sm font-bold text-white group-hover:text-[#38bdf8] transition-colors line-clamp-2 mb-1 leading-snug">
                    {vlog.title}
                  </h4>
                  <div className="flex items-center gap-2 text-[11px] text-white/60">
                    <span>{vlog.destination}</span>
                    <span>•</span>
                    <span>{vlog.views}</span>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* View All Vlogs Banner Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-gradient-to-r from-[#0ea5e9]/20 to-[#163058] border border-[#0ea5e9]/30 rounded-2xl p-5 flex items-center justify-between gap-4 shadow-lg hover:border-[#0ea5e9]/60 transition-colors"
            >
              <div>
                <h4 className="font-bold text-white text-sm mb-0.5">Looking for More Travel Videos?</h4>
                <p className="text-xs text-white/70">Browse our complete collection of 50+ video guides.</p>
              </div>
              <Link href="/vlogs">
                <Button size="sm" className="bg-[#f97316] hover:bg-[#ea580c] text-white font-bold text-xs shrink-0 gap-1.5 rounded-xl">
                  View All Vlogs
                  <ArrowRight size={14} />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Video Lightbox Modal */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99999] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
            onClick={() => setActiveVideo(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`relative w-full ${activeVideo.isShort ? "max-w-md sm:max-w-lg" : "max-w-4xl"} bg-[#0a1628] rounded-3xl overflow-hidden shadow-2xl border border-white/20`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header Bar */}
              <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/10 bg-slate-900/80">
                <div className="flex items-center gap-2">
                  <span className="bg-[#0ea5e9] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                    {activeVideo.categoryLabel}
                  </span>
                  <span className="text-white/70 text-xs font-semibold">{activeVideo.destination}</span>
                </div>
                <button
                  onClick={() => setActiveVideo(null)}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Close video player"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Video Player Frame */}
              <div className={`relative w-full ${activeVideo.isShort ? "aspect-[9/16] max-h-[70vh] mx-auto bg-black" : "aspect-video bg-black"}`}>
                <iframe
                  src={activeVideo.videoEmbedUrl}
                  title={activeVideo.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              {/* Modal Footer Description */}
              <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-900">
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm sm:text-base font-bold text-white mb-0.5">{activeVideo.title}</h3>
                  <p className="text-xs text-white/70 line-clamp-2">{activeVideo.description}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                  {activeVideo.packageLink && (
                    <Link href={activeVideo.packageLink} onClick={() => setActiveVideo(null)} className="flex-1 sm:flex-none">
                      <Button className="bg-[#f97316] hover:bg-[#ea580c] text-white text-xs font-bold w-full">
                        View Package
                      </Button>
                    </Link>
                  )}
                  <Link href="/vlogs" onClick={() => setActiveVideo(null)} className="flex-1 sm:flex-none">
                    <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 text-xs font-bold w-full">
                      All Videos
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
