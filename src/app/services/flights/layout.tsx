import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Flight Ticket Booking in Nepal | Cheap Domestic & International Airfare — Skywalk Holidays",
  description:
    "Book cheap flight tickets in Nepal with Skywalk Holidays Kathmandu. Compare 40+ domestic & international airlines, exclusive group discounts, instant WhatsApp booking, and 24/7 flight desk rebooking support.",
  keywords: [
    "flight ticket booking in nepal",
    "cheap flights from kathmandu",
    "international flight booking nepal",
    "domestic flight ticket nepal",
    "buddha air tickets kathmandu",
    "nepal airlines ticket booking",
    "kathmandu to bangkok flight ticket",
    "kathmandu to dubai flight",
    "kathmandu to delhi flight fare",
    "best travel agency for flight booking in nepal",
  ],
  alternates: {
    canonical: "https://skywalkholidays.com/services/flights",
  },
  openGraph: {
    title: "Flight Ticket Booking in Nepal | Guaranteed Best Agency Fares — Skywalk Holidays",
    description:
      "Compare 40+ airlines and book cheap international & domestic flight tickets with Skywalk Holidays Kathmandu. Instant quotes and 24/7 flight desk support.",
    url: "https://skywalkholidays.com/services/flights",
    siteName: "Skywalk Holidays Nepal",
    images: [
      {
        url: "https://skywalkholidays.com/images/flights-hero-banner.png",
        width: 1280,
        height: 500,
        alt: "Flight Ticket Booking Assistance — Skywalk Holidays Nepal",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Flight Ticket Booking in Nepal — Skywalk Holidays",
    description: "Compare 40+ airlines and book cheap international & domestic flight tickets from Kathmandu.",
    images: ["https://skywalkholidays.com/images/flights-hero-banner.png"],
  },
};

export default function FlightsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
