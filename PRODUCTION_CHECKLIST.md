# Minara — Production Checklist

**Created:** 2026-06-30 | **Updated:** 2026-07-07  
**Authority:** This file supersedes `ROADMAP_TO_PRODUCTION.md` as the working checklist. That file remains for historical context.  
**Domain:** `minara.market` — app name changed from Manaakhah to Minara across the entire codebase (2026-07-07).  
**Quick audit:** run `/prod-status` to get a live snapshot of what's done.

---

## Phase 0 — Missing credentials (manual, no code)

These require you to generate keys in external dashboards. Nothing further to verify in code until they're set.

- ✅ **`FROM_EMAIL`** — `noreply@minara.market`. Domain `minara.market` verified in Resend (2026-07-07). All transactional emails (verification, password reset, 2FA codes, booking confirmations) are now live.
- [ ] **`CLOUDINARY_CLOUD_NAME`** — From [Cloudinary dashboard](https://cloudinary.com/console) → Settings → Account
- [ ] **`CLOUDINARY_API_KEY`** — Same dashboard
- [ ] **`CLOUDINARY_API_SECRET`** — Same dashboard
- [ ] **`NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`** — Same value as `CLOUDINARY_CLOUD_NAME`
- [ ] **`NEXT_PUBLIC_MAPTILER_KEY`** — From [MapTiler cloud](https://cloud.maptiler.com/account/keys/). Without this, `components/map/MapLibreMap.tsx` renders a blank map.

After setting, restart the dev/prod server and run `/prod-status` to confirm they're picked up.

---

## Phase 1 — Auth endpoint rate limiting ✅ DONE

`lib/rate-limit.ts` created (in-memory sliding window). All 6 unprotected endpoints patched with IP-based rate limiting and 429 + Retry-After responses.

| Endpoint | File | Status |
|----------|------|--------|
| Register | `app/api/auth/register/route.ts` | ✅ 5 req / 15 min |
| Login precheck | `app/api/auth/login-precheck/route.ts` | ✅ 10 req / 5 min |
| Forgot password | `app/api/auth/forgot-password/route.ts` | ✅ 5 req / 15 min |
| Reset password | `app/api/auth/reset-password/route.ts` | ✅ 5 req / 15 min |
| Verify email | `app/api/auth/verify-email/route.ts` | ✅ 10 req / 5 min |
| 2FA verify (login) | `app/api/auth/2fa/verify/route.ts` | ✅ 5 req / 5 min |

Already rate-limited (untouched):
- `app/api/auth/resend-verification/route.ts` ✅ (60s cooldown via `lastVerificationEmailSent`)
- `app/api/auth/2fa/send-code/route.ts` ✅ (60s cooldown via `twoFactorCodeExpires`)
- `app/api/auth/2fa/setup/route.ts` ✅ (requires auth session — protected)
- `app/api/auth/[...nextauth]/route.ts` — NextAuth handler re-export; main attack vector covered by login-precheck above

---

## Phase 2 — Booking system ✅ DONE

- ✅ **Step 1 — API auth gates fixed** — `app/api/bookings/route.ts` and `app/api/bookings/[id]/status/route.ts` now use `getRequestUser(req)`. Work for real users.
- ✅ **Step 2 — Consumer booking UI** — Book button added to `app/business/[id]/page.tsx`. New page `app/business/[id]/book/page.tsx`: service type → duration → date → slot picker (fetches real availability from `GET /api/businesses/[id]/slots`) → notes → submit.
- ✅ **Step 3 — Owner bookings dashboard** — `app/dashboard/bookings/page.tsx` built with status tabs (All/Pending/Confirmed/Completed/Cancelled) + Confirm/Reject/Complete actions. "Bookings" added to `OwnerShell` nav.
- ✅ **Step 4 — Confirmation email wired** — `sendBookingConfirmationEmail()` called in `POST /api/bookings` (on create) and `PUT /api/bookings/[id]/status` (on CONFIRMED). Fire-and-forget — booking never fails due to email.
- ✅ **Step 5 — Conflict validation** — `generateTimeSlots()` from `lib/availability.ts` called in POST handler. Returns 409 if slot is already taken. New endpoint `GET /api/businesses/[id]/slots?date=&duration=` serves available slots to the booking UI.

---

## Phase 3 — Legal pages + SEO ✅ DONE

- ✅ **Privacy Policy** — `app/privacy/page.tsx` (covers data collection, retention, rights, contact)
- ✅ **Terms of Service** — `app/terms/page.tsx` (covers eligibility, listings, reviews, bookings, liability)
- ✅ **Dynamic sitemap** — `app/sitemap.ts` — Next.js App Router convention; queries all `ACTIVE` businesses and generates URLs. Gracefully skips DB if unavailable at build time.
- ✅ **`public/robots.txt`** — Allows all crawlers, points to sitemap

---

## Phase 4 — Error monitoring

No error monitoring exists. Production errors only appear in container logs.

- [ ] Install `@sentry/nextjs`: `npm install @sentry/nextjs`
- [ ] Run wizard: `npx @sentry/wizard@latest -i nextjs` — creates `sentry.client.config.ts`, `sentry.server.config.ts`, `sentry.edge.config.ts`, and patches `next.config.mjs`
- [ ] Add `SENTRY_DSN` (from Sentry project settings) to `.env`
- [ ] Verify: trigger a test error via `throw new Error("sentry test")` in a route, confirm it appears in the Sentry dashboard

---

## Phase 5 — Analytics event tracking ✅ DONE

- ✅ **Call, directions, website click tracking** — `app/business/[id]/page.tsx` now fires a fire-and-forget `POST /api/business/[id]/analytics` with `{action: "call"|"directions"|"website"}` on each button click.
- ✅ **Analytics POST handler updated** — `app/api/business/[id]/analytics/route.ts` creates a `BusinessView` record with `source: CALL | DIRECTIONS | WEBSITE` (new enum values added to `prisma/schema.prisma`, pushed to DB).
- ✅ **Owner analytics updated** — `app/api/user/analytics/route.ts` now queries real call/directions/website counts per date via raw SQL, replacing the hardcoded `count: 0` arrays.

---

## Phase 6 — Deployment hardening

- [ ] **TLS + reverse proxy** — `docker-compose.yml` exposes port 3000 directly. Put Caddy or nginx in front with a real domain and auto-TLS before opening to the public.
- [ ] **Neon DB backup** — Confirm the Neon plan tier has PITR (point-in-time recovery) enabled. Free tier does not.
- ✅ **Health-check endpoint** — `app/api/health/route.ts` returns `{ status: "ok", ts: Date.now() }`

---

## Quick reference — skills

| Skill | What it does |
|-------|--------------|
| `/prod-status` | Audits env vars, legal pages, sitemap, rate limiting, booking auth gates, Sentry — prints a live status table |
| `/add-rate-limit <path>` | Adds IP-based rate limiting to the specified auth route file; creates `lib/rate-limit.ts` on first run |
| `/track-event <call\|directions\|website>` | Wires click event tracking end-to-end for one business action type |
| `/booking-build <1-5>` | Executes one step of the booking system build (auth fix → consumer UI → owner dashboard → email → conflict validation) |

---

## Done (for reference)

These were completed in prior sessions and are production-ready:

- ✅ Real NextAuth + Neon PostgreSQL (`USE_MOCK_DATA=false`)
- ✅ Business verification workflow (claim → admin queue → ownership transfer)
- ✅ Two-factor auth (TOTP + email, login step, settings UI, bypass fix)
- ✅ Community posts, events, messages, referrals, lists, saved searches — all DB-backed
- ✅ Admin analytics wired to real data
- ✅ Prisma schema in sync with live DB (`directUrl` wired)
- ✅ Docker deployment (self-hosted, no Vercel dependency)
- ✅ React error boundaries (global, admin, dashboard, business, 404)
- ✅ Cloudinary upload returns 503 (not a silent placeholder) when unconfigured
- ✅ Prayer times fully removed
