import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "https://minara.market";

  const static_pages: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${base}/search`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];

  let businesses: MetadataRoute.Sitemap = [];
  try {
    const rows = await prisma.business.findMany({
      where: { status: "ACTIVE" },
      select: { id: true, slug: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
    });

    businesses = rows.map((b: { id: string; slug: string | null; updatedAt: Date }) => ({
      url: `${base}/business/${b.slug || b.id}`,
      lastModified: b.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  } catch {
    // DB unavailable during build — return static pages only
  }

  return [...static_pages, ...businesses];
}
