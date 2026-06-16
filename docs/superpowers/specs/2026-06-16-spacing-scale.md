# Spacing Scale (P1-1) — pragmatic sweep

**Date:** 2026-06-16
**Goal:** Replace the inline arbitrary "magic number" paddings/margins/gaps with a small consistent scale, unifying card paddings especially. Tailwind's 2px half-step classes (`gap-1.5`, `py-2.5`, …) are an accepted systematic sub-grid and are **left as-is** (pragmatic scope, per decision).

## Scale
`4 · 8 · 12 · 16 · 20 · 24 · 28 · 32 · 40 · 48` (px). Values ≤2px are kept (optical hairline nudges).

## What to sweep
Only **inline `style={{}}` spacing** — `padding*`, `margin*`, and `gap` — plus the 4 arbitrary Tailwind literals (`p-[18px]`, `p-[22px]`, `px-[18px]`). 

## What to LEAVE
- **Absolute positioning** props: `top` / `right` / `bottom` / `left` (e.g. the inset-50 overlay, toggle-knob offsets) — these are layout coordinates, not rhythm.
- **Tailwind `.5` half-step classes** (`gap-3.5`, `py-2.5`, `px-3.5`, `gap-1.5`, …) — kept.
- Any value already on the scale.

## Mapping (inline values)

**Padding** (`padding`, `paddingTop/...`, and `p-[Npx]`/`px-[Npx]`/`py-[Npx]`) — card paddings unify to **20**:
| old | new |
|---|---|
| 14 | 16 |
| 18 | **20** |
| 22 | **20** |
| 26 | 24 |
| 32 | 32 (keep — large feature padding) |

> `padding: 18` and `padding: 22` are overwhelmingly card/panel containers; mapping both to **20** makes the previously-mismatched cards (§3.5 of the design audit: 18/22/32) consistent. Arbitrary literals: `p-[18px]`→`p-5`, `p-[22px]`→`p-5`, `px-[18px]`→`px-5` (Tailwind `5` = 20px).

**Margin / gap / inline offsets** (`margin*`, `gap`) — round to nearest multiple of 4, **ties → down** (crisper rhythm); keep 0/1/2:
| old | new |
|---|---|
| 3 | 4 |
| 5 | 4 |
| 6 | 4 |
| 10 | 8 |
| 14 | 12 |
| 18 | 16 |
| 22 | 20 |
| 26 | 24 |

## Verify after sweep
- `grep -rnE "(padding|margin)[A-Za-z]*: ?(3|5|6|10|14|18|22|26)\b" app components` → none (except inside `top/right/bottom/left` positioning, which is fine).
- `grep -rnE "gap: ?(3|5|6|7|9|10|14|18|22|26)\b" app components` → none.
- `grep -rnE "\b(p|px|py)-\[(18|22)px\]" app components` → none.
- typecheck + build clean.

## Scope
`app/` + `components/`; `_legacy/` excluded.
