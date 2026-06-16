# Button & Interactive-Control Consistency

**Date:** 2026-06-16
**Parent:** Extends `2026-06-16-design-polish-consistency-audit.md` (P1-2 button radius + the "one focus treatment" work) and follows `2026-06-16-form-control-consistency-audit.md`.
**Goal:** One coherent treatment for buttons and clickable controls — radius, focus state, and pill active color.

---

## 1. Problems found

- **Radius drift:** shared `Button` = `8px`, form fields = `10px`, dropdowns = `12px`, cards = `14px`, checkboxes = `5px`, pills = full. Buttons are out of step.
- **Focus-state crisis:** only the shadcn `Button` (offset ring) and `man/Select`+`man/DatePicker` (halo) have focus states. ~14 hand-rolled control types have **none**: filter pills, segmented toggle (`ViewToggle`), underline tabs, toggle switches, icon buttons, dashed upload buttons, header nav links, dropdown menu items, option-selection cards, stepper circles, hero save/share pills.
- **Filter pills disagree:** active state is `moss-700` in most places but `ink-900` in `app/admin/reviews/page.tsx`; radius is `rounded-full` everywhere except the search `ViewToggle` (`rounded-lg`).
- **Mixed focus languages:** `Button` uses `ring-2 + ring-offset-2`; the man controls use the `moss-100` halo (no offset). Two different focus looks.

---

## 2. Convention (approved)

### Radius system
- **Buttons: 12px** (approved) — all variants and sizes.
- Inputs / form controls: **10px** (already standardized).
- Cards / containers: **14px**.
- Pills / toggles / circular: **full**.
- Checkbox: 5px, radio: full (unchanged).

### One focus treatment everywhere
A single shared utility, `.man-focus`, applied to every interactive control:

```css
.man-focus:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px var(--moss-100);
}
```

No radius override — the halo follows each element's own radius (pill-shaped on pills, rounded on buttons). This matches the input/field focus language (moss-100 halo) so the whole app shares one focus look. The shared `Button` is migrated from its `ring-2 ring-offset-2` to this halo.

### Pill / segmented active state
All filter/segmented pills standardize to:
- `rounded-full px-3 py-1.5` (compact variants may use `px-2.5 py-1`)
- **Active:** `background: var(--moss-700)`, `color: var(--bone)`
- **Inactive:** `background: var(--paper-2)`, `color: var(--ink-700)` (or a `card` bg + `card-edge` border where that pattern already exists)
- `man-focus` for keyboard focus
- The search `ViewToggle` keeps its segmented container but its active segment uses the same `moss-700`/`bone`.

---

## 3. Target list (batch fix)

### Pass 1 — Foundation
- `components/ui/button.tsx`: `rounded-[8px]` → `rounded-[12px]` (base + `sm` + `lg`); replace `focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2` with the `man-focus` halo (add `man-focus` to the base classes, drop the ring classes).
- `app/globals.css`: add `.man-focus:focus-visible { outline:none; box-shadow:0 0 0 3px var(--moss-100); }`.

### Pass 2 — Pills & segmented controls (add `man-focus`, unify active color to moss)
- `components/search/ViewToggle.tsx`
- `app/admin/reviews/page.tsx` (active `ink-900` → `moss-700`)
- `app/admin/businesses/review-queue/page.tsx`
- `app/inbox/page.tsx` (quick-reply pills)
- `app/business/[id]/review/page.tsx` (tag pills)
- `app/business/[id]/contact/page.tsx` (purpose pills)
- `app/dashboard/leads/page.tsx` (quick-reply pills)
- `app/dashboard/reviews/page.tsx` (filter pills)
- `app/notifications/page.tsx`, `app/dashboard/notifications/page.tsx` (filter pills)

### Pass 3 — Remaining focus-less controls (add `man-focus`)
- `components/header.tsx` (nav links `:91`, dropdown items `:139-148`)
- `app/dashboard/page.tsx` + `app/dashboard/listing/page.tsx` (underline tabs)
- toggle switches: `app/dashboard/settings/page.tsx`, `app/account/settings/page.tsx`, `app/account/searches/page.tsx`
- icon buttons: `app/account/searches/page.tsx`, `app/admin/cert-sources/page.tsx`, `app/dashboard/subscription/page.tsx`, `components/search/FilterSheet.tsx`
- dashed upload buttons: `app/dashboard/listing/page.tsx`, `app/dashboard/new-listing/page.tsx`, `app/business/[id]/review/page.tsx`, `app/account/lists/page.tsx`
- option-selection cards: `app/dashboard/verification/page.tsx`
- stepper circles: `app/dashboard/new-listing/page.tsx`
- hero save/share/back pills: `app/business/[id]/page.tsx`

> `man/Choice` already uses `man-focusable`; `man/Select` and `man/DatePicker` already show the halo when open — leave them.
> `_legacy/` excluded.

---

## 4. Out of scope
- Spacing scale (P1-1), shadow rules (P1-4), demo content (P2-3) — separate items.
- Converting hand-rolled controls into shared components (a larger refactor) — here we only standardize radius/focus/active-color in place.
