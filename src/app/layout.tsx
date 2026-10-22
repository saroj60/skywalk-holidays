import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppFloatingButton from "@/components/common/WhatsAppFloatingButton";
import SkyBackground from "@/components/common/SkyBackground";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://skywalkholidays.com"),
  title: {
    default: "Skywalk Holidays | #1 Tour and Travel Company in Nepal",
    template: "%s | Skywalk Holidays Nepal",
  },
  description:
    "Nepal's premier tour and travel company based in Kathmandu. Book Thailand, Bali Indonesia, China & Vietnam holiday packages, cheap flight tickets, and expedited visa assistance. Rated 4.9/5 by 1,500+ happy travelers.",
  keywords: [
    "tour and travel company in nepal",
    "best tour and travel company in nepal",
    "travel agency in nepal",
    "best travel agency in nepal",
    "kathmandu tour and travel agency",
    "travel agency in kathmandu",
    "travel agency in pepsicola kathmandu",
    "bangkok thailand tour packages from nepal",
    "thailand tour package from nepal",
    "bali indonesia tour package from nepal",
    "bali honeymoon package from nepal",
    "china tour packages from nepal",
    "china holiday packages from kathmandu",
    "vietnam tour package from nepal",
    "international holiday packages from nepal",
    "flight ticket booking in nepal",
    "cheap international flights from kathmandu",
    "visa assistance nepal",
    "nepal tour agency",
    "skywalks holidays",
    "skywalk holidays",
    "skywalk tours and travels",
  ],
  authors: [{ name: "Skywalks Holidays", url: "https://skywalkholidays.com" }],
  creator: "Skywalks Holidays",
  publisher: "Skywalks Holidays",
  alternates: {
    canonical: "https://skywalkholidays.com",
    languages: {
      "en-NP": "https://skywalkholidays.com",
      "ne-NP": "https://skywalkholidays.com",
    },
  },
  formatDetection: {
    telephone: true,
    address: true,
    email: true,
  },
  openGraph: {
    title: "Skywalk Holidays | #1 Tour and Travel Company in Nepal",
    description:
      "Nepal's premier tour and travel agency in Kathmandu. Best rates for Thailand, Bali Indonesia, China, Vietnam holiday packages, cheap flight tickets & visa assistance.",
    url: "https://skywalkholidays.com",
    siteName: "Skywalk Holidays Nepal",
    images: [
      {
        url: "https://skywalkholidays.com/uploads/Explore%20Holiday%20Packages.png",
        width: 1200,
        height: 630,
        alt: "Skywalk Holidays — Best Tour and Travel Company in Nepal",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Skywalk Holidays | #1 Tour and Travel Company in Nepal",
    description:
      "Book Thailand, Bali Indonesia, China & Vietnam holiday packages, cheap flight tickets, and visa assistance with Skywalk Holidays Kathmandu.",
    images: ["https://skywalkholidays.com/uploads/Explore%20Holiday%20Packages.png"],
  },
  icons: {
    icon: "/images/logo.png",
    shortcut: "/images/logo.png",
    apple: "/images/logo.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Comprehensive Schema.org Structured Data
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TravelAgency",
        "@id": "https://skywalkholidays.com/#travelagency",
        "name": "Skywalks Holidays",
        "alternateName": [
          "Skywalk Holidays",
          "Skywalk Tours & Travels",
          "Skywalk Holidays Nepal",
          "Skywalk Tours and Travels Kathmandu"
        ],
        "legalName": "Skywalk Tours and Travels Pvt. Ltd.",
        "url": "https://skywalkholidays.com",
        "logo": "https://skywalkholidays.com/images/logo.png",
        "image": "https://skywalkholidays.com/uploads/Explore%20Holiday%20Packages.png",
        "description":
          "Skywalk Holidays is Nepal's premier tour and travel company based in Kathmandu. We specialize in international holiday tour packages (Bangkok Thailand, Bali Indonesia, China, Vietnam, Europe), domestic tours, flight ticket booking, hotel reservations, and visa processing services.",
        "telephone": "+977 971-4491103",
        "email": "skywalktoursandtravels32@gmail.com",
        "priceRange": "$$",
        "currenciesAccepted": "NPR, USD",
        "paymentAccepted": "Cash, Bank Transfer, Fonepay, Esewa, Khalti, Credit Card",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Pepsicola",
          "addressLocality": "Kathmandu",
          "postalCode": "44600",
          "addressCountry": "NP"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 27.6946,
          "longitude": 85.3639
        },
        "hasMap": "https://maps.app.goo.gl/cSd8z1m3BnbegeSY6",
        "openingHoursSpecification": {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday"
          ],
          "opens": "00:00",
          "closes": "23:59"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "bestRating": "5",
          "worstRating": "1",
          "reviewCount": "1540"
        },
        "areaServed": [
          { "@type": "Country", "name": "Nepal" },
          { "@type": "City", "name": "Kathmandu" },
          { "@type": "City", "name": "Pokhara" },
          { "@type": "AdministrativeArea", "name": "Bagmati Province" }
        ],
        "sameAs": [
          "https://www.facebook.com/p/SkyWalk-Holidays-61569789310239/",
          "https://maps.app.goo.gl/cSd8z1m3BnbegeSY6"
        ],
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Travel Services and Holiday Tour Packages",
          "itemListElement": [
            {
              "@type": "OfferCatalog",
              "name": "International Holiday Packages",
              "itemListElement": [
                { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Bangkok & Pattaya Thailand Tour Packages" } },
                { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Bali Indonesia Honeymoon & Holiday Tour Packages" } },
                { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "China Beijing & Shanghai Great Wall Tour Packages" } },
                { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Vietnam Hanoi & Ha Long Bay Tour Packages" } }
              ]
            },
            {
              "@type": "OfferCatalog",
              "name": "Travel Agency Services",
              "itemListElement": [
                { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "International & Domestic Flight Ticket Booking" } },
                { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Expedited Tourist & Student Visa Assistance" } },
                { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Worldwide Hotel Reservations & Travel Insurance" } }
              ]
            }
          ]
        }
      },
      {
        "@type": "WebSite",
        "@id": "https://skywalkholidays.com/#website",
        "url": "https://skywalkholidays.com",
        "name": "Skywalk Holidays",
        "alternateName": "Skywalk Tours & Travels",
        "publisher": {
          "@id": "https://skywalkholidays.com/#travelagency"
        },
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://skywalkholidays.com/services/packages/international?country={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      }
    ]
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className={`${inter.className} relative min-h-screen bg-[#f8fbff] text-[#0a1628]`} suppressHydrationWarning>
        <SkyBackground />
        <Navbar />
        <main>{children}</main>
        <Footer />
        <WhatsAppFloatingButton />
      </body>
    </html>
  );
}
