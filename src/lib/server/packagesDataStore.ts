import fs from "fs";
import path from "path";
import { prisma } from "@/lib/prisma";
import { getPackagesAsAdminRecords, AdminPackageRecord } from "@/lib/packagesData";

const DATA_DIR = path.join(process.cwd(), "src", "data");
const DATA_FILE = path.join(DATA_DIR, "packages-live.json");

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
  // 1. Try fetching from Prisma (with a 2s timeout guard)
  try {
    const dbPromise = prisma.holidayPackage.findMany({
      where: { status: "ACTIVE" },
      orderBy: { id: "asc" },
    });
    const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 2500));
    const result = await Promise.race([dbPromise, timeoutPromise]);

    if (result && Array.isArray(result) && result.length > 0) {
      const parsed = result.map((pkg: any) => ({
        id: pkg.id,
        slug: pkg.slug || String(pkg.id),
        title: pkg.title,
        destination: pkg.destination,
        country: pkg.country || pkg.destination,
        duration: pkg.duration,
        price: Number(pkg.price),
        originalPrice: Number(pkg.originalPrice),
        rating: Number(pkg.rating) || 4.9,
        reviews: Number(pkg.reviews) || 120,
        inclusions: typeof pkg.inclusions === "string" ? JSON.parse(pkg.inclusions || "[]") : pkg.inclusions || [],
        exclusions: typeof pkg.exclusions === "string" ? JSON.parse(pkg.exclusions || "[]") : pkg.exclusions || [],
        itinerary: typeof pkg.itinerary === "string" ? JSON.parse(pkg.itinerary || "[]") : pkg.itinerary || [],
        hotelInfo: pkg.hotelInfo,
        coverImage: pkg.coverImage,
        gallery: typeof pkg.gallery === "string" ? JSON.parse(pkg.gallery || "[]") : pkg.gallery || [],
        category: pkg.category,
        badge: pkg.badge,
        featured: Boolean(pkg.featured),
        status: pkg.status,
      }));
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

export async function getPackageByIdOrSlug(idOrSlug: string, fallbackTitle?: string): Promise<AdminPackageRecord | null> {
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
  const currentList = ensureDataFile();

  const existingIndex = currentList.findIndex(
    (p) =>
      String(p.id) === String(pkgData.id) ||
      (pkgData.slug && p.slug === pkgData.slug) ||
      (pkgData.title && p.title.toLowerCase().trim() === pkgData.title.toLowerCase().trim())
  );

  let updatedRecord: AdminPackageRecord;

  if (existingIndex >= 0) {
    const prev = currentList[existingIndex];
    const safeSlug = pkgData.slug || prev.slug || (pkgData.title ? pkgData.title.toLowerCase().replace(/[^a-z0-9-_]+/g, "-").replace(/(^-|-$)/g, "") : "package");

    updatedRecord = {
      ...prev,
      ...pkgData,
      id: prev.id,
      slug: safeSlug,
      price: pkgData.price !== undefined ? Number(pkgData.price) : prev.price,
      originalPrice: pkgData.originalPrice !== undefined ? Number(pkgData.originalPrice) : prev.originalPrice,
    };
    currentList[existingIndex] = updatedRecord;
  } else {
    // Insert new
    const nextId = Math.max(0, ...currentList.map((p) => Number(p.id) || 0)) + 1;
    updatedRecord = {
      id: nextId,
      slug: safeSlug,
      title: pkgData.title,
      destination: pkgData.destination,
      country: pkgData.country || "International",
      duration: pkgData.duration || "5 Nights / 6 Days",
      price: Number(pkgData.price) || 45000,
      originalPrice: Number(pkgData.originalPrice) || 55000,
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

  // Persist to file store immediately
  writePackagesToFile(currentList);

  // Background non-blocking sync with Prisma DB if reachable
  (async () => {
    try {
      const numId = Number(updatedRecord.id);
      const isNumeric = !isNaN(numId) && numId > 0;

      if (isNumeric) {
        await prisma.holidayPackage.upsert({
          where: { id: numId },
          update: {
            title: updatedRecord.title,
            destination: updatedRecord.destination,
            country: updatedRecord.country,
            duration: updatedRecord.duration,
            price: Number(updatedRecord.price),
            originalPrice: Number(updatedRecord.originalPrice),
            rating: Number(updatedRecord.rating),
            reviews: Number(updatedRecord.reviews),
            inclusions: JSON.stringify(updatedRecord.inclusions || []),
            exclusions: JSON.stringify(updatedRecord.exclusions || []),
            itinerary: JSON.stringify(updatedRecord.itinerary || []),
            hotelInfo: typeof updatedRecord.hotelInfo === "string" ? updatedRecord.hotelInfo : JSON.stringify(updatedRecord.hotelInfo || {}),
            coverImage: updatedRecord.coverImage || "/images/bangkok-pattaya.png",
            gallery: JSON.stringify(updatedRecord.gallery || []),
            category: updatedRecord.category,
            badge: updatedRecord.badge,
            featured: Boolean(updatedRecord.featured),
            status: "ACTIVE",
          },
          create: {
            id: numId,
            title: updatedRecord.title,
            destination: updatedRecord.destination,
            country: updatedRecord.country,
            duration: updatedRecord.duration,
            price: Number(updatedRecord.price),
            originalPrice: Number(updatedRecord.originalPrice),
            rating: Number(updatedRecord.rating),
            reviews: Number(updatedRecord.reviews),
            inclusions: JSON.stringify(updatedRecord.inclusions || []),
            exclusions: JSON.stringify(updatedRecord.exclusions || []),
            itinerary: JSON.stringify(updatedRecord.itinerary || []),
            hotelInfo: typeof updatedRecord.hotelInfo === "string" ? updatedRecord.hotelInfo : JSON.stringify(updatedRecord.hotelInfo || {}),
            coverImage: updatedRecord.coverImage || "/images/bangkok-pattaya.png",
            gallery: JSON.stringify(updatedRecord.gallery || []),
            category: updatedRecord.category,
            badge: updatedRecord.badge,
            featured: Boolean(updatedRecord.featured),
            status: "ACTIVE",
          },
        });
      }
    } catch (dbErr) {
      // Prisma error ignored; file store is master fallback
    }
  })().catch(() => {});

  return updatedRecord;
}

export async function removePackage(idOrSlug: string): Promise<boolean> {
  const currentList = ensureDataFile();
  const needle = idOrSlug.toLowerCase().trim();
  const filtered = currentList.filter(
    (p) => String(p.id).toLowerCase() !== needle && p.slug?.toLowerCase() !== needle
  );

  writePackagesToFile(filtered);

  // Background non-blocking delete from DB
  (async () => {
    try {
      const numId = Number(idOrSlug);
      if (!isNaN(numId)) {
        await prisma.holidayPackage.delete({ where: { id: numId } });
      }
    } catch (e) {}
  })().catch(() => {});

  return true;
}
