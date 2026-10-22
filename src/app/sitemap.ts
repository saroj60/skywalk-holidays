import { MetadataRoute } from "next";
import { PACKAGES_DICTIONARY } from "@/lib/packagesData";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://skywalkholidays.com";
  const now = new Date();

  // Core static landing pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/services/packages/international`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/services/flights`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.92,
    },
    {
      url: `${baseUrl}/services/visa`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.92,
    },
    {
      url: `${baseUrl}/services/hotels`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/services/custom`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/services/insurance`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.75,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/gallery`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.75,
    },
    {
      url: `${baseUrl}/vlogs`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  // Destination landing page routes
  const destinationSlugs = [
    "thailand",
    "bali",
    "china",
    "singapore-malaysia",
    "vietnam",
    "maldives",
    "tokyo-japan",
    "philippines",
    "paris-europe",
  ];

  const destinationRoutes: MetadataRoute.Sitemap = destinationSlugs.map((slug) => ({
    url: `${baseUrl}/destinations/${slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  // Dynamic holiday package routes
  const packageRoutes: MetadataRoute.Sitemap = Object.keys(PACKAGES_DICTIONARY).map((slug) => ({
    url: `${baseUrl}/packages/${slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.88,
  }));

  return [...staticRoutes, ...destinationRoutes, ...packageRoutes];
}
