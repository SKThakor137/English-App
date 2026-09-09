# English Speaking & Communication Practice Platform

Enterprise multi-client ecosystem designed to transform passive English learners into active, fluent speakers through structured speech capture, phoneme-level pronunciation assessment, and conversational AI.

## Monorepo Architecture

- **`backend/`**: NestJS Modular Monolith API, PostgreSQL 16 (Prisma ORM), Redis, S3/MinIO audio pipeline, Azure Speech, Whisper STT, and GPT-4o-mini linguistic feedback.
- **`apps/web/`**: Next.js 15 App Router, React 19, Tailwind CSS, Web Audio API 16kHz WAV recorder, interactive IPA phoneme inspector.
- **`apps/admin/`**: Next.js 15 App Router administrative portal for curriculum authoring, student monitoring, and system metrics.
- **`mobile/`**: Flutter 3.x cross-platform mobile client for iOS and Android with low-latency audio capture.

## Getting Started

### 1. Prerequisites
- Node.js >= 20.x
- Docker & Docker Compose
- Flutter SDK (for mobile)

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
```bash
cp .env.example .env.local
```

### 4. Run Development Stack
```bash
# Start backend API (Port 4000)
npm run dev:backend

# Start Web Learner App (Port 3000)
npm run dev:web

# Start Admin Dashboard (Port 3001)
npm run dev:admin
```

