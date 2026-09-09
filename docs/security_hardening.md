# Production Security Hardening & OWASP Compliance

This document outlines the security architecture and defensive controls implemented across the English Speaking & Communication Platform.

## 1. Authentication & Session Security
- **Asymmetric / Secret-isolated JWTs**: Short-lived Access Tokens (15m–24h) coupled with rotated Refresh Tokens (7d).
- **Argon2 / BCrypt Salting**: Passwords hashed with standard work-factor salts (10 rounds).
- **Token Invalidation on Revocation**: Refresh tokens hashed in PostgreSQL `refreshTokenHash`; revoked immediately upon logout or password reset.
- **Role-Based Access Control (RBAC)**: Enforced hierarchically via `@Roles(UserRole.ADMIN)` metadata reflection on NestJS routes.

## 2. Audio Capture & Storage Upload Security
- **Zero Raw File Ingestion via API Gateway**: Audio files never stream through the NestJS backend memory buffers, preventing Denial of Service (OOM attacks).
- **Strict Pre-signed URLs**:
  - Expiration time strictly clamped to 300 seconds (5 minutes).
  - Exact MIME type enforcement (`audio/wav`, `audio/webm`, `audio/m4a`).
  - Size limitation capped at 15 Megabytes per recording.
  - S3 key namespacing by user ID: `production/users/{userId}/attempts/...` preventing path traversal.

## 3. Rate Limiting & Usage Quotas
- **Redis Token Bucket**: Distributed rate limiter protecting public endpoints (`/auth/login`, `/auth/register`) against credential stuffing (10 requests / min / IP).
- **Tier Quota Enforcer**:
  - `FREE_USER`: 20 AI sentence evaluations per day, 1 AI conversation per week.
  - `PREMIUM_USER`: Unlimited evaluations.
- **Cost Guardrails**: Circuit breaker halts third-party cloud STT/LLM invocations if daily spending crosses configured threshold.

## 4. Input Sanitization & AI Output Validation
- **NestJS Global ValidationPipe**: Strips unwhitelisted body parameters (`whitelist: true`, `forbidNonWhitelisted: false`).
- **Zod Strict Parsing on AI Generation**: All OpenAI / LLM JSON responses are passed through runtime Zod validators before database persistence.
- **SQL Injection Prevention**: Prisma ORM uses parameterized SQL queries across all Postgres operations.
- **Cross-Site Scripting (XSS)**: React 19 / Next.js 15 auto-escapes interpolated strings in DOM templates.

## 5. Network & Transport Security
- **TLS 1.3** required on all production ingress endpoints.
- **HSTS (HTTP Strict Transport Security)** headers enabled (`max-age=63072000; includeSubDomains; preload`).
- **CORS Configuration**: Explicit origin whitelisting in `main.ts` matching authorized Web and Admin domains.

