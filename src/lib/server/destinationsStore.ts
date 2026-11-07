import fs from "fs";
import path from "path";
import { POPULAR_COUNTRIES } from "@/lib/constants";

export interface DestinationCountry {
  id: string;
  name: string;
  flag: string;
  subtitle: string;
  packagesCount: number;
  startingPrice: number;
  image: string;
  badge: string;
  href: string;
  featured?: boolean;
}

const DATA_DIR = path.join(process.cwd(), "src", "data");
const COUNTRIES_FILE = path.join(DATA_DIR, "countries.json");

export function getStoredDestinations(): DestinationCountry[] {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(COUNTRIES_FILE)) {
      const content = fs.readFileSync(COUNTRIES_FILE, "utf-8");
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error("Error reading countries.json:", err);
  }

  try {
    fs.writeFileSync(COUNTRIES_FILE, JSON.stringify(POPULAR_COUNTRIES, null, 2), "utf-8");
  } catch (e) {}
  return POPULAR_COUNTRIES as DestinationCountry[];
}

export function saveStoredDestinations(countries: DestinationCountry[]): boolean {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(COUNTRIES_FILE, JSON.stringify(countries, null, 2), "utf-8");
    return true;
  } catch (e) {
    console.error("Error saving countries.json:", e);
    return false;
  }
}
