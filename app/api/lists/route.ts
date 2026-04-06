import { NextResponse } from "next/server";
import { z } from "zod";
import { db, isMockMode } from "@/lib/db";
import { getRequestUser } from "@/lib/api/auth-user";

const createSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  isPublic: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
});

export async function GET(req: Request) {
  try {
    const user = await getRequestUser(req);

    if (isMockMode()) {
      return NextResponse.json({ myLists: [], publicLists: [] });
    }

    const url = new URL(req.url);
    const tab = url.searchParams.get("tab") || "my";

    if (tab === "discover") {
      const publicLists = await db.businessList.findMany({
        where: {
          isPublic: true,
          ...(user ? { NOT: { userId: user.id } } : {}),
        },
        include: {
          user: { select: { id: true, name: true } },
          _count: { select: { businesses: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 50,
      });

      return NextResponse.json({
        publicLists: publicLists.map((l) => ({
          ...l,
          authorName: l.user.name || "Anonymous",
          businessCount: l._count.businesses,
        })),
      });
    }

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const myLists = await db.businessList.findMany({
      where: { userId: user.id },
      include: {
        _count: { select: { businesses: true } },
      },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({
      myLists: myLists.map((l) => ({
        ...l,
        businessCount: l._count.businesses,
      })),
    });
  } catch (error) {
    console.error("Error fetching lists:", error);
    return NextResponse.json({ error: "Failed to fetch lists" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getRequestUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (isMockMode()) {
      return NextResponse.json({ error: "Not available in mock mode" }, { status: 501 });
    }

    const input = createSchema.parse(await req.json());

    const list = await db.businessList.create({
      data: {
        userId: user.id,
        name: input.name,
        description: input.description || null,
        isPublic: input.isPublic,
      },
    });

    return NextResponse.json({ list }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation error", details: error.issues }, { status: 400 });
    }
    console.error("Error creating list:", error);
    return NextResponse.json({ error: "Failed to create list" }, { status: 500 });
  }
}
