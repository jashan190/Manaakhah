import { NextResponse } from "next/server";
import { z } from "zod";
import { db, isMockMode } from "@/lib/db";
import { getRequestUser } from "@/lib/api/auth-user";

const createSchema = z.object({
  name: z.string().min(1).max(200),
  query: z.string().max(500).default(""),
  filters: z.record(z.unknown()).default({}),
  alertEnabled: z.boolean().default(false),
});

export async function GET(req: Request) {
  try {
    const user = await getRequestUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (isMockMode()) {
      return NextResponse.json({ searches: [] });
    }

    const searches = await db.savedSearch.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ searches });
  } catch (error) {
    console.error("Error fetching saved searches:", error);
    return NextResponse.json({ error: "Failed to fetch saved searches" }, { status: 500 });
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

    const search = await db.savedSearch.create({
      data: {
        userId: user.id,
        name: input.name,
        query: input.query,
        filters: input.filters,
        alertEnabled: input.alertEnabled,
      },
    });

    return NextResponse.json({ search }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation error", details: error.issues }, { status: 400 });
    }
    console.error("Error creating saved search:", error);
    return NextResponse.json({ error: "Failed to create saved search" }, { status: 500 });
  }
}
