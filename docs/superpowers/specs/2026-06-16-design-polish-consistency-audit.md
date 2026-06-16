# Manaakhah Design Audit — Polish & Consistency

**Date:** 2026-06-16
**Goal:** Diagnose why Manaakhah reads as "vibe-coded" compared to Fiverr/Upwork, and produce a prioritized, approvable list of fixes.
**Primary outcome chosen:** Polish & consistency (make it feel professionally built), not a brand-identity overhaul.
**Scope:** All surfaces — consumer, owner dashboard, admin console.

---

## 1. Executive summary

Manaakhah's design *system* is good. The token set (moss/clay/paper palette, Fraunces + Hanken Grotesk type, the `t-*` scale in `app/globals.css`), the `components/man/primitives.tsx` library, and the owner/admin shells are distinctive and intentional. Many pages — the homepage, About, business profile, the owner and admin shells — speak that language fluently and look bespoke.

The "vibe-coded" feeling does **not** come from a weak design. It comes from **inconsistency**: two design languages collide across the app. Some pages speak fluent "Manaakhah" (`ManCard`, `Tag`, `Rating`, `t-*` typography, raw `var(--*)` tokens). Others — the **search/results page above all** — fall back to generic, un-skinned shadcn + Tailwind defaults (`Card`, `text-muted-foreground`, emoji, spinners). When a user crosses from a polished page into a default-looking one, the eye reads "unfinished." That gap is the tell.

Fiverr and Upwork do not feel vibe-coded because they are *unique* — they feel solid because **every screen speaks one visual language with rigid discipline**. The work here is to bring that same discipline to Manaakhah: unify on one component layer, enforce a spacing scale, replace placeholder UI patterns (emoji, spinners) with real ones, and standardize the color/radius vocabulary — while keeping the good system intact.

---

## 2. What Fiverr/Upwork do that Manaakhah doesn't

These are the *principles* behind their "professionally built" feel — not visual style, but discipline:

1. **One component layer.** A button is the same button everywhere; a card is the same card everywhere. There is never a second, almost-identical version on the next page.
2. **A strict spacing grid.** Spacing comes from a fixed scale (typically 4/8px increments). Padding and gaps are predictable, so vertical rhythm is consistent screen to screen.
3. **No emoji as iconography.** A single, consistent icon set is used everywhere. Emoji never appear as UI elements.
4. **Skeleton loaders, not spinners.** Loading states mirror the shape of the content that's coming, rather than a generic spinning circle.
5. **Restraint and repetition.** A small number of patterns (one card, one list row, one empty state, one section header) repeated everywhere, rather than each page inventing its own treatment.
6. **One color vocabulary.** Grays, borders, and surfaces are drawn from a single named set — never two near-identical grays from two different systems on the same screen.

Manaakhah already has the raw materials for all six. They're just applied unevenly.

---

## 3. The tells, with examples

Each item below is a concrete, located instance of one of the principles being broken.

### 3.1 Two component vocabularies
`app/search/page.tsx` imports shadcn `Card`, `CardContent` (line 19) and `Input` (line 17), and then hand-rolls the business card as a raw `<div>` with inline styles **three separate times** (compact row ~line 221, grid card ~line 265, plus the map thumbnail). Meanwhile the homepage and business profile use `ManCard` from `components/man/primitives.tsx`. Result: subtly different cards on adjacent pages, and a business card that exists in three slightly different hand-built forms instead of one shared component.

### 3.2 Emoji as UI
`app/search/page.tsx:416` — the empty state renders `<div className="text-6xl mb-4">🔍</div>`. This is the single clearest "AI-generated" giveaway. `lucide-react` is already imported in the same file, so a real icon is one line away.

### 3.3 Generic spinners instead of skeletons
`app/search/page.tsx:411` (results loading) and `:490` (Suspense fallback) use the classic `animate-spin rounded-full … border-b-2 border-primary` Tailwind spinner with copy like "Finding businesses near you…". The map placeholder (`:11-15`) does the same with "Loading map...". Polished apps render skeleton cards in the results grid shape instead.

### 3.4 Two grays that don't match
The search page uses shadcn semantic classes — `text-muted-foreground` (lines 412, 417, 428), `border-primary`, `bg-white` — while the rest of the app uses raw tokens (`var(--ink-500)`, `#ffffff`). `text-muted-foreground` maps to `--muted-foreground` (`ink-500` at 40% in HSL), which is close to but not identical to `var(--ink-500)`. Two almost-the-same grays on different pages is exactly what reads as "off."

### 3.5 Magic-number spacing
Inline padding values are invented per section rather than drawn from a scale:
- Home "How We Build Trust" cards: `padding: 22` (`app/page.tsx:33`)
- Category cards: `padding: 18` (`components/home/CategoryGroupGrid.tsx:26`)
- Owner story card: `padding: 32` (`app/page.tsx:45`)
- `StatCard`: `padding: 18` (`components/man/primitives.tsx:95`)

Margins (`marginTop: 18/16/12/6/2`) and gaps (`gap-9`, `gap-7`, `gap-2.5`) are similarly ad hoc. There is no spacing scale, so rhythm drifts between sections that should feel related.

### 3.6 Three styling methods at once
Across the codebase, a single element often combines Tailwind utility classes, an inline `style={{}}` object, and a `t-*` class — e.g. `app/page.tsx:35`: `<div className="t-h4" style={{ color: "var(--ink-900)", marginTop: 12 }}>`. Mixing three styling mechanisms makes spacing and color drift inevitable and is itself a hallmark of generated code.

### 3.7 Radius mismatch
`components/ui/button.tsx` hardcodes `rounded-[8px]` for every size (lines 6, 22-23), but cards use `borderRadius: 14` and the design token `--radius` is `0.875rem` (14px). 8px buttons sitting inside 14px cards is a small but repeated inconsistency.

### 3.8 Inconsistent shadows
Three shadow tokens exist (`--shadow-soft`, `--shadow-rest`, `--shadow-lift`) but there's no rule for when each applies. `ManCard` defaults to `--shadow-soft`; some hover states jump straight to `--shadow-lift`; the search cards use `--shadow-rest` on hover. Without a rule, elevation feels arbitrary.

### 3.9 Demo-data bleed (content, lower priority)
Not strictly visual, but it reinforces the "demo" feel:
- Hardcoded marketing stats: "110+", "94% Of reviewers return" (`components/home/HeroSearch.tsx:47`)
- Static dashboard date and copy: "Today · Mon Feb 10" (`app/dashboard/page.tsx:54`)
- Unsplash stock heroes and invented testimonials ("Yusuf Khan · Famous Kabob") (`app/page.tsx:11, 53-56`)

Flagged for awareness; addressed at P2 since it's content, not design discipline.

---

## 4. Prioritized improvement list (approve item by item)

Organized by impact. P0 items are the ones most responsible for the vibe-coded feel and are high-visibility; work top-down.

### P0 — Biggest offenders, highest visibility

- [ ] **P0-1. Extract one shared `BusinessCard` component.** Replace the three hand-rolled card variants in `app/search/page.tsx` (grid, compact row, map thumbnail) with a single `man/`-based component with a `variant` prop. Reuse it anywhere businesses are listed (search, favorites, profile-related lists).
- [ ] **P0-2. Migrate the search page off un-skinned shadcn.** Replace bare `Card`/`CardContent`/`Input` usage with `man/primitives` equivalents (or `man/`-skinned wrappers), so search speaks the same language as home and profile.
- [ ] **P0-3. Kill emoji UI.** Replace the `🔍` empty state (and any other emoji used as icons) with a lucide icon inside a shared `EmptyState` component.
- [ ] **P0-4. Build a shared `EmptyState` component.** Icon + title + body + optional action button. Use it for search-no-results and anywhere else that needs an empty state, so they're all identical.
- [ ] **P0-5. Replace spinners with skeletons.** Build a `Skeleton` primitive and skeleton variants of the business card / results grid / map. Use them in place of the `animate-spin` loaders in `app/search/page.tsx` (lines 411, 490) and the map placeholder.
- [ ] **P0-6. One color vocabulary on the search page.** Replace `text-muted-foreground`, `border-primary`, and `bg-white` with the same `var(--*)` tokens the rest of the app uses. (App-wide, pick one system — raw tokens or shadcn-semantic — and stick to it; the rest of the app already leans on raw tokens, so that's the recommended default.) No two-gray mismatches.

### P1 — Systemic consistency

- [x] **P1-1. Define and adopt a spacing scale.** ✅ Done — `2026-06-16-spacing-scale.md`. Inline magic-number paddings/margins/gaps snapped to the 4px scale; card paddings unified to 20.
- [x] **P1-2. Reconcile the `Button` radius.** ✅ Done — superseded by the full 4-grid radius scale (`2026-06-16-radius-scale.md`): buttons + inputs at 8px (controls), cards 12px, tiny 4px, pills full.
- [x] **P1-3. Pick one styling convention and document it.** ✅ Done — `docs/DESIGN_CONVENTIONS.md` consolidates the component layer, styling method, color/radius/spacing scales, focus treatment, pills, elevation, and icon/state rules.
- [x] **P1-4. Define shadow/elevation rules.** ✅ Done — soft = resting card, rest = raised/interactive, lift = overlay/dropdown/floating. All 14 ad-hoc Tailwind `shadow-*` usages converted to the tokens.

### P2 — Polish & content

- [x] **P2-1. Audit remaining pages for the same tells.** ✅ The two un-skinned holdouts (`verify-email`, `reset-password`) brought onto the design system; auth role-toggle pills corrected (ink-900 → moss + `man-focus`). Inventory found no remaining emoji; magic-number spacing already handled in P1-1.
- [x] **P2-2. Standardize loading/empty/error states.** ✅ Business profile now loads with a `Skeleton` screen instead of a spinner. Remaining spinners are legitimate transient states (auth verification, map controls) and were tokenized, not removed.
- [x] **P2-3. Replace or clearly label demo content.** ✅ Public-facing fabricated claims made honest: hero stats → true descriptors, invented homepage testimonial → non-attributed "Why Manaakhah" statement, "110+" claim dropped, dashboard date made dynamic. Internal owner/admin mock data ("Famous Kabob" demo account) intentionally kept as sample data.

---

## 5. What to explicitly keep

These are working and should **not** be thrown out in the name of "redesign":

- The **token system** in `app/globals.css` (palette, type scale, shadows, radius) — it's the backbone; we're enforcing it, not replacing it.
- The **`man/primitives.tsx` library** (`ManCard`, `Tag`, `Rating`, `Avatar`, `StatCard`, `Seal`, `PH`, `Divider`) — extend it, don't abandon it.
- The **owner and admin shells** (`OwnerShell`, `AdminShell`) — these are already consistent and well-structured.
- The **Fraunces + Hanken Grotesk pairing** and the moss/clay/paper identity — distinctive and on-brand.
- The **homepage and business profile** layouts — they're the reference standard the other pages should rise to.

---

## 6. Suggested execution path

The natural first slice of implementation is **P0 as a single coherent piece of work**, because the items reinforce each other: extracting `BusinessCard` (P0-1), building `EmptyState` (P0-4) and `Skeleton` (P0-5), and using them to fix the search page (P0-2, P0-3, P0-5, P0-6) is essentially "bring the search page up to the standard of the homepage." That one slice removes the most visible vibe-coded surface in the app and creates the shared components the rest of the cleanup will reuse.

P1 and P2 then become mechanical sweeps applying the now-established conventions.
