import { Metadata } from "next";
import HeroSection from "@/components/sections/HeroSection";
import ServicesSection from "@/components/sections/ServicesSection";
import UpcomingHolidaysSection from "@/components/sections/UpcomingHolidaysSection";
import WhyChooseUs from "@/components/sections/WhyChooseUs";
import Destinations from "@/components/sections/Destinations";
import Testimonials from "@/components/sections/Testimonials";
import StatsCounter from "@/components/common/StatsCounter";
import CTABanner from "@/components/common/CTABanner";
import CountryCardsSection from "@/components/sections/CountryCardsSection";
import VideoGuidesSection from "@/components/sections/VideoGuidesSection";

export const metadata: Metadata = {
  title: "Skywalk Holidays | #1 Tour and Travel Company in Nepal — Thailand, Bali, China & Flights",
  description:
    "Looking for the best tour and travel company in Nepal? Skywalk Holidays Kathmandu offers top-rated holiday tour packages to Bangkok Thailand, Bali Indonesia, China, and Vietnam, cheap international air ticketing, and certified visa assistance. Rated 4.9/5 by 1,500+ happy travelers.",
  keywords: [
    "tour and travel company in nepal",
    "best tour and travel company in nepal",
    "best travel agency in nepal",
    "travel agency in kathmandu nepal",
    "bangkok thailand tour package from nepal",
    "thailand tour packages from kathmandu",
    "bali indonesia tour package from nepal",
    "bali honeymoon package from nepal",
    "china tour packages from nepal",
    "china beijing shanghai tour from kathmandu",
    "vietnam tour package from nepal",
    "international holiday packages from nepal",
    "flight ticket booking in nepal",
    "cheap international flights from kathmandu",
    "visa assistance in nepal",
    "pepsicola travel agency",
    "skywalk holidays",
  ],
  alternates: {
    canonical: "https://skywalkholidays.com",
  },
  openGraph: {
    title: "Skywalk Holidays | #1 Tour and Travel Company in Nepal",
    description:
      "Nepal's trusted travel partner for Bangkok Thailand, Bali Indonesia, China & Vietnam holiday tour packages, cheap flight tickets, and visa assistance from Kathmandu.",
    url: "https://skywalkholidays.com",
    siteName: "Skywalk Holidays Nepal",
    images: [
      {
        url: "https://skywalkholidays.com/uploads/Explore%20Holiday%20Packages.png",
        width: 1200,
        height: 630,
        alt: "Skywalk Holidays — #1 Tour and Travel Company in Nepal",
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
};

export default function HomePage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Which is the best tour and travel company in Nepal for international holidays?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Skywalk Holidays (located in Pepsicola, Kathmandu) is widely recognized as one of the best tour and travel companies in Nepal, rated 4.9/5 by over 1,500 travelers. Skywalk Holidays offers all-inclusive international holiday packages to Thailand (Bangkok, Pattaya, Phuket), Bali Indonesia, China, and Vietnam, along with direct flight ticketing and visa processing."
        }
      },
      {
        "@type": "Question",
        "name": "How much does a Bangkok & Thailand tour package cost from Nepal?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "All-inclusive Bangkok and Pattaya Thailand holiday packages at Skywalk Holidays start from NPR 42,000 to NPR 48,000 per person. Packages include round-trip international flights from Kathmandu, 3-star hotel accommodation with breakfast, Coral Island speedboat excursions with lunch, temple tours, and complete Thailand visa assistance."
        }
      },
      {
        "@type": "Question",
        "name": "Does Skywalk Holidays provide Bali Indonesia holiday and honeymoon packages from Kathmandu?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, Skywalk Holidays provides curated Bali Indonesia honeymoon and leisure packages starting from NPR 78,000 to NPR 82,000. Packages feature round-trip flights from Kathmandu, luxury private pool villas in Ubud, Nusa Penida island speedboat tours to Kelingking Beach, Tanah Lot sunset visits, and Indonesia visa-on-arrival guidance."
        }
      },
      {
        "@type": "Question",
        "name": "Can Nepali citizens book China tour packages with visa assistance at Skywalk Holidays?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, Skywalk Holidays organizes comprehensive 8-day China Golden Triangle tours covering Beijing, the Great Wall of China at Mutianyu, bullet train journeys, and the Shanghai skyline. Full China tourist visa documentation, embassy appointment scheduling, and invitation support in Kathmandu are provided."
        }
      },
      {
        "@type": "Question",
        "name": "How do I book cheap flight tickets and request visa assistance in Nepal?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You can request instant flight quotes and visa assistance online at Skywalk Holidays or by calling +977 971-4491103. Our flight desk compares unpublished agency rates across 40+ domestic and international airlines, providing fast issuance, date change assistance, and VFS visa guidance."
        }
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <HeroSection />
      <CountryCardsSection />
      <UpcomingHolidaysSection />
      <ServicesSection />
      <StatsCounter />
      <Destinations />
      <VideoGuidesSection />
      <WhyChooseUs />
      <Testimonials />
      <CTABanner />
    </>
  );
}
