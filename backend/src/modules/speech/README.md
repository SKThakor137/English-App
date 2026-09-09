# Speech Engine Module (Phase 3)

## Responsibilities
- Pluggable Speech-to-Text provider abstraction (`ISpeechProvider`).
- Concrete providers:
  - `WhisperSpeechProvider` (OpenAI / Groq Whisper-large-v3)
  - `DeepgramSpeechProvider` (Nova-2)
  - `MockSpeechProvider` (Deterministic provider for offline/testing environments)
- Formats: 16,000 Hz, 16-bit Mono Linear PCM or high-efficiency Opus/WAV.
- Word-level timestamps for pronunciation alignment.

