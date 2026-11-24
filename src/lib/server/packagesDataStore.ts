import fs from "fs";
import path from "path";
import { prisma } from "@/lib/prisma";
import { getPackagesAsAdminRecords, AdminPackageRecord } from "@/lib/packagesData";
import { getSiteDataFromDb, saveSiteDataToDb } from "@/lib/server/siteDataStore";

const DATA_DIR = path.join(process.cwd(), "src", "data");
const DATA_FILE = path.join(DATA_DIR, "packages-live.json");

export const ID_TO_SLUG_MAP: Record<number, string> = {
  1: "bangkok-pattaya-6d",
  2: "bali-malaysia-7d",
  3: "bangkok-pattaya-8d",
  4: "bangkok-pattaya-phuket-8d",
  5: "bangkok-pattaya-5d",
  6: "krabi-phuket-bangkok-8d",
  7: "malaysia-singapore-6d",
  8: "maldives-4d",
  9: "philippines-6d",
  10: "philippines-8d",
  11: "phuket-bangkok-6d",
  12: "singapore-4d",
  13: "sri-lanka-thailand-7d",
  14: "thailand-vietnam-8d",
  15: "thailand-malaysia-singapore-9d",
  16: "vietnam-6d",
  17: "bali-7d",
  18: "china-beijing-shanghai-8d",
};

export const SLUG_TO_ID_MAP: Record<string, number> = Object.entries(ID_TO_SLUG_MAP).reduce(
  (acc, [id, slug]) => {
    acc[slug] = Number(id);
    return acc;
  },
  {} as Record<string, number>
);

// Ensure data directory exists
function ensureDataFile(): AdminPackageRecord[] {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, "utf-8");
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error("Error reading packages-live.json:", err);
  }

  // Fallback to default packages from packagesData.ts
  const defaults = getPackagesAsAdminRecords();
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(defaults, null, 2), "utf-8");
  } catch (e) {
    console.error("Could not write default packages to packages-live.json:", e);
  }
  return defaults;
}

export function writePackagesToFile(packages: AdminPackageRecord[]) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(packages, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to write packages-live.json:", err);
  }
}

export async function getAllPackages(): Promise<AdminPackageRecord[]> {
  // 0. Check MySQL SiteData JSON store first (preserves all fields & deletions across GitHub redeploys)
  try {
    const sitePackages = await getSiteDataFromDb<AdminPackageRecord[]>("packages");
    if (sitePackages && Array.isArray(sitePackages) && sitePackages.length > 0) {
      return sitePackages;
    }
  } catch (e) {}

  // 1. Try fetching from Prisma Hostinger MySQL (with a 4s timeout guard)
  try {
    const dbPromise = prisma.holidayPackage.findMany({
      where: { status: "ACTIVE" },
      orderBy: { id: "asc" },
    });
    const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 4000));
    const result = await Promise.race([dbPromise, timeoutPromise]);

    if (result && Array.isArray(result) && result.length > 0) {
      const parsed = result.map((pkg: any) => {
        const canonicalSlug =
          ID_TO_SLUG_MAP[pkg.id] ||
          (pkg.slug && isNaN(Number(pkg.slug)) ? pkg.slug : `package-${pkg.id}`);

        return {
          id: pkg.id,
          slug: canonicalSlug,
          title: pkg.title,
          destination: pkg.destination,
          country: pkg.country || pkg.destination,
          duration: pkg.duration,
          price: Number(pkg.price),
          originalPrice: Number(pkg.originalPrice),
          rating: Number(pkg.rating) || 4.9,
          reviews: Number(pkg.reviews) || 120,
          inclusions:
            typeof pkg.inclusions === "string"
              ? JSON.parse(pkg.inclusions || "[]")
              : pkg.inclusions || [],
          exclusions:
            typeof pkg.exclusions === "string"
              ? JSON.parse(pkg.exclusions || "[]")
              : pkg.exclusions || [],
          itinerary:
            typeof pkg.itinerary === "string"
              ? JSON.parse(pkg.itinerary || "[]")
              : pkg.itinerary || [],
          hotelInfo: pkg.hotelInfo,
          coverImage: pkg.coverImage,
          gallery:
            typeof pkg.gallery === "string"
              ? JSON.parse(pkg.gallery || "[]")
              : pkg.gallery || [],
          category: pkg.category || "International",
          badge: pkg.badge || "Popular",
          featured: Boolean(pkg.featured),
          status: pkg.status || "ACTIVE",
        };
      });

      // Sync file store with latest DB records
      writePackagesToFile(parsed as any);
      return parsed as any;
    }
  } catch (e) {
    // DB unreachable or timed out, fall through to file store
  }

  // 2. Read from persistent JSON file
  return ensureDataFile();
}

export async function getPackageByIdOrSlug(
  idOrSlug: string,
  fallbackTitle?: string
): Promise<AdminPackageRecord | null> {
  const all = await getAllPackages();
  const needle = idOrSlug.toLowerCase().trim();

  const found = all.find((p) => {
    if (String(p.id).toLowerCase() === needle) return true;
    if (p.slug && p.slug.toLowerCase() === needle) return true;
    const pTitle = (p.title || "").toLowerCase().trim();
    if (pTitle === needle) return true;
    if (fallbackTitle) {
      const fb = fallbackTitle.toLowerCase().trim();
      if (pTitle === fb || pTitle.includes(fb) || fb.includes(pTitle)) return true;
    }
    // Match common slug aliases
    if (needle === "bangkok-pattaya-6d" && (p.id === 1 || pTitle.includes("bangkok pattaya"))) return true;
    if (needle === "bali-malaysia-7d" && (p.id === 2 || pTitle.includes("bali"))) return true;
    return false;
  });

  return found || null;
}

export async function saveOrUpdatePackage(pkgData: any): Promise<AdminPackageRecord> {
  const currentList = await getAllPackages();

  const numId = Number(pkgData.id) || (pkgData.slug ? SLUG_TO_ID_MAP[pkgData.slug] : 0);
  const existingIndex = currentList.findIndex(
    (p) =>
      (numId > 0 && Number(p.id) === numId) ||
      String(p.id) === String(pkgData.id) ||
      (pkgData.slug && p.slug === pkgData.slug) ||
      (pkgData.title && p.title.toLowerCase().trim() === pkgData.title.toLowerCase().trim())
  );

  let updatedRecord: AdminPackageRecord;

  if (existingIndex >= 0) {
    const prev = currentList[existingIndex];
    const targetId = Number(prev.id);
    const safeSlug =
      (targetId > 0 && ID_TO_SLUG_MAP[targetId]) ||
      pkgData.slug ||
      prev.slug ||
      (pkgData.title
        ? pkgData.title
            .toLowerCase()
            .replace(/[^a-z0-9-_]+/g, "-")
            .replace(/(^-|-$)/g, "")
        : "package");

    updatedRecord = {
      ...prev,
      ...pkgData,
      id: prev.id,
      slug: safeSlug,
      price: pkgData.price !== undefined ? Math.round(Number(pkgData.price)) : prev.price,
      originalPrice:
        pkgData.originalPrice !== undefined
          ? Math.round(Number(pkgData.originalPrice))
          : prev.originalPrice,
    };
    currentList[existingIndex] = updatedRecord;
  } else {
    // Insert new
    const nextId = numId > 0 ? numId : Math.max(0, ...currentList.map((p) => Number(p.id) || 0)) + 1;
    const safeSlug =
      ID_TO_SLUG_MAP[nextId] ||
      pkgData.slug ||
      (pkgData.title
        ? pkgData.title
            .toLowerCase()
            .replace(/[^a-z0-9-_]+/g, "-")
            .replace(/(^-|-$)/g, "")
        : `package-${nextId}`);

    updatedRecord = {
      id: nextId,
      slug: safeSlug,
      title: pkgData.title,
      destination: pkgData.destination,
      country: pkgData.country || "International",
      duration: pkgData.duration || "5 Nights / 6 Days",
      price: Math.round(Number(pkgData.price)) || 45000,
      originalPrice: Math.round(Number(pkgData.originalPrice)) || 55000,
      rating: Number(pkgData.rating) || 4.9,
      reviews: Number(pkgData.reviews) || 120,
      overview: pkgData.overview || "",
      highlights: pkgData.highlights || [],
      inclusions: pkgData.inclusions || [],
      exclusions: pkgData.exclusions || [],
      itinerary: pkgData.itinerary || [],
      hotelInfo: pkgData.hotelInfo || "3-Star Deluxe Hotels",
      transportation: pkgData.transportation || "Private AC Transfers",
      coverImage: pkgData.coverImage || "/images/bangkok-pattaya.png",
      gallery: pkgData.gallery || [],
      category: pkgData.category || "International",
      badge: pkgData.badge || "Popular",
      featured: Boolean(pkgData.featured),
      status: pkgData.status || "ACTIVE",
    };
    currentList.unshift(updatedRecord);
  }

  // 1. Immediately persist to MySQL SiteData & file store
  await saveSiteDataToDb("packages", currentList);
  writePackagesToFile(currentList);

  // 2. Await Hostinger MySQL Prisma upsert to guarantee persistence
  try {
    const targetId = Number(updatedRecord.id);
    if (!isNaN(targetId) && targetId > 0) {
      await prisma.holidayPackage.upsert({
        where: { id: targetId },
        update: {
          title: updatedRecord.title,
          destination: updatedRecord.destination,
          country: updatedRecord.country,
          duration: updatedRecord.duration,
          price: Math.round(Number(updatedRecord.price)),
          originalPrice: Math.round(Number(updatedRecord.originalPrice)),
          rating: Number(updatedRecord.rating),
          reviews: Number(updatedRecord.reviews),
          inclusions: JSON.stringify(updatedRecord.inclusions || []),
          exclusions: JSON.stringify(updatedRecord.exclusions || []),
          itinerary: JSON.stringify(updatedRecord.itinerary || []),
          hotelInfo:
            typeof updatedRecord.hotelInfo === "string"
              ? updatedRecord.hotelInfo
              : JSON.stringify(updatedRecord.hotelInfo || {}),
          coverImage: updatedRecord.coverImage || "/images/bangkok-pattaya.png",
          gallery: JSON.stringify(updatedRecord.gallery || []),
          category: updatedRecord.category || "International",
          badge: updatedRecord.badge || "Popular",
          featured: Boolean(updatedRecord.featured),
          status: "ACTIVE",
        },
        create: {
          id: targetId,
          title: updatedRecord.title,
          destination: updatedRecord.destination,
          country: updatedRecord.country,
          duration: updatedRecord.duration,
          price: Math.round(Number(updatedRecord.price)),
          originalPrice: Math.round(Number(updatedRecord.originalPrice)),
          rating: Number(updatedRecord.rating),
          reviews: Number(updatedRecord.reviews),
          inclusions: JSON.stringify(updatedRecord.inclusions || []),
          exclusions: JSON.stringify(updatedRecord.exclusions || []),
          itinerary: JSON.stringify(updatedRecord.itinerary || []),
          hotelInfo:
            typeof updatedRecord.hotelInfo === "string"
              ? updatedRecord.hotelInfo
              : JSON.stringify(updatedRecord.hotelInfo || {}),
          coverImage: updatedRecord.coverImage || "/images/bangkok-pattaya.png",
          gallery: JSON.stringify(updatedRecord.gallery || []),
          category: updatedRecord.category || "International",
          badge: updatedRecord.badge || "Popular",
          featured: Boolean(updatedRecord.featured),
          status: "ACTIVE",
        },
      });
      console.log(`[packagesDataStore] Hostinger MySQL updated for package ID ${targetId}`);
    }
  } catch (dbErr: any) {
    console.error(
      `[packagesDataStore] Hostinger MySQL save error for package ID ${updatedRecord.id}:`,
      dbErr.message
    );
  }

  return updatedRecord;
}

export async function removePackage(idOrSlug: string): Promise<boolean> {
  const currentList = await getAllPackages();
  const needle = idOrSlug.toLowerCase().trim();
  const filtered = currentList.filter(
    (p) => String(p.id).toLowerCase() !== needle && p.slug?.toLowerCase() !== needle
  );

  await saveSiteDataToDb("packages", filtered);
  writePackagesToFile(filtered);

  try {
    const numId = Number(idOrSlug) || (SLUG_TO_ID_MAP[idOrSlug] ?? NaN);
    if (!isNaN(numId) && numId > 0) {
      await prisma.holidayPackage.delete({ where: { id: numId } });
    }
  } catch (e: any) {
    console.error("Hostinger MySQL package removal error:", e.message);
  }

  return true;
}
