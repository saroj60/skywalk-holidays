import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminUserFromRequest } from "@/lib/auth";

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
        orderBy: { createdAt: "desc" },
      });
    } catch (e) {
      packages = [];
    }

    const parsedPackages = packages.map((pkg: any) => ({
      ...pkg,
      inclusions: JSON.parse(pkg.inclusions || "[]"),
      exclusions: JSON.parse(pkg.exclusions || "[]"),
      itinerary: JSON.parse(pkg.itinerary || "[]"),
      gallery: JSON.parse(pkg.gallery || "[]"),
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

    const newPackage = await prisma.holidayPackage.create({
      data: {
        title,
        destination,
        country: country || destination,
        duration,
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

    return NextResponse.json({ success: true, package: newPackage }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create holiday package." }, { status: 500 });
  }
}
