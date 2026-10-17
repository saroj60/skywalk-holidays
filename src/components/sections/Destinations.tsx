"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin, Package, ArrowRight } from "lucide-react";
import { DESTINATIONS } from "@/lib/constants";
import SectionHeader from "@/components/common/SectionHeader";
import { Button } from "@/components/ui/button";

export default function Destinations() {
  return (
    <section className="section-padding relative overflow-hidden">
      {/* Ambient sky glow */}
      <div className="absolute top-1/2 left-10 w-96 h-96 bg-sky-200/35 rounded-full blur-[130px] pointer-events-none" />
      <div className="container-custom relative z-10">
        <SectionHeader
          eyebrow="Popular Destinations"
          title="Where Do You Want to Go?"
          subtitle="From the majestic Himalayas to the beaches of Bali — we cover every dream destination."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {DESTINATIONS.map((dest, index) => (
            <motion.div
              key={dest.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.55, delay: index * 0.08, ease: "easeOut" }}
              whileHover={{ y: -8, transition: { duration: 0.25 } }}
              className={`rounded-2xl overflow-hidden ${index === 0 ? "sm:col-span-2 lg:col-span-1" : ""}`}
            >
              <Link
                href={`/destinations/${dest.name.toLowerCase().replace(/,?\s+/g, "-")}`}
                className="group relative block overflow-hidden rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300"
              >
                <div className={`relative ${index < 2 ? "h-72" : "h-56"} overflow-hidden`}>
                  <Image
                    src={dest.image}
                    alt={dest.name}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  {/* Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <div className="flex items-center gap-1.5 text-white/80 text-xs mb-1">
                      <MapPin size={12} className="text-sky-400" />
                      {dest.name}
                    </div>
                    <h3 className="text-white font-bold text-xl leading-snug group-hover:text-sky-300 transition-colors">
                      {dest.name}
                    </h3>

                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/20">
                      <div className="flex items-center gap-1.5 text-sky-300 text-xs font-semibold">
                        <Package size={13} />
                        <span>{dest.packages} Packages Available</span>
                      </div>
                      <div className="text-white text-xs sm:text-sm font-extrabold bg-white/15 backdrop-blur-md px-2.5 py-1 rounded-full group-hover:bg-[#f97316] transition-colors shadow">
                        From NPR {dest.startingFrom.toLocaleString("en-US")}
                      </div>
                    </div>

                    <div className="mt-2 text-right opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-[11px] text-white font-bold flex items-center justify-end gap-1">
                      <span>View Related Packages</span>
                      <span>→</span>
                    </div>
                  </div>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-[#0ea5e9]/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-10"
        >
          <Button
            size="lg"
            variant="outline"
            asChild
            className="rounded-full border-sky-400/40 text-[#0ea5e9] hover:bg-[#0ea5e9] hover:text-white transition-all shadow-sm"
          >
            <Link
              href="/services/packages/international"
              className="inline-flex items-center gap-2 font-bold"
            >
              <span>View All Destinations</span>
              <ArrowRight size={16} />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
