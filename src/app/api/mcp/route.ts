import { NextRequest, NextResponse } from "next/server";
import { COMPANY } from "@/lib/constants";
import { getAllPackages } from "@/lib/server/packagesDataStore";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    server: "Skywalk Holidays MCP Endpoint",
    tools: ["search_tours", "get_contact_info", "submit_inquiry"],
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { method, params } = body;

    if (method === "tools/list") {
      return NextResponse.json({
        tools: [
          {
            name: "search_tours",
            description: "Search holiday packages by destination or price.",
            inputSchema: {
              type: "object",
              properties: {
                destination: { type: "string" },
              },
            },
          },
          {
            name: "get_contact_info",
            description: "Get Skywalk Holidays hotline phone numbers, email, WhatsApp, and office address.",
            inputSchema: { type: "object", properties: {} },
          },
        ],
      });
    }

    if (method === "tools/call") {
      const toolName = params?.name;
      const args = params?.arguments || {};

      if (toolName === "get_contact_info") {
        return NextResponse.json({
          content: [
            {
              type: "text",
              text: JSON.stringify({
                name: COMPANY.name,
                phones: COMPANY.phoneNumbers,
                email: COMPANY.email,
                address: COMPANY.address,
                hotlines: ["+977 971-4491103", "+977 970-7054143", "+977 970-7054144"],
              }),
            },
          ],
        });
      }

      if (toolName === "search_tours") {
        const packages = await getAllPackages().catch(() => []);
        const filtered = args.destination
          ? packages.filter((p: any) =>
              p.destination?.toLowerCase().includes(args.destination.toLowerCase()) ||
              p.title?.toLowerCase().includes(args.destination.toLowerCase())
            )
          : packages;
        return NextResponse.json({
          content: [
            {
              type: "text",
              text: JSON.stringify(filtered.slice(0, 10)),
            },
          ],
        });
      }
    }

    return NextResponse.json({ error: "Unsupported method" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
