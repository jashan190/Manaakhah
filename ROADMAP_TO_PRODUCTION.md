# Roadmap to Production

**Created:** 2026-06-24
**Updated:** 2026-06-24 — Phases 0–2.2 below reflect work actually completed and verified this session (live-DB curl tests + headless-browser screenshots). Phase 2.3 reflects a fresh code audit, not yet fixed.
**How to read this:** Items are grouped by what's blocking a real launch vs. what can ship after. Each item notes what's actually true in the code today (verified by reading it, not by trusting old status docs) vs. what's UI scaffolding without a backend behind it.

## Where things actually stand

- Real auth (NextAuth + Neon Postgres), community posts, events, messages, referrals, saved searches, lists, claims, admin analytics, and PWA scaffolding (`public/sw.js` + `manifest.json`, registered in `app/layout.tsx`) are genuinely wired to the database.
- **Business verification** (claim → admin approval → ownership transfer) is now real end-to-end. See Phase 2.1.
- **Two-factor auth** (login code-entry step + account-settings enable/disable) is now real end-to-end, including an EMAIL-method bypass vulnerability that was fixed in the process. See Phase 2.2.
- **Booking system is still essentially non-functional in production.** It's not a "verify it works" task — see Phase 2.3 for what an audit actually found.

## Phase 0 — Credentials (no code, just keys)

Still missing in `.env` as of 2026-06-24 — **these need you to generate them, nothing further to verify in code until they're set:**
- `FROM_EMAIL` — needs a Resend-verified sender. `RESEND_API_KEY` is already set, but `FROM_EMAIL` is empty, so the app falls back to a default `noreply@minara.market` address that is almost certainly not verified on your Resend account. This is dangerous, not just incomplete: Resend's `.send()` doesn't throw on an unverified-domain rejection — it fails silently. Right now, every "email sent" log line in this app (verification, password reset, 2FA codes, booking confirmations) could be lying. Verify a domain (or a single sender address) in the Resend dashboard, then set `FROM_EMAIL` to that address.
- `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` / `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` — all empty. Image uploads (`/api/upload`) currently return a clean 503 rather than failing silently, so this is "missing feature," not "silent bug" — but listing photos, avatars, etc. don't work until set.
- `NEXT_PUBLIC_MAPTILER_KEY` — empty. `components/map/MapLibreMap.tsx` depends on it for map rendering.

Not needed right now — skip unless you're adding social-login buttons to the UI (none exist today, confirmed by grep): `GOOGLE_CLIENT_ID/SECRET`, `APPLE_CLIENT_ID/SECRET`.

## Phase 1 — Data layer correctness ✅ DONE

1. ~~Confirm the Prisma schema is actually pushed to the live Neon DB.~~ Confirmed via `prisma migrate diff` against the live datasource: empty diff, schema and DB are in sync. `MIGRATION_REQUIRED.md`'s pending items (SpendingEntry, subscription/payment models) are already applied.
2. ~~Wire up `DIRECT_URL`.~~ Added `directUrl = env("DIRECT_URL")` to the `datasource db` block in `prisma/schema.prisma`.

## Phase 2 — Finish flows that look done but aren't

### 2.1 Business verification ✅ DONE
- `app/dashboard/verification/page.tsx` now fetches the real business via `GET /api/businesses/[id]` and submits to `/api/claims` instead of a hardcoded fake business.
- `POST /api/claims` no longer instantly grants ownership (that was a privilege-escalation hole — any authenticated user could've become the owner of any unclaimed business with no review). It now creates/updates a `VerificationRequest` and logs an `ActivityLog` entry recording who requested the claim; ownership transfer happens only when an admin approves.
- New admin queue: `GET/PATCH /api/admin/verification-requests[/[id]]`, surfaced at `app/admin/businesses/review-queue/page.tsx` (previously 100% hardcoded mock) with real Approve/Reject buttons.
- Verification badge (`<Seal>`) on business profiles already existed and now reflects real `Business.verificationStatus`, confirmed by reading `app/business/[id]/page.tsx`.
- Fixed an unrelated bug found along the way: `app/api/businesses/[id]/route.ts` was including a non-existent `reviews.photos` relation (should be `reviewPhotos`), 500ing the business detail API for every business in real mode.

### 2.2 Two-factor auth UI ✅ DONE
- `app/login/page.tsx` now has a real 2FA code-entry step. Since NextAuth v5 collapses any custom thrown error from `authorize()` into an opaque `error=Configuration`, this is implemented via a pre-check endpoint (`POST /api/auth/login-precheck`) that validates credentials and reports whether 2FA is required *before* `signIn()` is ever called.
- `lib/auth.ts`'s `authorize()` was fixed to actually verify TOTP/email codes and backup codes, and to `return null` (not throw) on failure for a clean `CredentialsSignin` error.
- **Found and fixed a real bypass:** the old gate was `if (user.twoFactorEnabled && user.twoFactorSecret)` — EMAIL-method 2FA users have no `twoFactorSecret`, so they skipped 2FA entirely; password alone was sufficient. Now gates on `twoFactorEnabled` alone.
- `app/account/settings/page.tsx` has a full enable (QR setup or email code) → confirm → one-time backup codes → disable (password + optional code) flow, wired to the existing `/api/auth/2fa/setup` (POST/PUT/DELETE) routes.
- Verified against the live DB: curl-tested every authorize() branch, then headless-browser screenshots of the password step, the 2FA code step, and the settings enable/disable flow — see `_legacy/` is not involved here, this is all in the live `app/` tree.

### 2.3 Booking system ❌ NOT DONE — bigger gap than this roadmap originally assumed
The original framing ("verified end-to-end... test with two real accounts") assumed there was a working flow to verify. A code audit found there isn't one reachable in the live app:
- **`POST /api/bookings`** and **`PUT /api/bookings/[id]/status`** are both hard-gated to `if (isMockMode()) { userId = req.headers.get("x-user-id") }` with no real-session fallback — they return 401 for every real user, always. Needs `getRequestUser(req)` per the CLAUDE.md convention (same fix already applied to `/api/claims` in 2.1).
- **No reachable consumer booking UI exists.** `app/business/[id]/page.tsx` (the live business detail page) has Call/Message/Directions actions but no "Book" button. The only frontend code that calls `POST /api/bookings` lives in `_legacy/app/business/[id]/book/page.tsx` — excluded from the build, unreachable.
- **No owner-facing bookings dashboard exists** under `app/dashboard/`. The only frontend code that calls the approve/reject endpoint is `_legacy/app/bookings/page.tsx` — also unreachable.
- `sendBookingConfirmationEmail` in `lib/email.ts` is fully implemented but called from nowhere.
- The `Waitlist` model and its full CRUD API (`app/api/bookings/waitlist/route.ts`, including promotion logic) are built but orphaned — zero non-legacy callers, and booking cancellation/rejection doesn't trigger promotion.
- `POST /api/bookings` does no availability/conflict check against `generateTimeSlots()` (`lib/availability.ts`), so double-booking is currently possible via direct API calls even after the auth fix.

This is a feature build (new consumer booking flow + new owner dashboard), not a wiring fix — see the suggested order of attack below for how to scope it.

## Phase 3 — Production hardening (nothing found in the codebase for any of these — all greenfield)

1. **Rate limiting on auth endpoints.** `middleware.ts` only rate-limits/logs *mock-header* abuse; `/api/auth/login`, `/api/auth/register`, `/api/auth/forgot-password` have no brute-force protection. Add a real limiter (e.g. Upstash Redis + `@upstash/ratelimit`, or a Postgres-backed counter) before launch.
2. **Error monitoring/logging.** No Sentry or equivalent anywhere in `package.json` or code — right now a production error only shows up in container logs. Worth adding before real users hit it.
3. **Legal pages.** No `/privacy` or `/terms` route exists anywhere under `app/`. Required before collecting real user accounts, payments, or scraped business data publicly.
4. **SEO basics.** No `sitemap.xml`/`robots.txt` route or `next-sitemap` config found — business profile pages won't be indexable without one.
5. **Real-time messaging.** `app/messages`/`app/inbox` are plain request/response (no `socket.io`, `EventSource`, or polling interval found) — conversations only update on navigation/refresh. Decide if that's acceptable for v1 or needs polling/websockets.

## Phase 4 — Known-incomplete features (already tracked, still accurate)

Carried forward from `FEATURES_TO_IMPROVE.md` since these are still genuinely open:
- Business owner analytics event tracking (views/calls/directions) — UI shows an empty state by design, no event-capture wired up yet.
- Appeal system — `Appeal` model exists, no submission/review UI.
- Business benchmarking — placeholder only, metrics undefined.
- Payment processing — current `PaymentMethod` types are manual (CARD/BANK_TRANSFER/ZELLE/CASH_APP/MANUAL recorded by the business, not charged). No Stripe/processor integration exists. Decide whether v1 launches with manual payment tracking only (cheaper, slower) or needs real charging before launch.

## Phase 5 — Deployment readiness

- Confirm the Docker self-hosted deployment (`Dockerfile`, `docker-compose.yml`) has a real domain + TLS in front of it (the compose file only exposes port 3000 directly).
- Confirm Neon DB backup/point-in-time-recovery is enabled (it's a managed service, but the plan tier matters).
- Add a health-check endpoint if your deployment/orchestration needs one (none currently exists under `app/api`).

## Suggested order of attack

1. ~~Phase 0 (credentials)~~ — still open, see above; you need to generate `FROM_EMAIL`, the Cloudinary keys, and the MapTiler key.
2. ~~Phase 1 (confirm migration applied)~~ — done.
3. ~~Phase 2.1 + 2.2 (verification + 2FA)~~ — done.
4. **Phase 2.3 (booking) — next.** Before building, decide scope: (a) bounded backend fixes only (auth-gate fix, availability validation, email wiring, waitlist promotion — all mirror patterns already fixed elsewhere this session) vs. (b) the full feature including net-new consumer booking UI and an owner bookings dashboard (genuine product/UX surface, not just wiring). (a) is low-risk and quick; (b) is comparable in size to everything done in Phase 2 so far, combined.
5. Phase 3 (hardening) — do before opening signups to the public, not before internal testing.
6. Phase 4 — prioritize by what your launch actually needs (e.g. skip Stripe if manual payment tracking is fine for v1).
7. Phase 5 — last mile before the production domain goes live.
