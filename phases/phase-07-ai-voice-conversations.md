# Phase 7: AI Multi-Turn Conversations & Free Speaking

## 1. Phase Objective
Immerse learners in realistic, multi-turn conversational roleplays with AI personas to bridge the gap between isolated sentence drills and spontaneous workplace English.

---

## 2. Implemented Features

1. **Multi-Turn Contextual Roleplay Personas**:
   - **Agile Scrum Standup**: Lead Engineer *Sarah* asking for yesterday's progress, today's goals, and project blockers.
   - **Technical Job Interview**: Engineering Manager *Alex* exploring distributed system tradeoffs and teamwork friction.
   - **International Travel & Concierge**: Concierge *Marco* assisting with reservations, hotel check-in, and local transport.
2. **Turn-by-Turn Conversational Evaluation**:
   - Each learner voice response is analyzed for grammar, vocabulary variety, and topical relevance.
3. **Voice Chat Console**:
   - Push-to-talk microphone, automated transcription, speech bubble playback, and conversation history.

---

## 3. Database Models in Phase 7

- `ConversationScenario`:
  - `scenarioKey`, `title`, `systemPrompt`, `personaName`, `personaRole`, `cefrLevel`.
- `ConversationSession`:
  - `userId`, `scenarioId`, `status` (`ACTIVE`, `COMPLETED`, `ABANDONED`), `turnCount`, `startedAt`, `endedAt`.
- `ConversationMessage`:
  - `sessionId`, `senderRole` (`USER`, `ASSISTANT`, `SYSTEM`), `textContent`, `audioUrl`, `overallTurnScore`.

---

## 4. API Endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/api/v1/conversations/session` | Start new conversation session with persona | Authenticated |
| `POST` | `/api/v1/conversations/:id/turn` | Submit learner speech turn and receive AI reply | Authenticated |
| `POST` | `/api/v1/conversations/:id/end` | Terminate session and get comprehensive debrief | Authenticated |

---

## 5. Key Files Created

### Backend
- [`backend/src/modules/conversations/conversations.service.ts`](file:///home/aavatto/English/backend/src/modules/conversations/conversations.service.ts) — Session management, AI persona orchestration, and turn evaluation.
- [`backend/src/modules/conversations/conversations.controller.ts`](file:///home/aavatto/English/backend/src/modules/conversations/conversations.controller.ts) — Conversation REST endpoints.
- [`backend/src/modules/conversations/conversations.module.ts`](file:///home/aavatto/English/backend/src/modules/conversations/conversations.module.ts) — Conversations module.

### Frontend
- [`apps/web/app/(learner)/conversations/page.tsx`](file:///home/aavatto/English/apps/web/app/(learner)/conversations/page.tsx) — Interactive voice chat interface with scenario picker.

