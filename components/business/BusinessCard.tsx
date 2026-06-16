"use client";

import * as React from "react";
import Link from "next/link";
import { Heart, Star, Store } from "lucide-react";
import { Tag } from "@/components/man/primitives";
import { BUSINESS_CATEGORIES, BUSINESS_TAGS, PRICE_RANGES } from "@/lib/constants";
import type { Business } from "@/hooks/useMapSearch";

function resolveImage(b: Business): string | undefined {
  const cover = (b as any).coverImage;
  if (cover) return cover;
  const first = (b as any).photos?.[0];
  if (!first) return undefined;
  return typeof first === "string" ? first : first.url;
}

export function BusinessCard({
  business,
  variant = "grid",
  isFavorite = false,
  onToggleFavorite,
  onView,
}: {
  business: Business;
  variant?: "grid" | "compact";
  isFavorite?: boolean;
  onToggleFavorite?: (e: React.MouseEvent) => void;
  onView?: () => void;
}) {
  const img = resolveImage(business);
  const cat = BUSINESS_CATEGORIES.find((c) => c.value === business.category)?.label;
  const price = PRICE_RANGES.find((p) => p.value === business.priceRange)?.label;
  const knownTags = (business.tags || [])
    .map((t) => BUSINESS_TAGS.find((bt) => bt.value === t.tag))
    .filter(Boolean) as { value: string; label: string }[];

  // Compact = short horizontal row (used in split view alongside the map)
  if (variant === "compact") {
    return (
      <Link href={`/business/${business.id}`} onClick={onView}>
        <div className="flex gap-3 overflow-hidden rounded-[12px] p-2.5 transition-shadow hover:shadow-[var(--shadow-rest)]"
          style={{ background: "#ffffff", border: "1px solid var(--card-edge)" }}>
          <div className="relative h-[84px] w-[84px] flex-shrink-0 overflow-hidden rounded-[10px]">
            {img ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={img} alt={business.name} loading="lazy" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center" style={{ background: "linear-gradient(135deg, var(--moss-100), var(--moss-200))" }}>
                <Store size={20} style={{ color: "var(--moss-700)" }} />
              </div>
            )}
          </div>
          <div className="flex min-w-0 flex-1 flex-col">
            <div className="flex items-start justify-between gap-2">
              <h3 className="t-label line-clamp-1" style={{ color: "var(--ink-900)" }}>{business.name}</h3>
              <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggleFavorite?.(e); }} aria-label="Save" className="-mr-0.5 flex-shrink-0">
                <Heart size={15} fill={isFavorite ? "var(--clay-500)" : "none"} stroke={isFavorite ? "var(--clay-500)" : "var(--ink-400)"} />
              </button>
            </div>
            <div className="mt-0.5 flex flex-wrap items-center gap-x-2 t-body-xs" style={{ color: "var(--ink-500)" }}>
              {business.averageRating > 0 && (
                <span className="inline-flex items-center gap-1" style={{ color: "var(--ink-700)" }}>
                  <Star size={12} fill="var(--clay-500)" stroke="none" />
                  <span style={{ fontWeight: 600 }}>{business.averageRating.toFixed(1)}</span>
                  <span style={{ color: "var(--ink-400)" }}>({business.reviewCount})</span>
                </span>
              )}
              {cat && <span>{cat}</span>}
              {price && <span>· {price}</span>}
            </div>
            <p className="mt-auto pt-1 t-body-xs line-clamp-1" style={{ color: "var(--ink-500)" }}>
              {[business.address, business.city].filter(Boolean).join(", ")}
              {business.distance !== undefined && ` · ${business.distance.toFixed(1)} mi`}
            </p>
          </div>
        </div>
      </Link>
    );
  }

  // Grid = vertical card (default)
  return (
    <Link href={`/business/${business.id}`} onClick={onView}>
      <div className="h-full overflow-hidden rounded-[14px] transition-shadow hover:shadow-[var(--shadow-lift)]"
        style={{ background: "#ffffff", border: "1px solid var(--card-edge)" }}>
        <div className="relative">
          {img ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={img} alt={business.name} loading="lazy" className="aspect-video w-full object-cover" />
          ) : (
            <div className="aspect-video flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, var(--moss-100), var(--moss-200))" }}>
              <Store size={26} style={{ color: "var(--moss-700)" }} />
            </div>
          )}

          <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggleFavorite?.(e); }} aria-label="Save"
            className="absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full shadow-md transition-transform hover:scale-110"
            style={{ background: "#ffffff" }}>
            <Heart size={15} fill={isFavorite ? "var(--clay-500)" : "none"} stroke={isFavorite ? "var(--clay-500)" : "var(--ink-500)"} />
          </button>

          {price && (
            <div className="absolute bottom-2.5 left-2.5 rounded-md px-2 py-0.5"
              style={{ background: "rgba(17,50,30,0.78)", color: "var(--bone)", fontSize: 11 }}>{price}</div>
          )}
        </div>

        <div style={{ padding: 16 }}>
          <div className="flex items-start justify-between gap-2">
            <h3 className="t-label line-clamp-1" style={{ color: "var(--ink-900)" }}>{business.name}</h3>
            {business.distance !== undefined && (
              <span className="t-body-xs whitespace-nowrap" style={{ color: "var(--ink-500)" }}>{business.distance.toFixed(1)} mi</span>
            )}
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 t-body-sm" style={{ color: "var(--ink-500)" }}>
            {business.averageRating > 0 && (
              <span className="inline-flex items-center gap-1" style={{ color: "var(--ink-700)" }}>
                <Star size={13} fill="var(--clay-500)" stroke="none" />
                <span style={{ fontWeight: 600 }}>{business.averageRating.toFixed(1)}</span>
                <span style={{ color: "var(--ink-400)" }}>({business.reviewCount})</span>
              </span>
            )}
            {cat && <span>{cat}</span>}
          </div>

          {business.description && (
            <p className="mt-2 t-body-sm line-clamp-2" style={{ color: "var(--ink-500)" }}>{business.description}</p>
          )}

          <p className="mt-2 t-body-sm line-clamp-1" style={{ color: "var(--ink-500)" }}>{[business.address, business.city].filter(Boolean).join(", ")}</p>

          {knownTags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {knownTags.slice(0, 3).map((t) => (
                <Tag key={t.value} tone="moss">{t.label}</Tag>
              ))}
              {knownTags.length > 3 && <Tag>+{knownTags.length - 3}</Tag>}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
