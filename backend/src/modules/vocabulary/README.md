# Vocabulary & Spaced Repetition Module (Phase 8)

## Responsibilities
- Master English Lexicon with IPA transcriptions, definitions, and audio.
- Tap-to-define popover handler for words clicked during practice.
- Spaced Repetition System (SRS) using the SuperMemo SM-2 algorithm:
  - Calculates intervals, ease factors ($EF$), and next review timestamps.
  - Review ratings: `1` (Again), `2` (Hard), `3` (Good), `4` (Easy).
- Flashcard review queue generator.

## Key Entities
- `VocabularyWord`: Master word entry, IPA (US/UK), definition, example sentence.
- `UserVocabulary`: User deck progress, interval days, repetitions, ease factor, next review date.

