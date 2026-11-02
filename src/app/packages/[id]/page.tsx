import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { PACKAGES_DICTIONARY } from "@/lib/packagesData";
import PackageDetailClient from "@/components/packages/PackageDetailClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function resolvePackage(id: string) {
  let pkg = PACKAGES_DICTIONARY[id];
  if (!pkg && (id === "1" || id === "bangkok-pattaya")) pkg = PACKAGES_DICTIONARY["bangkok-pattaya-6d"];
  if (!pkg && (id === "2" || id === "bali-malaysia")) pkg = PACKAGES_DICTIONARY["bali-malaysia-7d"];
  if (!pkg && (id === "3" || id === "bangkok-pattaya-8d" || id === "thailand-8d")) pkg = PACKAGES_DICTIONARY["bangkok-pattaya-8d"];
  if (!pkg && (id === "4" || id === "bangkok-pattaya-phuket-8d" || id === "thailand-phuket-8d" || id === "phuket-8d")) pkg = PACKAGES_DICTIONARY["bangkok-pattaya-phuket-8d"];
  if (!pkg && (id === "5" || id === "bangkok-pattaya-5d" || id === "thailand-5d")) pkg = PACKAGES_DICTIONARY["bangkok-pattaya-5d"];
  if (!pkg && (id === "6" || id === "krabi-phuket-bangkok-8d" || id === "krabi-8d" || id === "thailand-krabi-8d")) pkg = PACKAGES_DICTIONARY["krabi-phuket-bangkok-8d"];
  if (!pkg && (id === "7" || id === "malaysia-singapore-6d" || id === "singapore-malaysia-6d" || id === "malaysia-singapore" || id === "singapore-malaysia")) pkg = PACKAGES_DICTIONARY["malaysia-singapore-6d"];
  if (!pkg && (id === "8" || id === "maldives-4d" || id === "maldives-3n4d" || id === "maldives")) pkg = PACKAGES_DICTIONARY["maldives-4d"];
  if (!pkg && (id === "9" || id === "philippines-6d" || id === "philippines-5n6d" || id === "philippines")) pkg = PACKAGES_DICTIONARY["philippines-6d"];
  if (!pkg && (id === "10" || id === "philippines-8d" || id === "philippines-7n8d")) pkg = PACKAGES_DICTIONARY["philippines-8d"];
  if (!pkg && (id === "11" || id === "phuket-bangkok-6d" || id === "bangkok-phuket-6d" || id === "phuket-bangkok")) pkg = PACKAGES_DICTIONARY["phuket-bangkok-6d"];
  if (!pkg && (id === "12" || id === "singapore-4d" || id === "singapore-3n4d" || id === "singapore")) pkg = PACKAGES_DICTIONARY["singapore-4d"];
  if (!pkg && (id === "13" || id === "sri-lanka-thailand-7d" || id === "sri-lanka-thailand" || id === "thailand-sri-lanka-7d" || id === "thailand-sri-lanka")) pkg = PACKAGES_DICTIONARY["sri-lanka-thailand-7d"];
  if (!pkg && (id === "14" || id === "thailand-vietnam-8d" || id === "thailand-vietnam" || id === "vietnam-thailand-8d" || id === "vietnam-thailand" || id === "hanoi-8d")) pkg = PACKAGES_DICTIONARY["thailand-vietnam-8d"];
  if (!pkg && (id === "15" || id === "thailand-malaysia-singapore-9d" || id === "thailand-singapore-malaysia-9d" || id === "thailand-malaysia-singapore" || id === "thailand-singapore-malaysia" || id === "singapore-malaysia-thailand-9d")) pkg = PACKAGES_DICTIONARY["thailand-malaysia-singapore-9d"];
  if (!pkg && (id === "16" || id === "vietnam-6d" || id === "vietnam-5n6d" || id === "vietnam-hanoi-halong-danang-6d" || id === "vietnam" || id === "hanoi-halong-danang-6d" || id === "danang-6d")) pkg = PACKAGES_DICTIONARY["vietnam-6d"];
  if (!pkg && (id === "bali" || id === "bali-7d")) pkg = PACKAGES_DICTIONARY["bali-7d"];
  if (!pkg && (id === "china" || id === "china-8d" || id === "china-beijing-shanghai")) pkg = PACKAGES_DICTIONARY["china-beijing-shanghai-8d"];
  if (!pkg) return null;

  const itinerary = (pkg.itinerary && pkg.itinerary.length > 0)
    ? pkg.itinerary
    : (pkg.outlineItinerary || []).map((out: any) => ({
        day: out.day || "Day",
        title: out.title || "",
        description: out.description || out.desc || out.activity || out.title || "",
        meals: out.meals || "",
        stay: out.stay || "",
      }));

  const defaultHotelInfo = {
    name: `${pkg.destination || "Handpicked"} Partner Hotels & Resorts`,
    rating: "3-Star & 4-Star Certified Hospitality",
    location: pkg.destination || "Destination City Center",
    checkIn: "2:00 PM",
    checkOut: "12:00 PM",
    roomType: "Deluxe Twin/Double Room with Breakfast",
    amenities: [
      "Daily Buffet Breakfast",
      "Free High-Speed Wi-Fi",
      "Air Conditioning",
      "En-suite Bathroom with Hot Water",
      "24-Hour Reception & Travel Desk",
    ],
  };

  const hotelInfo = pkg.hotelInfo && typeof pkg.hotelInfo === "object"
    ? {
        name: pkg.hotelInfo.name || defaultHotelInfo.name,
        rating: pkg.hotelInfo.rating || defaultHotelInfo.rating,
        location: pkg.hotelInfo.location || defaultHotelInfo.location,
        checkIn: pkg.hotelInfo.checkIn || defaultHotelInfo.checkIn,
        checkOut: pkg.hotelInfo.checkOut || defaultHotelInfo.checkOut,
        roomType: pkg.hotelInfo.roomType || defaultHotelInfo.roomType,
        amenities: Array.isArray(pkg.hotelInfo.amenities) && pkg.hotelInfo.amenities.length > 0
          ? pkg.hotelInfo.amenities
          : defaultHotelInfo.amenities,
      }
    : defaultHotelInfo;

  const defaultFaqs = [
    {
      q: `What is included in this ${pkg.title || "holiday"} package?`,
      a: "This package includes round-trip international flight arrangements, certified hotel stays with daily breakfast, private/SIC airport and sightseeing transfers, selected monument entrance tickets, and full visa guidance from Kathmandu.",
    },
    {
      q: "Can this package itinerary be customized?",
      a: "Yes! All packages by Skywalk Holidays can be tailored to your preferred dates, hotel categories (3-Star, 4-Star, 5-Star), group size, or private vehicle upgrades. Contact our team on WhatsApp for a custom quote.",
    },
    {
      q: "How does the visa application process work for Nepali passport holders?",
      a: "Skywalk Holidays provides complete visa assistance including document checklist, embassy appointment scheduling, flight itineraries, and hotel booking vouchers.",
    },
  ];

  const faqs = Array.isArray(pkg.faqs) && pkg.faqs.length > 0 ? pkg.faqs : defaultFaqs;

  return {
    ...pkg,
    itinerary,
    hotelInfo,
    faqs,
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  let pkg = resolvePackage(id);

  if (!pkg) {
    return {
      title: "Holiday Tour Package from Nepal | Skywalk Holidays",
      description: "Explore curated international holiday packages from Nepal with Skywalk Holidays Kathmandu.",
    };
  }

  // Merge live price for metadata
  try {
    const numId = Number(id);
    const dbPkg = await prisma.holidayPackage.findFirst({
      where: {
        OR: [
          ...(!isNaN(numId) ? [{ id: numId }] : []),
          ...(pkg?.title ? [{ title: pkg.title }] : []),
        ],
      },
    });
    if (dbPkg) {
      pkg = {
        ...pkg,
        price: dbPkg.price,
        originalPrice: dbPkg.originalPrice,
        title: dbPkg.title || pkg.title,
      };
    }
  } catch (e) {}

  const destination = pkg.destination || "International";
  const title = `${pkg.title} | ${destination} Tour from Nepal — Skywalk Holidays`;
  const description = `${pkg.duration} holiday tour package to ${destination}. Starting from NPR ${pkg.price ? pkg.price.toLocaleString("en-US") : "48,000"}. Includes round-trip international flights from Kathmandu, deluxe hotel stays, guided sightseeing, and visa assistance.`;
  const canonicalUrl = `https://skywalkholiday.com/packages/${id}`;
  const rawImage = pkg.image || (pkg.gallery && pkg.gallery[0]?.url) || "/images/explore-holiday-packages.png";
  const ogImageUrl = rawImage.startsWith("http") ? rawImage : `https://skywalkholiday.com${rawImage}`;

  return {
    title,
    description,
    keywords: [
      `${destination} tour package from nepal`,
      `${pkg.title} nepal`,
      `${destination} holiday from kathmandu`,
      "tour and travel company in nepal",
      "best travel agency in nepal",
      "skywalk holidays",
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "Skywalk Holidays Nepal",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${pkg.title} — Skywalk Holidays Nepal`,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

export default async function PackageDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let pkg = resolvePackage(id);

  // Merge live database updates if available
  try {
    const numId = Number(id);
    const dbPkg = await prisma.holidayPackage.findFirst({
      where: {
        OR: [
          ...(!isNaN(numId) ? [{ id: numId }] : []),
          ...(pkg?.title ? [{ title: pkg.title }] : []),
        ],
      },
    });

    if (dbPkg) {
      pkg = {
        ...(pkg || {}),
        title: dbPkg.title || pkg?.title,
        price: Number(dbPkg.price),
        originalPrice: Number(dbPkg.originalPrice),
        destination: dbPkg.destination || pkg?.destination,
        duration: dbPkg.duration || pkg?.duration,
        overview: dbPkg.overview || pkg?.overview,
        inclusions: dbPkg.inclusions ? (typeof dbPkg.inclusions === "string" ? JSON.parse(dbPkg.inclusions) : dbPkg.inclusions) : pkg?.inclusions,
        exclusions: dbPkg.exclusions ? (typeof dbPkg.exclusions === "string" ? JSON.parse(dbPkg.exclusions) : dbPkg.exclusions) : pkg?.exclusions,
        itinerary: dbPkg.itinerary ? (typeof dbPkg.itinerary === "string" ? JSON.parse(dbPkg.itinerary) : dbPkg.itinerary) : pkg?.itinerary,
        gallery: dbPkg.gallery ? (typeof dbPkg.gallery === "string" ? JSON.parse(dbPkg.gallery) : dbPkg.gallery) : pkg?.gallery,
      } as any;
    }
  } catch (e) {
    console.error("Error reading live package from DB:", e);
  }

  if (!pkg) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center container-custom py-20">
        <div className="bg-white rounded-3xl p-10 sm:p-14 text-center border border-[#e2e8f0] shadow-sm space-y-4 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-full bg-sky-50 text-[#0ea5e9] flex items-center justify-center mx-auto text-2xl font-bold">
            ✈️
          </div>
          <h1 className="text-2xl font-bold text-[#0a1628]">Package Not Found</h1>
          <p className="text-sm text-[#64748b] leading-relaxed">
            This package is no longer available or is currently being updated with new seasonal itineraries.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild className="bg-[#0a1628] hover:bg-[#163058] text-white">
              <Link href="/services/packages/international">Browse All Packages</Link>
            </Button>
            <Button variant="outline" asChild className="border-emerald-600 text-emerald-600 hover:bg-emerald-50">
              <a href="https://wa.me/9779714491103" target="_blank" rel="noopener noreferrer">
                Inquire on WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const rawImg = pkg.image || (pkg.gallery && pkg.gallery[0]?.url) || "/images/explore-holiday-packages.png";
  const tripImageUrl = rawImg.startsWith("http") ? rawImg : `https://skywalkholiday.com${rawImg}`;

  const packageJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["TouristTrip", "Product"],
        "@id": `https://skywalkholiday.com/packages/${id}#trip`,
        "name": pkg.title,
        "description": pkg.overview,
        "touristType": ["Holiday Travelers", "Couples", "Families", "Tourists from Nepal"],
        "image": tripImageUrl,
        "offers": {
          "@type": "Offer",
          "price": pkg.price,
          "priceCurrency": "NPR",
          "availability": "https://schema.org/InStock",
          "url": `https://skywalkholiday.com/packages/${id}`,
          "priceValidUntil": "2027-12-31",
          "seller": {
            "@type": "TravelAgency",
            "name": "Skywalks Holidays",
            "telephone": "+977 971-4491103"
          }
        },
        "provider": {
          "@type": "TravelAgency",
          "name": "Skywalks Holidays",
          "url": "https://skywalkholiday.com"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": pkg.rating || 4.9,
          "reviewCount": pkg.reviewsCount || 150,
          "bestRating": 5,
          "worstRating": 1
        }
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://skywalkholiday.com"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Holiday Packages",
            "item": "https://skywalkholiday.com/services/packages/international"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": pkg.title,
            "item": `https://skywalkholiday.com/packages/${id}`
          }
        ]
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(packageJsonLd) }}
      />
      <PackageDetailClient initialPackage={pkg} id={id} />
    </>
  );
}
