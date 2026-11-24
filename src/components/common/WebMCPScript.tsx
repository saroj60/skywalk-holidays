"use client";

import { useEffect } from "react";

export default function WebMCPScript() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const nav = window.navigator as any;

    // Check if in-browser modelContext / WebMCP is supported
    if (nav?.modelContext && typeof nav.modelContext.registerTool === "function") {
      try {
        nav.modelContext.registerTool({
          name: "search_holiday_packages",
          description: "Search holiday packages, flight deals, and destinations from Skywalk Holidays Nepal.",
          inputSchema: {
            type: "object",
            properties: {
              destination: {
                type: "string",
                description: "Destination country or city (e.g., Thailand, Bali, China, Vietnam)",
              },
            },
          },
          execute: async ({ destination }: { destination?: string }) => {
            try {
              const res = await fetch(`/api/packages?q=${encodeURIComponent(destination || "")}`);
              return await res.json();
            } catch (e: any) {
              return { error: e.message };
            }
          },
        });

        nav.modelContext.registerTool({
          name: "get_agency_hotlines",
          description: "Get Skywalk Holidays hotline phone numbers, email, WhatsApp, and office address.",
          inputSchema: {
            type: "object",
            properties: {},
          },
          execute: async () => {
            return {
              agency: "Skywalk Holidays Pvt. Ltd.",
              hotlines: ["+977 971-4491103", "+977 970-7054143", "+977 970-7054144"],
              whatsapp: "+977 971-4491103",
              email: "skywalktoursandtravels32@gmail.com",
              address: "Pepsicola, Kathmandu, Nepal, 44600",
            };
          },
        });

        nav.modelContext.registerTool({
          name: "submit_travel_inquiry",
          description: "Submit a booking or consultation request for tour packages, flights, hotels, or visas.",
          inputSchema: {
            type: "object",
            properties: {
              customerName: { type: "string" },
              whatsappNumber: { type: "string" },
              serviceType: { type: "string" },
              destination: { type: "string" },
              message: { type: "string" },
            },
            required: ["customerName", "whatsappNumber"],
          },
          execute: async (data: any) => {
            const res = await fetch("/api/reach-us", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                name: data.customerName,
                phone: data.whatsappNumber,
                serviceInterested: data.serviceType || "Holiday Package",
                destination: data.destination || "General Inquiry",
                message: data.message || "Inquiry submitted via agent",
                email: "inquiry@skywalkholiday.com",
              }),
            });
            return await res.json();
          },
        });
      } catch (err) {
        console.warn("WebMCP registration note:", err);
      }
    }
  }, []);

  return null;
}
