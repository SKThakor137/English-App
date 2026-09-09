# Phase 8: Progress Analytics, Weakness Detection & Spaced Vocabulary

## 1. Phase Objective
Ensure long-term lexical retention through the SuperMemo SM-2 spaced repetition algorithm and provide holistic learner visibility via multi-dimensional CEFR skill analytics and automated weakness detection.

---

## 2. Implemented Features

1. **SuperMemo SM-2 Spaced Repetition Engine**:
   - Manages personal flashcard decks for words encountered during speaking practice.
   - 4-Tier recall rating:
     - Grade 1 (Forgot completely): Repetitions reset to 0, review tomorrow.
     - Grade 2 (Hesitant recall): Repetitions reset to 0, review tomorrow.
     - Grade 3 (Good recall): Interval advances.
     - Grade 4 (Instant recall): Interval advances with ease factor bonus.
   - Mathematical formula:
     $$\text{EF}' = \text{EF} + \left(0.1 - (5 - q) \times \left(0.08 + (5 - q) \times 0.02\right)\right), \quad \text{EF}' \ge 1.30$$
     $$I(1) = 1\text{ day}, \quad I(2) = 6\text{ days}, \quad I(n) = \text{round}(I(n-1) \times \text{EF})$$
2. **Multi-Dimensional CEFR Skill Analytics**:
   - Synthesizes speaking attempt data across 5 core competencies:
     - **Pronunciation** (acoustic phoneme accuracy)
     - **Fluency** (WPM rhythm normality)
     - **Grammar** (Zod error density)
     - **Vocabulary Variety** (unique lexical diversity)
     - **Coherence** (conversational turn completion)
3. **Automated Weakness Detection**:
   - Detects recurring phonetic and grammatical error patterns (e.g. repeated past tense omissions or specific vowel substitutions) and recommends targeted remedial drills.

---

## 3. Database Models in Phase 8

- `VocabularyWord`: `id`, `word`, `ipa`, `ipaUs`, `definition`, `exampleSentence`, `cefrLevel`, `audioUrl`.
- `UserVocabulary`: `userId`, `wordId`, `repetitions`, `intervalDays`, `easeFactor`, `nextReviewAt`, `masteryPercentage`.
- `UserDailyProgress`: `userId`, `activityDate`, `sentencesPracticed`, `practiceSeconds`, `wordsSpoken`, `averageAccuracy`.
- `UserWeakness`: `userId`, `weaknessType`, `identifier`, `errorCount`, `lastEncounteredAt`.

---

## 4. API Endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/api/v1/vocabulary/save` | Save new word to personal SRS review deck | Authenticated |
| `GET` | `/api/v1/vocabulary` | List all saved vocabulary words | Authenticated |
| `GET` | `/api/v1/vocabulary/due` | Fetch words due for SM-2 review today | Authenticated |
| `POST` | `/api/v1/vocabulary/review`| Submit recall rating (1-4) and calculate new interval | Authenticated |
| `DELETE`|`/api/v1/vocabulary/:id` | Remove word from deck | Authenticated |
| `GET` | `/api/v1/progress/summary`| Retrieve CEFR radar skills & recurring weaknesses | Authenticated |
| `GET` | `/api/v1/progress/history`| Daily practice minutes and accuracy over past 30 days | Authenticated |

---

## 5. Key Files Created

### Backend
- [`backend/src/modules/vocabulary/vocabulary.service.ts`](file:///home/aavatto/English/backend/src/modules/vocabulary/vocabulary.service.ts) — SM-2 algorithm scheduler and review processing.
- [`backend/src/modules/vocabulary/vocabulary.controller.ts`](file:///home/aavatto/English/backend/src/modules/vocabulary/vocabulary.controller.ts) — Vocabulary REST endpoints.
- [`backend/src/modules/vocabulary/vocabulary.module.ts`](file:///home/aavatto/English/backend/src/modules/vocabulary/vocabulary.module.ts) — Vocabulary module.
- [`backend/src/modules/progress/progress.service.ts`](file:///home/aavatto/English/backend/src/modules/progress/progress.service.ts) — Historical progress, streak calculation, and weakness aggregation.
- [`backend/src/modules/progress/progress.controller.ts`](file:///home/aavatto/English/backend/src/modules/progress/progress.controller.ts) — Progress analytics endpoints.
- [`backend/src/modules/progress/progress.module.ts`](file:///home/aavatto/English/backend/src/modules/progress/progress.module.ts) — Progress module.

### Frontend
- [`apps/web/app/(learner)/vocabulary/page.tsx`](file:///home/aavatto/English/apps/web/app/(learner)/vocabulary/page.tsx) — Interactive flip flashcards with 4-tier SM-2 rating buttons.
- [`apps/web/app/(learner)/progress/page.tsx`](file:///home/aavatto/English/apps/web/app/(learner)/progress/page.tsx) — Learner skill radar, practice history, and weakness drill links.
- [`mobile/lib/features/vocabulary/vocabulary_screen.dart`](file:///home/aavatto/English/mobile/lib/features/vocabulary/vocabulary_screen.dart) — Mobile SuperMemo SM-2 flashcard deck.
- [`mobile/lib/features/progress/progress_screen.dart`](file:///home/aavatto/English/mobile/lib/features/progress/progress_screen.dart) — Mobile CEFR radar chart and weakness remediation.

---

## 6. Phase Completion Checklist & Track Validation

- [x] SuperMemo SM-2 spaced repetition scheduler with 4-tier rating.
- [x] Retention interval progression ($I(1) = 1, I(2) = 6, I(n) = I(n-1) \times \text{EF}$).
- [x] Multi-dimensional CEFR skill analytics (Pronunciation, Fluency, Grammar, Lexical Variety, Coherence).
- [x] Recurring weakness pattern recognition and drill recommendations.
- [x] Interactive flip flashcard deck with instant rating on Web & Mobile.
- [x] Progress analytics dashboards with 30-day velocity metrics on Web & Mobile.
- [x] **Track Status**: ✅ Phase 8 Complete & On Track


