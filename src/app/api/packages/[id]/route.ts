import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminUserFromRequest } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const pkg = await prisma.holidayPackage.findUnique({
      where: { id: Number(id) },
    });

    if (!pkg) {
      return NextResponse.json({ error: "Package not found." }, { status: 404 });
    }

    const parsedPackage = {
      ...pkg,
      inclusions: JSON.parse(pkg.inclusions || "[]"),
      exclusions: JSON.parse(pkg.exclusions || "[]"),
      itinerary: JSON.parse(pkg.itinerary || "[]"),
      gallery: JSON.parse(pkg.gallery || "[]"),
    };

    return NextResponse.json({ success: true, package: parsedPackage });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch package." }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = getAdminUserFromRequest(req);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await req.json();
    const updateData: any = {};

    if (body.title) updateData.title = body.title;
    if (body.destination) updateData.destination = body.destination;
    if (body.country) updateData.country = body.country;
    if (body.price !== undefined) updateData.price = Number(body.price);
    if (body.originalPrice !== undefined) updateData.originalPrice = Number(body.originalPrice);
    if (body.duration) updateData.duration = body.duration;
    if (body.category) updateData.category = body.category;
    if (body.badge !== undefined) updateData.badge = body.badge;
    if (body.featured !== undefined) updateData.featured = Boolean(body.featured);
    if (body.status) updateData.status = body.status;
    if (body.coverImage) updateData.coverImage = body.coverImage;
    if (body.hotelInfo !== undefined) updateData.hotelInfo = body.hotelInfo;

    if (body.inclusions) {
      updateData.inclusions = typeof body.inclusions === "string" ? body.inclusions : JSON.stringify(body.inclusions);
    }
    if (body.exclusions) {
      updateData.exclusions = typeof body.exclusions === "string" ? body.exclusions : JSON.stringify(body.exclusions);
    }
    if (body.itinerary) {
      updateData.itinerary = typeof body.itinerary === "string" ? body.itinerary : JSON.stringify(body.itinerary);
    }
    if (body.gallery) {
      updateData.gallery = typeof body.gallery === "string" ? body.gallery : JSON.stringify(body.gallery);
    }

    // Locate target package by id or title
    let target = null;
    const numId = Number(id);
    if (!isNaN(numId) && numId > 0) {
      target = await prisma.holidayPackage.findUnique({ where: { id: numId } });
    }

    if (!target && body.title) {
      target = await prisma.holidayPackage.findFirst({
        where: { title: body.title },
      });
    }

    let updatedPackage;
    if (target) {
      updatedPackage = await prisma.holidayPackage.update({
        where: { id: target.id },
        data: updateData,
      });
    } else {
      updatedPackage = await prisma.holidayPackage.create({
        data: {
          title: body.title || "Holiday Package",
          destination: body.destination || "Destination",
          country: body.country || body.destination || "International",
          duration: body.duration || "5 Nights / 6 Days",
          price: Number(body.price) || 45000,
          originalPrice: Number(body.originalPrice) || 55000,
          rating: Number(body.rating) || 4.8,
          reviews: Number(body.reviews) || 120,
          inclusions: typeof body.inclusions === "string" ? body.inclusions : JSON.stringify(body.inclusions || []),
          exclusions: typeof body.exclusions === "string" ? body.exclusions : JSON.stringify(body.exclusions || []),
          itinerary: typeof body.itinerary === "string" ? body.itinerary : JSON.stringify(body.itinerary || []),
          hotelInfo: body.hotelInfo || null,
          coverImage: body.coverImage || "/images/bangkok-pattaya.png",
          gallery: typeof body.gallery === "string" ? body.gallery : JSON.stringify(body.gallery || []),
          category: body.category || "International",
          badge: body.badge || "Popular",
          featured: Boolean(body.featured),
          status: "ACTIVE",
          ...updateData,
        },
      });
    }

    return NextResponse.json({ success: true, package: updatedPackage });
  } catch (error: any) {
    console.error("PATCH package error:", error);
    return NextResponse.json({ error: "Failed to update package: " + error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = getAdminUserFromRequest(req);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  const { id } = await params;

  try {
    await prisma.holidayPackage.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ success: true, message: "Package deleted." });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete package." }, { status: 500 });
  }
}
