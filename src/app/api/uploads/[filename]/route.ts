import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { prisma } from "@/lib/prisma";

const MIME_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".avif": "image/avif",
  ".ico": "image/x-icon",
};

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;
    const safeName = path.basename(decodeURIComponent(filename));

    const candidatePaths = [
      path.join(process.cwd(), "public", "uploads", safeName),
      path.resolve(process.cwd(), "..", "..", "public", "uploads", safeName),
    ];

    const filePath = candidatePaths.find((p) => existsSync(p));
    if (filePath) {
      const fileBuffer = await readFile(filePath);
      const ext = path.extname(safeName).toLowerCase();
      const contentType = MIME_TYPES[ext] || "application/octet-stream";

      return new NextResponse(fileBuffer, {
        status: 200,
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    }

    // Fallback: Fetch from MySQL MediaAsset (survives GitHub redeploys)
    if (prisma && prisma.mediaAsset && typeof prisma.mediaAsset.findUnique === "function") {
      const asset = await prisma.mediaAsset.findUnique({ where: { filename: safeName } });
      if (asset && asset.data) {
        const buffer = Buffer.from(asset.data);
        // Warm disk cache
        try {
          const uploadsDir = path.join(process.cwd(), "public", "uploads");
          await mkdir(uploadsDir, { recursive: true });
          await writeFile(path.join(uploadsDir, safeName), buffer);
        } catch (e) {}

        return new NextResponse(buffer, {
          status: 200,
          headers: {
            "Content-Type": asset.mimeType || "image/png",
            "Cache-Control": "public, max-age=31536000, immutable",
          },
        });
      }
    }

    return NextResponse.json({ error: "Image not found" }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to load image" }, { status: 500 });
  }
}
