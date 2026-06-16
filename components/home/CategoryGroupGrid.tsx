// components/home/CategoryGroupGrid.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { CATEGORY_GROUPS } from "@/lib/category-groups";
import { BUSINESS_CATEGORIES } from "@/lib/constants";
import { ManCard, PH } from "@/components/man/primitives";
import {
  UtensilsCrossed, ShoppingBag, Scissors, HeartPulse, Wrench, Car,
  Briefcase, Laptop, Landmark, ChevronRight,
} from "lucide-react";

const ICONS: Record<string, any> = { UtensilsCrossed, ShoppingBag, Scissors, HeartPulse, Wrench, Car, Briefcase, Laptop, Landmark };

export function CategoryGroupGrid() {
  const [showAll, setShowAll] = useState(false);
  return (
    <section className="mx-auto max-w-[1200px] px-6 py-12">
      <PH title="Browse by Category" sub="Find Muslim-owned businesses across Sacramento" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-3">
        {CATEGORY_GROUPS.map((g) => {
          const Icon = ICONS[g.icon] ?? Briefcase;
          return (
            <Link key={g.key} href={`/search?group=${g.key}`}>
              <ManCard style={{ padding: 20 }} className="flex h-full items-center gap-3.5 transition-shadow hover:shadow-[var(--shadow-lift)]">
                <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl" style={{ background: "var(--moss-50)" }}>
                  <Icon size={20} style={{ color: "var(--moss-700)" }} />
                </span>
                <div className="flex-1">
                  <div className="t-label" style={{ color: "var(--ink-900)" }}>{g.label}</div>
                  <div className="t-body-xs" style={{ color: "var(--ink-500)", marginTop: 2 }}>{g.categories.length} categor{g.categories.length === 1 ? "y" : "ies"}</div>
                </div>
                <ChevronRight size={16} style={{ color: "var(--ink-400)" }} />
              </ManCard>
            </Link>
          );
        })}
      </div>

      <button onClick={() => setShowAll((v) => !v)} className="mt-4 t-body-sm" style={{ color: "var(--moss-700)", fontWeight: 600 }}>
        {showAll ? "Hide all categories" : "View all categories →"}
      </button>
      {showAll && (
        <div className="mt-3 flex flex-wrap gap-2">
          {BUSINESS_CATEGORIES.filter((c) => c.value !== "OTHER").map((c) => (
            <Link key={c.value} href={`/search?category=${c.value}`}
              className="rounded-full px-3 py-1.5 t-body-sm" style={{ background: "var(--paper-2)", color: "var(--ink-700)" }}>
              {c.label}
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
