# Form Control Consistency Audit & Convention

**Date:** 2026-06-16
**Status:** IMPLEMENTED ✅ — `man-field` / `man-field-wrap` / `man-focus` / `man-focusable` convention adopted; documented in `docs/DESIGN_CONVENTIONS.md`; merged in the P1 design polish cycle.
**Parent:** Extends `2026-06-16-design-polish-consistency-audit.md` (this is the P1 "one component layer" work for inputs/controls).
**Goal:** Eliminate the inconsistent input "selected/focus" states across the app by standardizing every form control on one convention.
**Trigger:** The home search bar and the search-page field have visibly different selected states (no indicator vs. a moss ring).

---

## 1. The problem

The app currently has **three different input treatments**, and the most common one has no focus indicator at all:

| Treatment | Focus / selected state | Border | Radius | Where |
|---|---|---|---|---|
| **A — shadcn ring** | 2px moss ring + 2px offset gap (`focus-visible:ring-2 ring-ring ring-offset-2`) | `border-input` (= `--card-edge`) | `rounded-md` (~7px) | `ui/Input`, `ui/Textarea`, `ui/Select` |
| **B — custom man** | border turns `--moss-700` on open/checked; **no ring** | dynamic | 10px / 5px / full | `man/Select`, `man/DatePicker`, `man/Choice` |
| **C — raw inline** | **none** — `outline-none` with no replacement | `--card-edge` (static) or none | 8/10/12/14px | 28+ inline `<input>`/`<textarea>` across the app |

Consequences:
- **Visible inconsistency** — the home hero search (C, no indicator) vs. the search-page field (A, moss ring) is the same control with two different selected states.
- **Radius chaos** — rectangular text controls use `rounded-md` (7px), `8px`, `10px`, `12px`, and `14px`.
- **Accessibility gap** — the 28+ Group-C inputs give keyboard users no focus indicator.

---

## 2. The convention (approved)

**One selected/focus treatment for all text-like controls: moss border + soft halo.**

- **Rest:** `border: 1px solid var(--card-edge)`; background `#ffffff`; radius **10px** (standard fields, textareas, selects, datepicker/select triggers).
- **Focus / focus-within:** `border-color: var(--moss-700)` + `box-shadow: 0 0 0 3px var(--moss-100)`; `outline: none`. No offset gap.
- **Search bars** (hero + search page) and other "input-inside-a-bordered-container" patterns: the **container** carries the border and gets the focus treatment via `:focus-within` (because the inner `<input>` is transparent/borderless). Container radius **12px** (a deliberate, consistent search affordance — the only rectangular radius other than 10px).
- **Checkboxes** keep `rounded-[5px]`, **radios** keep `rounded-full`; both already turn moss when checked. They additionally get the same halo on keyboard focus for a11y.

This unifies Group A and B's "border turns green" language and closes Group C's accessibility gap with a single, on-brand cue.

### Implementation strategy (one source of truth)

Add shared classes to `app/globals.css` so the treatment lives in exactly one place:

```css
/* Unified form-control treatment */
.man-field {
  border: 1px solid var(--card-edge);
  border-radius: 10px;
  background: #ffffff;
}
.man-field:focus,
.man-field:focus-visible {
  outline: none;
  border-color: var(--moss-700);
  box-shadow: 0 0 0 3px var(--moss-100);
}
/* For controls whose visible border lives on a wrapper (search bars, icon+input rows) */
.man-field-wrap:focus-within {
  border-color: var(--moss-700);
  box-shadow: 0 0 0 3px var(--moss-100);
}
```

Then:
- **shadcn `ui/Input`, `ui/Textarea`, `ui/Select`:** replace the `focus-visible:ring-2 ring-ring ring-offset-2` + `rounded-md` with the `man-field` treatment (border+halo, radius 10px). Keep them as the base components.
- **Group C raw inputs:** swap each ad-hoc `fieldCls`/`field` constant and inline `outline-none` field for `man-field` (or add `man-field-wrap` to the bordered container for transparent search inputs).
- **`man/Select`, `man/DatePicker`:** add the halo on open/focus (keep their existing moss border).
- **`man/Choice`:** add the focus halo for keyboard users.

---

## 3. Full target list (for the batch fix)

### Shared components (change the source → fixes many call sites)
- `components/ui/input.tsx:13`
- `components/ui/textarea.tsx:12`
- `components/ui/select.tsx:12`
- `components/man/Select.tsx:42-43` (+ open state)
- `components/man/DatePicker.tsx:59-60`
- `components/man/Choice.tsx:32-38` (checkbox), `:64-68` (radio)

### Search bars / transparent-input containers (use `man-field-wrap` on the container)
- `components/home/HeroSearch.tsx:36-40` (home hero — the original complaint)
- `app/search/page.tsx:215` (uses shadcn `Input` — inherits the fix, verify it reads consistently)
- `app/inbox/page.tsx:48-49` (search), `:100-102` (compose)
- `app/help/page.tsx:32-34`
- `app/claim-business/page.tsx:55-57`
- `app/admin/businesses/review-queue/page.tsx:42`
- `app/dashboard/leads/page.tsx:38`
- `app/dashboard/reviews/page.tsx:65`
- `components/help/AuthedHelp.tsx:52`

### Inline field constants & raw fields (swap to `man-field`)
- `app/dashboard/settings/page.tsx:10` (`fieldCls`), used `:58-61`
- `app/dashboard/listing/page.tsx:16` (`fieldCls`), used `:53-62, 116-118`
- `app/dashboard/new-listing/page.tsx:16` (`fieldCls`), used `:56-72, 79-81`
- `app/business/[id]/contact/page.tsx:21-22` (`field`), used `:56-61`
- `app/admin/businesses/[id]/page.tsx:75` (textarea)
- `app/admin/support/page.tsx:76` (textarea)
- `app/dashboard/leads/page.tsx:84` (reply textarea)
- `app/dashboard/verification/page.tsx:70` (OTP 1-char inputs)

> `_legacy/` is intentionally excluded.

---

## 4. Out of scope (for this pass)
- Button radius reconciliation (separate P1 item, `2026-06-16-design-polish-consistency-audit.md` P1-2).
- The app-wide spacing scale (P1-1).
- Hover states on non-input controls.
