# Practice Module (Phase 3)

## Responsibilities
- Orchestrates practice sessions and individual attempts.
- Triggers audio upload verification and dispatches BullMQ transcription jobs.
- Implements the Algorithmic Token Diff Engine (Levenshtein distance matching expected vs spoken words).
- Computes Words-Per-Minute (WPM) and baseline accuracy scores.
- Updates daily user streak upon successful practice completion.

## Key Entities
- `PracticeSession`: Groups attempts within a single continuous sitting.
- `PracticeAttempt`: Stores expected text, spoken transcript, S3 audio key, diff matrix, and scores.

