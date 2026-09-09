# Phase 0: Product Requirements & Technical Architecture Blueprint

## 1. Phase Objective
Establish the product foundation, functional & non-functional requirements, target user personas, CEFR proficiency levels, and the architectural blueprint before writing any production code.

---

## 2. Core Deliberate Practice Cycle
Most language learning platforms suffer from an **active output deficit** (excessive passive multiple-choice or reading drills). This platform centers around the **Deliberate Speaking Loop**:

$$\text{Learn} \longrightarrow \text{Listen} \longrightarrow \text{Speak} \longrightarrow \text{Analyze} \longrightarrow \text{Get Feedback} \longrightarrow \text{Correct} \longrightarrow \text{Repeat} \longrightarrow \text{Use in Conversation}$$

---

## 3. CEFR Language Framework
The platform categorizes all speaking content, phonetic complexity, vocabulary, and conversational scenarios into 6 standardized CEFR bands:

| Level | CEFR Code | Target Audience & Communication Benchmark |
|---|---|---|
| **Beginner** | `A1` | Basic introductions, numbers, simple daily routines, present simple tense. |
| **Elementary** | `A2` | Ordering food, asking for directions, travel booking, airport check-in. |
| **Intermediate** | `B1` | Delivering workplace agile standups, expressing opinions, past/future tenses. |
| **Upper Intermediate** | `B2` | System architecture explanations, technical tradeoffs, compound complex reasoning. |
| **Advanced** | `C1` | Executive negotiations, diplomatic disagreements, keynote delivery, persuasive debates. |
| **Proficient** | `C2` | Idiomatic mastery, native-speed colloquial speech, nuanced rhetoric. |

---

## 4. User Personas

1. **Priya Patel ("The Global Software Engineer")**:
   - Level: B1 (Intermediate)
   - Goal: Articulate updates confidently in daily standups, sprint retrospectives, and client calls.
2. **Carlos Rodriguez ("The Everyday Immigrant")**:
   - Level: A2 (Elementary)
   - Goal: Clear pronunciation in daily American life (grocery shopping, parent-teacher conferences).
3. **Akiko Tanaka ("The Standardized Exam Student")**:
   - Level: B2 (Upper Intermediate)
   - Goal: IELTS Speaking test preparation (target band 7.5), sustained 90-second monologues.
4. **Sarah Jenkins ("The Curriculum Administrator")**:
   - Head of Language Content auditing AI responses, publishing course curricula, and scheduling daily speaking challenges.

---

## 5. Architectural Guarantees & Decisions

- **Modular Monolith Backend**: NestJS 10 application partitioned into domain modules (`Auth`, `Users`, `Content`, `Practice`, `Pronunciation`, `Documents`, `Conversations`, `Vocabulary`, `Progress`, `Challenges`, `Subscriptions`).
- **Separation of Speech Recognition from Pronunciation**:
  - *Speech-to-Text (STT)*: Whisper / Deepgram probabilistic language model for transcript recovery.
  - *Pronunciation Engine*: Acoustic phoneme comparison against ground truth IPA symbols to detect true pronunciation errors.
- **Deterministic AI Guardrails**: Generative AI (LLMs) used strictly for qualitative grammar explanations; core scoring (accuracy, completeness, WPM) computed via algorithmic Dynamic Programming Levenshtein alignment.
- **Cost Quota Protection**: Redis token-bucket rate limiting and database daily quotas (Free: 20 sentences/day; Premium: Unlimited).

---

## 6. Files Created in this Phase

- [`PLAN.md`](file:///home/aavatto/English/PLAN.md) — 32-section comprehensive Master Plan and PRD.
- [`docs/architecture.md`](file:///home/aavatto/English/docs/architecture.md) — System topology, sequence diagrams, and module interaction graphs.
- [`docs/api_specification.md`](file:///home/aavatto/English/docs/api_specification.md) — Complete REST API contract across all domain modules.

---

## 7. Phase Completion Checklist & Track Validation

- [x] Product Requirements Document (PRD) with CEFR levels (A1 to C1).
- [x] 4 Detailed User Personas (Global Dev, Immigrant Worker, IELTS Student, Curriculum Admin).
- [x] Full Screen Inventories for Web, Flutter, and Admin.
- [x] Normalized PostgreSQL 16 schema & Mermaid ERD.
- [x] Complete REST API contracts.
- [x] Audio storage, BullMQ queue topology, and cost control model.
- [x] **Track Status**: ✅ Phase 0 Complete & On Track


