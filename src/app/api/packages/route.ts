import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminUserFromRequest } from "@/lib/auth";
import { getPackagesAsAdminRecords } from "@/lib/packagesData";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");

    const where: any = { status: "ACTIVE" };
    if (category && category !== "All") where.category = category;
    if (featured === "true") where.featured = true;

    let packages: any[] = [];
    try {
      packages = await prisma.holidayPackage.findMany({
        where,
        orderBy: { id: "asc" },
      });

      // Auto-seed packages from master data if database is currently empty
      if (packages.length === 0) {
        const defaults = getPackagesAsAdminRecords();
        for (const def of defaults) {
          try {
            await prisma.holidayPackage.create({
              data: {
                title: def.title,
                destination: def.destination,
                country: def.country || def.destination,
                duration: def.duration,
                price: Number(def.price) || 45000,
                originalPrice: Number(def.originalPrice) || 55000,
                rating: Number(def.rating) || 4.9,
                reviews: Number(def.reviews) || 120,
                inclusions: JSON.stringify(def.inclusions || []),
                exclusions: JSON.stringify(def.exclusions || []),
                itinerary: JSON.stringify(def.itinerary || []),
                hotelInfo: def.hotelInfo || null,
                coverImage: def.coverImage || "/images/bangkok-pattaya.png",
                gallery: JSON.stringify(def.gallery || []),
                category: def.category || "International",
                badge: def.badge || "Popular",
                featured: Boolean(def.featured),
                status: "ACTIVE",
              },
            });
          } catch (seedErr) {
            console.error("Auto-seed error for package:", def.title, seedErr);
          }
        }

        packages = await prisma.holidayPackage.findMany({
          where,
          orderBy: { id: "asc" },
        });
      }
    } catch (e) {
      console.error("Prisma packages query error:", e);
      packages = [];
    }

    const parsedPackages = packages.map((pkg: any) => ({
      ...pkg,
      inclusions: typeof pkg.inclusions === "string" ? JSON.parse(pkg.inclusions || "[]") : pkg.inclusions || [],
      exclusions: typeof pkg.exclusions === "string" ? JSON.parse(pkg.exclusions || "[]") : pkg.exclusions || [],
      itinerary: typeof pkg.itinerary === "string" ? JSON.parse(pkg.itinerary || "[]") : pkg.itinerary || [],
      gallery: typeof pkg.gallery === "string" ? JSON.parse(pkg.gallery || "[]") : pkg.gallery || [],
    }));

    return NextResponse.json({ success: true, packages: parsedPackages });
  } catch (error) {
    return NextResponse.json({ success: true, packages: [] });
  }
}

export async function POST(req: NextRequest) {
  const admin = getAdminUserFromRequest(req);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      title,
      destination,
      country,
      duration,
      price,
      originalPrice,
      rating,
      reviews,
      inclusions,
      exclusions,
      itinerary,
      coverImage,
      gallery,
      category,
      badge,
      featured,
    } = body;

    if (!title || !destination || price === undefined) {
      return NextResponse.json({ error: "Title, destination, and price are required." }, { status: 400 });
    }

    // Check if package already exists by title
    const existing = await prisma.holidayPackage.findFirst({
      where: { title },
    });

    let savedPackage;
    if (existing) {
      savedPackage = await prisma.holidayPackage.update({
        where: { id: existing.id },
        data: {
          destination,
          country: country || destination,
          duration: duration || existing.duration,
          price: Number(price),
          originalPrice: Number(originalPrice || price * 1.2),
          rating: rating ? Number(rating) : existing.rating,
          reviews: reviews ? Number(reviews) : existing.reviews,
          inclusions: typeof inclusions === "string" ? inclusions : JSON.stringify(inclusions || []),
          exclusions: typeof exclusions === "string" ? exclusions : JSON.stringify(exclusions || []),
          itinerary: typeof itinerary === "string" ? itinerary : JSON.stringify(itinerary || []),
          coverImage: coverImage || existing.coverImage,
          gallery: typeof gallery === "string" ? gallery : JSON.stringify(gallery || []),
          category: category || existing.category,
          badge: badge || existing.badge,
          featured: Boolean(featured),
          status: "ACTIVE",
        },
      });
    } else {
      savedPackage = await prisma.holidayPackage.create({
        data: {
          title,
          destination,
          country: country || destination,
          duration: duration || "5 Nights / 6 Days",
          price: Number(price),
          originalPrice: Number(originalPrice || price * 1.2),
          rating: rating ? Number(rating) : 4.8,
          reviews: reviews ? Number(reviews) : 12,
          inclusions: typeof inclusions === "string" ? inclusions : JSON.stringify(inclusions || []),
          exclusions: typeof exclusions === "string" ? exclusions : JSON.stringify(exclusions || []),
          itinerary: typeof itinerary === "string" ? itinerary : JSON.stringify(itinerary || []),
          coverImage: coverImage || "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1000&q=80",
          gallery: typeof gallery === "string" ? gallery : JSON.stringify(gallery || []),
          category: category || "International",
          badge: badge || "Popular",
          featured: Boolean(featured),
          status: "ACTIVE",
        },
      });
    }

    return NextResponse.json({ success: true, package: savedPackage }, { status: 201 });
  } catch (error: any) {
    console.error("POST package error:", error);
    return NextResponse.json({ error: "Failed to create holiday package: " + error.message }, { status: 500 });
  }
}
