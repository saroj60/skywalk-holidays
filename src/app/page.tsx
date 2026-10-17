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

export default function HomePage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How do I book flight tickets with Skywalks Holidays in Nepal?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You can request flight quotes online by choosing your route, departure date, and passenger details. Our flight desk will send pre-filled WhatsApp options and issue tickets directly."
        }
      },
      {
        "@type": "Question",
        "name": "Does Skywalks Holidays provide visa assistance for Nepali citizens?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, we provide certified document review, VFS appointment scheduling, and application guidance for Schengen, USA, UK, Australia, Japan, South Korea, Canada, Thailand, and Malaysia."
        }
      },
      {
        "@type": "Question",
        "name": "What upcoming fixed departure holiday packages are available?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We offer upcoming fixed departure tour packages for Dashain, Tihar, and New Year 2027 to Vietnam, Thailand, Bali, Europe, and Singapore with live seat tracking and instant WhatsApp reservation."
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
