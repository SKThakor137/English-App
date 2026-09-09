# PDF & Document Ingestion Module (Phase 6)

## Responsibilities
- Secure upload of learning PDFs via S3 pre-signed URLs.
- Background extraction pipeline (BullMQ `pdf-processing-queue`):
  1. Native text extraction via `pdf-parse`.
  2. OCR fallback via Tesseract for scanned documents.
  3. Structural chunking: Document -> Chapter -> Paragraph -> Sentence.
  4. Sentence filtering (3-40 words) and automated CEFR classification.
- Dynamic custom lesson creation for personalized speaking practice.

## Key Entities
- `Document`: File metadata, page count, processing status (`PENDING`, `PROCESSING`, `COMPLETED`, `FAILED`).
- `DocumentChunk`: Extracted and cleaned sentences ready for deliberate practice.

