// lib/category-groups.ts
import type { BusinessCategory } from "./mock-data/types";

export type CategoryGroup = {
  key: string;
  label: string;
  icon: string; // Lucide component name, resolved in the UI layer
  categories: BusinessCategory[];
};

export const CATEGORY_GROUPS: CategoryGroup[] = [
  { key: "food", label: "Food & Drink", icon: "UtensilsCrossed", categories: ["RESTAURANT", "GROCERY", "BAKERY", "HALAL_FOOD"] },
  { key: "retail", label: "Shopping & Retail", icon: "ShoppingBag", categories: ["JEWELRY", "CLOTHING", "FLORIST", "BOOKS_GIFTS", "TAILORING", "RETAIL"] },
  { key: "beauty", label: "Beauty & Grooming", icon: "Scissors", categories: ["BARBER_SALON", "BEAUTY_SPA"] },
  { key: "health", label: "Health & Wellness", icon: "HeartPulse", categories: ["HEALTH_WELLNESS", "FITNESS"] },
  { key: "home", label: "Home & Trade", icon: "Wrench", categories: ["HOME_SERVICES", "PLUMBING", "ELECTRICAL", "HANDYMAN"] },
  { key: "auto", label: "Auto", icon: "Car", categories: ["AUTO_REPAIR"] },
  { key: "professional", label: "Professional Services", icon: "Briefcase", categories: ["LEGAL_SERVICES", "ACCOUNTING", "REAL_ESTATE", "EVENTS"] },
  { key: "tech", label: "Tech & Media", icon: "Laptop", categories: ["TECH_SERVICES", "PHOTOGRAPHY"] },
  { key: "community", label: "Community & Education", icon: "Landmark", categories: ["MASJID", "TUTORING", "CHILDCARE", "COMMUNITY_AID"] },
];

export function categoriesForGroup(key: string): BusinessCategory[] {
  return CATEGORY_GROUPS.find((g) => g.key === key)?.categories ?? [];
}

export function groupForCategory(category: string): CategoryGroup | undefined {
  return CATEGORY_GROUPS.find((g) => g.categories.includes(category as BusinessCategory));
}
