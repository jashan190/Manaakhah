import { NextResponse } from "next/server";
import { z } from "zod";
import { db, isMockMode } from "@/lib/db";
import { getRequestUser } from "@/lib/api/auth-user";

const updateMethodSchema = z.object({
  label: z.string().max(100).optional(),
  isDefault: z.boolean().optional(),
  isActive: z.boolean().optional(),
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
      return NextResponse.json(
        { error: "Payment methods are not available in mock mode" },
        { status: 501 }
      );
    }

    const { id } = await params;
    const input = updateMethodSchema.parse(await req.json());

    const existing = await db.paymentMethod.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Payment method not found" },
        { status: 404 }
      );
    }

    if (input.isDefault) {
      await db.paymentMethod.updateMany({
        where: { userId: user.id, isDefault: true },
        data: { isDefault: false },
      });
    }

    if (input.isActive === false) {
      const activeSubscription = await db.businessSubscription.findFirst({
        where: {
          paymentMethodId: id,
          status: { in: ["ACTIVE", "TRIALING", "PAST_DUE"] },
        },
      });
      if (activeSubscription) {
        return NextResponse.json(
          { error: "Cannot deactivate payment method used by an active subscription" },
          { status: 409 }
        );
      }
    }

    const method = await db.paymentMethod.update({
      where: { id },
      data: {
        ...(input.label !== undefined ? { label: input.label } : {}),
        ...(input.isDefault !== undefined ? { isDefault: input.isDefault } : {}),
        ...(input.isActive !== undefined ? { isActive: input.isActive } : {}),
      },
    });

    return NextResponse.json({ method });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Error updating payment method:", error);
    return NextResponse.json(
      { error: "Failed to update payment method" },
      { status: 500 }
    );
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
      return NextResponse.json(
        { error: "Payment methods are not available in mock mode" },
        { status: 501 }
      );
    }

    const { id } = await params;

    const existing = await db.paymentMethod.findFirst({
      where: {
        id,
        userId: user.id,
      },
      include: {
        subscriptions: {
          where: { status: { in: ["ACTIVE", "TRIALING", "PAST_DUE"] } },
          take: 1,
        },
      },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Payment method not found" },
        { status: 404 }
      );
    }

    if (existing.subscriptions.length > 0) {
      return NextResponse.json(
        { error: "Cannot remove payment method used by an active subscription" },
        { status: 409 }
      );
    }

    await db.paymentMethod.update({
      where: { id },
      data: {
        isActive: false,
        isDefault: false,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting payment method:", error);
    return NextResponse.json(
      { error: "Failed to delete payment method" },
      { status: 500 }
    );
  }
}

