# Features to Improve Before App is Usable

**Project:** Minara - Muslim-owned Business Directory
**Updated:** 2026-06-24 — see `ROADMAP_TO_PRODUCTION.md` for the authoritative, more detailed current status. This file is kept in sync but that one has the full audit trail.

## Status Update

### Completed
- ✅ Prayer times fully removed from UX, APIs, and filesystem.
- ✅ Service discovery backend upgraded: service-aware search, filters, sorting, pagination, `/api/services/suggest`.
- ✅ Subscription/payment backend + owner-facing management UI at `/dashboard/subscription`.
- ✅ Authentication switched to real NextAuth + Neon PostgreSQL (`USE_MOCK_DATA=false`).
- ✅ Forum/community posts migrated from localStorage to PostgreSQL.
- ✅ Events system persists in PostgreSQL with RSVP tracking.
- ✅ Community impact and spending insights pages wired to real database data.
- ✅ Codebase cleaned: removed unused components, debug scripts, empty dirs.
- ✅ Moved away from Vercel — app deployed via Docker (self-hosted).
- ✅ **Messages** — localStorage fallback removed, API-only data flow.
- ✅ **Referrals** — backend API built (`/api/referrals`), localStorage removed.
- ✅ **Saved Searches** — backend API built (`/api/saved-searches`), localStorage removed.
- ✅ **Lists** — backend API built (`/api/lists`), localStorage removed.
- ✅ **Claim Business** — backend API built (`/api/claims`), localStorage removed.
- ✅ **Cloudinary upload** — placeholder URL removed, returns clear 503 when not configured.
- ✅ **Admin analytics** — growth trends wired to real database data.
- ✅ **Business owner analytics** — mock random data replaced with empty state (ready for event tracking).
- ✅ **Error boundaries** — React error boundaries added (global, admin, dashboard, business, 404).
- ✅ **Prisma schema migration** — confirmed in sync with the live Neon DB (`prisma migrate diff` returns empty); `directUrl` wired up.
- ✅ **Business verification workflow** — `app/dashboard/verification/page.tsx` now does a real `VerificationRequest` submission via `/api/claims`; admin queue UI lives at `app/admin/businesses/review-queue/page.tsx`; ownership transfer is admin-approval-gated, not instant.
- ✅ **Two-factor authentication** — login code-entry step (`app/login/page.tsx`) and account-settings enable/disable UI (`app/account/settings/page.tsx`) both built and verified against the live DB. Also fixed a real bypass: EMAIL-method 2FA users could previously skip 2FA with password alone.

### Remaining Work
1. Generate the still-missing Phase 0 credentials (`FROM_EMAIL`, Cloudinary keys, MapTiler key) — see `ROADMAP_TO_PRODUCTION.md` Phase 0.
2. Booking system (#14 below) — not just untested, the live app has no reachable booking UI at all and the booking APIs 401 in production. See `ROADMAP_TO_PRODUCTION.md` Phase 2.3 for the full audit.
3. Integrate event tracking for business owner analytics (views, calls, directions).

---

## Critical (Must Fix Before Launch)

### 1. Authentication System ✅ COMPLETED
Real NextAuth with PostgreSQL. `RESEND_API_KEY` is set, but `FROM_EMAIL` is still empty — emails fall back to an unverified default sender and may be silently dropped by Resend. Needs a verified sender before trusting email delivery in production.

### 2. Forum/Community Posts ✅ COMPLETED
Database-backed with `CommunityPost` and `PostComment` models.

### 3. Events System ✅ COMPLETED
Database-backed with `Event` and `EventRsvp` models.

### 4. Referral Program ✅ COMPLETED
API at `/api/referrals` — GET (list + stats), POST (invite). Uses Prisma `Referral` model.

### 5. Prayer Times ✅ FULLY REMOVED

---

## High Priority (Important for User Experience)

### 6. Community Impact Page ✅ COMPLETED
Real database aggregations via `/api/community/stats`.

### 7. Spending Insights ✅ COMPLETED
Full CRUD API. `SpendingEntry` table confirmed present in the live DB (schema/DB in sync).

### 8. Saved Searches ✅ COMPLETED
CRUD API at `/api/saved-searches`. Uses Prisma `SavedSearch` model.

### 9. Lists Feature ✅ COMPLETED
CRUD API at `/api/lists`. Uses Prisma `BusinessList` + `SavedBusiness` models.

### 10. Offline Mode - Page Only, No PWA
**Status:** Not started. Low priority.

---

## Medium Priority (Enhance Before Full Launch)

### 11. Business Verification Workflow ✅ COMPLETED
Verification request UI, admin queue, and badge display are all wired to real data — see Status Update above.

### 12. Business Claim System ✅ COMPLETED
API at `/api/claims`. Uses `Business.claimStatus` field.

### 13. Messaging System ✅ localStorage REMOVED
API-only data flow. Still needs real-time updates (WebSocket or polling).

### 14. Booking System - Not Just Untested, Not Reachable
- [ ] Fix `POST /api/bookings` and `PUT /api/bookings/[id]/status` — both hard-gated to mock-mode auth, always 401 in production
- [ ] Build a consumer booking-creation UI (none exists outside the excluded `_legacy/` tree)
- [ ] Build an owner-facing bookings dashboard under `app/dashboard/` (doesn't exist)
- [ ] Wire `sendBookingConfirmationEmail` (built, called nowhere)
- [ ] Decide on wiring the orphaned `Waitlist` model/API into reachable UI + auto-promotion on cancel/reject
- [ ] Add availability/conflict validation to booking creation (currently double-bookable via direct API calls)

See `ROADMAP_TO_PRODUCTION.md` Phase 2.3 for full detail.

### 15. Admin Analytics ✅ COMPLETED
Growth trends use real monthly data from database. User/business/review/booking breakdowns are live.

### 16. Image Uploads ✅ FIXED
Cloudinary integration is complete. Returns 503 with setup instructions when not configured.

---

## Lower Priority (Nice to Have)

### 17. Wallet/Payment System - Schema Only
- [ ] Integrate payment processor (Stripe)
- [ ] Build payment flow for bookings

### 18. Appeal System - Schema Only
- [ ] Build appeal submission and review UI

### 19. Two-Factor Authentication ✅ COMPLETED
TOTP and email-code setup, QR code, backup codes, and the login-time verification step are all built and verified against the live DB — see Status Update above.

### 20. Business Benchmarking - Placeholder
- [ ] Define metrics, build comparison logic

### 21. Business Deals/Promotions - Page Exists
- [ ] Verify deal creation, display on business profiles

---

## Technical Debt

### 22. Error Handling
- [x] Add React error boundaries (global, admin, dashboard, business, not-found)
- [ ] Add error logging/monitoring

### 23. Performance
- [ ] Audit and optimize database queries
- [ ] Add pagination where missing
- [ ] Implement proper caching

### 24. Testing
- [ ] Add unit tests for critical paths
- [ ] Add integration tests for API routes
- [ ] Add E2E tests for user flows

---

## Summary

| Priority | Count | Status |
|----------|-------|--------|
| Critical | 5 | All completed |
| High | 5 | 4 completed, 1 remaining (offline/PWA) |
| Medium | 6 | 5 completed, 1 remaining (booking system — needs a feature build, not a test pass) |
| Lower | 5 | Nice to have |
| Technical | 3 | Ongoing |

**Next Steps:**
1. Generate the missing Phase 0 keys (`FROM_EMAIL`, Cloudinary, MapTiler) — see `ROADMAP_TO_PRODUCTION.md`
2. Fix the booking system's auth gates and build the missing consumer/owner UI
3. Add event tracking for business analytics
