import { NextResponse } from "next/server";
import { z } from "zod";
import { db, isMockMode } from "@/lib/db";
import { getRequestUser } from "@/lib/api/auth-user";

const updateSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  query: z.string().max(500).optional(),
  filters: z.record(z.unknown()).optional(),
  alertEnabled: z.boolean().optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getRequestUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (isMockMode()) {
      return NextResponse.json({ error: "Not available in mock mode" }, { status: 501 });
    }

    const { id } = await params;
    const input = updateSchema.parse(await req.json());

    const existing = await db.savedSearch.findFirst({
      where: { id, userId: user.id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Saved search not found" }, { status: 404 });
    }

    const search = await db.savedSearch.update({
      where: { id },
      data: {
        ...(input.name !== undefined ? { name: input.name } : {}),
        ...(input.query !== undefined ? { query: input.query } : {}),
        ...(input.filters !== undefined ? { filters: input.filters } : {}),
        ...(input.alertEnabled !== undefined ? { alertEnabled: input.alertEnabled } : {}),
      },
    });

    return NextResponse.json({ search });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation error", details: error.issues }, { status: 400 });
    }
    console.error("Error updating saved search:", error);
    return NextResponse.json({ error: "Failed to update saved search" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getRequestUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (isMockMode()) {
      return NextResponse.json({ error: "Not available in mock mode" }, { status: 501 });
    }

    const { id } = await params;

    const existing = await db.savedSearch.findFirst({
      where: { id, userId: user.id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Saved search not found" }, { status: 404 });
    }

    await db.savedSearch.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting saved search:", error);
    return NextResponse.json({ error: "Failed to delete saved search" }, { status: 500 });
  }
}
