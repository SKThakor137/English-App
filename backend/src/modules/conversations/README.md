# AI Conversations & Free Speaking Module (Phase 7)

## Responsibilities
- Manages multi-turn voice conversations with dynamic AI personas.
- Scenarios: Workplace Standup, Job Interview, Airport Check-in, Coffee Shop, etc.
- Turn lifecycle:
  1. User speaks response (Audio).
  2. STT transcribes & evaluates turn for relevance and grammar.
  3. LLM persona generates next dialog turn.
  4. Neural TTS synthesizes realistic voice response audio.
- Free Speaking mode: 60-second monologue prompt with fluency, pace (WPM), and filler word evaluation.

## Key Entities
- `ConversationScenario`: Pre-configured persona prompt, initial message, difficulty.
- `ConversationSession`: Session lifecycle, overall score, turns counter.
- `ConversationMessage`: Turn transcript, sender (`USER` / `AI`), audio S3 key, grammar critique.

