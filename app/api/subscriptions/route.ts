import { NextResponse } from "next/server";
import { z } from "zod";
import { db, isMockMode } from "@/lib/db";
import { getRequestUser } from "@/lib/api/auth-user";
import { DEFAULT_SUBSCRIPTION_PLANS } from "@/lib/subscriptions/plans";

const subscribeSchema = z.object({
  businessId: z.string().min(1),
  planCode: z.string().min(1),
  paymentMethodId: z.string().optional(),
  savePaymentMethod: z
    .object({
      type: z.enum(["CARD", "BANK_TRANSFER", "ZELLE", "CASH_APP", "MANUAL"]),
      label: z.string().max(100).optional(),
      brand: z.string().max(50).optional(),
      last4: z.string().regex(/^\d{4}$/).optional(),
      expMonth: z.number().int().min(1).max(12).optional(),
      expYear: z.number().int().min(2024).max(2100).optional(),
      accountHint: z.string().max(100).optional(),
      isDefault: z.boolean().optional(),
    })
    .optional(),
});

function getPeriodEnd(start: Date, cycle: "MONTHLY" | "YEARLY") {
  const end = new Date(start);
  if (cycle === "YEARLY") {
    end.setFullYear(end.getFullYear() + 1);
  } else {
    end.setMonth(end.getMonth() + 1);
  }
  return end;
}

async function ensurePlans() {
  await Promise.all(
    DEFAULT_SUBSCRIPTION_PLANS.map((plan) =>
      db.subscriptionPlan.upsert({
        where: { code: plan.code },
        update: {
          name: plan.name,
          description: plan.description,
          tier: plan.tier,
          amount: plan.amount,
          currency: plan.currency,
          billingCycle: plan.billingCycle,
          features: plan.features,
          isActive: true,
        },
        create: {
          code: plan.code,
          name: plan.name,
          description: plan.description,
          tier: plan.tier,
          amount: plan.amount,
          currency: plan.currency,
          billingCycle: plan.billingCycle,
          features: plan.features,
          isActive: true,
        },
      })
    )
  );
}

export async function GET(req: Request) {
  try {
    const user = await getRequestUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (isMockMode()) {
      return NextResponse.json({
        plans: DEFAULT_SUBSCRIPTION_PLANS,
        businesses: [],
        paymentMethods: [],
      });
    }

    await ensurePlans();

    const [plans, businesses, paymentMethods] = await Promise.all([
      db.subscriptionPlan.findMany({
        where: { isActive: true },
        orderBy: [{ amount: "asc" }, { name: "asc" }],
      }),
      db.business.findMany({
        where: {
          ownerId: user.id,
        },
        select: {
          id: true,
          name: true,
          subscriptionTier: true,
          subscriptionExpires: true,
          subscriptions: {
            orderBy: { createdAt: "desc" },
            take: 1,
            include: {
              plan: true,
              paymentMethod: true,
              invoices: {
                orderBy: { createdAt: "desc" },
                take: 3,
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      db.paymentMethod.findMany({
        where: {
          userId: user.id,
          isActive: true,
        },
        orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
      }),
    ]);

    return NextResponse.json({
      plans,
      businesses,
      paymentMethods,
    });
  } catch (error) {
    console.error("Error loading subscriptions:", error);
    return NextResponse.json(
      { error: "Failed to load subscriptions" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
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

    const input = subscribeSchema.parse(await req.json());
    await ensurePlans();

    const business = await db.business.findUnique({
      where: { id: input.businessId },
      select: {
        id: true,
        ownerId: true,
      },
    });

    if (!business) {
      return NextResponse.json({ error: "Business not found" }, { status: 404 });
    }

    const isAdmin = user.role === "ADMIN" || user.role === "SUPER_ADMIN";
    if (business.ownerId !== user.id && !isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const plan = await db.subscriptionPlan.findFirst({
      where: {
        code: input.planCode,
        isActive: true,
      },
    });

    if (!plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    let paymentMethodId = input.paymentMethodId || null;

    if (input.savePaymentMethod) {
      if (input.savePaymentMethod.isDefault) {
        await db.paymentMethod.updateMany({
          where: { userId: user.id, isDefault: true },
          data: { isDefault: false },
        });
      }

      const newMethod = await db.paymentMethod.create({
        data: {
          userId: user.id,
          type: input.savePaymentMethod.type,
          label: input.savePaymentMethod.label || null,
          brand: input.savePaymentMethod.brand || null,
          last4: input.savePaymentMethod.last4 || null,
          expMonth: input.savePaymentMethod.expMonth || null,
          expYear: input.savePaymentMethod.expYear || null,
          accountHint: input.savePaymentMethod.accountHint || null,
          isDefault: input.savePaymentMethod.isDefault ?? false,
          isActive: true,
        },
      });
      paymentMethodId = newMethod.id;
    }

    if (paymentMethodId) {
      const paymentMethod = await db.paymentMethod.findFirst({
        where: {
          id: paymentMethodId,
          userId: user.id,
          isActive: true,
        },
      });
      if (!paymentMethod) {
        return NextResponse.json(
          { error: "Payment method not found" },
          { status: 404 }
        );
      }
    }

    const now = new Date();
    const periodEnd = getPeriodEnd(now, plan.billingCycle);

    await db.businessSubscription.updateMany({
      where: {
        businessId: input.businessId,
        status: { in: ["ACTIVE", "TRIALING", "PAST_DUE"] },
      },
      data: {
        status: "CANCELED",
        canceledAt: now,
        cancelAtPeriodEnd: false,
      },
    });

    const subscription = await db.businessSubscription.create({
      data: {
        businessId: input.businessId,
        planId: plan.id,
        paymentMethodId,
        status: "ACTIVE",
        currentPeriodStart: now,
        currentPeriodEnd: periodEnd,
        createdById: user.id,
      },
      include: {
        plan: true,
        paymentMethod: true,
      },
    });

    const invoice = await db.subscriptionInvoice.create({
      data: {
        subscriptionId: subscription.id,
        businessId: input.businessId,
        paymentMethodId,
        amount: plan.amount,
        currency: plan.currency,
        status: "PAID",
        periodStart: now,
        periodEnd,
        dueDate: now,
        paidAt: now,
        paymentReference: `internal_${subscription.id}_${Date.now()}`,
      },
    });

    await db.business.update({
      where: { id: input.businessId },
      data: {
        subscriptionTier: plan.tier,
        subscriptionExpires: periodEnd,
      },
    });

    return NextResponse.json({
      subscription,
      invoice,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Error creating subscription:", error);
    return NextResponse.json(
      { error: "Failed to create subscription" },
      { status: 500 }
    );
  }
}

