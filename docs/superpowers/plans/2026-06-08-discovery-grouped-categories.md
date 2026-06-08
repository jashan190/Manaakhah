# Discovery Redesign (Cycle 1) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Unify discovery onto a search-first homepage, rebuild the Browse page as a grid + filter rail (map on toggle), and introduce a 9-group category taxonomy — reusing the existing design system.

**Architecture:** Next.js 16 App Router, mock-mode data (`USE_MOCK_DATA=true`) via the `db` facade + `/api/businesses`. New presentational components in `components/man/` and `components/home/`; taxonomy data in `lib/category-groups.ts`. URL params drive discovery (`search`, `group`, `category`, filters) through the existing `useMapSearch` hook.

**Tech Stack:** TypeScript, React, Tailwind + CSS-variable tokens, Lucide icons, MapLibre (existing), Puppeteer (verification only).

**Spec:** `docs/superpowers/specs/2026-06-08-discovery-grouped-categories-design.md`

---

## Conventions for this plan

- **No unit-test runner exists** in this repo. The verification gate for each task is the project's established pattern: dev server on **http://localhost:3000** (mock mode), `curl` for HTTP 200, and Puppeteer for render checks/screenshots. Where a step says "verify," run the given command and confirm the stated expected output.
- **Dev server:** assume `npm run dev` is already running on port 3000. If not, start it first (`npm run dev`) and wait for "Ready".
- **Commit cadence:** one commit per task, on branch `redesign/discovery-grouped-categories`.
- **Reused components (do not recreate):** result card logic in `app/search/page.tsx` (`renderBusinessCard`), `components/map/MapLibreMap`, `components/man/Select.tsx`, `components/man/Choice.tsx`, `components/man/primitives.tsx`, `components/search/FilterSheet.tsx`, `components/site-footer.tsx`.

## File structure (created / modified)

| File | Responsibility |
|---|---|
| `lib/category-groups.ts` (create) | The 9-group taxonomy + helpers (`categoriesForGroup`, `groupForCategory`) |
| `components/home/CategoryGroupGrid.tsx` (create) | Renders the 9 group tiles → link to Browse |
| `components/home/HeroSearch.tsx` (create) | What+where hero search; routes to `/search` |
| `components/home/FeaturedRow.tsx` (create) | Row of business cards (featured / near-you) |
| `app/page.tsx` (rewrite) | Discovery homepage assembling the above |
| `app/home/page.tsx` (replace) | Redirect `/home` → `/` |
| `components/header.tsx` (modify) | Nav: Home·Browse·Account; rename Discover→Browse; logo→`/` |
| `components/search/FilterRail.tsx` (create) | Persistent desktop filter rail + mobile sheet, grouped categories |
| `app/search/page.tsx` (modify) | Grid default, FilterRail, map toggle, `?group=` support |

---

## Task 1: Category-group taxonomy + helpers

**Files:**
- Create: `lib/category-groups.ts`

- [ ] **Step 1: Create the taxonomy module**

```ts
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
```

- [ ] **Step 2: Verify it type-checks and every category is mapped**

Run:
```bash
cd /Users/farhan/Developer/Manaakhah && node -e "
const ts=require('fs').readFileSync('lib/constants.ts','utf8');
const cats=[...ts.matchAll(/value: '([A-Z_]+)'/g)].map(m=>m[1]).filter(c=>c!=='OTHER');
const grp=require('fs').readFileSync('lib/category-groups.ts','utf8');
const mapped=[...grp.matchAll(/\"([A-Z_]+)\"/g)].map(m=>m[1]);
const missing=cats.filter(c=>!mapped.includes(c));
console.log('unmapped (excluding OTHER):', missing.length? missing : 'NONE');
"
```
Expected: `unmapped (excluding OTHER): NONE`

- [ ] **Step 3: Commit**

```bash
git add lib/category-groups.ts
git commit -m "feat(discovery): add grouped category taxonomy + helpers"
```

---

## Task 2: CategoryGroupGrid component

**Files:**
- Create: `components/home/CategoryGroupGrid.tsx`

- [ ] **Step 1: Create the component**

```tsx
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
      <PH title="Browse by category" sub="Find Muslim-owned businesses across Sacramento" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-3">
        {CATEGORY_GROUPS.map((g) => {
          const Icon = ICONS[g.icon] ?? Briefcase;
          return (
            <Link key={g.key} href={`/search?group=${g.key}`}>
              <ManCard style={{ padding: 18 }} className="flex h-full items-center gap-3.5 transition-shadow hover:shadow-[var(--shadow-lift)]">
                <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl" style={{ background: "var(--moss-50)" }}>
                  <Icon size={20} style={{ color: "var(--moss-700)" }} />
                </span>
                <div className="flex-1">
                  <div className="t-label" style={{ color: "var(--ink-900)" }}>{g.label}</div>
                  <div className="t-body-xs" style={{ color: "var(--ink-500)", marginTop: 2 }}>{g.categories.length} categories</div>
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
```

- [ ] **Step 2: Commit (verified on the homepage in Task 5)**

```bash
git add components/home/CategoryGroupGrid.tsx
git commit -m "feat(discovery): CategoryGroupGrid (9 group tiles + view-all)"
```

---

## Task 3: HeroSearch component

**Files:**
- Create: `components/home/HeroSearch.tsx`

- [ ] **Step 1: Create the component**

```tsx
// components/home/HeroSearch.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tag } from "@/components/man/primitives";
import { Search, MapPin } from "lucide-react";
import { CATEGORY_GROUPS } from "@/lib/category-groups";

export function HeroSearch() {
  const router = useRouter();
  const [term, setTerm] = useState("");
  const [where, setWhere] = useState("Sacramento, CA");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (term.trim()) params.set("search", term.trim());
    router.push(`/search${params.toString() ? `?${params}` : ""}`);
  };

  return (
    <section style={{ background: "linear-gradient(180deg, var(--paper) 0%, var(--paper) 55%, var(--moss-50) 100%)" }}>
      <div className="mx-auto max-w-[860px] px-6 py-16 text-center md:py-20">
        <Tag tone="moss">Sacramento&apos;s Muslim business directory</Tag>
        <h1 className="t-display" style={{ color: "var(--ink-900)", marginTop: 18 }}>
          Discover &amp; support<br className="hidden sm:block" /> <span style={{ fontStyle: "italic" }}>Muslim businesses</span>
        </h1>
        <p className="t-body-lg" style={{ color: "var(--ink-500)", margin: "16px auto 0", maxWidth: 560 }}>
          Find restaurants, grocers, salons, services and more — owned by your community, trusted by your community.
        </p>

        <form onSubmit={submit} className="mx-auto mt-7 flex max-w-[680px] flex-col gap-2 rounded-[14px] border bg-white p-2 shadow-[var(--shadow-lift)] sm:flex-row" style={{ borderColor: "var(--card-edge)" }}>
          <div className="flex flex-1 items-center gap-2 px-3">
            <Search size={18} style={{ color: "var(--ink-400)" }} />
            <input value={term} onChange={(e) => setTerm(e.target.value)} placeholder="Search businesses, e.g. kabob, jeweler"
              className="w-full bg-transparent py-2.5 t-body outline-none" style={{ color: "var(--ink-900)" }} />
          </div>
          <div className="flex items-center gap-2 px-3 sm:w-52" style={{ borderLeft: "1px solid var(--card-edge)" }}>
            <MapPin size={18} style={{ color: "var(--ink-400)" }} />
            <input value={where} onChange={(e) => setWhere(e.target.value)} placeholder="Location"
              className="w-full bg-transparent py-2.5 t-body outline-none" style={{ color: "var(--ink-900)" }} />
          </div>
          <Button type="submit" size="lg">Search</Button>
        </form>

        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {CATEGORY_GROUPS.slice(0, 6).map((g) => (
            <Link key={g.key} href={`/search?group=${g.key}`}
              className="rounded-full px-3 py-1.5 t-body-sm" style={{ background: "var(--card)", border: "1px solid var(--card-edge)", color: "var(--ink-700)" }}>
              {g.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
```

> Note: the `where` field is UI-forward; with Sacramento-only mock data the actual centering uses the existing service-area logic on `/search`. Do not wire `where` into the query for this cycle.

- [ ] **Step 2: Commit**

```bash
git add components/home/HeroSearch.tsx
git commit -m "feat(discovery): HeroSearch (what+where) routing to Browse"
```

---

## Task 4: FeaturedRow component

**Files:**
- Create: `components/home/FeaturedRow.tsx`

- [ ] **Step 1: Create the component**

```tsx
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
```

- [ ] **Step 2: Commit**

```bash
git add components/home/FeaturedRow.tsx
git commit -m "feat(discovery): FeaturedRow of nearby verified businesses"
```

---

## Task 5: Rebuild the discovery homepage

**Files:**
- Modify (rewrite): `app/page.tsx`

- [ ] **Step 1: Replace `app/page.tsx` with the discovery home**

```tsx
// app/page.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ManCard } from "@/components/man/primitives";
import { HeroSearch } from "@/components/home/HeroSearch";
import { CategoryGroupGrid } from "@/components/home/CategoryGroupGrid";
import { FeaturedRow } from "@/components/home/FeaturedRow";
import { SiteFooter } from "@/components/site-footer";
import { Sparkles, Store } from "lucide-react";

export default function Home() {
  return (
    <div style={{ background: "var(--paper)" }}>
      <HeroSearch />
      <CategoryGroupGrid />
      <FeaturedRow />

      {/* Engagement teaser — reserves the slot for Cycle 2 (static, no logic) */}
      <section className="mx-auto max-w-[1200px] px-6 pb-4">
        <ManCard style={{ padding: 24, background: "var(--clay-50)", border: "1px solid var(--clay-100)" }} className="flex flex-wrap items-center gap-4">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: "var(--clay-100)" }}>
            <Sparkles size={20} style={{ color: "var(--clay-700)" }} />
          </span>
          <div className="flex-1">
            <div className="t-h4" style={{ color: "var(--ink-900)" }}>Earn points for supporting Muslim businesses</div>
            <div className="t-body-sm" style={{ color: "var(--ink-700)", marginTop: 2 }}>Challenges, visit rewards and community perks — coming soon.</div>
          </div>
          <Tagish />
        </ManCard>
      </section>

      {/* For businesses */}
      <section style={{ background: "var(--moss-700)", color: "var(--bone)" }} className="mt-8">
        <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-4 px-6 py-12 text-center">
          <Store size={26} />
          <h2 className="t-h2" style={{ color: "var(--bone)" }}>Own a Muslim business?</h2>
          <p style={{ opacity: 0.85, fontSize: 15, maxWidth: 520 }}>Get found by the community — claim your listing, get verified, and grow.</p>
          <Link href="/for-business"><Button size="lg" style={{ background: "var(--bone)", color: "var(--moss-800)" }}>List your business</Button></Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function Tagish() {
  return <span className="rounded-full px-3 py-1 t-body-xs" style={{ background: "var(--clay-100)", color: "var(--clay-700)", fontWeight: 600 }}>Coming soon</span>;
}
```

- [ ] **Step 2: Verify the homepage renders (HTTP 200 + key sections present)**

Run:
```bash
cd /Users/farhan/Developer/Manaakhah
echo "status: $(curl -s -o /dev/null -w '%{http_code}' http://localhost:3000/)"
curl -s http://localhost:3000/ | grep -oE "Discover|Browse by category|Featured near you|List your business" | sort -u
```
Expected: `status: 200` and all four strings present.

- [ ] **Step 3: Screenshot check (no console errors)**

Run (write `./_v.js`, run, delete):
```bash
cd /Users/farhan/Developer/Manaakhah && cat > ./_v.js <<'EOF'
const p=require('puppeteer');(async()=>{const b=await p.launch();const pg=await b.newPage();
const err=[];pg.on('pageerror',e=>err.push(e.message.slice(0,100)));
await pg.setViewport({width:1280,height:1000});
await pg.goto("http://localhost:3000/",{waitUntil:"networkidle2",timeout:30000});
await new Promise(s=>setTimeout(s,1500));
await pg.screenshot({path:"/tmp/home_new.png",fullPage:true});
console.log("pageerrors:",err.length?err:"none");await b.close();})();
EOF
node ./_v.js; rm -f ./_v.js
```
Expected: `pageerrors: none`. Open `/tmp/home_new.png` and confirm: hero search, the 9 group tiles, featured row, the "coming soon" engagement teaser, and the moss "List your business" band.

- [ ] **Step 4: Commit**

```bash
git add app/page.tsx
git commit -m "feat(discovery): rebuild homepage as unified discovery surface"
```

---

## Task 6: Retire `/home` (redirect → `/`) and fix internal links

**Files:**
- Modify (replace): `app/home/page.tsx`
- Modify: `app/login/page.tsx`, `app/register/page.tsx` (consumer redirect targets)

- [ ] **Step 1: Replace `/home` with a server redirect**

```tsx
// app/home/page.tsx
import { redirect } from "next/navigation";

export default function HomeRedirect() {
  redirect("/");
}
```

- [ ] **Step 2: Point consumer auth redirects at `/` instead of `/home`**

In `app/login/page.tsx`, the mock-mode branch routes consumers to `/home`. Change that target to `/`:

```tsx
// app/login/page.tsx — inside the mock-mode branch
window.location.href =
  target === "ADMIN" ? "/admin" : target === "BUSINESS_OWNER" ? "/dashboard" : "/";
```

In `app/register/page.tsx`, the mock-mode branch routes consumers to `/home`. Change it:

```tsx
// app/register/page.tsx — inside the mock-mode branch
window.location.href = formData.role === "BUSINESS_OWNER" ? "/business" : "/";
```

- [ ] **Step 3: Find any remaining `/home` references and update to `/`**

Run:
```bash
cd /Users/farhan/Developer/Manaakhah && grep -rn '"/home"' app components | grep -v "app/home/page.tsx"
```
Expected: no results (empty). If any appear, change those `href`/redirect targets to `"/"`.

- [ ] **Step 4: Verify redirect works**

Run:
```bash
echo "/home -> $(curl -s -o /dev/null -w '%{http_code} -> %{redirect_url}' -L http://localhost:3000/home)"
```
Expected: resolves to `200` at `http://localhost:3000/` (the discovery home).

- [ ] **Step 5: Commit**

```bash
git add app/home/page.tsx app/login/page.tsx app/register/page.tsx
git commit -m "refactor(discovery): retire /home, redirect to unified home"
```

---

## Task 7: Header nav — Home·Browse·Account; logo → `/`

**Files:**
- Modify: `components/header.tsx`

- [ ] **Step 1: Update the tab arrays**

Replace the `SIGNED_OUT` and `CONSUMER` arrays (keep `BUSINESS` empty as-is):

```tsx
const SIGNED_OUT: Tab[] = [
  { l: "Home", href: "/" },
  { l: "Browse", href: "/search" },
  { l: "For businesses", href: "/for-business" },
  { l: "About", href: "/about" },
];
const CONSUMER: Tab[] = [
  { l: "Home", href: "/" },
  { l: "Browse", href: "/search" },
  { l: "Account", href: "/account" },
];
```

- [ ] **Step 2: Point the logo at `/` for everyone**

Find the logo `Link` (currently `href={signedIn ? (role === "BUSINESS_OWNER" ? "/dashboard" : "/home") : "/"}`) and change the consumer target from `/home` to `/`:

```tsx
<Link href={signedIn && role === "BUSINESS_OWNER" ? "/dashboard" : "/"} className="t-h4" style={{ color: "var(--moss-700)", fontWeight: 600 }}>
  Manaakhah
</Link>
```

- [ ] **Step 3: Fix `isActive` so "Home" (`/`) isn't always active**

The existing `isActive` already special-cases `/` (`href === "/" ? pathname === "/" : pathname.startsWith(href)`). Confirm it's unchanged so `Home` highlights only on `/` and `Browse` highlights on `/search`.

- [ ] **Step 4: Verify nav for signed-out and consumer**

Run (write `./_nav.js`, run, delete):
```bash
cd /Users/farhan/Developer/Manaakhah && cat > ./_nav.js <<'EOF'
const p=require('puppeteer');(async()=>{const b=await p.launch();const pg=await b.newPage();
await pg.goto("http://localhost:3000/",{waitUntil:"domcontentloaded"});await new Promise(s=>setTimeout(s,500));
console.log("signed-out:",await pg.evaluate(()=>[...document.querySelectorAll('header nav a')].map(a=>a.textContent.trim()+'→'+a.getAttribute('href')).join(' | ')));
await pg.goto("http://localhost:3000/login",{waitUntil:"domcontentloaded"});await new Promise(s=>setTimeout(s,400));
await pg.type('#email','a@b.com');await pg.type('#password','password');
await Promise.all([pg.waitForNavigation({waitUntil:"domcontentloaded"}).catch(()=>{}),pg.evaluate(()=>document.querySelector('form').requestSubmit())]);
await new Promise(s=>setTimeout(s,800));
console.log("consumer:",await pg.evaluate(()=>[...document.querySelectorAll('header nav a')].map(a=>a.textContent.trim()+'→'+a.getAttribute('href')).join(' | ')));
await b.close();})();
EOF
node ./_nav.js; rm -f ./_nav.js
```
Expected: `signed-out: Home→/ | Browse→/search | For businesses→/for-business | About→/about` and `consumer: Home→/ | Browse→/search | Account→/account`.

- [ ] **Step 5: Commit**

```bash
git add components/header.tsx
git commit -m "refactor(nav): Home/Browse/Account, logo to unified home"
```

---

## Task 8: FilterRail (grouped filters — rail + reused in mobile sheet)

**Files:**
- Create: `components/search/FilterRail.tsx`
- Modify: `components/search/FilterSheet.tsx` (render `FilterRail` inside its slide-over, so mobile + desktop share one source of filter sections)

- [ ] **Step 1: Create `FilterRail` with a grouped Category section**

```tsx
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
```

- [ ] **Step 2: Make the mobile `FilterSheet` reuse `FilterRail`**

Replace the body of the sheet panel in `components/search/FilterSheet.tsx` so it renders `<FilterRail .../>` (keep the existing scrim, slide-over container, header, and the "Show N results" footer). Concretely, inside the `<aside>` panel, replace the hand-written `<Section>` blocks with:

```tsx
import { FilterRail } from "@/components/search/FilterRail";
// ...inside the scrolling panel body:
<div className="flex-1 overflow-auto px-5">
  <FilterRail filters={filters} setFilters={setFilters} clearFilters={clearFilters} activeCount={activeCount} />
</div>
```
Leave the footer `Show {resultCount} results` button as-is.

- [ ] **Step 3: Commit (verified in Task 9 on the Browse page)**

```bash
git add components/search/FilterRail.tsx components/search/FilterSheet.tsx
git commit -m "feat(browse): grouped FilterRail, shared by desktop rail + mobile sheet"
```

---

## Task 9: Browse page — grid default, filter rail, group param

**Files:**
- Modify: `app/search/page.tsx`

- [ ] **Step 1: Imports + read the `group` param**

At the top of `SearchContent` (it already calls `useMapSearch`), add imports and read `group` from the URL. The file already imports `useSearchParams`-equivalent via the hook, but read it directly here:

```tsx
import { useSearchParams } from "next/navigation"; // add if not present
import { FilterRail } from "@/components/search/FilterRail";
import { categoriesForGroup } from "@/lib/category-groups";
// inside SearchContent:
const searchParams = useSearchParams();
const groupKey = searchParams.get("group") || "";
```

- [ ] **Step 2: Default to the grid view**

Change the view-mode initial state:

```tsx
const [viewMode, setViewMode] = useState<ViewMode>("list"); // was "split"
```

- [ ] **Step 3: Apply the group filter inside `sortedBusinesses`**

In the `sortedBusinesses` `useMemo`, filter by the group's categories before returning:

```tsx
const sortedBusinesses = useMemo(() => {
  let sorted = [...businesses];
  if (filters.sort === "rating") sorted.sort((a, b) => b.averageRating - a.averageRating);
  else if (filters.sort === "reviews") sorted.sort((a, b) => b.reviewCount - a.reviewCount);
  if (groupKey) {
    const cats = categoriesForGroup(groupKey);
    sorted = sorted.filter((b) => cats.includes(b.category as any));
  }
  return sorted;
}, [businesses, filters.sort, groupKey]);
```

- [ ] **Step 4: Add the desktop filter rail beside the results**

Wrap the results area in a 2-column grid on large screens. Find the results container (`<div className="container mx-auto max-w-6xl py-8 px-4">`) and restructure its inner content so the cards sit in the right column and a sticky `FilterRail` sits on the left (desktop only). Keep the existing mobile `FilterSheet` (Filters button) for small screens:

```tsx
<div className="container mx-auto max-w-6xl py-8 px-4">
  {/* guest rail stays here, full width */}
  <div className="lg:grid lg:grid-cols-[250px_1fr] lg:gap-6">
    <aside className="hidden lg:block">
      <div className="sticky top-[88px] max-h-[calc(100vh-110px)] overflow-auto rounded-[14px] border p-4"
        style={{ background: "var(--card)", borderColor: "var(--card-edge)" }}>
        <FilterRail filters={filters} setFilters={setFilters} clearFilters={clearFilters} activeCount={activeFilterCount} />
      </div>
    </aside>
    <div>
      {/* existing results block: count + ViewToggle + list/grid/map */}
    </div>
  </div>
</div>
```
The existing `loading / empty / results` block moves into the right `<div>`. The map toggle (`ViewToggle`) stays; with default `list`, the grid shows full-width within the right column and `map` shows the map.

- [ ] **Step 5: Verify Browse — grid default, group filter, rail present, no errors**

Run (write `./_b.js`, run, delete):
```bash
cd /Users/farhan/Developer/Manaakhah && cat > ./_b.js <<'EOF'
const p=require('puppeteer');(async()=>{const b=await p.launch({protocolTimeout:60000});const pg=await b.newPage();
const err=[];pg.on('pageerror',e=>err.push(e.message.slice(0,100)));
await pg.setViewport({width:1280,height:1000});
// group route returns filtered results
await pg.goto("http://localhost:3000/search?group=beauty",{waitUntil:"domcontentloaded"});await new Promise(s=>setTimeout(s,2800));
const r=await pg.evaluate(()=>{const t=document.body.innerText;return {found:(t.match(/Found\s+\d+\s+businesses/)||[])[0],rail:!!document.body.innerText.match(/Filters/)};});
console.log("group=beauty:",JSON.stringify(r),"| errors:",err.length?err:"none");
await b.close();})();
EOF
node ./_b.js; rm -f ./_b.js
echo "status: $(curl -s -o /dev/null -w '%{http_code}' 'http://localhost:3000/search?group=food')"
```
Expected: a "Found N businesses" count (N>0), `rail:true`, `errors: none`, and `status: 200`.

- [ ] **Step 6: Commit**

```bash
git add app/search/page.tsx
git commit -m "feat(browse): grid default + filter rail + group-param filtering"
```

---

## Task 10: Final verification pass

**Files:** none (verification only)

- [ ] **Step 1: Overflow + text-clip audit on the changed routes**

Run (write `./_audit.js`, run, delete):
```bash
cd /Users/farhan/Developer/Manaakhah && cat > ./_audit.js <<'EOF'
const p=require('puppeteer');const routes=["/","/search","/search?group=food","/search?group=professional"];
(async()=>{const b=await p.launch({protocolTimeout:60000});const pg=await b.newPage();
for(const w of [390,1280]){await pg.setViewport({width:w,height:900});
 for(const r of routes){await pg.goto("http://localhost:3000"+r,{waitUntil:"domcontentloaded"});await new Promise(s=>setTimeout(s,1500));
  const over=await pg.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
  if(over>1)console.log(`OVERFLOW ${w} ${r}: +${over}px`);}}
console.log("audit done");await b.close();})();
EOF
node ./_audit.js; rm -f ./_audit.js
```
Expected: only `audit done` (no `OVERFLOW` lines).

- [ ] **Step 2: Screenshot home + browse (desktop & mobile) for eyeball review**

Run (write `./_shots.js`, run, delete):
```bash
cd /Users/farhan/Developer/Manaakhah && cat > ./_shots.js <<'EOF'
const p=require('puppeteer');(async()=>{const b=await p.launch({protocolTimeout:60000});const pg=await b.newPage();
for(const[w,tag] of [[1280,"d"],[390,"m"]]){await pg.setViewport({width:w,height:1000});
 await pg.goto("http://localhost:3000/",{waitUntil:"networkidle2",timeout:30000});await new Promise(s=>setTimeout(s,1500));
 await pg.screenshot({path:`/tmp/final_home_${tag}.png`,fullPage:true});
 await pg.goto("http://localhost:3000/search?group=food",{waitUntil:"domcontentloaded"});await new Promise(s=>setTimeout(s,2500));
 await pg.screenshot({path:`/tmp/final_browse_${tag}.png`});}
console.log("shots done");await b.close();})();
EOF
node ./_shots.js; rm -f ./_shots.js
```
Expected: `shots done`. Open the four `/tmp/final_*.png` files; confirm the homepage (hero search, group grid, featured, teaser, for-business) and Browse (grid + left rail desktop, results on mobile) look correct.

- [ ] **Step 3: Final commit (if any audit tweaks were needed)**

```bash
git add -A && git commit -m "fix(discovery): polish from final verification pass" || echo "nothing to commit"
```

---

## Self-review (completed during planning)

**Spec coverage:** §5.1 taxonomy → Task 1; §5.2 homepage → Tasks 2–5; §5.3 Browse → Tasks 8–9; §5.4 nav/IA + `/home` retire → Tasks 6–7; §5.5 components → Tasks 2,3,4,8; §6 data flow (URL params, group expansion, service-area location) → Tasks 3,9; §7 verification → Tasks 5,9,10; engagement teaser slot (deferred loop) → Task 5. No spec requirement is left without a task.

**Placeholder scan:** every code step contains complete code; verification steps contain runnable commands with expected output. No TBD/TODO.

**Type consistency:** `CATEGORY_GROUPS` shape + `categoriesForGroup`/`groupForCategory` defined in Task 1 are used consistently in Tasks 2 (grid), 8 (rail), 9 (group filter). `FilterRail` prop names (`filters`, `setFilters`, `clearFilters`, `activeCount`) match between Task 8 (definition) and Tasks 8-Step-2 + 9 (usages). Nav `Tab[]` shape matches the existing header type.

**Known adaptation:** verification uses curl + Puppeteer (no unit-test runner in repo), per "follow established patterns."
