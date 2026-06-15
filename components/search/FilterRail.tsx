// components/search/FilterRail.tsx
"use client";

import { useState } from "react";
import { ChevronRight, ChevronLeft, Check } from "lucide-react";
import { BUSINESS_TAGS, DISTANCE_OPTIONS, SORT_OPTIONS, PRICE_RANGES } from "@/lib/constants";
import { CATEGORY_GROUPS } from "@/lib/category-groups";

type Filters = { category: string; tags: string[]; distance: string; sort: string; priceRange: string; minRating: string };
const RATINGS = [["", "Any"], ["4", "4+"], ["3", "3+"], ["2", "2+"]] as const;
const titleCase = (s: string) => s.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (m) => m.toUpperCase());

type View = "root" | "category" | "distance" | "price" | "rating" | "sort" | "amenities";

/* A navigable row on the root menu (drills into a sub-list) */
function NavRow({ label, value, onClick }: { label: string; value: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-[var(--paper-2)]">
      <span className="t-label" style={{ color: "var(--ink-900)" }}>{label}</span>
      <span className="flex items-center gap-1.5">
        <span className="t-body-sm" style={{ color: "var(--ink-500)" }}>{value}</span>
        <ChevronRight size={16} style={{ color: "var(--ink-400)" }} />
      </span>
    </button>
  );
}

/* A selectable option within a sub-list */
function Opt({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-[var(--paper-2)]">
      <span className="t-body" style={{ color: selected ? "var(--moss-700)" : "var(--ink-700)", fontWeight: selected ? 600 : 400 }}>{label}</span>
      {selected && <Check size={16} style={{ color: "var(--moss-700)" }} />}
    </button>
  );
}

function SubHeader({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <button onClick={onBack} className="mb-1 flex w-full items-center gap-1 rounded-lg px-1.5 py-1.5 text-left transition-colors hover:bg-[var(--paper-2)]">
      <ChevronLeft size={16} style={{ color: "var(--ink-500)" }} />
      <span className="t-label" style={{ color: "var(--ink-900)" }}>{title}</span>
    </button>
  );
}

export function FilterRail({
  filters, setFilters,
}: {
  filters: Filters;
  setFilters: (p: Partial<Filters> & Record<string, unknown>) => void;
  clearFilters: () => void;
  activeCount: number;
}) {
  const [view, setView] = useState<View>("root");
  const back = () => setView("root");
  const toggleTag = (t: string) =>
    setFilters({ tags: filters.tags.includes(t) ? filters.tags.filter((x) => x !== t) : [...filters.tags, t] });

  // current-value summaries shown on the root menu
  const summary = {
    category: filters.category ? titleCase(filters.category) : "All",
    distance: DISTANCE_OPTIONS.find((o) => o.value === filters.distance)?.label || "Any",
    price: PRICE_RANGES.find((o) => o.value === filters.priceRange)?.label || "Any",
    rating: filters.minRating ? `${filters.minRating}+` : "Any",
    sort: SORT_OPTIONS.find((o) => o.value === filters.sort)?.label || "Default",
    amenities: filters.tags.length ? `${filters.tags.length} selected` : "Any",
  };

  if (view === "root") {
    return (
      <div className="flex flex-col">
        <NavRow label="Category" value={summary.category} onClick={() => setView("category")} />
        <NavRow label="Distance" value={summary.distance} onClick={() => setView("distance")} />
        <NavRow label="Price" value={summary.price} onClick={() => setView("price")} />
        <NavRow label="Rating" value={summary.rating} onClick={() => setView("rating")} />
        <NavRow label="Sort By" value={summary.sort} onClick={() => setView("sort")} />
        <NavRow label="Amenities" value={summary.amenities} onClick={() => setView("amenities")} />
      </div>
    );
  }

  if (view === "category") {
    return (
      <div>
        <SubHeader title="Category" onBack={back} />
        <Opt label="All Categories" selected={!filters.category} onClick={() => { setFilters({ category: "" }); back(); }} />
        {CATEGORY_GROUPS.map((g) => (
          <div key={g.key}>
            <div className="t-eyebrow px-3 pb-1 pt-3" style={{ color: "var(--ink-400)" }}>{g.label}</div>
            {g.categories.map((c) => (
              <Opt key={c} label={titleCase(c)} selected={filters.category === c} onClick={() => { setFilters({ category: c }); back(); }} />
            ))}
          </div>
        ))}
      </div>
    );
  }

  if (view === "distance") {
    return (
      <div>
        <SubHeader title="Distance" onBack={back} />
        {DISTANCE_OPTIONS.map((o) => (
          <Opt key={o.value} label={o.label} selected={filters.distance === o.value}
            onClick={() => { setFilters({ distance: o.value, ne_lat: null, ne_lng: null, sw_lat: null, sw_lng: null }); back(); }} />
        ))}
      </div>
    );
  }

  if (view === "price") {
    return (
      <div>
        <SubHeader title="Price" onBack={back} />
        <Opt label="Any" selected={!filters.priceRange} onClick={() => { setFilters({ priceRange: "" }); back(); }} />
        {PRICE_RANGES.map((o) => (
          <Opt key={o.value} label={o.label} selected={filters.priceRange === o.value} onClick={() => { setFilters({ priceRange: o.value }); back(); }} />
        ))}
      </div>
    );
  }

  if (view === "rating") {
    return (
      <div>
        <SubHeader title="Minimum Rating" onBack={back} />
        {RATINGS.map(([v, l]) => (
          <Opt key={v} label={v ? `${l} stars` : l} selected={filters.minRating === v} onClick={() => { setFilters({ minRating: v }); back(); }} />
        ))}
      </div>
    );
  }

  if (view === "sort") {
    return (
      <div>
        <SubHeader title="Sort By" onBack={back} />
        {SORT_OPTIONS.map((o) => (
          <Opt key={o.value} label={o.label} selected={filters.sort === o.value} onClick={() => { setFilters({ sort: o.value }); back(); }} />
        ))}
      </div>
    );
  }

  // amenities — multi-select, stays open
  return (
    <div>
      <SubHeader title="Amenities" onBack={back} />
      {BUSINESS_TAGS.map((t) => (
        <Opt key={t.value} label={t.label} selected={filters.tags.includes(t.value)} onClick={() => toggleTag(t.value)} />
      ))}
    </div>
  );
}
