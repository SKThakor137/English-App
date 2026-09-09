# AI Linguistic Feedback Module (Phase 4)

## Responsibilities
- Evaluates spoken transcripts against ground-truth sentences using LLMs (Gemini / OpenAI).
- Strict output enforcement via Zod schema (`AiFeedbackSchema`).
- Produces:
  - Grammatical error breakdowns with human-friendly explanations.
  - Natural phrasing suggestions.
  - Encouraging positive reinforcement.
- Circuit breaker & JSON sanitization fallback for malformed responses.

## Key Entities
- `AiFeedbackRecord`: Stores structured corrections, suggestions, and model version.

