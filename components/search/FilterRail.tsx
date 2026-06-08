// components/search/FilterRail.tsx
"use client";

import { Button } from "@/components/ui/button";
import { BUSINESS_TAGS, DISTANCE_OPTIONS, SORT_OPTIONS, PRICE_RANGES } from "@/lib/constants";
import { CATEGORY_GROUPS } from "@/lib/category-groups";

type Filters = { category: string; tags: string[]; distance: string; sort: string; priceRange: string; minRating: string };
const RATINGS = [["", "Any"], ["4", "4+"], ["3", "3+"], ["2", "2+"]] as const;

function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className="t-body-sm rounded-full px-3 py-1.5"
      style={on ? { background: "var(--moss-700)", color: "var(--bone)" } : { background: "var(--card)", border: "1px solid var(--card-edge)", color: "var(--ink-700)" }}>
      {children}
    </button>
  );
}
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="py-3.5" style={{ borderBottom: "1px solid var(--card-edge)" }}>
      <div className="t-eyebrow" style={{ color: "var(--ink-500)", marginBottom: 8 }}>{title}</div>
      {children}
    </div>
  );
}

export function FilterRail({
  filters, setFilters, clearFilters, activeCount,
}: {
  filters: Filters;
  setFilters: (p: Partial<Filters> & Record<string, unknown>) => void;
  clearFilters: () => void;
  activeCount: number;
}) {
  const toggleTag = (t: string) =>
    setFilters({ tags: filters.tags.includes(t) ? filters.tags.filter((x) => x !== t) : [...filters.tags, t] });

  return (
    <div>
      <div className="flex items-center justify-between pb-1">
        <div className="t-h4" style={{ color: "var(--ink-900)" }}>Filters</div>
        {activeCount > 0 && <button onClick={clearFilters} className="t-body-sm" style={{ color: "var(--moss-700)" }}>Clear all</button>}
      </div>

      <Section title="Category">
        <div className="flex flex-wrap gap-2"><Chip on={!filters.category} onClick={() => setFilters({ category: "" })}>All</Chip></div>
        {CATEGORY_GROUPS.map((g) => (
          <div key={g.key} className="mt-2.5">
            <div className="t-body-xs" style={{ color: "var(--ink-400)", marginBottom: 5, fontWeight: 600 }}>{g.label}</div>
            <div className="flex flex-wrap gap-2">
              {g.categories.map((c) => (
                <Chip key={c} on={filters.category === c} onClick={() => setFilters({ category: c })}>
                  {c.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (m) => m.toUpperCase())}
                </Chip>
              ))}
            </div>
          </div>
        ))}
      </Section>

      <Section title="Distance">
        <div className="flex flex-wrap gap-2">
          {DISTANCE_OPTIONS.map((o) => (
            <Chip key={o.value} on={filters.distance === o.value} onClick={() => setFilters({ distance: o.value, ne_lat: null, ne_lng: null, sw_lat: null, sw_lng: null })}>{o.label}</Chip>
          ))}
        </div>
      </Section>

      <Section title="Price">
        <div className="flex flex-wrap gap-2">
          <Chip on={!filters.priceRange} onClick={() => setFilters({ priceRange: "" })}>Any</Chip>
          {PRICE_RANGES.map((o) => <Chip key={o.value} on={filters.priceRange === o.value} onClick={() => setFilters({ priceRange: o.value })}>{o.label}</Chip>)}
        </div>
      </Section>

      <Section title="Minimum rating">
        <div className="flex flex-wrap gap-2">
          {RATINGS.map(([v, l]) => <Chip key={v} on={filters.minRating === v} onClick={() => setFilters({ minRating: v })}>{l}</Chip>)}
        </div>
      </Section>

      <Section title="Sort by">
        <div className="flex flex-wrap gap-2">
          {SORT_OPTIONS.map((o) => <Chip key={o.value} on={filters.sort === o.value} onClick={() => setFilters({ sort: o.value })}>{o.label}</Chip>)}
        </div>
      </Section>

      <Section title="Amenities">
        <div className="flex flex-wrap gap-2">
          {BUSINESS_TAGS.map((t) => <Chip key={t.value} on={filters.tags.includes(t.value)} onClick={() => toggleTag(t.value)}>{t.label.split(" ")[0]}</Chip>)}
        </div>
      </Section>
    </div>
  );
}
