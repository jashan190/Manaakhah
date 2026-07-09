# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Minara — a Muslim-owned business directory web app (Next.js App Router, TypeScript, PostgreSQL/Prisma). Consumers discover businesses (halal food, services, masjids, etc.), book appointments, leave reviews, message owners, and engage in a community feed. Business owners manage listings, bookings, deals, subscriptions, and analytics. Admins moderate content and review verification/scraped-business submissions.

## Commands

```bash
npm run dev          # start dev server (next dev)
npm run build         # prisma generate && next build
npm run lint          # next lint

npm run db:generate   # prisma generate
npm run db:push       # push schema.prisma to the database (no migration files are used — see below)
npm run db:migrate    # prisma migrate dev
npm run db:studio     # prisma studio
npm run db:seed       # npx tsx scripts/seed.ts
```

There is no test framework configured in this repo (no jest/vitest/playwright). Don't assume one — verify changes by running `npm run lint`, `npx tsc --noEmit`, and exercising the affected route/page manually.

Schema changes: this project uses `prisma db push`, not migration files (`prisma/` only contains `schema.prisma`, no `migrations/` directory). After editing `schema.prisma`, run `npm run db:push && npm run db:generate`.

## Architecture

### Mock-data dual mode (read this before touching auth or data access)

The entire app can run two ways, controlled by `USE_MOCK_DATA` (server) / `NEXT_PUBLIC_USE_MOCK_DATA` (client):

- **Real mode** (`USE_MOCK_DATA=false`, the production setup): Prisma + PostgreSQL, real NextAuth sessions via `lib/auth.ts`.
- **Mock mode** (`USE_MOCK_DATA=true`): an in-memory/localStorage-backed fake database (`lib/mock-data/`) and a fake session system (`lib/mock-auth.ts`, `mock-session.ts`) that bypasses NextAuth entirely. Mock auth is propagated via the `x-user-id` / `x-user-role` request headers instead of a session cookie.

Key files that bridge the two modes:
- `lib/db.ts` — exports `db`, a lazy proxy that resolves to either `mockDb` (`lib/mock-data/client.ts`, a hand-rolled Prisma-API-shaped client) or the real Prisma client (`lib/prisma.ts`), decided by `isMockMode()`.
- `lib/api/auth-user.ts` — `getRequestUser(req)` is the standard way API routes get the current user; it reads `x-user-id`/`x-user-role` headers in mock mode or calls `auth()` (NextAuth) otherwise. Use this in new API routes rather than calling `auth()` directly, so the route works in both modes.
- `middleware.ts` — detects and logs (but never blocks) `x-user-id`/`x-user-role` headers arriving on `/api/*` when NOT in mock mode, since those headers would otherwise be a privilege-escalation vector. Deliberately silent/non-blocking by design (avoids tipping off an attacker) — don't "fix" it to return 403.
- `lib/env.ts` — `@t3-oss/env-nextjs` validation that relaxes required vars (`DATABASE_URL`, `RESEND_API_KEY`) when in mock mode, so the app can run/deploy without a database or email provider.

When adding a new API route or data access path, always go through `db` (not `prisma` directly) and `getRequestUser` (not `auth()` directly) unless you have a specific reason to bypass mock mode.

### Auth

`lib/auth.ts` configures NextAuth v5 (`next-auth@beta`) with Credentials (bcrypt + TOTP/email 2FA via `lib/auth/two-factor.ts`), Google, and Apple providers, JWT sessions, and Prisma adapter. Notable flows: auto-login token after email verification, OAuth account-linking via `PendingAccountLink` when a Google/Apple sign-in matches an existing email, ban checks (`isBanned`/`isShadowBanned`) at sign-in, and `ActivityLog` writes on login/logout/failed attempts.

**2FA implementation constraints** — NextAuth v5 collapses any `throw` from `authorize()` into a generic `error=Configuration` (all custom error data is lost). Because of this, the login page calls `POST /api/auth/login-precheck` *before* `signIn()` to validate credentials and learn whether 2FA is required and which method. `authorize()` itself then only needs to verify the 2FA code and `return null` (never throw) on failure, which gives a clean `CredentialsSignin` error. Do not re-introduce a throw-based 2FA signal from `authorize()`. The 2FA gate in `authorize()` must check `user.twoFactorEnabled` alone, NOT `user.twoFactorSecret` — EMAIL-method 2FA users have no `twoFactorSecret`, so gating on the secret would silently bypass their 2FA. `app/account/settings/page.tsx` is the 2FA enable/disable UI (AUTHENTICATOR QR or EMAIL, plus backup codes), wired to `/api/auth/2fa/setup` (POST init / PUT confirm+enable / DELETE disable) and `/api/auth/2fa/send-code`.

**Silent email failure** — `FROM_EMAIL` is currently unset in `.env`. Resend's `.send()` does not throw on delivery failure (unverified domain, bad address) — it returns successfully while the email is silently dropped. Every email path in this app (`lib/email.ts`: verification, password reset, 2FA codes, booking confirmations) is affected. Do not trust "email sent" log lines in production until a Resend-verified `FROM_EMAIL` is configured.

### Data model (`prisma/schema.prisma`)

One large schema, organized by section comments — read the section header comments rather than scanning the whole file. Major clusters:
- **User & auth** — `User` (roles: CONSUMER/BUSINESS_OWNER/STAFF/MODERATOR/ADMIN/SUPER_ADMIN, trust/karma scores, ban state), `Account`/`Session`/`VerificationToken`, `PendingAccountLink`, `ActivityLog` (audit trail — also used as an application-level store for deferred ownership claims: `POST /api/claims` writes an entry with `action: "VERIFICATION"` recording who requested the claim; `PATCH /api/admin/verification-requests/[id]` reads it back to transfer ownership on approval — this intentionally avoids a schema migration; do not revert `/api/claims` to immediately granting `ownerId`, that was a privilege-escalation fix).
- **Business** — `Business` (category/tag enums, hours incl. Ramadan hours, verification, claim status, scraping provenance, masjid-specific and aid-org-specific fields), `StaffRole`, `BusinessPhoto`, `BusinessTagRelation`, `SavedBusiness`/`BusinessList`, `MenuCategory`/`MenuItem`, `BusinessQuestion`/`BusinessAnswer`.
- **Reviews** — `Review` with moderation/edit-tracking/AI-sentiment fields, `ReviewHelpful`, `ReviewReport`.
- **Messaging** — `Conversation`/`Message` (per business+customer pair, unique constraint), `MessageTemplate`, `AutoReply`.
- **Booking** — `Booking`, `BusinessAvailability`/`AvailabilityException`, `Service`, `Waitlist`. **The booking system is non-functional in production as of 2026-06-25**: `POST /api/bookings` and `PUT /api/bookings/[id]/status` are hard-gated to mock-mode auth only and always 401 for real users; no consumer booking UI or owner bookings dashboard exists in the live `app/` tree (only in the excluded `_legacy/`); `sendBookingConfirmationEmail` (`lib/email.ts`) is implemented but called nowhere. Building this out is a full feature build (new UI + auth-gate fix + email wiring), not a small change — see `ROADMAP_TO_PRODUCTION.md` Phase 2.3.
- **Billing** — `SubscriptionPlan`, `BusinessSubscription`, `SubscriptionInvoice`, `PaymentMethod` (manual payment types: CARD/BANK_TRANSFER/ZELLE/CASH_APP/MANUAL — no live payment processor integration).
- **Community** — `CommunityPost`/`CommunityChannel`/`PostComment` (threaded via `parentId`), likes, polls, reports.
- **Moderation/appeals** — `ContentReport`, `Appeal`, `ModerationRule`.
- **Scraping** — `ScrapedBusiness` (pending-review queue, see `lib/scraper/`), feeds into real `Business` records on approval (`scrapedBusinessId`/`isScraped`/`confidenceScore` on `Business`).
- **Islamic features** — `FundraisingCampaign`/`Donation` (zakat/sadaqah flags). Note: prayer times have been intentionally removed from the product (see `FEATURES_TO_IMPROVE.md`) — don't reintroduce a `PrayerTime` UI without checking that history.

### Scraper pipeline (`lib/scraper/`)

Sources (`lib/scraper/sources/{zabihah,hfsaa,hms,ifanca}.ts`, common interface in `base.ts`) scrape listings into `ScrapedBusiness`. `validation.ts`/`signals.ts` score confidence; `import.ts` promotes a scraped record into a real `Business`. Driven by standalone scripts in `scripts/` (`scrape-*.ts`, `geocode-scraped.ts`, `batch-approve-reject.ts`, `check-status.ts`) and the admin UI under `app/admin/businesses` / `app/api/admin/scraper`, `app/api/admin/scraped-businesses`.

### Route structure

- `app/` — App Router pages. Consumer-facing (`search`, `business/[slug or id]`, `lists`, `favorites`, `messages`, `inbox`, `settings/security|notifications|calendar` for consumer preferences, `account/settings` for profile + 2FA), owner-facing (`dashboard/*`: analytics, deals, leads, listing, subscription, verification, settings), and `admin/*` (businesses, reviews, users, moderation, cert-sources, system, support, settings). Note: `account/settings` and `settings/*` are separate surfaces — the former is personal account management (2FA, profile), the latter is consumer discovery preferences.
- `app/api/` — route handlers mirroring the above (`businesses`, `bookings`, `messages`, `reviews`, `community`, `subscriptions`, `payment-methods`, `admin/*`, `auth/login-precheck`, `admin/verification-requests`, etc.). Use `getRequestUser` for auth as noted above. Claim submission (`POST /api/claims`) creates a `VerificationRequest` + `ActivityLog` entry but does NOT immediately grant ownership; admin approval via `PATCH /api/admin/verification-requests/[id]` is the ownership transfer point. `user/analytics` (`GET ?range=7days|30days|90days`) aggregates views, searches, reviews, peak hours, and device data across all businesses owned by the authenticated user — it uses **raw SQL** (not Prisma) for date-series normalization performance; extend this endpoint for any new owner analytics features rather than adding separate Prisma aggregations.
- Path alias `@/*` maps to repo root (see `tsconfig.json`).
- `_legacy/` is archived/dead code — excluded from `tsconfig.json` and exempt from design conventions. Don't pull patterns from it.

### Design system

Full conventions live in `docs/DESIGN_CONVENTIONS.md` — read it before writing any UI. Summary of the load-bearing rules:
- Build from `components/man/primitives.tsx` (`ManCard`, `Tag`, `Rating`, `Avatar`, `StatCard`, `Seal`, `PH`, `Divider`) and shared components (`components/business/BusinessCard.tsx`, `components/man/EmptyState.tsx`, `Skeleton.tsx`, `Select.tsx`, `Choice.tsx`, `DatePicker.tsx`) — not raw shadcn (`ui/*`) directly, and never a second hand-rolled card/field/button vocabulary.
- Layout via Tailwind utilities; typography via `t-*` classes; color via CSS tokens (`var(--ink-*)`, `--moss-*`, `--clay-*`, `--paper*`) — never `text-muted-foreground` or raw hex (except `#ffffff`).
- Corner radius is a fixed 4px grid (4/8/12/full — see table in the doc); spacing is a fixed 4px scale; only 3 shadow tokens exist (`--shadow-soft/rest/lift`, never Tailwind `shadow-sm/md/lg`).
- Focus states use `man-field` / `man-field-wrap` / `man-focus` / `man-focusable` classes — never an inline `borderColor` on a `man-field` element (it breaks the focus halo).
- Icons are lucide-react only, no emoji as UI.

### i18n

`lib/i18n/translations.ts` + `LanguageContext.tsx` provide app-wide translation; `components/LanguageSwitcher.tsx` is the UI entry point. `User.preferredLanguage` persists the choice server-side.

## Project status docs

`ROADMAP_TO_PRODUCTION.md` is the authoritative, most-current status doc (updated 2026-06-24) — it audits what's actually wired to real data vs. UI scaffolding, and supersedes `FEATURES_TO_IMPROVE.md`/`TESTING_SUMMARY.md` on any point of disagreement. Those two files are kept in sync but track a longer history; check the roadmap first before assuming a feature is mock-only or production-ready, and verify against current code regardless — status docs drift.
