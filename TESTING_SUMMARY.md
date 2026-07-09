# Testing Summary - Minara

**Updated:** 2026-06-24 — see `ROADMAP_TO_PRODUCTION.md` for the authoritative current status with full audit detail.
**Status:** All localStorage removed. Backend stable. UI complete for core flows except booking (see Known Issues).
**Deployment:** Docker (self-hosted)

## Completed Work

### Authentication System - Complete
- Real NextAuth with Neon PostgreSQL
- `USE_MOCK_DATA=false`
- Email verification/reset requires Resend API key

### Forum/Community Posts - Complete
- Database-backed via `CommunityPost` and `PostComment` models
- NextAuth session support on all API endpoints

### Events System - Complete
- Database-backed with RSVP tracking
- API at `/api/events` and `/api/events/[id]/rsvp`

### Prayer Times - Fully Removed
- All routes, components, and API endpoints deleted

### Service Discovery - Backend Complete
- Service-aware search, sorting, filtering, pagination
- `/api/services/suggest` endpoint live

### Subscription Management - Complete
- Backend APIs: `/api/subscriptions`, `/api/payment-methods`
- Owner-facing UI at `/dashboard/subscription`
- Subscribe, cancel, reactivate, payment method management

### Messages - localStorage Removed
- API-only data flow via `/api/messages/conversations`

### Referrals - Backend Built, localStorage Removed
- API at `/api/referrals` (GET list+stats, POST invite)
- Uses Prisma `Referral` model

### Saved Searches - Backend Built, localStorage Removed
- CRUD API at `/api/saved-searches`
- Uses Prisma `SavedSearch` model

### Lists - Backend Built, localStorage Removed
- CRUD API at `/api/lists`
- Uses Prisma `BusinessList` model

### Claim Business - Backend Built, localStorage Removed
- API at `/api/claims` (GET user claims, POST submit claim)
- Uses `Business.claimStatus` field

### Cloudinary Upload - Fixed
- Placeholder URL removed
- Returns 503 with clear setup instructions when not configured

### Admin Analytics - Real Data
- Growth trends from actual database timestamps
- User/business/review/booking breakdowns are live

### Codebase Cleanup - Complete
- Removed empty dirs, unused components, debug scripts

### Error Boundaries - Complete
- `app/error.tsx` — catches errors in all routes
- `app/global-error.tsx` — catches root layout errors
- `app/admin/error.tsx` — admin-specific with dashboard link
- `app/dashboard/error.tsx` — dashboard-specific
- `app/business/error.tsx` — business page-specific
- `app/not-found.tsx` — custom 404 page

### Prisma Migration - Complete
Confirmed in sync via `prisma migrate diff` against the live Neon datasource (empty diff). `directUrl` wired up in `schema.prisma`.

### Business Verification - Complete
Verification request submission, admin approve/reject queue, and ownership transfer all tested against the live DB with real test accounts (created, exercised, and cleaned up via curl + one-off scripts).

### Two-Factor Authentication - Complete
TOTP and email-code 2FA tested end-to-end against the live DB: setup, QR/code confirmation, backup codes, login-time verification (including wrong-code and missing-code cases), and disable. Also verified visually via headless Chromium screenshots of `/login`'s code-entry step and `/account/settings`' enable/disable flow.

## Remaining Tasks

### Auth Email Flows - Partially Untestable
- Verification, reset, and 2FA-email codes are logic-tested (the code paths run correctly), but real delivery is unverified — `FROM_EMAIL` is empty, so sends fall back to an unverified default address that Resend may silently reject. Needs a verified `FROM_EMAIL` to confirm actual delivery.

### Booking System - Needs a Build, Not Just a Test
- `POST /api/bookings` and `PUT /api/bookings/[id]/status` are gated to mock-mode-only auth and return 401 for every real user.
- No reachable consumer booking UI or owner bookings dashboard exists in the live `app/` tree (only in the excluded `_legacy/` tree).
- Confirmation email and waitlist promotion are unwired.
- See `ROADMAP_TO_PRODUCTION.md` Phase 2.3 for the full audit and suggested scope split.

## Quick Test Commands

```bash
# Development
npm run dev

# Docker
docker compose up --build

# Test APIs
./test-apis.sh
```

## Database Status
- **Users:** 1 (admin account)
- **Businesses:** 182 (populated)
- **Posts:** 0 (test by creating)
- **Events:** 1 (test event created)

## Known Issues
- Subscription UI not tested end-to-end (Prisma migration is applied now, but the UI flow itself hasn't been walked with a real account)
- Real email delivery unverified (`FROM_EMAIL` not set — see Remaining Tasks)
- Business owner analytics shows empty state (event tracking not yet integrated)
- Booking system is not reachable in the live app — needs new UI, not just testing (see Remaining Tasks)
