"use client";

import { useState, useEffect, useCallback } from "react";
import { COMPANY } from "@/lib/constants";

export interface CompanyInfo {
  name: string;
  tagline: string;
  description: string;
  phone: string;
  mobile: string;
  email: string;
  address: string;
  mapsUrl: string;
  facebook: string;
  instagram: string;
  hours: string;
  announcement?: string;
  announcementActive?: boolean;
}

export function useCompanySettings(): CompanyInfo {
  const [settings, setSettings] = useState<CompanyInfo>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("skywalk_site_settings");
        if (stored) {
          return { ...COMPANY, ...JSON.parse(stored) };
        }
      } catch (e) {}
    }
    return COMPANY as CompanyInfo;
  });

  const syncSettings = useCallback(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("skywalk_site_settings");
        if (stored) {
          setSettings((prev) => ({ ...prev, ...JSON.parse(stored) }));
        }
      } catch (e) {}
    }

    fetch("/api/settings", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.settings) {
          setSettings((prev) => ({ ...prev, ...data.settings }));
          if (typeof window !== "undefined") {
            localStorage.setItem("skywalk_site_settings", JSON.stringify(data.settings));
          }
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    syncSettings();

    const handleUpdate = () => syncSettings();
    window.addEventListener("skywalk-settings-updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("skywalk-settings-updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, [syncSettings]);

  return settings;
}
