# BullMQ Queue Fleet

## Queues
1. `audio-transcription-queue`: High priority. Transcribes 16kHz WAV audio using Whisper/Deepgram.
2. `pronunciation-eval-queue`: Medium priority. Acoustic phoneme analysis.
3. `ai-feedback-queue`: Medium priority. LLM linguistic critique & structured parsing.
4. `pdf-processing-queue`: Low priority. PDF text extraction, OCR, and sentence chunking.

## Worker Configuration
- Max concurrency: Configured per queue type.
- Retries: 3 attempts with exponential backoff (`delay: 1000ms`).
- Dead Letter Queue (DLQ): Failed jobs routed to persistent dead letter queue for admin review.

