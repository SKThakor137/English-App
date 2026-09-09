# Phase 4: AI Feedback Engine & Detailed Linguistic Scoring

## 1. Phase Objective
Integrate LLM-driven linguistic analysis bounded by strict Zod schema validation to provide learners with qualitative grammar explanations, vocabulary suggestions, and constructive speaking feedback.

---

## 2. Implemented Features

1. **Strict Zod Runtime Validation**:
   - Every AI response from OpenAI (GPT-4o-mini) is validated with [`ai-feedback.schema.ts`](file:///home/aavatto/English/backend/src/modules/ai-feedback/ai-feedback.schema.ts) prior to database insertion.
   - Prevents hallucinations or malformed JSON payloads from reaching the client.
2. **Deterministic Linguistic Fallback**:
   - If third-party AI keys are unavailable, rate-limited, or return invalid JSON, a rule-based linguistic analyzer generates deterministic feedback based on word diff errors, ensuring zero application downtime.
3. **Compound Scoring Formula**:
   $$\text{Overall Score} = \text{round}(0.60 \times \text{Accuracy Score} + 0.40 \times \text{Fluency Score})$$
   - Fluency is mapped to a WPM normality distribution:
     - $< 60\text{ WPM}$: Hesitant pace (Fluency = 65)
     - $90 - 150\text{ WPM}$: Ideal conversational pace (Fluency = 95)
     - $> 180\text{ WPM}$: Excessively rushed (Fluency = 80)
4. **Structured Pedagogical Output**:
   - **Grammar Errors**: `{ original, corrected, explanation, type }`
   - **Fluency Suggestions**: Tips on sentence rhythm, pause placement, and stress.
   - **Positive Reinforcement**: Specific praise on vocabulary variety and pronunciation.

---

## 3. Database Models in Phase 4

- `AiFeedbackRecord`:
  - `attemptId`: Unique 1:1 foreign key referencing `PracticeAttempt`.
  - `overallScore`, `grammarScore`, `fluencyScore`, `accuracyScore`.
  - `errors`: JSON array of grammar errors and corrections.
  - `suggestions`: JSON array of practical improvement strategies.
  - `positiveFeedback`: Markdown text of learner strengths.

---

## 4. Key Files Created

### Backend
- [`backend/src/modules/ai-feedback/ai-feedback.schema.ts`](file:///home/aavatto/English/backend/src/modules/ai-feedback/ai-feedback.schema.ts) — Zod runtime validation schema.
- [`backend/src/modules/ai-feedback/ai-feedback.service.ts`](file:///home/aavatto/English/backend/src/modules/ai-feedback/ai-feedback.service.ts) — LLM integration with prompt engineering and linguistic fallback.
- [`backend/src/modules/ai-feedback/ai-feedback.module.ts`](file:///home/aavatto/English/backend/src/modules/ai-feedback/ai-feedback.module.ts) — Encapsulated feedback module.
- Integration in [`backend/src/modules/practice/practice.service.ts`](file:///home/aavatto/English/backend/src/modules/practice/practice.service.ts) invoking `AiFeedbackService.generateFeedback()`.

### Frontend
- Feedback panels in [`apps/web/app/(learner)/practice/sentence/[id]/page.tsx`](file:///home/aavatto/English/apps/web/app/(learner)/practice/sentence/%5Bid%5D/page.tsx) displaying grammar tags and corrections.

