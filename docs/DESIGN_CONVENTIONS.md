# Minara Design Conventions

The single reference for how UI is built in this app. Follow it so new pages don't reintroduce the inconsistency ("vibe-coded") drift. `_legacy/` is exempt (archived).

> Background audits live in `docs/superpowers/specs/2026-06-16-*`.

## 1. Component layer — use the design system, not raw shadcn
- Build from `components/man/primitives.tsx` (`ManCard`, `Tag`, `Rating`, `Avatar`, `StatCard`, `Seal`, `PH`, `Divider`) and the shared components: `components/business/BusinessCard.tsx`, `components/man/EmptyState.tsx`, `components/man/Skeleton.tsx`, `components/man/Select.tsx`, `components/man/Choice.tsx`, `components/man/DatePicker.tsx`.
- shadcn primitives (`ui/Button`, `ui/Input`, `ui/Textarea`, `ui/Select`) are the skinned base — they already carry the conventions below. Use them; don't hand-roll a second card/field/button vocabulary on a page.
- If you find yourself copy-pasting a control's markup a second time, extract a shared component instead.

## 2. Styling method (the one rule that prevents drift)
- **Layout** (flex, grid, spacing, sizing) → **Tailwind utility classes**.
- **Typography** → the `t-*` classes (`t-h1`…`t-h4`, `t-body`, `t-body-sm`, `t-label`, `t-eyebrow`, …).
- **Color** → CSS tokens via `style={{ color: "var(--ink-700)" }}` etc. (the established house pattern). Do **not** use shadcn semantic grays like `text-muted-foreground` in app pages — use `var(--ink-*)`.
- **Inline `style={{}}`** is for token colors and genuinely dynamic/computed values only — not for layout you could express with a utility.

## 3. Color tokens
`--ink-900/700/500/400/300` (text), `--moss-900…50` (brand), `--clay-*` (accent), `--paper / --paper-2 / --paper-3 / --card-edge / --hairline` (surfaces), `--bone`, `--ok/warn/err-500`. Never use raw hex except `#ffffff` for control/card fills.

## 4. Corner radius — 4px grid (see `2026-06-16-radius-scale.md`)
- **4px** — checkboxes, tiny chips, focus-halo corners
- **8px** — controls: **buttons + inputs/fields**, icon buttons, search containers
- **12px** — cards, panels, dropdowns, large tiles, upload drop-zones
- **full** — pills, toggles, avatars

Tailwind: `rounded-sm`=8, `rounded-md`/`rounded-lg`=12. No off-grid literals (no `rounded-[10px]`/`[14px]`/etc.).

## 5. Spacing — 4px scale (see `2026-06-16-spacing-scale.md`)
- Scale: `4 · 8 · 12 · 16 · 20 · 24 · 28 · 32 · 40 · 48`. Standard card/panel inner padding = **20**.
- Inline `padding`/`margin`/`gap` numbers must be on the scale (≤2px optical nudges allowed). Tailwind's 2px half-steps (`gap-1.5`, `py-2.5`, …) are an accepted sub-grid and may be used.

## 6. Focus / selected state — one moss halo everywhere
- Inputs/fields → class `man-field` (border + 8px radius + moss-700 border & `0 0 0 3px var(--moss-100)` halo on focus).
- Input-inside-a-bordered-container (search bars) → `man-field-wrap` on the container (halo on `:focus-within`). ⚠️ Never put an inline `borderColor` on a `man-field`/`man-field-wrap` element — it overrides the focus rule.
- Buttons & other clickable controls → class `man-focus` (halo on `:focus-visible`, follows the element's radius).
- `man/Choice` checkbox/radio → `man-focusable`.
- The shared `Button` already includes `man-focus`.

## 7. Pills / segmented toggles
`rounded-full`, `px-3 py-1.5` (compact: `px-2.5 py-1`). **Active:** `var(--moss-700)` bg + `var(--bone)` text. **Inactive:** `var(--paper-2)` bg + `var(--ink-700)` text. Add `man-focus`.

## 8. Elevation — 3 shadow tokens only (see P1-4)
- `--shadow-soft` — resting cards (the `ManCard`/`Card` default).
- `--shadow-rest` — raised/interactive elements (a control floating over media, hover on list rows).
- `--shadow-lift` — overlays: dropdowns, popovers, floating buttons, card hover.

Use `shadow-[var(--shadow-soft|rest|lift)]` (or inline `boxShadow`). Do **not** use Tailwind `shadow-sm/md/lg/xl`.

## 9. Icons & states
- Icons: **lucide-react only**. Never emoji as UI/iconography.
- Loading → `Skeleton` / `BusinessCardSkeleton` (never spinners).
- Empty → the shared `EmptyState` (lucide icon + title + description + optional action).
