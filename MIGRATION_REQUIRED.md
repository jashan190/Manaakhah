# Database Migration Required

**Status:** RESOLVED as of 2026-06-24.

The migration described below (SpendingEntry, subscription/payment models, related enums) has been applied. Confirmed via:

```bash
npx prisma migrate diff --from-schema-datasource prisma/schema.prisma --to-schema-datamodel prisma/schema.prisma --script
# -> "This is an empty migration." (schema and live DB are in sync)
```

`directUrl = env("DIRECT_URL")` has also since been added to the `datasource db` block in `prisma/schema.prisma`.

No action needed. See `ROADMAP_TO_PRODUCTION.md` Phase 1 for current status. This file is kept only as a record of what the migration originally covered, in case the manual-SQL fallback below is ever needed again for a future migration.

## Original Contents (for reference only — already applied)

### What Needed Migration
- `SpendingEntry` model
- Service discovery indexes
- Subscription/payment models: `SubscriptionPlan`, `PaymentMethod`, `BusinessSubscription`, `SubscriptionInvoice`
- New enums: `BillingCycle`, `PaymentMethodType`, `BusinessSubscriptionStatus`

### How It Was Applied
```bash
npx prisma db push
npx prisma generate
```
