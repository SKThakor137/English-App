# Phase 2: Curriculum Management & Content Engine

## 1. Phase Objective
Construct the educational spine of the platform: structured CEFR-aligned courses, hierarchical lessons, sentences, stories, paragraphs, and administrative authoring interfaces.

---

## 2. Implemented Features

1. **Curriculum Hierarchy**:
   $$\text{Course (CEFR Band)} \longrightarrow \text{Lesson (Topic Unit)} \longrightarrow \text{Sentence / Paragraph / Story (Drills)}$$
2. **Public Curriculum API**: Paginated course catalogs, lesson syllabus navigation, and sentence retrieval filtered by CEFR level.
3. **Admin Authoring Engine**: Role-guarded (`@Roles(UserRole.ADMIN)`) CRUD endpoints to create, update, reorder, and publish courses, lessons, and sentences.
4. **Automated Curriculum Seeder**: Populates 5 CEFR tier courses (A1 to C1) with real-world practice sentences, IPA transcriptions, and grammar focus rules.

---

## 3. Seeded Curriculum Structure

1. **A1 Beginner**: *Everyday Conversational Foundations* (Greetings, Introductions, Ordering Coffee, Prices).
2. **A2 Elementary**: *Travel, Airports & Socializing* (Check-in, Gate Departures, Directions).
3. **B1 Intermediate**: *Professional Workplace & Agile Communication* (Agile standups, Sprint retrospectives, Evening routines).
4. **B2 Upper Intermediate**: *Technical Presentations & System Architecture* (Architectural tradeoffs, Monolith vs Microservices).
5. **C1 Advanced**: *Executive Persuasion & Strategic Debates* (Diplomatic disagreements, Stakeholder alignment).

---

## 4. Database Models in Phase 2

- `Course`: `id`, `title`, `slug`, `description`, `level` (`CefrLevel`), `topic`, `orderIndex`, `isPublished`.
- `Lesson`: `id`, `courseId`, `title`, `description`, `orderIndex`, `estimatedMinutes`, `isPublished`.
- `Sentence`: `id`, `lessonId`, `targetText`, `ipaTranscription`, `grammarFocus`, `level`, `audioReferenceUrl`.
- `Paragraph`: `id`, `lessonId`, `title`, `content`, `orderIndex`.
- `Story`: `id`, `lessonId`, `title`, `description`, `segments` (`StorySegment[]`).

---

## 5. API Endpoints

| Method | Endpoint | Description | Role |
|---|---|---|---|
| `GET` | `/api/v1/content/courses` | List published courses with lesson counts & filters | Public / User |
| `GET` | `/api/v1/content/courses/:id` | Retrieve course details and lesson syllabus | Public / User |
| `GET` | `/api/v1/content/lessons/:id` | Retrieve lesson sentences, paragraphs & stories | Public / User |
| `GET` | `/api/v1/content/sentences` | Query sentences filtered by CEFR level | Public / User |
| `POST` | `/api/v1/content/courses` | Create new curriculum course | Admin |
| `PATCH`| `/api/v1/content/courses/:id`| Update course metadata or publishing state | Admin |
| `DELETE`|`/api/v1/content/courses/:id`| Delete course and cascaded lessons | Admin |
| `POST` | `/api/v1/content/lessons` | Create lesson within a course | Admin |
| `POST` | `/api/v1/content/sentences` | Add practice sentence with IPA transcription | Admin |

---

## 6. Key Files Created

### Backend
- [`backend/src/modules/content/content.service.ts`](file:///home/aavatto/English/backend/src/modules/content/content.service.ts) — Curriculum querying and administrative operations.
- [`backend/src/modules/content/content.controller.ts`](file:///home/aavatto/English/backend/src/modules/content/content.controller.ts) — Controller with Swagger documentation.
- [`backend/src/modules/content/content.module.ts`](file:///home/aavatto/English/backend/src/modules/content/content.module.ts) — Content domain module.
- [`backend/prisma/seed.ts`](file:///home/aavatto/English/backend/prisma/seed.ts) — Full curriculum database seeder.

### Frontend
- [`apps/web/app/(learner)/courses/page.tsx`](file:///home/aavatto/English/apps/web/app/(learner)/courses/page.tsx) — Learner Course Catalog with level badges.
- [`apps/web/app/(learner)/courses/[id]/page.tsx`](file:///home/aavatto/English/apps/web/app/(learner)/courses/%5Bid%5D/page.tsx) — Course Syllabus and lesson launch view.
- [`apps/admin/app/curriculum/page.tsx`](file:///home/aavatto/English/apps/admin/app/curriculum/page.tsx) — Administrative curriculum data table with tabs.
- [`apps/admin/app/curriculum/sentences/page.tsx`](file:///home/aavatto/English/apps/admin/app/curriculum/sentences/page.tsx) — Administrative Sentence & IPA Phoneme authoring studio.
- [`mobile/lib/features/practice/practice_hub_screen.dart`](file:///home/aavatto/English/mobile/lib/features/practice/practice_hub_screen.dart) — Mobile course and practice mode selector with GoRouter links.

---

## 7. Phase Completion Checklist & Track Validation

- [x] Hierarchical curriculum structure (Courses, Lessons, Sentences, Paragraphs, Stories).
- [x] Database seeder covering 5 CEFR courses (A1 to C1) with real sentences & IPA transcriptions.
- [x] Public curriculum API endpoints with filtering by level.
- [x] Administrative CRUD endpoints for courses, lessons, and practice sentences.
- [x] Learner Web Course Browser & Lesson Syllabus viewer.
- [x] Admin Web Curriculum table and Sentence & IPA authoring console.
- [x] Mobile Practice Hub with syllabus levels.
- [x] **Track Status**: ✅ Phase 2 Complete & On Track


