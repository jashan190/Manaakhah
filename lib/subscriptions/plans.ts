import type { BillingCycle, SubscriptionTier } from "@prisma/client";

type PlanSeed = {
  code: string;
  name: string;
  description: string;
  tier: SubscriptionTier;
  amount: number;
  currency: string;
  billingCycle: BillingCycle;
  features: string[];
};

export const DEFAULT_SUBSCRIPTION_PLANS: PlanSeed[] = [
  {
    code: "basic-monthly",
    name: "Basic Monthly",
    description: "Starter visibility for businesses with limited needs.",
    tier: "BASIC",
    amount: 19,
    currency: "USD",
    billingCycle: "MONTHLY",
    features: ["Public profile", "Service listing", "Basic analytics"],
  },
  {
    code: "professional-monthly",
    name: "Professional Monthly",
    description: "Best for active trades businesses with frequent leads.",
    tier: "PROFESSIONAL",
    amount: 49,
    currency: "USD",
    billingCycle: "MONTHLY",
    features: [
      "Priority ranking boost",
      "Featured services",
      "Advanced analytics",
      "Priority support",
    ],
  },
  {
    code: "enterprise-monthly",
    name: "Enterprise Monthly",
    description: "For teams managing larger service operations.",
    tier: "ENTERPRISE",
    amount: 99,
    currency: "USD",
    billingCycle: "MONTHLY",
    features: [
      "Everything in Professional",
      "Multi-staff management",
      "White-glove onboarding",
    ],
  },
];

