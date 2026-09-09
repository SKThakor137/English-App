# Phase 1: Foundation & Monorepo Scaffolding

## 1. Phase Objective
Establish the monorepo workspace, local container services (PostgreSQL 16, Redis 7, MinIO), PostgreSQL schema with 26 normalized entities, the NestJS Modular Monolith core runtime, authentication, and baseline frontend scaffolding.

---

## 2. Implemented Features

1. **Monorepo Workspace Orchestration**: Unified `package.json` with npm workspaces for `@english-platform/backend`, `@english-platform/web`, and `@english-platform/admin`.
2. **Containerized Infrastructure**: [`docker-compose.yml`](file:///home/aavatto/English/docker-compose.yml) spinning up PostgreSQL 16, Redis 7, and MinIO S3 storage with automatic volume mounts.
3. **Database Architecture**: 26 normalized models in [`backend/prisma/schema.prisma`](file:///home/aavatto/English/backend/prisma/schema.prisma) with foreign-key cascades, indexes, and CEFR enums.
4. **Authentication & Session Security**:
   - Short-lived JWT Access Tokens (24h) + Rotated Refresh Tokens (7d).
   - Password hashing with 10-round bcrypt salts.
   - Guard system (`JwtAuthGuard`, `RolesGuard`) supporting `@Public()` and `@Roles(UserRole.ADMIN)` decorators.
5. **Learner Onboarding & Profile**: Multi-step survey capturing target CEFR level, daily goal minutes, native language, and dashboard aggregation.
6. **Uniform API Envelopes & Error Handling**:
   - `TransformInterceptor`: Envelopes all successful responses in `{ success: true, statusCode, data, timestamp }`.
   - `AllExceptionsFilter`: Formats internal and HTTP exceptions into uniform error payloads.

---

## 3. Database Schema Models Implemented in Phase 1

- `User`: Email, password hash, role (`FREE_USER`, `PREMIUM_USER`, `ADMIN`), refresh token hash.
- `UserProfile`: Native language, target goal, daily goal minutes, current CEFR level.
- `UserStreak`: Current consecutive active days, longest streak, last active timestamp.
- `Subscription`: Plan tier, Stripe customer ID, status, expiry date.
- `DailyUsageQuota`: Per-user daily AI request counter and audio upload meter.

---

## 4. Key Files Created

### Backend Core
- [`backend/package.json`](file:///home/aavatto/English/backend/package.json) — NestJS 10, Prisma, AWS SDK, bcrypt, class-validator dependencies.
- [`backend/prisma/schema.prisma`](file:///home/aavatto/English/backend/prisma/schema.prisma) — Canonical PostgreSQL schema.
- [`backend/src/main.ts`](file:///home/aavatto/English/backend/src/main.ts) — Swagger documentation (`/api/docs`), CORS, and ValidationPipe.
- [`backend/src/database/prisma.service.ts`](file:///home/aavatto/English/backend/src/database/prisma.service.ts) — Prisma client lifecycle hooks.
- [`backend/src/database/database.module.ts`](file:///home/aavatto/English/backend/src/database/database.module.ts) — Global database module.
- [`backend/src/common/guards/jwt-auth.guard.ts`](file:///home/aavatto/English/backend/src/common/guards/jwt-auth.guard.ts) — JWT authentication guard.
- [`backend/src/common/guards/roles.guard.ts`](file:///home/aavatto/English/backend/src/common/guards/roles.guard.ts) — Role-based access control guard.
- [`backend/src/common/interceptors/transform.interceptor.ts`](file:///home/aavatto/English/backend/src/common/interceptors/transform.interceptor.ts) — Standard API envelope.
- [`backend/src/common/filters/http-exception.filter.ts`](file:///home/aavatto/English/backend/src/common/filters/http-exception.filter.ts) — Centralized exception filter.

### Backend Modules
- [`backend/src/modules/health/health.controller.ts`](file:///home/aavatto/English/backend/src/modules/health/health.controller.ts) — Liveness and database connectivity probe (`GET /health`).
- [`backend/src/modules/auth/auth.service.ts`](file:///home/aavatto/English/backend/src/modules/auth/auth.service.ts) — Registration, authentication, token refresh.
- [`backend/src/modules/auth/auth.controller.ts`](file:///home/aavatto/English/backend/src/modules/auth/auth.controller.ts) — `/auth/register`, `/auth/login`, `/auth/refresh`.
- [`backend/src/modules/users/users.service.ts`](file:///home/aavatto/English/backend/src/modules/users/users.service.ts) — Profile management, onboarding, dashboard metrics.
- [`backend/src/modules/users/users.controller.ts`](file:///home/aavatto/English/backend/src/modules/users/users.controller.ts) — `/users/me`, `/users/onboarding`, `/users/dashboard`.

### Frontend Clients
- [`apps/web/app/page.tsx`](file:///home/aavatto/English/apps/web/app/page.tsx) — Landing page showcasing features and CEFR curriculum.
- [`apps/web/app/(learner)/dashboard/page.tsx`](file:///home/aavatto/English/apps/web/app/(learner)/dashboard/page.tsx) — Learner dashboard with streaks and goals.
- [`apps/admin/app/dashboard/page.tsx`](file:///home/aavatto/English/apps/admin/app/dashboard/page.tsx) — Admin telemetry and operations dashboard.
- [`mobile/lib/main.dart`](file:///home/aavatto/English/mobile/lib/main.dart) & [`mobile/lib/features/home/home_screen.dart`](file:///home/aavatto/English/mobile/lib/features/home/home_screen.dart) — Flutter mobile foundation.

---

## 5. Phase Completion Checklist & Track Validation

- [x] Monorepo orchestration (`package.json`, `docker-compose.yml`, `.env.example`).
- [x] PostgreSQL 16 schema with 26 normalized models (`backend/prisma/schema.prisma`).
- [x] NestJS core runtime (`PrismaService`, `TransformInterceptor`, `AllExceptionsFilter`).
- [x] Auth and RBAC (`AuthModule`, `JwtAuthGuard`, `RolesGuard`, refresh tokens).
- [x] Users and multi-step onboarding (`UsersModule`, `UserProfile`, `UserStreak`).
- [x] Frontend scaffolds (Learner Web, Admin Web, Flutter Mobile).
- [x] **Track Status**: ✅ Phase 1 Complete & On Track


