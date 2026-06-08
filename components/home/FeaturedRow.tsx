// components/home/FeaturedRow.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ManCard, PH, Tag } from "@/components/man/primitives";
import { Star } from "lucide-react";
import { DEFAULT_LOCATION } from "@/lib/constants";

export function FeaturedRow() {
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => {
    fetch(`/api/businesses?status=PUBLISHED&limit=8&lat=${DEFAULT_LOCATION.latitude}&lng=${DEFAULT_LOCATION.longitude}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setItems(((d?.businesses || d || []) as any[]).filter((b) => b.coverImage).slice(0, 4)))
      .catch(() => {});
  }, []);
  if (items.length === 0) return null;

  return (
    <section className="mx-auto max-w-[1200px] px-6 py-12">
      <PH title="Featured near you" sub="Verified Muslim-owned businesses in Sacramento" />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {items.map((b) => (
          <Link key={b.id} href={`/business/${b.id}`}>
            <ManCard style={{ padding: 0, overflow: "hidden" }} className="h-full transition-shadow hover:shadow-[var(--shadow-lift)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={b.coverImage} alt={b.name} loading="lazy" className="aspect-video w-full object-cover" />
              <div style={{ padding: 14 }}>
                <div className="t-label line-clamp-1" style={{ color: "var(--ink-900)" }}>{b.name}</div>
                <div className="mt-1 flex items-center gap-2 t-body-sm" style={{ color: "var(--ink-500)" }}>
                  {b.averageRating > 0 && (
                    <span className="inline-flex items-center gap-1" style={{ color: "var(--ink-700)" }}>
                      <Star size={13} fill="var(--clay-500)" stroke="none" /> {b.averageRating.toFixed(1)}
                    </span>
                  )}
                  <span className="line-clamp-1">{b.city}</span>
                </div>
                {b.verificationStatus === "APPROVED" && <div className="mt-2"><Tag tone="moss">Verified</Tag></div>}
              </div>
            </ManCard>
          </Link>
        ))}
      </div>
    </section>
  );
}
