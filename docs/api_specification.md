# Complete REST API Specification

All endpoints return uniform response envelopes:
- **Success**: `{ "success": true, "data": { ... } }`
- **Error**: `{ "success": false, "error": { "code": "STRING", "message": "...", "details": [...] } }`

Base URL: `/api/v1`

## 1. Authentication (`/auth`)
| Method | Path | Access | Description |
|---|---|---|---|
| `POST` | `/auth/register` | Public | Register new user (email, password, fullName) |
| `POST` | `/auth/login` | Public | Authenticate user & issue tokens |
| `POST` | `/auth/refresh` | Public | Renew access token via refresh token |
| `GET` | `/auth/me` | Bearer | Get current authenticated user profile & streak |

## 2. Users & Onboarding (`/users`)
| Method | Path | Access | Description |
|---|---|---|---|
| `POST` | `/users/onboarding` | Bearer | Save level, goals, daily target minutes |
| `PATCH` | `/users/profile` | Bearer | Update profile info, timezone, goals |
| `GET` | `/users/dashboard` | Bearer | Aggregated daily metrics, streak, quotas |

## 3. Curriculum & Content (`/courses`, `/lessons`) - Phase 2
| Method | Path | Access | Description |
|---|---|---|---|
| `GET` | `/courses` | Bearer | List published courses by CEFR level |
| `GET` | `/courses/:id` | Bearer | Get course syllabus and lessons |
| `GET` | `/lessons/:id` | Bearer | Get lesson practice exercises |

## 4. Practice & Audio Evaluation (`/practice`) - Phase 3 & 4
| Method | Path | Access | Description |
|---|---|---|---|
| `POST` | `/practice/pre-signed-url` | Bearer | Obtain temporary upload URL for 16kHz WAV audio |
| `POST` | `/practice/attempts` | Bearer | Submit spoken audio attempt for scoring & diff analysis |
| `GET` | `/practice/attempts/:id` | Bearer | Retrieve detailed attempt feedback & phoneme breakdown |

## 5. Conversations (`/conversations`) - Phase 7
| Method | Path | Access | Description |
|---|---|---|---|
| `GET` | `/conversations/scenarios` | Bearer | List available AI conversational roleplays |
| `POST` | `/conversations/sessions` | Bearer | Initialize a conversation session |
| `POST` | `/conversations/sessions/:id/turn` | Bearer | Send user audio turn, receive AI response & audio |
| `POST` | `/conversations/sessions/:id/conclude` | Bearer | Conclude session and receive comprehensive report card |

## 6. Documents & PDF Processing (`/documents`) - Phase 6
| Method | Path | Access | Description |
|---|---|---|---|
| `POST` | `/documents/upload-url` | Bearer | Pre-signed URL for PDF upload |
| `POST` | `/documents` | Bearer | Register uploaded document and enqueue OCR/parsing |
| `GET` | `/documents` | Bearer | List user uploaded documents |
| `GET` | `/documents/:id` | Bearer | Get document chapters and practice chunks |

## 7. Vocabulary (`/vocabulary`) - Phase 8
| Method | Path | Access | Description |
|---|---|---|---|
| `GET` | `/vocabulary` | Bearer | List saved vocabulary words |
| `POST` | `/vocabulary` | Bearer | Save new word to personal deck |
| `POST` | `/vocabulary/:id/review` | Bearer | Submit SM-2 review score (1-4) |

## 8. Progress & Analytics (`/progress`) - Phase 8
| Method | Path | Access | Description |
|---|---|---|---|
| `GET` | `/progress/summary` | Bearer | Radar scores, total practice minutes, WPM |
| `GET` | `/progress/weekly` | Bearer | Daily historical activity for current week |
| `GET` | `/progress/weaknesses` | Bearer | Top recurring grammatical/phonetic errors |

## 9. Challenges (`/challenges`) - Phase 9
| Method | Path | Access | Description |
|---|---|---|---|
| `GET` | `/challenges/today` | Bearer | Today's active daily speaking challenge |
| `POST` | `/challenges/:id/attempt` | Bearer | Submit audio attempt for challenge leaderboard |

## 10. Admin Console (`/admin/*`) - Phase 2 & 9
| Method | Path | Access | Description |
|---|---|---|---|
| `GET` | `/admin/metrics` | Admin | Platform telemetry, spend, queue statuses |
| `POST` | `/admin/courses` | Admin | Create or edit courses |
| `POST` | `/admin/sentences` | Admin | Bulk create/import practice sentences |
| `GET` | `/admin/ai-jobs` | Admin | BullMQ queue supervisor & DLQ retrier |

