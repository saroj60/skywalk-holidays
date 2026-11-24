import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const mimeType = file.type || "image/png";

    // Sanitize filename and create unique timestamp-prefixed filename
    const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filename = `${Date.now()}-${sanitizedFilename}`;

    // 1. Persist binary in MySQL MediaAsset so images survive GitHub redeploys
    let savedToDb = false;
    try {
      if (prisma && prisma.mediaAsset && typeof prisma.mediaAsset.upsert === "function") {
        await prisma.mediaAsset.upsert({
          where: { filename },
          update: { mimeType, data: buffer },
          create: { filename, mimeType, data: buffer },
        });
        savedToDb = true;
      }
    } catch (dbErr) {
      console.warn("MediaAsset DB save skipped:", dbErr);
    }

    // 2. Also write to local public/uploads for fast disk caching
    let savedToDisk = false;
    try {
      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      await mkdir(uploadsDir, { recursive: true });

      const filePath = path.join(uploadsDir, filename);
      await writeFile(filePath, buffer);
      savedToDisk = true;
    } catch (fsError) {
      console.warn("Disk upload write skipped:", fsError);
    }

    if (savedToDb || savedToDisk) {
      const publicUrl = `/api/uploads/${filename}`;
      return NextResponse.json({ success: true, url: publicUrl });
    }

    // Fallback: Convert to Base64 Data URL if both DB and disk failed
    const base64 = buffer.toString("base64");
    const dataUrl = `data:${mimeType};base64,${base64}`;
    return NextResponse.json({ success: true, url: dataUrl });
  } catch (error) {
    return NextResponse.json({ error: "Failed to upload image file" }, { status: 500 });
  }
}
