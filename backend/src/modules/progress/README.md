# Progress & Analytics Module (Phase 8)

## Responsibilities
- Computes and aggregates user learning statistics:
  - Daily active streak and streak freeze logic.
  - Practice minutes, sentences completed, and words spoken.
  - Average pronunciation, fluency, and accuracy trends.
- Radar chart skill profile (Grammar, Pronunciation, Fluency, Vocabulary, Speed).
- Recurring weakness detector (e.g. past tense errors, third-person singular, specific phonemes).
- Personalized recommendation generator based on detected weaknesses.

## Key Entities
- `UserStreak`: Current streak, longest streak, freeze credits.
- `UserDailyProgress`: Daily rollup of seconds, words, and accuracy.
- `UserWeakness`: Recurring error types and occurrence counts.

