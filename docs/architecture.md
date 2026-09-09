# System Architecture & Network Topology

## 1. High-Level Flow
```text
                     ENGLISH SPEAKING PLATFORM
                              │
             ┌────────────────┼────────────────┐
             │                │                │
             ↓                ↓                ↓
       WEB LEARNER       FLUTTER MOBILE     ADMIN WEB
       Next.js/React       Android/iOS       Next.js/React
             │                │                │
             └────────────────┼────────────────┘
                              │
                         Backend API
                              │
        ┌─────────────┬───────┼────────┬─────────────┐
        ↓             ↓       ↓        ↓             ↓
   PostgreSQL      Storage   Queue    AI/Speech   Notifications
        │                     │
        │                     ↓
        │                 Workers
        │
        └────────────── Progress / Content / Users
```

## 2. Core Subsystems

### 2.1 Backend Modular Monolith (NestJS)
* **Auth & RBAC**: JWT access/refresh tokens, Argon2/bcrypt password hashing, `@Roles` guard.
* **Curriculum Engine**: Courses, lessons, sentences, paragraphs, stories with CEFR levels.
* **Practice Engine**: Attempt sessions, audio uploads, diff calculation, scoring.
* **Speech Orchestration**: Pluggable Speech-to-Text (`ISpeechProvider`) and Pronunciation (`IPronunciationProvider`).
* **AI Feedback**: Strict Zod-validated linguistic critique, grammar error breakdown, and suggestions.
* **Document Processing**: PDF text extraction, OCR fallback, sentence boundary parsing.
* **Conversations**: Scenario state machine, multi-turn dialogue, TTS audio synthesis.
* **Vocabulary Engine**: Personal dictionary, SuperMemo SM-2 spaced repetition scheduler.
* **Progress & Streaks**: Daily streak calculation, streak freezes, CEFR skill radar rollups.

### 2.2 Distributed Queue Workers (BullMQ + Redis)
1. `audio-transcription-queue` (Concurrency: 10)
2. `pronunciation-eval-queue` (Concurrency: 8)
3. `ai-feedback-queue` (Concurrency: 6)
4. `pdf-processing-queue` (Concurrency: 2)

### 2.3 Object Storage (S3 / MinIO)
All audio and PDF uploads are authenticated via short-lived pre-signed URLs with MIME and size constraints.
No public bucket access. Audio retention: 14 days (Free) / 90 days (Premium).

