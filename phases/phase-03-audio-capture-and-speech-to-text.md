# Phase 3: Audio Capture & Speech-to-Text Pipeline

## 1. Phase Objective
Build the secure audio upload infrastructure, speech-to-text transcription engine, and algorithmic Dynamic Programming word-level diff analysis to score pronunciation accuracy and speaking pace.

---

## 2. Implemented Features

1. **Pre-signed S3 Audio Uploads**:
   - Zero raw audio passes through the NestJS server buffer (avoids OOM and server bottlenecks).
   - Generates pre-signed S3/MinIO PUT URLs with a strict 300-second expiration.
   - Enforces user-isolated namespacing: `production/users/{userId}/attempts/attempt_{timestamp}.wav`.
2. **Pluggable Speech-to-Text Providers**:
   - `ISpeechProvider` interface allowing seamless switching between OpenAI Whisper API, Groq Whisper, Deepgram, and local `MockSpeechProvider`.
3. **Dynamic Programming Word-Level Levenshtein Diff**:
   - Two-dimensional dynamic programming table aligning expected ground truth words with recognized speech.
   - Categorizes every token into one of four states:
     - `CORRECT`: Exact match (ignoring punctuation and casing).
     - `MISSING`: Word in expected text omitted by learner.
     - `EXTRA`: Spoken filler word not present in expected text.
     - `INCORRECT`: Phonetic or morphological substitution.
   - Computes:
     $$\text{Accuracy Score} = \frac{\text{Correct Words}}{\text{Total Expected Words}} \times 100$$
     $$\text{Words Per Minute (WPM)} = \frac{\text{Spoken Words Count}}{\text{Duration in Minutes}}$$
4. **Web Audio Capture (16kHz WAV)**:
   - High-fidelity single-channel 16,000 Hz Linear PCM audio capture directly in the browser via `useAudioRecorder.ts`.

---

## 3. Database Models in Phase 3

- `PracticeSession`: Tracks a learner's continuous practice block (`practiceType`, `startedAt`, `completedAt`).
- `PracticeAttempt`: Stores the evaluated attempt:
  - `expectedText`, `spokenTranscript`, `audioS3Key`
  - `overallScore`, `accuracyScore`, `fluencyScore`, `wordsPerMinute`
  - `diffMatrix` (stored as JSON array of tokens with status).

---

## 4. API Endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/api/v1/practice/pre-signed-url` | Generate temporary S3 upload URL for audio | Authenticated |
| `POST` | `/api/v1/practice/attempts` | Submit recorded audio for STT and diff analysis | Authenticated |
| `GET` | `/api/v1/practice/attempts/:id` | Retrieve attempt details, diff tokens & scores | Authenticated |

---

## 5. Key Files Created

### Backend
- [`backend/src/storage/storage.service.ts`](file:///home/aavatto/English/backend/src/storage/storage.service.ts) — AWS SDK S3 client & pre-signed URL generator.
- [`backend/src/modules/speech/speech.service.ts`](file:///home/aavatto/English/backend/src/modules/speech/speech.service.ts) — Speech recognition orchestrator with provider abstraction.
- [`backend/src/modules/practice/diff.service.ts`](file:///home/aavatto/English/backend/src/modules/practice/diff.service.ts) — Dynamic Programming word alignment algorithm.
- [`backend/src/modules/practice/practice.service.ts`](file:///home/aavatto/English/backend/src/modules/practice/practice.service.ts) — Attempt persistence and daily progress updates.
- [`backend/src/modules/practice/practice.controller.ts`](file:///home/aavatto/English/backend/src/modules/practice/practice.controller.ts) — REST controller for practice sessions.

### Frontend
- [`apps/web/hooks/useAudioRecorder.ts`](file:///home/aavatto/English/apps/web/hooks/useAudioRecorder.ts) — Web Audio API recording hook with timer and WAV blob generation.
- [`apps/web/app/(learner)/practice/sentence/[id]/page.tsx`](file:///home/aavatto/English/apps/web/app/(learner)/practice/sentence/%5Bid%5D/page.tsx) — Interactive Sentence Practice console.
- [`mobile/lib/features/practice/sentence_practice_screen.dart`](file:///home/aavatto/English/mobile/lib/features/practice/sentence_practice_screen.dart) — Flutter native audio recording screen.

---

## 6. Phase Completion Checklist & Track Validation

- [x] Pre-signed S3 upload architecture with 300s TTL and magic byte validation.
- [x] Zero raw audio buffering on the API server to prevent memory bottlenecks.
- [x] Speech-to-Text provider abstraction (`WhisperSpeechProvider`, `MockSpeechProvider`).
- [x] Dynamic Programming Levenshtein word diff engine with 4-state classification.
- [x] Accurate Words-Per-Minute (WPM) calculation.
- [x] Web Audio API 16kHz WAV recorder hook (`useAudioRecorder.ts`).
- [x] Interactive Sentence Practice UI on Web & Flutter Mobile.
- [x] **Track Status**: ✅ Phase 3 Complete & On Track


