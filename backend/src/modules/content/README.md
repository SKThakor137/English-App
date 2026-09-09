# Content & Curriculum Module (Phase 2)

## Responsibilities
- Manages hierarchical curriculum: `Course -> Lesson -> Sentence / Paragraph / Story`.
- Implements CEFR level tagging (A1 Beginner to C1 Advanced).
- Serves curriculum catalog for Learner Web and Mobile App.
- Provides content authoring APIs for Admin Web.

## Key Entities
- `Course`: Title, slug, CEFR level, topic, thumbnail.
- `Lesson`: Order index, estimated minutes, prerequisites.
- `Sentence`: Target ground-truth text, IPA transcription, reference audio URL.
- `Paragraph`: Multi-sentence reading passage.
- `Story` & `StorySegment`: Narrative-driven chunked reading.

