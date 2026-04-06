import { NextResponse } from "next/server";
import { z } from "zod";
import { db, isMockMode } from "@/lib/db";
import { getRequestUser } from "@/lib/api/auth-user";

const updateSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  description: z.string().max(1000).optional(),
  isPublic: z.boolean().optional(),
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

    const existing = await db.businessList.findFirst({
      where: { id, userId: user.id },
    });

    if (!existing) {
      return NextResponse.json({ error: "List not found" }, { status: 404 });
    }

    const list = await db.businessList.update({
      where: { id },
      data: {
        ...(input.name !== undefined ? { name: input.name } : {}),
        ...(input.description !== undefined ? { description: input.description } : {}),
        ...(input.isPublic !== undefined ? { isPublic: input.isPublic } : {}),
      },
    });

    return NextResponse.json({ list });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation error", details: error.issues }, { status: 400 });
    }
    console.error("Error updating list:", error);
    return NextResponse.json({ error: "Failed to update list" }, { status: 500 });
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

    const existing = await db.businessList.findFirst({
      where: { id, userId: user.id },
    });

    if (!existing) {
      return NextResponse.json({ error: "List not found" }, { status: 404 });
    }

    await db.businessList.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting list:", error);
    return NextResponse.json({ error: "Failed to delete list" }, { status: 500 });
  }
}
