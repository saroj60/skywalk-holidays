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
    default: "Skywalk Holidays | Flight Booking, Visa & Holiday Packages",
    template: "%s | Skywalk Holidays",
  },
  description:
    "Book flights, hotels, holiday packages and visa assistance with Skywalk Holidays. Your trusted travel partner from Nepal.",
  keywords: [
    "Flight ticket booking in Nepal",
    "Kathmandu travel agency",
    "Nepal holiday packages",
    "Visa assistance Nepal",
    "International flight booking Nepal",
    "skywalks holidays",
    "nepal tour agency",
    "thamel travel agency",
    "pokhara holiday packages",
    "vietnam tour package from nepal",
    "thailand visa for nepali",
  ],
  authors: [{ name: "Skywalks Holidays" }],
  creator: "Skywalks Holidays",
  publisher: "Skywalks Holidays",
  formatDetection: {
    telephone: true,
    address: true,
    email: true,
  },
  openGraph: {
    title: "Skywalk Holidays | Flight Booking, Visa & Holiday Packages",
    description:
      "Book flights, hotels, holiday packages and visa assistance with Skywalk Holidays. Your trusted travel partner from Nepal.",
    url: "https://skywalkholidays.com",
    siteName: "Skywalk Holidays",
    images: [
      {
        url: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200&q=85",
        width: 1200,
        height: 630,
        alt: "Skywalk Holidays — Nepal's Premier Travel Agency",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Skywalk Holidays | Flight Booking, Visa & Holiday Packages",
    description:
      "Book flights, hotels, holiday packages and visa assistance with Skywalk Holidays. Your trusted travel partner from Nepal.",
    images: ["https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200&q=85"],
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
  // Schema.org TravelAgency JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "name": "Skywalks Holidays",
    "image": "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200&q=85",
    "@id": "https://skywalkholidays.com",
    "url": "https://skywalkholidays.com",
    "telephone": "+977 971-4491103",
    "priceRange": "$$",
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
    "sameAs": [
      "https://www.facebook.com/p/SkyWalk-Holidays-61569789310239/"
    ]
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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
