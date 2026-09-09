# Dedicated Pronunciation & Phonetics Module (Phase 5)

## Responsibilities
- Acoustic phoneme alignment against ground-truth International Phonetic Alphabet (IPA).
- Decouples speech recognition from pronunciation assessment.
- Computes:
  - Phoneme-level accuracy scores (0-100).
  - Word stress and syllable intonation.
  - Completeness and fluency markers.
- Integrates with Azure Speech Assessment / SpeechAce.

## Key Entities
- `PhonemeEvaluation`: Stores word-by-word phoneme accuracy and error types.

