# Phase 6: PDF & Document Learning Pipeline

## 1. Phase Objective
Allow learners to upload arbitrary workplace PDFs, articles, or study textbooks, automatically extracting structural paragraphs and clean practice sentences with CEFR difficulty grading.

---

## 2. Implemented Features

1. **PDF Text Extraction & Cleaning**:
   - Ingests user-uploaded PDF binary files via `pdf-parse`.
   - Strips PDF artifact noise (headers, footers, page numbers, trailing symbols).
2. **Structural Chunking Engine**:
   - Segments raw text into chapters, logical paragraphs, and individual target practice sentences.
3. **Automated CEFR Difficulty Classification**:
   - Calculates readability metrics (syllable density, sentence length, and vocabulary difficulty) to automatically estimate the CEFR tier of the uploaded material (`BEGINNER` to `ADVANCED`).
4. **Personalized Drill Generation**:
   - Enables learners to launch sentence-by-sentence speaking drills directly from their uploaded workplace design docs or articles.

---

## 3. Database Models in Phase 6

- `Document`:
  - `userId`: References `User`.
  - `title`, `fileS3Key`, `status` (`PENDING`, `PROCESSING`, `COMPLETED`, `FAILED`).
  - `estimatedLevel`: Inferred `CefrLevel`.
  - `totalSentences`: Count of extracted sentences.
- `DocumentChunk`:
  - `documentId`: References `Document`.
  - `chunkIndex`: Ordering index.
  - `textContent`: Clean paragraph text.
  - `targetSentences`: JSON array of parsed sentences available for deliberate practice.

---

## 4. API Endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/api/v1/documents/upload` | Upload PDF and start parsing pipeline | Authenticated |
| `GET` | `/api/v1/documents` | List learner's processed documents | Authenticated |
| `GET` | `/api/v1/documents/:id` | Get document chunks and practice sentences | Authenticated |
| `DELETE`|`/api/v1/documents/:id` | Delete document and associated chunks | Authenticated |

---

## 5. Key Files Created

### Backend
- [`backend/src/modules/documents/pdf-parser.service.ts`](file:///home/aavatto/English/backend/src/modules/documents/pdf-parser.service.ts) — PDF extraction, chunking, and CEFR grading.
- [`backend/src/modules/documents/documents.service.ts`](file:///home/aavatto/English/backend/src/modules/documents/documents.service.ts) — Document CRUD and chunk storage.
- [`backend/src/modules/documents/documents.controller.ts`](file:///home/aavatto/English/backend/src/modules/documents/documents.controller.ts) — REST controller with Swagger docs.
- [`backend/src/modules/documents/documents.module.ts`](file:///home/aavatto/English/backend/src/modules/documents/documents.module.ts) — Document processing module.

### Frontend
- [`apps/web/app/(learner)/documents/page.tsx`](file:///home/aavatto/English/apps/web/app/(learner)/documents/page.tsx) — Drag-and-drop document upload and sentence drill launcher.
- [`apps/admin/app/documents/page.tsx`](file:///home/aavatto/English/apps/admin/app/documents/page.tsx) — Admin PDF ingestion monitor and chunk inspection.

---

## 6. Phase Completion Checklist & Track Validation

- [x] Ingestion and cleaning of arbitrary PDF documents via `pdf-parse`.
- [x] Text artifact noise stripping (headers, footers, page numbers).
- [x] Structural chunking into logical chapters, paragraphs, and practice sentences.
- [x] Automated CEFR readability index estimation on extracted text.
- [x] Dynamic generation of personalized speaking drills from documents.
- [x] Admin document telemetry and processing audit view.
- [x] **Track Status**: ✅ Phase 6 Complete & On Track


