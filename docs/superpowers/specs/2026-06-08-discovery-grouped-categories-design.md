# Manaakhah — Discovery Redesign (Cycle 1: Unified Discovery + Grouped Categories)

**Date:** 2026-06-08
**Status:** Approved design — ready for implementation planning
**Author:** Farhan + design lead (Claude)

## 1. Background & motivation

A competitor, **taawun.app** ("Buy Muslim. Build Ummah."), launched recently with the same premise as Manaakhah (a directory of halal restaurants + Muslim-owned businesses). A live UX review of Taawun surfaced clear advantages we can learn from:

1. **Unified, discovery-first homepage** — one hero search (*what + where*) + grouped categories + featured listings; a single **Browse** grid. Minimal difference logged-in vs out.
2. **Grouped category taxonomy** — parent groups (Food & Drink, Beauty, Auto, Health, Professional…) instead of a flat list.
3. (Also notable, deferred to a later cycle) an **engagement loop** — points, monthly challenges, log visits, redeem discounts.

Manaakhah today spreads discovery across **three** surfaces — `/` (marketing landing with a "two-paths" fork), `/home` (signed-in home), and `/search` (the Discover tab with map + filters) — and uses a **flat** category list. This redesign consolidates discovery and introduces grouped categories.

Manaakhah remains **ahead** of Taawun on trust depth (certification detail, audit history, the verification Seal, admin queue) and on having complete role-based flows + a mature design system. This cycle must not regress those.

## 2. Goal

Make discovery feel intentional, fast, and cohesive: one discovery-first homepage, one strong Browse page, and a grouped category system — for both signed-out and signed-in consumers — reusing the existing design system.

## 3. Scope

**In scope**
- Unified discovery homepage at `/`.
- Redesigned Browse page at `/search` (grid + filter rail, map on toggle).
- Grouped category taxonomy (`CATEGORY_GROUPS`) driving home tiles + Browse filters.
- The minimal nav/IA changes that unification requires.

**Out of scope (explicitly deferred)**
- **Engagement loop** (points/challenges/visit-logging/redemptions) — next cycle. We only reserve a teaser slot on the home.
- Broader visual/brand refresh beyond what this redesign touches.
- Owner and admin flows; trust-storytelling enhancements.
- Real database / API rework. Stays mock-mode; only `lib/constants.ts` gains the taxonomy.

## 4. Validated decisions

| Decision | Choice |
|---|---|
| Discovery model | **Unify** onto the homepage (Taawun-style), collapsing `/home` + the marketing fork |
| Homepage layout | **A — Search-first**: hero search → grouped category grid → featured/nearby → engagement teaser → for-business band → footer |
| Taxonomy | **9 parent groups** (below), approved |
| Browse layout | **A — Grid + left filter rail**, map on toggle (grid is the default view) |

## 5. Detailed design

### 5.1 Grouped category taxonomy (data)

Add to `lib/constants.ts`, built on the existing `BUSINESS_CATEGORIES`:

```ts
export const CATEGORY_GROUPS = [
  { key: "food",         label: "Food & Drink",          icon: "UtensilsCrossed", categories: ["RESTAURANT","GROCERY","BAKERY","HALAL_FOOD"] },
  { key: "retail",       label: "Shopping & Retail",     icon: "ShoppingBag",     categories: ["JEWELRY","CLOTHING","FLORIST","BOOKS_GIFTS","TAILORING","RETAIL"] },
  { key: "beauty",       label: "Beauty & Grooming",     icon: "Scissors",        categories: ["BARBER_SALON","BEAUTY_SPA"] },
  { key: "health",       label: "Health & Wellness",     icon: "HeartPulse",      categories: ["HEALTH_WELLNESS","FITNESS"] },
  { key: "home",         label: "Home & Trade",          icon: "Wrench",          categories: ["HOME_SERVICES","PLUMBING","ELECTRICAL","HANDYMAN"] },
  { key: "auto",         label: "Auto",                  icon: "Car",             categories: ["AUTO_REPAIR"] },
  { key: "professional", label: "Professional Services", icon: "Briefcase",       categories: ["LEGAL_SERVICES","ACCOUNTING","REAL_ESTATE","EVENTS"] },
  { key: "tech",         label: "Tech & Media",          icon: "Laptop",          categories: ["TECH_SERVICES","PHOTOGRAPHY"] },
  { key: "community",    label: "Community & Education",  icon: "Landmark",        categories: ["MASJID","TUTORING","CHILDCARE","COMMUNITY_AID"] },
] as const;
```

- Icons are Lucide component names (resolved via a small name→component map).
- `OTHER` is a catch-all, **not** shown as a group tile; still selectable under "All categories."
- A helper `groupForCategory(category)` and `categoriesForGroup(key)` support both directions.
- No business-data migration — every business already has a `category`.

### 5.2 Discovery homepage (`/`)

One page for everyone. Top to bottom:

1. **HeroSearch** — headline (keep the repositioned voice) + a *what + where* search: a term input, a location input (prefilled "Sacramento, CA"), and a Search button. Submitting routes to `/search?search=<term>` (+ location handled by existing geolocation/service-area logic). A handful of quick category chips sit below.
2. **CategoryGroupGrid** — the 9 group tiles (icon + label). Tap → `/search?group=<key>`. A "View all categories" control expands the full category list.
3. **FeaturedRow** — a row of real business cards. Signed-in: recently-viewed / "near you"; signed-out: featured + verified. Reuses the restyled search card.
4. **Engagement teaser** — a single band ("Earn points for supporting Muslim businesses — coming soon") reserving the slot for Cycle 2. Static, no logic.
5. **For-businesses band** → `/for-business` (owner acquisition).
6. **SiteFooter** (existing).

**Signed-in vs out:** identical structure; signed-in personalizes the FeaturedRow and shows saved state on cards; guests see the existing "sign up to save & contact" rail. The old two-paths fork is removed from the home (owners are served by the for-business band + nav).

### 5.3 Browse page (`/search`) — grid + filter rail

- **Top bar:** what + where search, active-filter chips (removable), and a **Map** toggle.
- **FilterRail (left, desktop):** persistent rail with sections using `man` components:
  - **Category** — grouped (collapsible parent → subcategories; selecting a parent selects its members).
  - **Distance**, **Price**, **Rating**, **Amenities** (prayer space, sisters-friendly, etc.).
  - On mobile, the rail becomes a slide-over sheet (refactor of the current `FilterSheet`).
- **Main:** responsive **card grid** (reuse the restyled result card).
- **Map:** existing MapLibre map, shown when the Map toggle is on; retains "search this area." Grid is the **default** view.
- **Group filtering:** `/search?group=<key>` expands to the group's member categories; results are filtered to any of those categories (client-side expansion over the mock-fetched set, consistent with the current mock approach). The existing single-`category` param still works.

### 5.4 Nav / IA changes (minimal, required by unification)

- **Logo →** discovery home (`/`).
- The `/` route becomes the **discovery home**; the old "Discover" tab (→ `/search`) is renamed **Browse**; the signed-in **Home** tab now points to `/` (discovery) instead of `/home`.
  - Public nav: **Home · Browse · For businesses · About** + Sign in / Sign up. (`Home` = `/`, `Browse` = `/search`.)
  - Consumer nav: **Home · Browse · Account**.
  - Business owner nav: unchanged (no top-nav tabs; OwnerShell sidebar).
- `/home` (old signed-in home) is retired; its useful pieces fold into the homepage, and `/home` redirects to `/`. Header background (paper-2 tint), sticky behavior, and the avatar menu stay exactly as currently specified.

### 5.5 Components

**Reuse:** result card, MapLibre map, `man` Select/Checkbox/DatePicker, primitives, guest rail, tokens, SiteFooter.

**New / refactored** (each small and single-purpose):
- `HeroSearch` — the what+where hero search; owns the submit→route logic.
- `CategoryGroupGrid` — renders `CATEGORY_GROUPS` tiles + "view all"; links to Browse.
- `FeaturedRow` — fetches and renders a row of business cards (variant: featured vs near-you).
- `FilterRail` — persistent desktop rail + mobile sheet; refactor of `FilterSheet`, adds grouped category section.
- `lib/constants.ts` — `CATEGORY_GROUPS` + helpers.

## 6. Data flow

- Homepage and Browse both read businesses via the existing `db`/mock facade through `/api/businesses` (and the `useMapSearch` hook on Browse).
- Search submit and group tiles set URL params (`search`, `group`, `category`, filters); `useMapSearch` already drives off URL params. Group→categories expansion happens in the Browse page before filtering.
- Default location stays the Sacramento service area (per the prior fix: device location adopted only within ~75 miles), so results always show.

## 7. Verification

- Mock-mode throughout; no real backend.
- Automated **overflow + text-clip audits** (existing scripts) at desktop (1280) and mobile (390) across `/` and `/search`.
- Screenshots of: homepage (hero, group grid, featured), Browse (grid + rail, map toggle, mobile sheet).
- Functional checks: search submit routes correctly; each group tile lands on a filtered Browse with results; grouped category filter returns the right businesses; guest vs signed-in states render.

## 8. Risks / notes

- The location input is UI-forward but functionally limited while data is Sacramento-only; it prefills and feeds the existing service-area logic rather than true multi-city search. Acceptable for this cycle.
- Retiring `/home` must not break links — redirect `/home` → `/` (or update the few internal links).
- Keep the engagement teaser purely static so Cycle 2 can replace it without rework.

## 9. Next cycle (preview, not in scope)

Engagement loop: points, monthly challenges, visit logging, redeemable discounts — the largest differentiator vs Taawun. Separate spec → plan → build.
