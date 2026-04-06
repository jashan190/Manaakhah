# Features to Improve Before App is Usable

**Project:** Manaakhah - Muslim-owned Business Directory
**Updated:** 2026-04-05

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

### Remaining Work
1. Apply pending Prisma schema migration: `npx prisma db push && npx prisma generate`
2. Add React error boundaries for graceful error handling.
3. Test auth email flows end-to-end (verification, reset, 2FA) — requires Resend API key.
4. Integrate event tracking for business owner analytics (views, calls, directions).

---

## Critical (Must Fix Before Launch)

### 1. Authentication System ✅ COMPLETED
Real NextAuth with PostgreSQL. Email verification/reset still needs Resend API key testing.

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
Full CRUD API. **Pending: run `npx prisma db push`** for SpendingEntry table.

### 8. Saved Searches ✅ COMPLETED
CRUD API at `/api/saved-searches`. Uses Prisma `SavedSearch` model.

### 9. Lists Feature ✅ COMPLETED
CRUD API at `/api/lists`. Uses Prisma `BusinessList` + `SavedBusiness` models.

### 10. Offline Mode - Page Only, No PWA
**Status:** Not started. Low priority.

---

## Medium Priority (Enhance Before Full Launch)

### 11. Business Verification Workflow - Models Exist, No UI
- [ ] Build verification request UI for business owners
- [ ] Build admin verification queue
- [ ] Display verification badges on business profiles

### 12. Business Claim System ✅ COMPLETED
API at `/api/claims`. Uses `Business.claimStatus` field.

### 13. Messaging System ✅ localStorage REMOVED
API-only data flow. Still needs real-time updates (WebSocket or polling).

### 14. Booking System - Verify End-to-End Flow
- [ ] Test booking creation, approval/rejection, email notifications
- [ ] Implement waitlist functionality

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

### 19. Two-Factor Authentication - API Exists, UI Untested
- [ ] Test TOTP setup, QR code, verification during login

### 20. Business Benchmarking - Placeholder
- [ ] Define metrics, build comparison logic

### 21. Business Deals/Promotions - Page Exists
- [ ] Verify deal creation, display on business profiles

---

## Technical Debt

### 22. Error Handling
- [ ] Add React error boundaries (next task)
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
| Medium | 6 | 4 completed, 2 remaining (verification UI, booking tests) |
| Lower | 5 | Nice to have |
| Technical | 3 | Ongoing |

**Next Steps:**
1. Apply pending Prisma migration
2. Add error boundaries
3. Test auth email flows with Resend API key
4. Build verification workflow UI
5. Add event tracking for business analytics
