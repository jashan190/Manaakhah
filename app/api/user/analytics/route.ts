import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

// GET /api/user/analytics?range=30days
// Aggregates analytics across all businesses owned by the authenticated user.
export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const range = searchParams.get("range") || "30days";

    const days = range === "7days" ? 7 : range === "90days" ? 90 : 30;
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    // All businesses owned by this user
    const businesses = await prisma.business.findMany({
      where: { ownerId: session.user.id },
      select: { id: true },
    });

    if (businesses.length === 0) {
      return NextResponse.json(buildEmptyResponse(days));
    }

    const businessIds = businesses.map((b: { id: string }) => b.id);

    // Build a complete date series for the range
    const dateLabels: string[] = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      dateLabels.push(d.toISOString().split("T")[0]);
    }

    const idList = Prisma.join(businessIds.map((id: string) => Prisma.sql`${id}`));

    // Views by date
    const rawViews = await prisma.$queryRaw<Array<{ date: string; count: bigint }>>`
      SELECT DATE("createdAt" AT TIME ZONE 'UTC') AS date, COUNT(*)::bigint AS count
      FROM "BusinessView"
      WHERE "businessId" IN (${idList})
        AND "createdAt" >= ${startDate}
      GROUP BY DATE("createdAt" AT TIME ZONE 'UTC')
      ORDER BY date ASC
    `;

    // Search-source views by date (source = 'SEARCH')
    const rawSearches = await prisma.$queryRaw<Array<{ date: string; count: bigint }>>`
      SELECT DATE("createdAt" AT TIME ZONE 'UTC') AS date, COUNT(*)::bigint AS count
      FROM "BusinessView"
      WHERE "businessId" IN (${idList})
        AND "createdAt" >= ${startDate}
        AND source = 'SEARCH'
      GROUP BY DATE("createdAt" AT TIME ZONE 'UTC')
      ORDER BY date ASC
    `;

    // Reviews by date with avg rating
    const rawReviews = await prisma.$queryRaw<
      Array<{ date: string; count: bigint; avg_rating: number | null }>
    >`
      SELECT DATE("createdAt" AT TIME ZONE 'UTC') AS date,
             COUNT(*)::bigint AS count,
             AVG(rating)::float AS avg_rating
      FROM "Review"
      WHERE "businessId" IN (${idList})
        AND "createdAt" >= ${startDate}
        AND status = 'PUBLISHED'
      GROUP BY DATE("createdAt" AT TIME ZONE 'UTC')
      ORDER BY date ASC
    `;

    // Peak hours (0-23)
    const rawPeakHours = await prisma.$queryRaw<
      Array<{ hour: number; count: bigint }>
    >`
      SELECT EXTRACT(HOUR FROM "createdAt" AT TIME ZONE 'UTC')::int AS hour,
             COUNT(*)::bigint AS count
      FROM "BusinessView"
      WHERE "businessId" IN (${idList})
        AND "createdAt" >= ${startDate}
      GROUP BY EXTRACT(HOUR FROM "createdAt" AT TIME ZONE 'UTC')
      ORDER BY hour ASC
    `;

    // Device types
    const rawDevices = await prisma.$queryRaw<
      Array<{ device_type: string | null; count: bigint }>
    >`
      SELECT "deviceType" AS device_type, COUNT(*)::bigint AS count
      FROM "BusinessView"
      WHERE "businessId" IN (${idList})
        AND "createdAt" >= ${startDate}
      GROUP BY "deviceType"
    `;

    // Returning visitors (users who viewed more than once in the period)
    const rawVisitorStats = await prisma.$queryRaw<
      Array<{ visitor_type: string; count: bigint }>
    >`
      SELECT
        CASE WHEN visit_count > 1 THEN 'returning' ELSE 'new' END AS visitor_type,
        COUNT(*)::bigint AS count
      FROM (
        SELECT "userId", COUNT(*) AS visit_count
        FROM "BusinessView"
        WHERE "businessId" IN (${idList})
          AND "createdAt" >= ${startDate}
          AND "userId" IS NOT NULL
        GROUP BY "userId"
      ) sub
      GROUP BY visitor_type
    `;

    // Rating distribution for all businesses in period
    const rawRatingDist = await prisma.$queryRaw<
      Array<{ rating: number; count: bigint }>
    >`
      SELECT rating::int, COUNT(*)::bigint AS count
      FROM "Review"
      WHERE "businessId" IN (${idList})
        AND status = 'PUBLISHED'
      GROUP BY rating
      ORDER BY rating DESC
    `;

    // Build map helpers
    const toMap = (rows: Array<{ date: string; count: bigint }>) => {
      const m: Record<string, number> = {};
      for (const r of rows) m[String(r.date).split("T")[0]] = Number(r.count);
      return m;
    };

    const viewsMap = toMap(rawViews);
    const searchesMap = toMap(rawSearches);
    const reviewsMap: Record<string, { count: number; avgRating: number }> = {};
    for (const r of rawReviews) {
      const key = String(r.date).split("T")[0];
      reviewsMap[key] = {
        count: Number(r.count),
        avgRating: r.avg_rating ? parseFloat(r.avg_rating.toFixed(1)) : 0,
      };
    }

    const peakHoursMap: Record<number, number> = {};
    for (const r of rawPeakHours) peakHoursMap[r.hour] = Number(r.count);

    // Devices
    let mobile = 0, desktop = 0, tablet = 0, totalDevices = 0;
    for (const r of rawDevices) {
      const c = Number(r.count);
      totalDevices += c;
      if (r.device_type === "mobile") mobile = c;
      else if (r.device_type === "tablet") tablet = c;
      else desktop += c;
    }
    const deviceTotal = totalDevices || 1;

    // New vs returning
    let newCount = 0, returningCount = 0;
    for (const r of rawVisitorStats) {
      if (r.visitor_type === "new") newCount = Number(r.count);
      else returningCount = Number(r.count);
    }
    const visitorTotal = newCount + returningCount || 1;

    // Rating distribution as percentages
    const ratingDist: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let totalRatings = 0;
    for (const r of rawRatingDist) {
      const c = Number(r.count);
      ratingDist[r.rating] = c;
      totalRatings += c;
    }
    const ratingTotal = totalRatings || 1;
    const ratingDistPct: Record<number, number> = {};
    for (const star of [1, 2, 3, 4, 5]) {
      ratingDistPct[star] = Math.round((ratingDist[star] / ratingTotal) * 100);
    }

    // Call / directions / website clicks by date
    const rawCalls = await prisma.$queryRaw<Array<{ date: string; count: bigint }>>`
      SELECT DATE("createdAt" AT TIME ZONE 'UTC') AS date, COUNT(*)::bigint AS count
      FROM "BusinessView"
      WHERE "businessId" IN (${idList})
        AND "createdAt" >= ${startDate}
        AND source = 'CALL'
      GROUP BY DATE("createdAt" AT TIME ZONE 'UTC')
      ORDER BY date ASC
    `;

    const rawDirections = await prisma.$queryRaw<Array<{ date: string; count: bigint }>>`
      SELECT DATE("createdAt" AT TIME ZONE 'UTC') AS date, COUNT(*)::bigint AS count
      FROM "BusinessView"
      WHERE "businessId" IN (${idList})
        AND "createdAt" >= ${startDate}
        AND source = 'DIRECTIONS'
      GROUP BY DATE("createdAt" AT TIME ZONE 'UTC')
      ORDER BY date ASC
    `;

    const rawWebsite = await prisma.$queryRaw<Array<{ date: string; count: bigint }>>`
      SELECT DATE("createdAt" AT TIME ZONE 'UTC') AS date, COUNT(*)::bigint AS count
      FROM "BusinessView"
      WHERE "businessId" IN (${idList})
        AND "createdAt" >= ${startDate}
        AND source = 'WEBSITE'
      GROUP BY DATE("createdAt" AT TIME ZONE 'UTC')
      ORDER BY date ASC
    `;

    const callsMap = toMap(rawCalls);
    const directionsMap = toMap(rawDirections);
    const websiteMap = toMap(rawWebsite);

    return NextResponse.json({
      views: dateLabels.map((date) => ({ date, count: viewsMap[date] ?? 0 })),
      searches: dateLabels.map((date) => ({ date, count: searchesMap[date] ?? 0 })),
      calls: dateLabels.map((date) => ({ date, count: callsMap[date] ?? 0 })),
      directions: dateLabels.map((date) => ({ date, count: directionsMap[date] ?? 0 })),
      websiteClicks: dateLabels.map((date) => ({ date, count: websiteMap[date] ?? 0 })),
      reviews: dateLabels.map((date) => ({
        date,
        count: reviewsMap[date]?.count ?? 0,
        avgRating: reviewsMap[date]?.avgRating ?? 0,
      })),
      topSearchTerms: [],
      peakHours: Array.from({ length: 24 }, (_, hour) => ({
        hour,
        count: peakHoursMap[hour] ?? 0,
      })),
      demographics: {
        newVsReturning: {
          new: Math.round((newCount / visitorTotal) * 100),
          returning: Math.round((returningCount / visitorTotal) * 100),
        },
        deviceTypes: {
          mobile: Math.round((mobile / deviceTotal) * 100),
          desktop: Math.round((desktop / deviceTotal) * 100),
          tablet: Math.round((tablet / deviceTotal) * 100),
        },
      },
      ratingDistribution: ratingDistPct,
    });
  } catch (error) {
    console.error("User analytics error:", error);
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}

function buildEmptyResponse(days: number) {
  const dateLabels: string[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    dateLabels.push(d.toISOString().split("T")[0]);
  }
  const zeroDates = dateLabels.map((date) => ({ date, count: 0 }));
  return {
    views: zeroDates,
    searches: zeroDates,
    calls: zeroDates,
    directions: zeroDates,
    websiteClicks: zeroDates,
    reviews: dateLabels.map((date) => ({ date, count: 0, avgRating: 0 })),
    topSearchTerms: [],
    peakHours: Array.from({ length: 24 }, (_, hour) => ({ hour, count: 0 })),
    demographics: {
      newVsReturning: { new: 0, returning: 0 },
      deviceTypes: { mobile: 0, desktop: 0, tablet: 0 },
    },
    ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  };
}
