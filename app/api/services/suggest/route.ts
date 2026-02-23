import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/services/suggest?q=oil&limit=10
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get("q") || "").trim();
    const limit = Math.min(
      Math.max(parseInt(searchParams.get("limit") || "10", 10), 1),
      20
    );

    if (q.length < 2) {
      return NextResponse.json({ suggestions: [] });
    }

    const services = await db.service.findMany({
      where: {
        isActive: true,
        business: {
          status: "PUBLISHED",
        },
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { description: { contains: q, mode: "insensitive" } },
        ],
      },
      select: {
        name: true,
        category: true,
      },
      take: 200,
      orderBy: [{ isFeatured: "desc" }, { name: "asc" }],
    });

    const deduped = new Map<string, { name: string; category: string | null; count: number }>();

    for (const service of services) {
      const key = service.name.toLowerCase().trim();
      if (!key) continue;
      const existing = deduped.get(key);
      if (existing) {
        existing.count += 1;
        continue;
      }
      deduped.set(key, {
        name: service.name,
        category: service.category,
        count: 1,
      });
    }

    const suggestions = Array.from(deduped.values())
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
      .slice(0, limit);

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error("Error fetching service suggestions:", error);
    return NextResponse.json(
      { error: "Failed to fetch service suggestions" },
      { status: 500 }
    );
  }
}
