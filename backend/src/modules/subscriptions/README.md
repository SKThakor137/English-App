# Subscriptions & Usage Quotas Module (Phase 9)

## Responsibilities
- Manages user tiers: `GUEST`, `FREE_USER`, `PREMIUM_USER`, `ADMIN`.
- Daily usage metering in Redis & PostgreSQL:
  - Free: 20 sentences/day, 1 conversation/week, 1 document/month.
  - Premium: Unlimited sentences, 30 min daily conversations, 20 documents/month.
- Stripe payment integration:
  - Checkout session generator.
  - Webhook listener for subscription lifecycle (`invoice.paid`, `customer.subscription.deleted`).
- Quota guard (`QuotaGuard`) protecting expensive AI/speech endpoints.

## Key Entities
- `UserSubscription`: Stripe customer ID, subscription status, plan tier.
- `DailyUsageQuota`: Metered STT seconds, AI feedback requests, and PDF pages.

