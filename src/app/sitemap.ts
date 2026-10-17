import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://skywalkholidays.com";

  const routes = [
    "",
    "/services/flights",
    "/services/hotels",
    "/services/packages/international",
    "/services/packages/domestic",
    "/services/visa",
    "/services/insurance",
    "/services/custom",
    "/about",
    "/contact",
    "/gallery",
    "/vlogs",
    "/packages/bangkok-pattaya-6d",
    "/packages/thailand-5d",
    "/packages/bali-7d",
    "/packages/europe-11d",
    "/packages/singapore-6d",
    "/packages/japan-7d",
    "/packages/vietnam-6d",
    "/packages/maldives-5d",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1.0 : route.startsWith("/packages") ? 0.8 : 0.9,
  }));
}
