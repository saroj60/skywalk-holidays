import { prisma } from "@/lib/prisma";

const DB_TIMEOUT_MS = 4000;

/**
 * Read a JSON collection from MySQL `SiteData` table with timeout guard.
 * Returns null if not found in DB or if DB is unreachable.
 */
export async function getSiteDataFromDb<T>(key: string): Promise<T | null> {
  try {
    if (!prisma || !prisma.siteData || typeof prisma.siteData.findUnique !== "function") {
      return null;
    }

    const dbPromise = prisma.siteData.findUnique({ where: { key } });
    const timeoutPromise = new Promise<null>((resolve) =>
      setTimeout(() => resolve(null), DB_TIMEOUT_MS)
    );

    const record = await Promise.race([dbPromise, timeoutPromise]);
    if (record && typeof record.value === "string") {
      return JSON.parse(record.value) as T;
    }
  } catch (err) {
    console.warn(`getSiteDataFromDb("${key}") warning:`, err);
  }
  return null;
}

/**
 * Persist a JSON collection to MySQL `SiteData` table.
 */
export async function saveSiteDataToDb<T>(key: string, value: T): Promise<boolean> {
  try {
    if (!prisma || !prisma.siteData || typeof prisma.siteData.upsert !== "function") {
      return false;
    }

    const serialized = JSON.stringify(value);
    const dbPromise = prisma.siteData.upsert({
      where: { key },
      update: { value: serialized },
      create: { key, value: serialized },
    });
    const timeoutPromise = new Promise<null>((resolve) =>
      setTimeout(() => resolve(null), DB_TIMEOUT_MS)
    );

    const res = await Promise.race([dbPromise, timeoutPromise]);
    return Boolean(res);
  } catch (err) {
    console.warn(`saveSiteDataToDb("${key}") warning:`, err);
    return false;
  }
}
