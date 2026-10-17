"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, Phone, Mail, Plane } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NAV_LINKS, COMPANY } from "@/lib/constants";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const servicesLink = NAV_LINKS.find((l) => l.label === "Services");

  return (
    <>
      {/* Top Bar */}
      <div className="hidden md:block bg-[#0a1628] text-white text-xs py-2">
        <div className="container-custom flex justify-between items-center">
          <div className="flex items-center gap-6">
            <a href={`tel:${COMPANY.mobile}`} className="flex items-center gap-1.5 hover:text-[#0ea5e9] transition-colors">
              <Phone size={12} />
              {COMPANY.mobile}
            </a>
            <a href={`mailto:${COMPANY.email}`} className="flex items-center gap-1.5 hover:text-[#0ea5e9] transition-colors">
              <Mail size={12} />
              {COMPANY.email}
            </a>
          </div>
          <div className="text-[#94a3b8]">{COMPANY.address}</div>
        </div>
      </div>

      {/* Main Navbar */}
      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-300",
          isScrolled
            ? "bg-white shadow-md border-b border-[#e2e8f0]"
            : "bg-white border-b border-[#e2e8f0]"
        )}
      >
        <div className="container-custom flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group py-1">
            <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-xl overflow-hidden shadow-sm border border-slate-200/90 group-hover:scale-105 group-hover:border-[#0ea5e9] transition-all shrink-0 bg-white p-0.5">
              <Image
                src="/images/logo.png"
                alt="SkyWalk Tours & Travels Logo"
                fill
                className="object-contain"
                sizes="48px"
                priority
              />
            </div>
            <div>
              <span className="font-extrabold text-[#0a1628] text-lg leading-tight block group-hover:text-[#0ea5e9] transition-colors">
                SkyWalk
              </span>
              <span className="text-[#0ea5e9] text-[10px] font-extrabold tracking-widest uppercase leading-none block mt-0.5">
                Tours &amp; Travels
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) =>
              link.children ? (
                <div
                  key={link.label}
                  className="relative group"
                  onMouseEnter={() => setServicesOpen(true)}
                  onMouseLeave={() => setServicesOpen(false)}
                >
                  <button
                    type="button"
                    suppressHydrationWarning
                    className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-[#334155] hover:text-[#0ea5e9] rounded-lg hover:bg-[#f1f5f9] transition-colors"
                  >
                    {link.label}
                    <ChevronDown size={14} className="transition-transform group-hover:rotate-180" />
                  </button>

                  {/* Mega Menu */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none group-hover:pointer-events-auto">
                    <div className="bg-white rounded-2xl shadow-2xl border border-[#e2e8f0] p-3 w-72 text-left">
                      <p className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wider px-3 pb-2 border-b border-[#f1f5f9] mb-2">
                        Our Services
                      </p>
                      <div className="grid grid-cols-1 gap-0.5">
                        {link.children.map((child) => (
                          <Link
                            key={child.label}
                            href={child.href}
                            prefetch={true}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#334155] hover:bg-[#f0f9ff] hover:text-[#0ea5e9] transition-colors font-medium"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#0ea5e9] flex-shrink-0" />
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={link.label}
                  href={link.href}
                  prefetch={true}
                  className={cn(
                    "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                    pathname === link.href
                      ? "text-[#0ea5e9] font-bold bg-sky-50"
                      : "text-[#334155] hover:text-[#0ea5e9] hover:bg-[#f1f5f9]"
                  )}
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <Button variant="outline" size="sm" asChild>
              <Link href="/contact">Get a Quote</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/services/custom">Book Now</Link>
            </Button>
          </div>

          {/* Mobile Toggle */}
          <button
            type="button"
            suppressHydrationWarning
            className="lg:hidden p-2 rounded-lg text-[#334155] hover:bg-[#f1f5f9] transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={cn(
            "lg:hidden overflow-hidden transition-all duration-300 bg-white border-t border-[#e2e8f0]",
            mobileOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <div className="container-custom py-4 space-y-1">
            <Link
              href="/"
              className="block px-4 py-2.5 rounded-lg text-sm font-medium text-[#334155] hover:bg-[#f1f5f9]"
              onClick={() => setMobileOpen(false)}
            >
              Home
            </Link>

            {/* Mobile Services accordion */}
            <div>
              <button
                type="button"
                suppressHydrationWarning
                className="flex items-center justify-between w-full px-4 py-2.5 rounded-lg text-sm font-medium text-[#334155] hover:bg-[#f1f5f9]"
                onClick={() => setServicesOpen(!servicesOpen)}
              >
                Services
                <ChevronDown
                  size={14}
                  className={cn("transition-transform", servicesOpen && "rotate-180")}
                />
              </button>
              {servicesOpen && (
                <div className="pl-4 mt-1 space-y-0.5">
                  {servicesLink?.children?.map((child) => (
                    <Link
                      key={child.label}
                      href={child.href}
                      className="block px-4 py-2 rounded-lg text-sm text-[#64748b] hover:bg-[#f0f9ff] hover:text-[#0ea5e9]"
                      onClick={() => setMobileOpen(false)}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/gallery"
              className="block px-4 py-2.5 rounded-lg text-sm font-medium text-[#334155] hover:bg-[#f1f5f9]"
              onClick={() => setMobileOpen(false)}
            >
              Gallery
            </Link>
            <Link
              href="/vlogs"
              className="block px-4 py-2.5 rounded-lg text-sm font-medium text-[#334155] hover:bg-[#f1f5f9]"
              onClick={() => setMobileOpen(false)}
            >
              Vlogs
            </Link>
            <Link
              href="/about"
              className="block px-4 py-2.5 rounded-lg text-sm font-medium text-[#334155] hover:bg-[#f1f5f9]"
              onClick={() => setMobileOpen(false)}
            >
              About
            </Link>
            <Link
              href="/contact"
              className="block px-4 py-2.5 rounded-lg text-sm font-medium text-[#334155] hover:bg-[#f1f5f9]"
              onClick={() => setMobileOpen(false)}
            >
              Contact
            </Link>

            <div className="pt-3 pb-1 flex gap-2">
              <Button variant="outline" size="sm" className="flex-1" asChild>
                <Link href="/contact" onClick={() => setMobileOpen(false)}>Get a Quote</Link>
              </Button>
              <Button size="sm" className="flex-1" asChild>
                <Link href="/services/custom" onClick={() => setMobileOpen(false)}>Book Now</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
