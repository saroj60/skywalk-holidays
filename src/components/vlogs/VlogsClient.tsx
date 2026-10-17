"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Video,
  Eye,
  Clock,
  User,
  MapPin,
  X,
  Phone,
  ArrowRight,
  Sparkles,
  Share2,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildCustomWhatsAppLink } from "@/lib/whatsapp";

const VLOG_CATEGORIES = [
  { id: "all", label: "All Videos" },
  { id: "destinations", label: "Destination Guides" },
  { id: "reviews", label: "Customer Reviews" },
  { id: "tips", label: "Visa & Travel Tips" },
];

const VLOG_ITEMS = [
  {
    id: "vlog-thailand-malaysia-singapore",
    title: "Thailand, Malaysia & Singapore Tour — Official Tour Guide & Highlights",
    destination: "Thailand, Malaysia & Singapore",
    category: "destinations",
    categoryLabel: "Official Tour Guide",
    thumbnail: "/images/gallery/thailand-malaysia-singapore-trio.jpg",
    videoEmbedUrl: "https://www.youtube-nocookie.com/embed/S3-Mrb6BSyc?autoplay=1&rel=0",
    duration: "0:58",
    views: "Featured Official",
    date: "Oct 2026",
    host: "SkyWalk Holiday Official",
    isShort: true,
    description:
      "Official tour guide video of our 8 Nights / 9 Days grand multi-country package. Highlights include Pattaya Coral Island, Bangkok Golden Buddha, Singapore Sentosa cable car & Malaysia Genting Highlands.",
    packageLink: "/packages/thailand-malaysia-singapore-9d",
  },
  {
    id: "vlog-bangkok-pattaya",
    title: "Bangkok & Pattaya 5N/6D Holiday Tour Package — Visual Travel Guide",
    destination: "Bangkok & Pattaya, Thailand",
    category: "destinations",
    categoryLabel: "Official Tour Guide",
    thumbnail: "/images/gallery/coral-island-tropical-lagoon-view.png",
    videoEmbedUrl: "https://www.youtube-nocookie.com/embed/uef3bmZmiZk?autoplay=1&rel=0",
    duration: "0:59",
    views: "Official Reel",
    date: "Oct 2026",
    host: "SkyWalk Holiday Official",
    isShort: true,
    description:
      "Official tour reel of Bangkok & Pattaya holiday package covering Koh Larn speedboat excursion, Indian buffet lunch, Wat Pho reclining buddha, and shopping in Bangkok.",
    packageLink: "/packages/bangkok-pattaya-6d",
  },
  {
    id: "vlog-vietnam-guide",
    title: "Vietnam: The Ultimate Adventure & 4K Travel Guide (Hanoi, Ha Long Bay & Da Nang)",
    destination: "Vietnam",
    category: "destinations",
    categoryLabel: "Destination Guide",
    thumbnail: "/images/gallery/vietnam-highlights-collage-card.jpg",
    videoEmbedUrl: "https://www.youtube-nocookie.com/embed/MgbupV25I60?autoplay=1&rel=0",
    duration: "22:15",
    views: "54.2K views",
    date: "Sep 2026",
    host: "SkyWalk Travel Desk",
    isShort: false,
    description:
      "Explore Hanoi Old Quarter, an overnight luxury cruise in Ha Long Bay, Sung Sot Cave kayaking, Ba Na Hills Golden Bridge, and Hoi An lantern streets.",
    packageLink: "/packages/vietnam-8d",
  },
  {
    id: "vlog-singapore-guide",
    title: "Singapore & Malaysia 4K Travel Guide — Marina Bay, Genting & Batu Caves",
    destination: "Singapore & Malaysia",
    category: "destinations",
    categoryLabel: "Destination Guide",
    thumbnail: "https://images.unsplash.com/photo-1565967511849-76a60a516170?w=1200&q=85",
    videoEmbedUrl: "https://www.youtube-nocookie.com/embed/JE8GVJnkSvM?autoplay=1&rel=0",
    duration: "13:20",
    views: "48.6K views",
    date: "Aug 2026",
    host: "Aayush & SkyWalk Team",
    isShort: false,
    description:
      "Explore Marina Bay Sands, Gardens by the Bay, Genting Skyway cable car & Batu Caves with our Nepalese travelers.",
    packageLink: "/packages/thailand-malaysia-singapore-9d",
  },
  {
    id: "vlog-bali-guide",
    title: "Bali Tropical Paradise Travel Guide — Ubud, Seminyak & Nusa Penida",
    destination: "Bali, Indonesia",
    category: "reviews",
    categoryLabel: "Customer Review",
    thumbnail: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&q=85",
    videoEmbedUrl: "https://www.youtube-nocookie.com/embed/y3QBgcsAlx4?autoplay=1&rel=0",
    duration: "16:45",
    views: "38.4K views",
    date: "Jul 2026",
    host: "Rohan & Sneha Karki",
    isShort: false,
    description:
      "Real customer review showing private pool villas in Seminyak, flower baths, Ubud jungle swings, and Uluwatu cliff sunset booked through Skywalk Holidays.",
    packageLink: "/packages/bali-7d",
  },
  {
    id: "vlog-schengen-tips",
    title: "Schengen Visa from Nepal — Documents & Approval Guide",
    destination: "Europe / Nepal",
    category: "tips",
    categoryLabel: "Visa & Travel Tips",
    thumbnail: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&q=85",
    videoEmbedUrl: "https://www.youtube-nocookie.com/embed/MgbupV25I60?autoplay=1&rel=0",
    duration: "18:30",
    views: "42.8K views",
    date: "Jun 2026",
    host: "Skywalk Visa Desk",
    isShort: false,
    description:
      "Step-by-step breakdown of document preparation, bank statement requirements, cover letters, and VFS appointment booking in Kathmandu.",
    packageLink: "/services/visa",
  },
];

export default function VlogsClient() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeVlog, setActiveVlog] = useState<(typeof VLOG_ITEMS)[0] | null>(null);
  const [copied, setCopied] = useState(false);

  const filteredVlogs =
    activeCategory === "all"
      ? VLOG_ITEMS
      : VLOG_ITEMS.filter((item) => item.category === activeCategory);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const featuredVlog = VLOG_ITEMS[0];

  return (
    <div className="min-h-screen pb-20 relative overflow-hidden bg-gradient-to-b from-[#f0f9ff]/70 via-[#e0f2fe]/40 to-[#f8fafc]">
      {/* Background ambient radial glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-sky-200/35 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-2/3 right-10 w-[600px] h-[600px] bg-blue-200/25 rounded-full blur-[130px] pointer-events-none" />

      {/* Cloud SVG Definitions */}
      <svg className="absolute w-0 h-0" aria-hidden="true">
        <defs>
          <linearGradient id="vlogsCloudGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="65%" stopColor="#f0f9ff" />
            <stop offset="100%" stopColor="#bae6fd" />
          </linearGradient>
          <linearGradient id="vlogsContrailGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#0284c7" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#0369a1" stopOpacity="0.95" />
          </linearGradient>
        </defs>
      </svg>



      {/* Hero Header */}
      <section className="relative text-white py-16 md:py-24 overflow-hidden bg-[#0a1628]">
        {/* Background Travel Banner Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/contact-hero-banner.png"
            alt="Skywalk Travel Vlogs & Video Guides"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          {/* Multi-layer gradient overlays ensuring high contrast, readability, and landmark visibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a1628]/90 via-[#0a1628]/70 to-[#0a1628]/85" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] via-transparent to-[#0a1628]/60" />
        </div>

        <div className="container-custom relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6 text-xs sm:text-sm font-semibold text-[#0ea5e9] uppercase tracking-wider backdrop-blur-md shadow-lg"
          >
            <Video size={14} className="text-[#f97316]" />
            Travel Experiences &amp; Video Guides
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-4 drop-shadow-md"
          >
            Skywalk{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0ea5e9] via-[#38bdf8] to-white">
              Travel Vlogs
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/90 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed drop-shadow font-medium"
          >
            Watch real customer tour recaps, destination walkthroughs, visa tips, and resort reviews to inspire your next trip from Nepal.
          </motion.p>
        </div>
      </section>

      {/* Featured Main Video Card with Smooth Entrance */}
      <section className="container-custom -mt-8 relative z-20 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          className="bg-white rounded-3xl shadow-2xl border border-[#e2e8f0] overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0"
        >
          {/* Left Thumbnail with Play Overlay */}
          <div
            onClick={() => setActiveVlog(featuredVlog)}
            className="lg:col-span-7 relative h-72 sm:h-96 lg:h-full min-h-[320px] bg-slate-900 group cursor-pointer overflow-hidden"
          >
            <Image
              src={featuredVlog.thumbnail}
              alt={featuredVlog.title}
              fill
              priority
              className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-90"
              sizes="(max-width: 1024px) 100vw, 60vw"
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />

            {/* Pulsing Play Button with Radiating Radar Ring */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative flex items-center justify-center">
                <span className="absolute w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#f97316] animate-ping opacity-35 pointer-events-none" />
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#f97316] text-white flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform transform">
                  <Play size={32} className="ml-1 fill-white" />
                </div>
              </div>
            </div>

            {/* Badges */}
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="bg-[#0ea5e9] text-white text-xs font-bold px-3 py-1 rounded-full uppercase shadow-md">
                Featured Vlog
              </span>
            </div>
            <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-lg flex items-center gap-1">
              <Clock size={12} />
              {featuredVlog.duration}
            </div>
          </div>

          {/* Right Video Info */}
          <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 text-xs text-[#0ea5e9] font-bold uppercase tracking-wider mb-2">
                <span className="flex items-center gap-1">
                  <MapPin size={12} />
                  {featuredVlog.destination}
                </span>
                <span>•</span>
                <span className="text-[#64748b]">{featuredVlog.views}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#0a1628] leading-snug mb-3">
                {featuredVlog.title}
              </h2>
              <p className="text-[#64748b] text-sm leading-relaxed mb-6">
                {featuredVlog.description}
              </p>
            </div>

            <div className="pt-4 border-t border-[#f1f5f9] flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#0ea5e9]/10 text-[#0ea5e9] flex items-center justify-center font-bold text-xs">
                  <User size={14} />
                </div>
                <div>
                  <span className="text-xs text-[#94a3b8] block leading-none">Traveler</span>
                  <span className="text-xs font-bold text-[#0a1628]">{featuredVlog.host}</span>
                </div>
              </div>

              <Button
                onClick={() => setActiveVlog(featuredVlog)}
                className="bg-[#f97316] hover:bg-[#ea580c] text-white font-bold shadow-lg hover:shadow-orange-500/25 transition-all duration-300 hover:scale-105"
              >
                <Play size={16} className="fill-white" />
                Watch Vlog
              </Button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Category Navigation Tabs with Smooth Animation */}
      <section className="container-custom mb-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap items-center justify-center gap-2.5 max-w-2xl mx-auto"
        >
          {VLOG_CATEGORIES.map((cat) => (
            <motion.button
              key={cat.id}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                activeCategory === cat.id
                  ? "bg-[#0a1628] text-white shadow-lg shadow-slate-900/25 ring-2 ring-sky-400/40"
                  : "bg-white/90 backdrop-blur-sm text-[#64748b] hover:text-[#0a1628] border border-slate-200/90 hover:border-sky-300 hover:bg-white"
              }`}
            >
              {cat.label}
            </motion.button>
          ))}
        </motion.div>
      </section>

      {/* Vlogs Video Grid with Staggered Entrance & Interactive Hover Animations */}
      <section className="container-custom relative z-10">
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredVlogs.map((vlog, index) => (
              <motion.div
                key={vlog.id}
                layout
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                whileHover={{ y: -8, scale: 1.015 }}
                onClick={() => setActiveVlog(vlog)}
                className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl hover:shadow-sky-500/20 border border-slate-200/90 hover:border-sky-300 cursor-pointer flex flex-col justify-between transition-all duration-300"
              >
                {/* Thumbnail Container */}
                <div>
                  <div className="relative h-52 sm:h-56 w-full bg-slate-900 overflow-hidden">
                    <Image
                      src={vlog.thumbnail}
                      alt={vlog.title}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />

                    {/* Play Button Overlay with Pulsing Aura on Hover */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative flex items-center justify-center">
                        <span className="absolute w-14 h-14 rounded-full bg-[#f97316] opacity-0 group-hover:opacity-40 group-hover:animate-ping transition-opacity pointer-events-none" />
                        <div className="relative w-12 h-12 rounded-full bg-[#f97316] text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <Play size={20} className="ml-0.5 fill-white" />
                        </div>
                      </div>
                    </div>

                    {/* Top Category Badge */}
                    <div className="absolute top-3 left-3 bg-[#0a1628]/85 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full border border-white/20 shadow-md transition-transform duration-300 group-hover:scale-105">
                      {vlog.categoryLabel}
                    </div>

                    {/* Duration */}
                    <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-0.5 rounded flex items-center gap-1">
                      <Clock size={11} />
                      {vlog.duration}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5">
                    <div className="flex items-center gap-2 text-xs text-[#0ea5e9] font-bold uppercase tracking-wider mb-2">
                      <MapPin size={12} />
                      <span>{vlog.destination}</span>
                      <span>•</span>
                      <span className="text-[#94a3b8]">{vlog.views}</span>
                    </div>

                    <h3 className="font-bold text-base text-[#0a1628] leading-snug line-clamp-2 mb-2 group-hover:text-[#0ea5e9] transition-colors">
                      {vlog.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-[#64748b] line-clamp-2 leading-relaxed">
                      {vlog.description}
                    </p>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="p-5 pt-0 border-t border-[#f1f5f9] mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-[#64748b]">
                    <User size={12} className="text-[#0ea5e9]" />
                    <span>{vlog.host}</span>
                  </div>
                  <span className="text-xs font-bold text-[#f97316] flex items-center gap-1 group-hover:translate-x-1.5 transition-transform duration-300">
                    Watch Now
                    <ArrowRight size={14} />
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* Embedded Video Player Modal Overlay */}
      <AnimatePresence>
        {activeVlog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-6"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between text-white z-10 pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-xs bg-[#f97316] font-bold px-3 py-1 rounded-full uppercase">
                  {activeVlog.categoryLabel}
                </span>
                <span className="text-white/60 text-xs hidden sm:inline">
                  {activeVlog.destination}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleShare}
                  className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg text-xs font-semibold backdrop-blur-md transition-colors"
                >
                  {copied ? <Check size={14} className="text-green-400" /> : <Share2 size={14} />}
                  <span>{copied ? "Copied!" : "Share"}</span>
                </button>
                <button
                  onClick={() => setActiveVlog(null)}
                  className="p-2 rounded-full bg-white/10 hover:bg-red-500 text-white transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Video Container */}
            <div className="relative flex-1 flex items-center justify-center my-4">
              <div
                className={`relative w-full ${
                  activeVlog.isShort
                    ? "max-w-md aspect-[9/16] max-h-[70vh]"
                    : "max-w-5xl aspect-video"
                } rounded-2xl overflow-hidden shadow-2xl bg-black border border-white/15`}
              >
                <iframe
                  src={activeVlog.videoEmbedUrl}
                  title={activeVlog.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              </div>
            </div>

            {/* Modal Bottom Footer Info */}
            <div className="max-w-5xl mx-auto w-full bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 sm:p-5 text-white flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs text-[#38bdf8] font-bold mb-1">
                  <MapPin size={14} />
                  <span>{activeVlog.destination}</span>
                  <span>•</span>
                  <span className="text-white/60">{activeVlog.views}</span>
                  <span>•</span>
                  <span className="text-white/60">{activeVlog.host}</span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold">{activeVlog.title}</h2>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0 w-full md:w-auto">
                {activeVlog.packageLink && (
                  <Link
                    href={activeVlog.packageLink}
                    onClick={() => setActiveVlog(null)}
                    className="w-full sm:w-auto"
                  >
                    <Button
                      variant="outline"
                      className="border-white/20 text-white hover:bg-white/10 font-bold w-full sm:w-auto"
                    >
                      View Package
                    </Button>
                  </Link>
                )}
                <Button
                  size="default"
                  asChild
                  className="bg-[#f97316] hover:bg-[#ea580c] text-white font-bold w-full sm:w-auto"
                >
                  <a
                    href={buildCustomWhatsAppLink(
                      `Hello Skywalk Holidays! I watched the tour video "${activeVlog.title}" (${activeVlog.destination}) and want to inquire about booking this tour package.`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Phone size={16} />
                    Inquire On WhatsApp
                  </a>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Vlog Share CTA */}
      <section className="container-custom mt-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-r from-[#0a1628] via-[#0f2342] to-[#0ea5e9] rounded-3xl p-8 sm:p-12 text-white text-center relative overflow-hidden shadow-2xl"
        >
          <Sparkles className="absolute top-4 right-4 text-amber-400 opacity-30" size={48} />
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-4xl font-extrabold mb-4">
              Are You a Travel Creator or Vlogger?
            </h2>
            <p className="text-white/85 text-sm sm:text-base mb-8 leading-relaxed">
              Partner with Skywalk Holidays for sponsored tour packages and feature your vlogs in front of thousands of Nepalese travelers!
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" asChild className="bg-[#f97316] hover:bg-[#ea580c] text-white font-bold w-full sm:w-auto shadow-lg hover:shadow-orange-500/30 transition-all">
                <Link href="/contact">
                  Submit Your Vlog
                  <ArrowRight size={18} />
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
