import { NextResponse } from "next/server";
import { db, isMockMode } from "@/lib/db";
import { DEFAULT_SUBSCRIPTION_PLANS } from "@/lib/subscriptions/plans";

export async function GET() {
  try {
    if (isMockMode()) {
      return NextResponse.json({ plans: DEFAULT_SUBSCRIPTION_PLANS });
    }

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

    const plans = await db.subscriptionPlan.findMany({
      where: { isActive: true },
      orderBy: [{ amount: "asc" }, { name: "asc" }],
    });

    return NextResponse.json({ plans });
  } catch (error) {
    console.error("Error fetching plans:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscription plans" },
      { status: 500 }
    );
  }
}

