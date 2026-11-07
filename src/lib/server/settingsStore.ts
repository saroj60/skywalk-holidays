import fs from "fs";
import path from "path";
import { COMPANY } from "@/lib/constants";

export interface SiteSettings {
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

const DATA_DIR = path.join(process.cwd(), "src", "data");
const SETTINGS_FILE = path.join(DATA_DIR, "site-settings.json");

const DEFAULT_SETTINGS: SiteSettings = {
  name: COMPANY.name,
  tagline: COMPANY.tagline,
  description: COMPANY.description,
  phone: COMPANY.phone,
  mobile: COMPANY.mobile,
  email: COMPANY.email,
  address: COMPANY.address,
  mapsUrl: COMPANY.mapsUrl,
  facebook: COMPANY.facebook,
  instagram: COMPANY.instagram,
  hours: COMPANY.hours,
  announcement: "Special seasonal festival departures now open for booking!",
  announcementActive: false,
};

export function getStoredSettings(): SiteSettings {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(SETTINGS_FILE)) {
      const content = fs.readFileSync(SETTINGS_FILE, "utf-8");
      const parsed = JSON.parse(content);
      if (parsed && typeof parsed === "object") {
        return { ...DEFAULT_SETTINGS, ...parsed };
      }
    }
  } catch (err) {
    console.error("Error reading site-settings.json:", err);
  }

  try {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(DEFAULT_SETTINGS, null, 2), "utf-8");
  } catch (e) {}
  return DEFAULT_SETTINGS;
}

export function saveStoredSettings(newSettings: Partial<SiteSettings>): SiteSettings {
  const current = getStoredSettings();
  const merged: SiteSettings = { ...current, ...newSettings };
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(merged, null, 2), "utf-8");
  } catch (e) {
    console.error("Error saving site-settings.json:", e);
  }
  return merged;
}
