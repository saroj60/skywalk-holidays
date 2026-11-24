// Prisma Client singleton wrapper with fallback for build phase and production
let prismaInstance: any;

const DEFAULT_DB_URL =
  "mysql://u786674613_skywalk:Skywalk%40%402026@srv831.hstgr.io:3306/u786674613_skywalk";

try {
  const { PrismaClient } = require("@prisma/client");
  const globalForPrisma = global as unknown as { prisma: any };

  const dbUrl = process.env.DATABASE_URL || DEFAULT_DB_URL;

  prismaInstance =
    globalForPrisma.prisma ||
    new PrismaClient({
      datasources: {
        db: {
          url: dbUrl,
        },
      },
      log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    });

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prismaInstance;
  }
} catch (e) {
  console.warn("Prisma Client initialization warning:", e);
  // Fallback mock object if PrismaClient generator hasn't executed
  prismaInstance = {};
}

export const prisma = prismaInstance;
