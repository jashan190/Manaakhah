# Database Migration Required

**Updated:** 2026-04-05
**Status:** Migration still pending — has NOT been applied to production DB.

## What Needs Migration

- `SpendingEntry` model
- Service discovery indexes
- Subscription/payment models: `SubscriptionPlan`, `PaymentMethod`, `BusinessSubscription`, `SubscriptionInvoice`
- New enums: `BillingCycle`, `PaymentMethodType`, `BusinessSubscriptionStatus`

## How to Apply

```bash
# Recommended: push schema directly
npx prisma db push
npx prisma generate

# Then restart
npm run dev
```

### Alternative: Prisma Migrate (creates migration file)
```bash
npx prisma migrate dev --name app_schema_updates
```

### Alternative: Manual SQL (if Prisma commands fail)

```sql
-- Create SpendingEntry table
CREATE TABLE IF NOT EXISTS "SpendingEntry" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "businessId" TEXT NOT NULL,
  "amount" DOUBLE PRECISION NOT NULL,
  "category" TEXT NOT NULL,
  "description" TEXT,
  "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "SpendingEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "SpendingEntry_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "SpendingEntry_userId_date_idx" ON "SpendingEntry"("userId", "date");
CREATE INDEX IF NOT EXISTS "SpendingEntry_businessId_idx" ON "SpendingEntry"("businessId");
CREATE INDEX IF NOT EXISTS "SpendingEntry_category_idx" ON "SpendingEntry"("category");
```

Then: `npx prisma generate`

## After Migration

1. Test spending insights at `/insights`
2. Test subscription management at `/dashboard/subscription`
3. Test API endpoints:
   ```bash
   curl http://localhost:3000/api/spending
   curl http://localhost:3000/api/subscriptions/plans
   ```
