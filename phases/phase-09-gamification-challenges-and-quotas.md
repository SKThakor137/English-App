# Phase 9: Gamification, Daily Challenges & Quotas

## 1. Phase Objective
Drive daily user habit formation through gamified community speaking challenges, live accuracy leaderboards, streak multipliers, and strict tier quota enforcement paired with Stripe checkout.

---

## 2. Implemented Features

1. **Daily Speaking Quest & Community Leaderboard**:
   - Refreshed daily prompt with CEFR difficulty band, sample model response, and bonus points multiplier ($1.0\times$ to $3.0\times$).
   - Live ranked leaderboard showcasing top learner attempts and accuracy percentages.
   - Streak protection: Completing the daily challenge advances the user's active streak by 1 day.
2. **Tiered Usage Quota Enforcer**:
   - **Free Tier (`FREE_USER`)**: 20 AI sentence evaluations per day, 1 AI conversation per week, 1 PDF per month.
   - **Premium Tier (`PREMIUM_USER`)**: Unlimited sentence drills, acoustic phoneme analysis, unlimited conversations, and up to 20 PDFs/month.
3. **Stripe Customer Checkout**:
   - Secure checkout session generation (`POST /subscriptions/checkout`) redirecting to Stripe Customer Portal.
4. **Admin Challenge Scheduler**:
   - Administrative calendar allowing curriculum leads to pre-schedule future speaking prompts and set holiday/weekend point multipliers.

---

## 3. Database Models in Phase 9

- `DailyChallenge`: `id`, `challengeDate`, `promptText`, `targetCefr`, `sampleAnswer`, `pointsMultiplier`.
- `DailyChallengeAttempt`: `challengeId`, `userId`, `score`, `durationSeconds`, `submittedAt`.
- `DailyUsageQuota`: `userId`, `usageDate`, `aiFeedbackRequests`, `audioUploads`.
- `Subscription`: `userId`, `planTier`, `stripeCustomerId`, `status`, `expiresAt`.

---

## 4. API Endpoints

| Method | Endpoint | Description | Role |
|---|---|---|---|
| `GET` | `/api/v1/challenges/today` | Retrieve today's prompt and live community leaderboard | Authenticated |
| `POST` | `/api/v1/challenges/:id/attempt` | Submit speaking challenge audio for scoring & rank | Authenticated |
| `POST` | `/api/v1/challenges/admin/schedule` | Pre-schedule daily prompt with points multiplier | Admin |
| `GET` | `/api/v1/subscriptions/quota` | Check remaining free sentences and tier perks | Authenticated |
| `POST` | `/api/v1/subscriptions/checkout` | Generate Stripe checkout session URL | Authenticated |

---

## 5. Key Files Created

### Backend
- [`backend/src/modules/challenges/challenges.service.ts`](file:///home/aavatto/English/backend/src/modules/challenges/challenges.service.ts) — Daily prompt retrieval and leaderboard ranking.
- [`backend/src/modules/challenges/challenges.controller.ts`](file:///home/aavatto/English/backend/src/modules/challenges/challenges.controller.ts) — Challenge endpoints.
- [`backend/src/modules/challenges/challenges.module.ts`](file:///home/aavatto/English/backend/src/modules/challenges/challenges.module.ts) — Challenges module.
- [`backend/src/modules/subscriptions/subscriptions.service.ts`](file:///home/aavatto/English/backend/src/modules/subscriptions/subscriptions.service.ts) — Daily quota meter and Stripe checkout session creator.
- [`backend/src/modules/subscriptions/subscriptions.controller.ts`](file:///home/aavatto/English/backend/src/modules/subscriptions/subscriptions.controller.ts) — Quota and billing endpoints.
- [`backend/src/modules/subscriptions/subscriptions.module.ts`](file:///home/aavatto/English/backend/src/modules/subscriptions/subscriptions.module.ts) — Subscriptions module.

### Web Frontend
- [`apps/web/app/(learner)/challenges/today/page.tsx`](file:///home/aavatto/English/apps/web/app/(learner)/challenges/today/page.tsx) — Learner Daily Challenge quest and leaderboard page.
- [`apps/web/app/(learner)/subscription/page.tsx`](file:///home/aavatto/English/apps/web/app/(learner)/subscription/page.tsx) — Daily quota balance gauge and plan upgrade comparison.
- [`apps/admin/app/challenges/page.tsx`](file:///home/aavatto/English/apps/admin/app/challenges/page.tsx) — Administrative challenge scheduler and calendar.

### Mobile Flutter
- [`mobile/lib/features/challenges/daily_challenge_screen.dart`](file:///home/aavatto/English/mobile/lib/features/challenges/daily_challenge_screen.dart) — Flutter Daily Speaking Challenge UI.
- [`mobile/lib/features/subscription/subscription_screen.dart`](file:///home/aavatto/English/mobile/lib/features/subscription/subscription_screen.dart) — Flutter Quota & Subscription UI.

