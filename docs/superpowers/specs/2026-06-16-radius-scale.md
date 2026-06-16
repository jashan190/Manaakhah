# Corner-Radius Scale (4px grid)

**Date:** 2026-06-16
**Goal:** Every corner radius in the app is a multiple of 4, drawn from one small scale. Harmonizes with the 4/8px spacing grid.

## The scale
| Token | Value | Used for |
|---|---|---|
| `xs` | **4px** | checkboxes, tiny chips, focus-halo corners |
| `sm` | **8px** | **controls: buttons + inputs/fields**, icon buttons, search containers |
| `md` | **12px** | cards, panels, dropdowns, large selection tiles, upload drop-zones |
| `full` | — | pills, toggles, avatars |

Buttons and input fields share the 8px **controls** tier so adjacent control rows (e.g. an input + its Search button) have matching corners. Cards/containers sit one step up at 12px. (Large dashed upload drop-zones and selectable method tiles are treated as containers → 12.)

## Mapping (old → new)
- `5`, `6` → **4**
- `10` → **8**
- `14` → **12**
- `8`, `12` → unchanged
- `0`, `full`/`999` → unchanged

## The three forms to sweep
1. **Tailwind config** (`tailwind.config.ts`): currently `lg: var(--radius)` (14), `md: calc(-2)` (12), `sm: calc(-4)` (10). Replace with explicit on-grid values: `sm: "8px"`, `md: "12px"`, `lg: "12px"`. This auto-fixes all `rounded-lg` (×39, 14→12) and `rounded-sm` (×4, 10→8); `rounded-md` (×12) stays 12. Update `--radius` to `0.75rem` (12px) for any external reference and keep `rounded-xl` at its 12px default.
2. **Arbitrary literals** (`rounded-[Npx]`): `rounded-[10px]`→`rounded-[8px]`; `rounded-[14px]`→`rounded-[12px]`; `rounded-[6px]`→`rounded-[4px]`; `rounded-[5px]`→`rounded-[4px]`. (`[8px]`, `[12px]` unchanged.)
3. **Inline JS** (`borderRadius:` numbers and `radius={N}`/`radius: N` props): `10`→`8`, `14`→`12`, `6`→`4`; keep `8`, `12`, `0`, `999`.

## CSS class radii (from earlier passes)
- `.man-field` `border-radius: 10px` → **8px**
- `.man-focusable` `border-radius: 6px` → **4px**

## Scope
- `app/` and `components/` (incl. `man` primitives, `Skeleton`, `BusinessCard`). `_legacy/` excluded.
- After: a grep for `rounded-\[(5|6|10|14)px\]` and `borderRadius: ?(10|14)` and `radius[=:] ?\{?(6|10|14)` must return nothing in scope.
