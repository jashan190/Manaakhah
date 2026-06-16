# Design P0 — Search Page Polish & Shared Components Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bring the search/results page up to the visual standard of the homepage by extracting shared `BusinessCard`, `EmptyState`, and `Skeleton` components and replacing the page's un-skinned shadcn defaults, emoji, and spinners.

**Architecture:** Add three reusable, token-styled components to the existing `man`/`business` component layer, then refactor `app/search/page.tsx` to consume them. The card is presentational (state stays in the page); loading uses skeletons that mirror the results grid; the no-results state uses a shared `EmptyState` with a lucide icon instead of an emoji.

**Tech Stack:** Next.js (App Router), React, TypeScript (strict), Tailwind CSS, `lucide-react`, the Manaakhah token system in `app/globals.css`.

**Verification model:** This codebase has **no test framework** (no Jest/Vitest, no test script). Adding one is out of scope for P0. Each task is verified by TypeScript typecheck (`npx tsc --noEmit`) + production build (`npm run build`), and the final task is a visual verification pass. Components are written to be pure/presentational so they're easy to reason about without a harness.

**Scope:** This plan covers only the **P0** items from `docs/superpowers/specs/2026-06-16-design-polish-consistency-audit.md` (P0-1 through P0-6). P1/P2 are separate plans.

**Source of truth for current card markup:** `app/search/page.tsx`, function `renderBusinessCard` (~lines 209-329). The new `BusinessCard` is a faithful extraction of that markup, parameterized by `variant`.

---

## File Structure

- **Create** `components/man/Skeleton.tsx` — `Skeleton` base block + `BusinessCardSkeleton` (grid/compact). Loading placeholders. (P0-5)
- **Create** `components/man/EmptyState.tsx` — shared empty state: icon + title + description + optional action. (P0-3, P0-4)
- **Create** `components/business/BusinessCard.tsx` — presentational business card with `variant="grid" | "compact"`. (P0-1)
- **Modify** `app/search/page.tsx` — consume `BusinessCard`, `EmptyState`, `BusinessCardSkeleton`; remove dead `Card`/`CardContent` import; replace `text-muted-foreground`/emoji/spinners. (P0-2, P0-3, P0-5, P0-6)

The `Business` type is imported from `hooks/useMapSearch.ts` (`export interface Business`).

---

## Task 1: Skeleton primitives

**Files:**
- Create: `components/man/Skeleton.tsx`

- [ ] **Step 1: Create the Skeleton component file**

Create `components/man/Skeleton.tsx` with this exact content:

```tsx
import * as React from "react";

/* ── Skeleton: pulsing placeholder block ───────────────────────── */
export function Skeleton({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={`animate-pulse ${className}`}
      style={{ background: "var(--paper-2)", borderRadius: 8, ...style }}
    />
  );
}

/* ── BusinessCardSkeleton: mirrors BusinessCard layout per variant ─ */
export function BusinessCardSkeleton({ variant = "grid" }: { variant?: "grid" | "compact" }) {
  if (variant === "compact") {
    return (
      <div className="flex gap-3 rounded-[12px] p-2.5" style={{ background: "#ffffff", border: "1px solid var(--card-edge)" }}>
        <Skeleton style={{ width: 84, height: 84, borderRadius: 10, flexShrink: 0 }} />
        <div className="flex min-w-0 flex-1 flex-col gap-2 py-1">
          <Skeleton style={{ height: 14, width: "70%" }} />
          <Skeleton style={{ height: 11, width: "45%" }} />
          <Skeleton style={{ height: 11, width: "85%", marginTop: "auto" }} />
        </div>
      </div>
    );
  }
  return (
    <div className="overflow-hidden rounded-[14px]" style={{ background: "#ffffff", border: "1px solid var(--card-edge)" }}>
      <Skeleton style={{ width: "100%", aspectRatio: "16 / 9", borderRadius: 0 }} />
      <div className="flex flex-col gap-2.5" style={{ padding: 16 }}>
        <Skeleton style={{ height: 15, width: "65%" }} />
        <Skeleton style={{ height: 12, width: "40%" }} />
        <Skeleton style={{ height: 12, width: "100%" }} />
        <Skeleton style={{ height: 12, width: "80%" }} />
        <div className="mt-1 flex gap-1.5">
          <Skeleton style={{ height: 18, width: 60, borderRadius: 999 }} />
          <Skeleton style={{ height: 18, width: 72, borderRadius: 999 }} />
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit -p tsconfig.json`
Expected: no errors (ignore any "npm notice" lines).

- [ ] **Step 3: Commit**

```bash
git add components/man/Skeleton.tsx
git commit -m "feat: add Skeleton and BusinessCardSkeleton primitives"
```

---

## Task 2: EmptyState component

**Files:**
- Create: `components/man/EmptyState.tsx`

- [ ] **Step 1: Create the EmptyState component file**

Create `components/man/EmptyState.tsx` with this exact content:

```tsx
import * as React from "react";
import { type LucideIcon } from "lucide-react";

/* ── EmptyState: icon + title + description + optional action ───── */
export function EmptyState({
  Icon,
  title,
  description,
  action,
}: {
  Icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full" style={{ background: "var(--paper-2)" }}>
        <Icon size={24} style={{ color: "var(--ink-400)" }} />
      </span>
      <h3 className="t-h4" style={{ color: "var(--ink-900)", marginTop: 16 }}>{title}</h3>
      {description && (
        <p className="t-body-sm" style={{ color: "var(--ink-500)", marginTop: 6, maxWidth: 360 }}>{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit -p tsconfig.json`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/man/EmptyState.tsx
git commit -m "feat: add shared EmptyState component"
```

---

## Task 3: BusinessCard component

**Files:**
- Create: `components/business/BusinessCard.tsx`

This is a faithful extraction of `renderBusinessCard` from `app/search/page.tsx`, parameterized by `variant`. State (favorites, recently-viewed) stays in the parent; the card receives `isFavorite`, `onToggleFavorite`, and `onView`.

- [ ] **Step 1: Create the BusinessCard component file**

Create `components/business/BusinessCard.tsx` with this exact content:

```tsx
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
              <button onClick={onToggleFavorite} aria-label="Save" className="-mr-0.5 flex-shrink-0">
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

          <button onClick={onToggleFavorite} aria-label="Save"
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
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit -p tsconfig.json`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/business/BusinessCard.tsx
git commit -m "feat: extract shared BusinessCard component"
```

---

## Task 4: Migrate search results to BusinessCard

**Files:**
- Modify: `app/search/page.tsx`

This task swaps the inline `renderBusinessCard` for the new component, removes the dead `Card`/`CardContent` import, fixes the results-count gray (P0-6), and deletes now-unused imports.

- [ ] **Step 1: Add the BusinessCard import**

In `app/search/page.tsx`, find the import of `FilterRail`:

```tsx
import { FilterRail } from "@/components/search/FilterRail";
```

Add immediately after it:

```tsx
import { BusinessCard } from "@/components/business/BusinessCard";
```

- [ ] **Step 2: Remove the dead shadcn Card import**

Find and delete this line (it is imported but never used in JSX):

```tsx
import { Card, CardContent } from "@/components/ui/card";
```

- [ ] **Step 3: Delete the inline `renderBusinessCard` function**

Delete the entire `renderBusinessCard` function — from the line:

```tsx
  // Render business card
  const renderBusinessCard = (business: Business, compact: boolean = false) => {
```

through its closing `};` (the block that ends just before `return (` of the component's main JSX, i.e. the line `    );\n  };` that precedes `  return (\n    <div className="min-h-screen"`). Remove the leading comment line too.

- [ ] **Step 4: Replace the split-view (compact) list mapping**

Find:

```tsx
                      {sortedBusinesses.map((business) => renderBusinessCard(business, true))}
```

Replace with:

```tsx
                      {sortedBusinesses.map((business) => (
                        <BusinessCard
                          key={business.id}
                          business={business}
                          variant="compact"
                          isFavorite={favorites.includes(business.id)}
                          onToggleFavorite={(e) => toggleFavorite(business.id, e)}
                          onView={() => addToRecentlyViewed(business.id)}
                        />
                      ))}
```

- [ ] **Step 5: Replace the grid mapping**

Find:

```tsx
                    {sortedBusinesses.map((business) => renderBusinessCard(business))}
```

Replace with:

```tsx
                    {sortedBusinesses.map((business) => (
                      <BusinessCard
                        key={business.id}
                        business={business}
                        isFavorite={favorites.includes(business.id)}
                        onToggleFavorite={(e) => toggleFavorite(business.id, e)}
                        onView={() => addToRecentlyViewed(business.id)}
                      />
                    ))}
```

- [ ] **Step 6: Fix the results-count gray (P0-6)**

Find:

```tsx
                  <p className="text-muted-foreground">
                    Found <strong>{sortedBusinesses.length}</strong> businesses
                    {userLocation && ` within ${filters.distance} miles`}
                  </p>
```

Replace with:

```tsx
                  <p className="t-body-sm" style={{ color: "var(--ink-500)" }}>
                    Found <strong style={{ color: "var(--ink-900)" }}>{sortedBusinesses.length}</strong> businesses
                    {userLocation && ` within ${filters.distance} miles`}
                  </p>
```

- [ ] **Step 7: Remove now-unused imports**

These symbols were only used by the deleted `renderBusinessCard`. Remove them:

- From the `lucide-react` import on the search page, remove `Heart`, `Star`, and `Store` (keep `Bookmark, MessageCircle, SlidersHorizontal, ChevronDown, X`).
- Remove the `import { Tag } from "@/components/man/primitives";` line.
- From the `@/lib/constants` import, remove `BUSINESS_CATEGORIES`, `BUSINESS_TAGS`, and `PRICE_RANGES` (keep `DISTANCE_OPTIONS`, `SORT_OPTIONS`, `DEFAULT_LOCATION`).

> Note: `strict` is on but `noUnusedLocals` is **not**, so a missed unused import will not fail the build — but remove them for cleanliness. If typecheck/build passes, you're fine.

- [ ] **Step 8: Typecheck**

Run: `npx tsc --noEmit -p tsconfig.json`
Expected: no errors. If you see "Cannot find name 'renderBusinessCard'", you missed a call site — search the file for `renderBusinessCard` and convert it to a `<BusinessCard>` like Steps 4-5.

- [ ] **Step 9: Production build**

Run: `npm run build`
Expected: "✓ Compiled successfully" and all pages generate.

- [ ] **Step 10: Commit**

```bash
git add app/search/page.tsx
git commit -m "refactor: use shared BusinessCard on search; drop dead shadcn Card import"
```

---

## Task 5: Replace search loading & empty states (kill emoji + spinners)

**Files:**
- Modify: `app/search/page.tsx`

- [ ] **Step 1: Add imports for the new states**

After the `BusinessCard` import added in Task 4, add:

```tsx
import { BusinessCardSkeleton } from "@/components/man/Skeleton";
import { EmptyState } from "@/components/man/EmptyState";
```

Then add `Search` to the existing `lucide-react` import on the search page (it is used for the empty-state icon). The import should include `Search` alongside the others, e.g. `import { Bookmark, MessageCircle, SlidersHorizontal, ChevronDown, X, Search } from "lucide-react";`.

- [ ] **Step 2: Replace the results loading spinner with skeletons**

Find:

```tsx
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Finding businesses near you...</p>
              </div>
            ) : sortedBusinesses.length === 0 ? (
```

Replace with:

```tsx
            {isLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <BusinessCardSkeleton key={i} />
                ))}
              </div>
            ) : sortedBusinesses.length === 0 ? (
```

- [ ] **Step 3: Replace the emoji empty state with EmptyState (P0-3)**

Find:

```tsx
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <p className="text-muted-foreground mb-4">No businesses found</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Try adjusting your search filters or expanding your search radius
                </p>
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
```

Replace with:

```tsx
              <EmptyState
                Icon={Search}
                title="No businesses found"
                description="Try adjusting your search filters or expanding your search radius."
                action={
                  <Button variant="outline" onClick={clearFilters}>
                    Clear Filters
                  </Button>
                }
              />
```

- [ ] **Step 4: Replace the Suspense fallback spinner with skeletons**

Find the `SearchPage` default export fallback:

```tsx
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--moss-700)] mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading search...</p>
        </div>
      </div>
    }>
```

Replace with:

```tsx
    <Suspense fallback={
      <div className="min-h-screen" style={{ background: "var(--paper)" }}>
        <div className="container mx-auto max-w-6xl py-8 px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <BusinessCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    }>
```

> Note: `BusinessCardSkeleton` and the import added in Step 1 are module-scope, so they're usable in the `SearchPage` export as well as `SearchContent`.

- [ ] **Step 5: Replace the map loading placeholder spinner text**

Find the dynamic-import loading placeholder near the top of the file:

```tsx
  loading: () => (
    <div className="h-[600px] rounded-lg flex items-center justify-center" style={{ background: "var(--paper-2)" }}>
      <p className="text-muted-foreground">Loading map...</p>
    </div>
  ),
```

Replace with:

```tsx
  loading: () => (
    <div className="h-[600px] rounded-lg flex items-center justify-center" style={{ background: "var(--paper-2)" }}>
      <p className="t-body-sm" style={{ color: "var(--ink-500)" }}>Loading map…</p>
    </div>
  ),
```

- [ ] **Step 6: Typecheck**

Run: `npx tsc --noEmit -p tsconfig.json`
Expected: no errors.

- [ ] **Step 7: Verify no stray emoji/spinner/muted-foreground remain on the page**

Run: `grep -nE "🔍|animate-spin|text-muted-foreground|text-6xl" app/search/page.tsx`
Expected: **no output** (all replaced).

- [ ] **Step 8: Production build**

Run: `npm run build`
Expected: "✓ Compiled successfully" and all pages generate.

- [ ] **Step 9: Commit**

```bash
git add app/search/page.tsx
git commit -m "refactor: skeleton loaders + EmptyState on search; remove emoji and spinners"
```

---

## Task 6: Visual verification

**Files:** none (verification only)

- [ ] **Step 1: Start the dev server**

Run: `npm run dev`
Open `http://localhost:3000/search`.

- [ ] **Step 2: Verify the result grid**

Confirm: business cards render identically to before (image, favorite heart, price badge, name, rating, category, description, tags). Toggling the heart still works. Clicking a card navigates to `/business/[id]`.

- [ ] **Step 3: Verify the split view**

Switch the view toggle to "split". Confirm the compact rows render correctly beside the map and the map still loads.

- [ ] **Step 4: Verify the empty state**

Apply a filter that yields zero results (e.g. a nonsense search term). Confirm the empty state shows a **Search icon** (not the 🔍 emoji), the title/description, and a working "Clear Filters" button.

- [ ] **Step 5: Verify loading skeletons**

Reload `/search` and watch the initial load — confirm skeleton cards appear (pulsing placeholders in the grid shape) instead of a spinner.

- [ ] **Step 6: Confirm visual consistency**

Compare the search page side by side with the homepage (`/`). Confirm the cards, grays, and spacing now read as the same design language.

- [ ] **Step 7: Stop the dev server** (Ctrl-C).

---

## Self-Review Notes

- **Spec coverage:** P0-1 (BusinessCard, Task 3) ✓; P0-2 (migrate search off shadcn, Task 4) ✓; P0-3 (kill emoji, Task 5 Step 3) ✓; P0-4 (EmptyState, Task 2) ✓; P0-5 (skeletons, Tasks 1 + 5) ✓; P0-6 (one color vocabulary, Task 4 Step 6 + Task 5 replacements + grep gate Task 5 Step 7) ✓.
- **Out of scope (P1/P2):** the hero vs. search input divergence, the app-wide spacing scale, button radius, and the remaining-pages sweep are intentionally deferred to later plans.
- **Type consistency:** `BusinessCard` props (`business`, `variant`, `isFavorite`, `onToggleFavorite`, `onView`) are used identically at all three call sites; `Business` is imported from `hooks/useMapSearch`; `BusinessCardSkeleton` `variant` matches `BusinessCard` `variant` ("grid" | "compact").
