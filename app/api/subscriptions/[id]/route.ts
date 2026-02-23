import { NextResponse } from "next/server";
import { z } from "zod";
import { db, isMockMode } from "@/lib/db";
import { getRequestUser } from "@/lib/api/auth-user";

const updateSubscriptionSchema = z.object({
  immediate: z.boolean().optional(),
  cancelAtPeriodEnd: z.boolean().optional(),
  reactivate: z.boolean().optional(),
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
        { error: "Subscriptions are not available in mock mode" },
        { status: 501 }
      );
    }

    const { id } = await params;
    const input = updateSubscriptionSchema.parse(await req.json());

    const subscription = await db.businessSubscription.findUnique({
      where: { id },
      include: {
        business: {
          select: {
            id: true,
            ownerId: true,
          },
        },
        plan: {
          select: {
            tier: true,
          },
        },
      },
    });

    if (!subscription) {
      return NextResponse.json(
        { error: "Subscription not found" },
        { status: 404 }
      );
    }

    const isAdmin = user.role === "ADMIN" || user.role === "SUPER_ADMIN";
    if (subscription.business.ownerId !== user.id && !isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (input.reactivate) {
      const updated = await db.businessSubscription.update({
        where: { id: subscription.id },
        data: {
          cancelAtPeriodEnd: false,
        },
      });
      return NextResponse.json({ subscription: updated });
    }

    const immediate = input.immediate === true;
    const cancelAtPeriodEnd = input.cancelAtPeriodEnd ?? !immediate;

    const updatedSubscription = await db.businessSubscription.update({
      where: { id: subscription.id },
      data: immediate
        ? {
            status: "CANCELED",
            canceledAt: new Date(),
            cancelAtPeriodEnd: false,
          }
        : {
            cancelAtPeriodEnd,
          },
    });

    if (immediate) {
      await db.business.update({
        where: { id: subscription.businessId },
        data: {
          subscriptionTier: "FREE",
          subscriptionExpires: null,
        },
      });
    }

    return NextResponse.json({ subscription: updatedSubscription });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Error updating subscription:", error);
    return NextResponse.json(
      { error: "Failed to update subscription" },
      { status: 500 }
    );
  }
}

