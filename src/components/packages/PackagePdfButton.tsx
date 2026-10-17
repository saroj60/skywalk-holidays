"use client";

import React, { useState } from "react";
import { FileDown, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PackagePdfButtonProps {
  pkg: any;
  variant?: "primary" | "outline" | "secondary";
  className?: string;
  size?: "default" | "sm" | "lg" | "icon";
}

/**
 * Strips 4-byte unicode emojis and unsupported unicode symbols
 * that cause garbled characters (e.g. '{ or !Ä) in jsPDF standard Helvetica.
 */
function sanitizeText(str: string | undefined | null): string {
  if (!str) return "";
  return String(str)
    // Convert unicode arrows to clean ASCII
    .replace(/[\u21C4\u21C6\u2194\u21CB\u21CC]/g, " <-> ")
    .replace(/[\u2192\u279C\u2794\u21E8]/g, " -> ")
    .replace(/[\u2190\u21E6]/g, " <- ")
    // Convert curly quotes & special dashes
    .replace(/[\u201C\u201D\u201E\u201F]/g, '"')
    .replace(/[\u2018\u2019\u201A\u201B]/g, "'")
    .replace(/[\u2013\u2014\u2015]/g, " - ")
    // Remove emojis and symbols
    .replace(/[\u{1F300}-\u{1F9FF}]/gu, "")
    .replace(/[\u{2700}-\u{27BF}]/gu, "")
    .replace(/[\u{2600}-\u{26FF}]/gu, "")
    .replace(/[\u{FE00}-\u{FE0F}]/gu, "")
    .replace(/[\u{1F000}-\u{1F02F}]/gu, "")
    .replace(/[\u{1F0A0}-\u{1F0FF}]/gu, "")
    .replace(/[\u{1F100}-\u{1F64F}]/gu, "")
    .replace(/[\u{1F680}-\u{1F6FF}]/gu, "")
    .replace(/[\u{2300}-\u{23FF}]/gu, "")
    .replace(/[\u{2B50}]/gu, "")
    .replace(/[✨⭐📍⏱️🍽️🏨✈️✓✕•★✔✘]/g, " ")
    // Filter any remaining non-printable / corrupted unicode characters
    .replace(/[^\x20-\x7E\xA0-\xFF]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Converts local or remote image URL into a base64 Data URL
 * with timeout guard so PDF generation is fast and never hangs.
 */
async function urlToDataUrl(url: string, maxWidth = 1000): Promise<string | null> {
  if (!url || typeof window === "undefined") return null;

  const origin = window.location.origin;
  const fullUrl = url.startsWith("http://") || url.startsWith("https://")
    ? url
    : `${origin}${url.startsWith("/") ? "" : "/"}${url}`;

  // 1. Try Fetch + Blob (fastest and most reliable for all same-origin public images)
  try {
    const res = await fetch(fullUrl);
    if (res.ok) {
      const blob = await res.blob();
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
      return base64;
    }
  } catch {
    // Continue to canvas fallback
  }

  // 2. HTML Image + Canvas with CORS fallback
  return new Promise<string | null>((resolve) => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    const timer = setTimeout(() => resolve(null), 1800);

    img.onload = () => {
      clearTimeout(timer);
      try {
        const canvas = document.createElement("canvas");
        let w = img.naturalWidth || img.width;
        let h = img.naturalHeight || img.height;
        if (w > maxWidth) {
          h = Math.round((h * maxWidth) / w);
          w = maxWidth;
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(null);
          return;
        }
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      } catch {
        resolve(null);
      }
    };

    img.onerror = () => {
      clearTimeout(timer);
      resolve(null);
    };

    img.src = fullUrl;
  });
}

export default function PackagePdfButton({
  pkg,
  variant = "primary",
  className = "",
  size = "default",
}: PackagePdfButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleDownloadPdf = async () => {
    if (isGenerating || !pkg) return;
    setIsGenerating(true);

    try {
      // 1. Load images in parallel with deduplication and timeout safety
      const logoUrl = "/images/logo-transparent.png";
      const coverUrl =
        pkg.coverImage ||
        pkg.image ||
        (pkg.gallery?.[0]?.url || pkg.gallery?.[0]) ||
        "/images/bangkok-pattaya.png";

      // Deduplicate gallery: ensure the cover image is NOT repeated in the gallery,
      // and ensure every gallery photo is completely unique.
      const normalizedCover = (coverUrl || "").trim().toLowerCase();
      const seenImageUrls = new Set<string>();
      if (normalizedCover) {
        seenImageUrls.add(normalizedCover);
      }

      const galleryItems: { url: string; caption: string }[] = [];
      for (const g of (pkg.gallery || [])) {
        const rawUrl = typeof g === "string" ? g : (g?.url || "");
        const cleanUrl = (rawUrl || "").trim();
        const lowerUrl = cleanUrl.toLowerCase();

        if (cleanUrl && !seenImageUrls.has(lowerUrl)) {
          seenImageUrls.add(lowerUrl);
          galleryItems.push({
            url: cleanUrl,
            caption: typeof g === "object" ? sanitizeText(g.caption || "") : "",
          });
          if (galleryItems.length >= 4) break;
        }
      }

      const [logoData, coverData, ...galleryDataUrls] = await Promise.all([
        urlToDataUrl(logoUrl),
        urlToDataUrl(coverUrl),
        ...galleryItems.map((g: any) => urlToDataUrl(g.url)),
      ]);

      // 2. Initialize jsPDF
      const { jsPDF } = await import("jspdf");

      const doc = new jsPDF({
        unit: "mm",
        format: "a4",
        orientation: "portrait",
      });

      const pageWidth = 210;
      const pageHeight = 297;
      const margin = 14;
      const contentWidth = pageWidth - margin * 2;
      let y = 14;

      // Automated page break handler
      const ensureSpace = (neededHeight: number) => {
        if (y + neededHeight > pageHeight - 18) {
          doc.addPage();
          y = 22; // Starts comfortably below running top header on pages 2+
          return true;
        }
        return false;
      };

      // Clean section header with vertical accent bar - Enlarged to 11.5pt
      const addSectionTitle = (title: string) => {
        ensureSpace(14);
        doc.setFillColor(14, 165, 233); // #0ea5e9
        doc.rect(margin, y, 3, 6.8, "F");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11.5);
        doc.setTextColor(10, 22, 40);
        doc.text(title.toUpperCase(), margin + 6, y + 5.5);
        y += 11;
      };

      // -------------------------------------------------------------
      // 1. Header Banner (with Company Logo) - Enlarged typography
      // -------------------------------------------------------------
      const headerBannerHeight = 26;
      doc.setFillColor(10, 22, 40); // Deep Navy #0a1628
      doc.roundedRect(margin, y, contentWidth, headerBannerHeight, 2.5, 2.5, "F");

      let textStartX = margin + 8;

      // Draw Logo Image if loaded
      if (logoData) {
        try {
          doc.addImage(logoData, "PNG", margin + 6, y + 3, 22, 20, undefined, "FAST");
          textStartX = margin + 32;
        } catch {
          textStartX = margin + 8;
        }
      }

      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(15);
      doc.text("SKYWALK", textStartX, y + 10.5);

      doc.setTextColor(14, 165, 233); // Sky Blue #0ea5e9
      doc.text("HOLIDAYS", textStartX + doc.getTextWidth("SKYWALK ") + 1, y + 10.5);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(203, 213, 225);
      doc.text("Your Trusted International Travel Partner in Nepal", textStartX, y + 18.5);

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(8.5);
      doc.text("Pepsicola, Kathmandu • Tel: 014544343 / 9714491103", margin + contentWidth - 6, y + 10, {
        align: "right",
      });
      doc.text("skywalktoursandtravels32@gmail.com", margin + contentWidth - 6, y + 17.5, {
        align: "right",
      });

      y += headerBannerHeight + 6;

      // -------------------------------------------------------------
      // 2. Destination Cover Hero Image
      // -------------------------------------------------------------
      if (coverData) {
        try {
          const heroHeight = 52;
          ensureSpace(heroHeight + 4);
          doc.addImage(coverData, "JPEG", margin, y, contentWidth, heroHeight, undefined, "FAST");
          doc.setDrawColor(203, 213, 225);
          doc.rect(margin, y, contentWidth, heroHeight, "S");
          y += heroHeight + 6;
        } catch {
          // If image render fails, skip gracefully
        }
      }

      // -------------------------------------------------------------
      // 3. Package Title Hero Card - Clean non-overlapping layout
      // -------------------------------------------------------------
      const cleanTitle = sanitizeText(pkg.title || "Holiday Package");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      const titleLines = doc.splitTextToSize(cleanTitle, contentWidth - 16);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      const metaTokens = [
        pkg.destination ? `Destination: ${sanitizeText(pkg.destination)}` : "",
        pkg.duration ? `Duration: ${sanitizeText(pkg.duration)}` : "",
        pkg.rating ? `Rating: ${pkg.rating} / 5.0` : "",
      ].filter(Boolean);
      const metaLines = doc.splitTextToSize(metaTokens.join("    |    "), contentWidth - 16);

      const hasOriginalPrice = Boolean(pkg.originalPrice && pkg.originalPrice > pkg.price);
      const titleBlockHeight = Math.max(
        36,
        14 + titleLines.length * 5.8 + metaLines.length * 4.8 + (hasOriginalPrice ? 14 : 10)
      );
      ensureSpace(titleBlockHeight);

      doc.setFillColor(240, 249, 255); // #f0f9ff
      doc.setDrawColor(186, 230, 253); // #bae6fd
      doc.roundedRect(margin, y, contentWidth, titleBlockHeight, 3, 3, "FD");

      // Left brand accent bar
      doc.setFillColor(14, 165, 233);
      doc.rect(margin, y + 2, 2.5, titleBlockHeight - 4, "F");

      // Title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(10, 22, 40);
      doc.text(titleLines, margin + 8, y + 8.5);

      let heroY = y + 8.5 + titleLines.length * 5.8;

      // Meta row (Destination, Duration, Rating) with proper wrapping
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      doc.setTextColor(71, 85, 105);
      doc.text(metaLines, margin + 8, heroY);
      heroY += metaLines.length * 4.8 + 2;

      // Price row - cleanly separated text components to eliminate any overlap
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12.5);
      doc.setTextColor(2, 132, 199);
      const priceText = `NPR ${(pkg.price || 0).toLocaleString("en-US")}`;
      doc.text(priceText, margin + 8, heroY);
      const priceWidth = doc.getTextWidth(priceText);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(71, 85, 105);
      const taxText = "  per person (All Taxes Included)";
      doc.text(taxText, margin + 8 + priceWidth, heroY);
      const taxWidth = doc.getTextWidth(taxText);

      // Standard Rate (if applicable)
      if (hasOriginalPrice) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8.5);
        doc.setTextColor(148, 163, 184);
        const originalText = `    [Standard: NPR ${Number(pkg.originalPrice).toLocaleString("en-US")}]`;
        const originalWidth = doc.getTextWidth(originalText);

        // If it fits on the same line, place it cleanly after the tax text
        if (margin + 8 + priceWidth + taxWidth + originalWidth < margin + contentWidth - 8) {
          doc.text(originalText, margin + 8 + priceWidth + taxWidth, heroY);
        } else {
          // Otherwise place on its own line below so it NEVER overlaps
          heroY += 5.5;
          doc.text(`[Standard Rate: NPR ${Number(pkg.originalPrice).toLocaleString("en-US")}]`, margin + 8, heroY);
        }
      }

      y += titleBlockHeight + 7;

      // -------------------------------------------------------------
      // 4. Destination Photo Gallery Grid (4 Photos)
      // -------------------------------------------------------------
      const validGalleryPhotos: { data: string; caption: string }[] = [];
      const seenDataUrls = new Set<string>();
      if (coverData) {
        seenDataUrls.add(coverData);
      }

      galleryDataUrls.forEach((data, index) => {
        if (data && !seenDataUrls.has(data)) {
          seenDataUrls.add(data);
          validGalleryPhotos.push({
            data,
            caption: galleryItems[index]?.caption || "",
          });
        }
      });

      if (validGalleryPhotos.length > 0) {
        addSectionTitle("Destination Photo Highlights & Sights");
        const photoCount = Math.min(4, validGalleryPhotos.length);
        const gap = 3.5;
        const photoWidth = (contentWidth - (photoCount - 1) * gap) / photoCount;
        const photoHeight = 28;

        ensureSpace(photoHeight + 11);

        for (let i = 0; i < photoCount; i++) {
          const photo = validGalleryPhotos[i];
          const photoX = margin + i * (photoWidth + gap);
          try {
            doc.addImage(photo.data, "JPEG", photoX, y, photoWidth, photoHeight, undefined, "FAST");
            doc.setDrawColor(203, 213, 225);
            doc.rect(photoX, y, photoWidth, photoHeight, "S");

            if (photo.caption) {
              doc.setFont("helvetica", "normal");
              doc.setFontSize(7.5);
              doc.setTextColor(100, 116, 139);
              const captionLines = doc.splitTextToSize(photo.caption, photoWidth);
              doc.text(captionLines[0], photoX, y + photoHeight + 3.5);
            }
          } catch {
            // Skip broken image
          }
        }
        y += photoHeight + 9;
      }

      // -------------------------------------------------------------
      // 5. Package Overview & Introduction - Enlarged to 9.5pt
      // -------------------------------------------------------------
      if (pkg.overview) {
        addSectionTitle("Trip Overview & Experience");
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9.5);
        doc.setTextColor(51, 65, 85);
        const overviewClean = sanitizeText(pkg.overview);
        const overviewLines = doc.splitTextToSize(overviewClean, contentWidth - 4);
        ensureSpace(overviewLines.length * 4.8 + 4);
        doc.text(overviewLines, margin + 2, y);
        y += overviewLines.length * 4.8 + 7;
      }

      // -------------------------------------------------------------
      // 6. Key Trip Highlights - Enlarged to 9.5pt
      // -------------------------------------------------------------
      if (pkg.highlights && pkg.highlights.length > 0) {
        addSectionTitle("Key Trip Highlights");
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9.5);
        doc.setTextColor(15, 23, 42);

        pkg.highlights.forEach((h: string) => {
          const hClean = sanitizeText(h);
          const hLines = doc.splitTextToSize(hClean, contentWidth - 14);
          ensureSpace(hLines.length * 4.8 + 2);
          doc.setFillColor(14, 165, 233);
          doc.circle(margin + 4, y - 1.0, 1.1, "F");
          doc.text(hLines, margin + 9, y);
          y += hLines.length * 4.8 + 2;
        });
        y += 4;
      }

      // -------------------------------------------------------------
      // 7. Day-by-Day Itinerary - Enlarged to 9.5pt Body, 10.5pt Titles, 8.5pt Badges
      // -------------------------------------------------------------
      const itinerary = pkg.itinerary || pkg.outlineItinerary || [];
      if (itinerary.length > 0) {
        addSectionTitle("Day-by-Day Itinerary");

        itinerary.forEach((day: any, idx: number) => {
          const dayLabel = sanitizeText(day.day || `Day ${idx + 1}`);
          const dayTitle = sanitizeText(day.title || "");
          const dayHighlight = sanitizeText(day.highlight || "");
          const dayDesc = sanitizeText(day.desc || day.description || day.activity || "");
          const meals = sanitizeText(day.meals || "");
          const stay = sanitizeText(day.stay || "");

          doc.setFont("helvetica", "normal");
          doc.setFontSize(9.5);
          const descLines = doc.splitTextToSize(dayDesc, contentWidth - 14);

          doc.setFont("helvetica", "bold");
          doc.setFontSize(10.5);
          const titleLines = doc.splitTextToSize(dayTitle, contentWidth - 36);

          doc.setFont("helvetica", "italic");
          doc.setFontSize(9);
          const highlightLines = dayHighlight
            ? doc.splitTextToSize(`Highlights: ${dayHighlight}`, contentWidth - 14)
            : [];

          const titleHeight = Math.max(6.5, titleLines.length * 5.2);
          const highlightHeight = highlightLines.length > 0 ? highlightLines.length * 4.4 + 2.5 : 0;
          const descHeight = descLines.length * 4.8;
          const metaHeight = meals || stay ? 8.5 : 0;

          const cardHeight = 10 + titleHeight + highlightHeight + descHeight + metaHeight + 4;

          ensureSpace(cardHeight);

          // Card background
          doc.setFillColor(248, 250, 252); // #f8fafc
          doc.setDrawColor(226, 232, 240); // #e2e8f0
          doc.roundedRect(margin, y, contentWidth, cardHeight, 2, 2, "FD");

          // Left Sky Blue accent stripe
          doc.setFillColor(14, 165, 233);
          doc.rect(margin, y + 2, 2.5, cardHeight - 4, "F");

          // Day Badge Pill - 8.5pt font
          doc.setFillColor(224, 242, 254); // #e0f2fe
          doc.roundedRect(margin + 6, y + 3, 20, 5.8, 1, 1, "F");
          doc.setFont("helvetica", "bold");
          doc.setFontSize(8.5);
          doc.setTextColor(2, 132, 199);
          doc.text(dayLabel.toUpperCase(), margin + 7.5, y + 7.0);

          // Day Title - 10.5pt bold font
          doc.setFont("helvetica", "bold");
          doc.setFontSize(10.5);
          doc.setTextColor(10, 22, 40);
          doc.text(titleLines, margin + 30, y + 7.0);

          let curY = y + 6 + titleHeight;

          // Highlight Line - 9pt italic font
          if (highlightLines.length > 0) {
            doc.setFont("helvetica", "italic");
            doc.setFontSize(9);
            doc.setTextColor(2, 132, 199);
            doc.text(highlightLines, margin + 6, curY);
            curY += highlightHeight;
          }

          // Detailed Activity Description - 9.5pt readable font
          doc.setFont("helvetica", "normal");
          doc.setFontSize(9.5);
          doc.setTextColor(71, 85, 105);
          doc.text(descLines, margin + 6, curY);
          curY += descHeight;

          // Meals & Accommodation Footer - 8.5pt font
          if (meals || stay) {
            doc.setDrawColor(241, 245, 249);
            doc.line(margin + 6, curY + 1.5, margin + contentWidth - 6, curY + 1.5);
            doc.setFont("helvetica", "normal");
            doc.setFontSize(8.5);
            doc.setTextColor(100, 116, 139);
            const metaParts: string[] = [];
            if (meals) metaParts.push(`Meals: ${meals}`);
            if (stay) metaParts.push(`Stay: ${stay}`);
            doc.text(metaParts.join("    |    "), margin + 6, curY + 6.2);
          }

          y += cardHeight + 4.5;
        });
        y += 2;
      }

      // -------------------------------------------------------------
      // 8. Inclusions & Exclusions - Enlarged to 9.5pt with Vector Bullets
      // -------------------------------------------------------------
      const inclusions = pkg.inclusions || [];
      const exclusions = pkg.exclusions || [];

      if (inclusions.length > 0 || exclusions.length > 0) {
        addSectionTitle("Package Inclusions & Exclusions");

        // Inclusions Card
        if (inclusions.length > 0) {
          doc.setFont("helvetica", "normal");
          doc.setFontSize(9.5);
          const incLines = inclusions.map((inc: string) =>
            doc.splitTextToSize(sanitizeText(inc), contentWidth - 22)
          );
          const incTotalHeight =
            14 + incLines.reduce((acc: number, l: string[]) => acc + l.length * 4.8 + 2.0, 0);

          ensureSpace(incTotalHeight);

          doc.setFillColor(240, 253, 244); // #f0fdf4
          doc.setDrawColor(187, 247, 208); // #bbf7d0
          doc.roundedRect(margin, y, contentWidth, incTotalHeight, 2, 2, "FD");

          // Green accent stripe
          doc.setFillColor(34, 197, 94); // #22c55e
          doc.rect(margin, y + 2, 2.5, incTotalHeight - 4, "F");

          doc.setFont("helvetica", "bold");
          doc.setFontSize(10);
          doc.setTextColor(21, 128, 61); // #15803d
          doc.text("INCLUDED IN PACKAGE", margin + 7, y + 7.5);

          let incY = y + 13.5;
          doc.setFont("helvetica", "normal");
          doc.setFontSize(9.5);
          doc.setTextColor(22, 101, 52);

          incLines.forEach((lines: string[]) => {
            // Draw clean vector checkmark scaled to 9.5pt text
            doc.setDrawColor(22, 101, 52);
            doc.setLineWidth(0.45);
            const checkX = margin + 7;
            const checkY = incY - 1.5;
            doc.line(checkX, checkY, checkX + 1.2, checkY + 1.4);
            doc.line(checkX + 1.2, checkY + 1.4, checkX + 3.2, checkY - 1.6);

            // Draw text cleanly indented
            doc.text(lines, margin + 14, incY);
            incY += lines.length * 4.8 + 2.0;
          });

          y += incTotalHeight + 5;
        }

        // Exclusions Card
        if (exclusions.length > 0) {
          doc.setFont("helvetica", "normal");
          doc.setFontSize(9.5);
          const excLines = exclusions.map((exc: string) =>
            doc.splitTextToSize(sanitizeText(exc), contentWidth - 22)
          );
          const excTotalHeight =
            14 + excLines.reduce((acc: number, l: string[]) => acc + l.length * 4.8 + 2.0, 0);

          ensureSpace(excTotalHeight);

          doc.setFillColor(254, 242, 242); // #fef2f2
          doc.setDrawColor(254, 202, 202); // #fecaca
          doc.roundedRect(margin, y, contentWidth, excTotalHeight, 2, 2, "FD");

          // Red accent stripe
          doc.setFillColor(239, 68, 68); // #ef4444
          doc.rect(margin, y + 2, 2.5, excTotalHeight - 4, "F");

          doc.setFont("helvetica", "bold");
          doc.setFontSize(10);
          doc.setTextColor(185, 28, 28); // #b91c1c
          doc.text("EXCLUDED / EXTRA COSTS", margin + 7, y + 7.5);

          let excY = y + 13.5;
          doc.setFont("helvetica", "normal");
          doc.setFontSize(9.5);
          doc.setTextColor(153, 27, 27);

          excLines.forEach((lines: string[]) => {
            // Draw clean vector minus dash scaled to 9.5pt text
            doc.setDrawColor(185, 28, 28);
            doc.setLineWidth(0.55);
            const dashX = margin + 7;
            const dashY = excY - 1.2;
            doc.line(dashX, dashY, dashX + 3.0, dashY);

            // Draw text cleanly indented
            doc.text(lines, margin + 14, excY);
            excY += lines.length * 4.8 + 2.0;
          });

          y += excTotalHeight + 5;
        }
      }

      // -------------------------------------------------------------
      // 9. Accommodation & Important Visa Checklist - Enlarged to 9.5pt
      // -------------------------------------------------------------
      const hotelInfo = pkg.hotelInfo;
      const visaReqs = pkg.visaRequirements || pkg.visaInfo?.details || [];

      if (hotelInfo || visaReqs.length > 0) {
        addSectionTitle("Hotel, Visa & Important Guidelines");

        if (hotelInfo) {
          doc.setFont("helvetica", "normal");
          doc.setFontSize(9.5);
          const hotelText =
            typeof hotelInfo === "string"
              ? sanitizeText(hotelInfo)
              : `${sanitizeText(hotelInfo.name || "3-Star Deluxe Hotel")} (${sanitizeText(hotelInfo.rating || "3-Star Deluxe")}) • Check-in: ${hotelInfo.checkIn || "14:00"} / Check-out: ${hotelInfo.checkOut || "12:00"}`;
          const hotelLines = doc.splitTextToSize(hotelText, contentWidth - 12);
          const hotelCardHeight = 16 + hotelLines.length * 4.8;

          ensureSpace(hotelCardHeight);
          doc.setFillColor(248, 250, 252);
          doc.setDrawColor(226, 232, 240);
          doc.roundedRect(margin, y, contentWidth, hotelCardHeight, 2, 2, "FD");

          doc.setFont("helvetica", "bold");
          doc.setFontSize(9.5);
          doc.setTextColor(10, 22, 40);
          doc.text("ACCOMMODATION DETAILS:", margin + 6, y + 6.5);

          doc.setFont("helvetica", "normal");
          doc.setFontSize(9.5);
          doc.setTextColor(71, 85, 105);
          doc.text(hotelLines, margin + 6, y + 12.5);
          y += hotelCardHeight + 5;
        }

        if (visaReqs.length > 0) {
          ensureSpace(14 + visaReqs.length * 5);
          doc.setFont("helvetica", "bold");
          doc.setFontSize(9.5);
          doc.setTextColor(10, 22, 40);
          doc.text("MANDATORY TRAVEL & VISA REQUIREMENTS:", margin + 2, y + 5);
          y += 8;

          doc.setFont("helvetica", "normal");
          doc.setFontSize(9.5);
          doc.setTextColor(51, 65, 85);
          visaReqs.forEach((v: string) => {
            const vLines = doc.splitTextToSize(`•  ${sanitizeText(v)}`, contentWidth - 8);
            ensureSpace(vLines.length * 4.8);
            doc.text(vLines, margin + 4, y);
            y += vLines.length * 4.8 + 1.5;
          });
          y += 4;
        }
      }

      // -------------------------------------------------------------
      // 10. Running Top Header on Pages 2..N & Footer on All Pages
      // -------------------------------------------------------------
      const totalPages = doc.getNumberOfPages();
      const headerShortTitle = cleanTitle.substring(0, 48);

      for (let p = 1; p <= totalPages; p++) {
        doc.setPage(p);

        // Top Running Header (Pages 2+) - 8.5pt font
        if (p > 1) {
          doc.setFont("helvetica", "bold");
          doc.setFontSize(8.5);
          doc.setTextColor(10, 22, 40);
          doc.text("SKYWALK HOLIDAYS", margin, 11);

          doc.setFont("helvetica", "normal");
          doc.setTextColor(100, 116, 139);
          doc.text("|  Official Tour Package Itinerary", margin + 34, 11);
          doc.text(headerShortTitle, margin + contentWidth, 11, { align: "right" });

          doc.setDrawColor(226, 232, 240);
          doc.line(margin, 14, margin + contentWidth, 14);
        }

        // Bottom Footer (All Pages) - 8pt font
        doc.setDrawColor(226, 232, 240);
        doc.line(margin, pageHeight - 12, margin + contentWidth, pageHeight - 12);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(148, 163, 184);
        doc.text(
          "SkyWalk Tours & Travels Pvt. Ltd. • Govt. Regd. Travel Agency, Nepal • 24/7 Helpline: +977-9714491103 / 014544343",
          margin,
          pageHeight - 7
        );
        doc.text(`Page ${p} of ${totalPages}`, margin + contentWidth, pageHeight - 7, {
          align: "right",
        });
      }

      // -------------------------------------------------------------
      // 11. Instant 1-Click File Download
      // -------------------------------------------------------------
      const safeFilename = `${cleanTitle.replace(/[^a-zA-Z0-9_-]/g, "_").replace(/_+/g, "_")}_SkyWalk_Holidays.pdf`;
      doc.save(safeFilename);

      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 2500);
    } catch (err) {
      console.error("PDF generation error:", err);
      alert("Unable to generate PDF at this time. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  if (variant === "outline") {
    return (
      <Button
        onClick={handleDownloadPdf}
        disabled={isGenerating}
        variant="outline"
        size={size}
        className={`border-[#0ea5e9] text-[#0ea5e9] hover:bg-[#0ea5e9] hover:text-white font-bold gap-2 shadow-xs transition-all duration-200 cursor-pointer ${
          isSuccess ? "!border-emerald-500 !text-emerald-600 !bg-emerald-50" : ""
        } ${className}`}
      >
        {isGenerating ? (
          <>
            <Loader2 size={16} className="animate-spin text-[#0ea5e9]" />
            <span>Generating PDF...</span>
          </>
        ) : isSuccess ? (
          <>
            <Check size={16} className="text-emerald-500" />
            <span>Downloaded!</span>
          </>
        ) : (
          <>
            <FileDown size={16} />
            <span>Download PDF</span>
          </>
        )}
      </Button>
    );
  }

  if (variant === "secondary") {
    return (
      <Button
        onClick={handleDownloadPdf}
        disabled={isGenerating}
        size={size}
        className={`bg-[#0a1628] hover:bg-[#1e293b] text-white font-bold gap-2 shadow-md transition-all duration-200 cursor-pointer ${
          isSuccess ? "!bg-emerald-600" : ""
        } ${className}`}
      >
        {isGenerating ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            <span>Generating PDF...</span>
          </>
        ) : isSuccess ? (
          <>
            <Check size={16} />
            <span>Downloaded!</span>
          </>
        ) : (
          <>
            <FileDown size={16} />
            <span>Download PDF</span>
          </>
        )}
      </Button>
    );
  }

  return (
    <Button
      onClick={handleDownloadPdf}
      disabled={isGenerating}
      size={size}
      className={`bg-[#0ea5e9] hover:bg-[#0284c7] text-white font-extrabold gap-2 shadow-lg shadow-sky-500/25 transition-all duration-200 cursor-pointer ${
        isSuccess ? "!bg-emerald-600 shadow-emerald-500/25" : ""
      } ${className}`}
    >
      {isGenerating ? (
        <>
          <Loader2 size={18} className="animate-spin" />
          <span>Generating PDF...</span>
        </>
      ) : isSuccess ? (
        <>
          <Check size={18} />
          <span>Downloaded!</span>
        </>
      ) : (
        <>
          <FileDown size={18} />
          <span>Download PDF Itinerary</span>
        </>
      )}
    </Button>
  );
}
