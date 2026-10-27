
## File 7 — `backend/doc/API-Index.md`

**Is file mein assignment attachment endpoint add hai, aur Quiz aur Doubt Forum ke endpoints bhi included hain.** Poora current API index replace karna.

```markdown
# Complete API Endpoint Index

Base URL: `http://localhost:5000`

Protected endpoints require `Authorization: Bearer <ACCESS_TOKEN>`. The current roles are `student` and `teacher`.

## Health and authentication

| Method | Endpoint | Access |
|---|---|---|
| GET | `/api/health` | Public |
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/verify-otp` | Public |
| POST | `/api/auth/resend-otp` | Public |
| POST | `/api/auth/login` | Public |
| POST | `/api/auth/google` | Public |
| POST | `/api/auth/refresh` | Refresh token required in body |
| POST | `/api/auth/logout` | Refresh token optional in body |
| GET | `/api/auth/me` | Authenticated user |

## Classroom management

| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/classrooms` | Teacher |
| GET | `/api/classrooms` | Teacher or student |
| POST | `/api/classrooms/join` | Student |
| GET | `/api/classrooms/:id` | Classroom owner or enrolled student |
| PATCH | `/api/classrooms/:id` | Owning teacher |
| DELETE | `/api/classrooms/:id/students/:studentId` | Owning teacher |
| POST | `/api/classrooms/:id/leave` | Student |
| DELETE | `/api/classrooms/:id` | Owning teacher; destructive |

## Assignments and grading

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| POST | `/api/classrooms/:id/assignments` | Owning teacher | Create an assignment with JSON or multipart/form-data; optional PDF field `file` |
| GET | `/api/classrooms/:id/assignments` | Classroom owner or enrolled student | List assignments and optional PDF metadata |
| GET | `/api/assignments/:id/attachment` | Classroom owner or enrolled student | Return attached PDF bytes |
| POST | `/api/assignments/:id/submit` | Enrolled student | Submit answer text and/or URL |
| GET | `/api/assignments/:id/submissions` | Assignment teacher | List student submissions |
| PATCH | `/api/assignments/:assignmentId/submissions/:submissionId/grade` | Assignment teacher | Grade a submission |
| GET | `/api/assignments/:id/my-submission` | Enrolled student | Retrieve own submission and grade |

## Study materials

| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/classrooms/:id/materials` | Owning teacher |
| GET | `/api/classrooms/:id/materials` | Classroom owner or enrolled student |
| GET | `/api/materials/:id/download` | Classroom owner or enrolled student |
| PATCH | `/api/materials/:id` | Owning teacher |
| DELETE | `/api/materials/:id` | Owning teacher |

## Announcements and notifications

| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/classrooms/:id/announcements` | Owning teacher |
| GET | `/api/classrooms/:id/announcements` | Classroom member |
| PATCH | `/api/announcements/:id` | Announcement-owning teacher |
| DELETE | `/api/announcements/:id` | Announcement-owning teacher |
| GET | `/api/notifications` | Authenticated user; own notifications |
| PATCH | `/api/notifications/:id/read` | Notification recipient |

## Analytics and ML

| Method | Endpoint | Access |
|---|---|---|
| GET | `/api/analytics/student/overview` | Student |
| GET | `/api/analytics/student/classrooms/:id` | Enrolled student |
| GET | `/api/analytics/teacher/classrooms/:id` | Owning teacher |
| GET | `/api/analytics/teacher/classrooms/:id/students` | Owning teacher |
| GET | `/api/analytics/teacher/classrooms/:id/risk-predictions` | Owning teacher |
| PUT | `/api/analytics/teacher/classrooms/:id/students/:studentId/risk-profile` | Owning teacher; student must be enrolled |

## AI summarizer, flashcards, and quiz generation

| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/ai/summarize` | Student or teacher; PDF multipart field `file` |
| POST | `/api/ai/quizzes/generate` | Teacher; topic/study text JSON |
| POST | `/api/ai/quizzes/generate-from-pdf` | Teacher; multipart PDF field `file` |

AI generation returns content and does not automatically save a persistent quiz to MongoDB.

## Persistent quizzes

| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/quizzes` | Teacher who owns the classroom |
| GET | `/api/quizzes/classrooms/:classroomId` | Owning teacher |
| PATCH | `/api/quizzes/:quizId/publish` | Owning teacher |
| PATCH | `/api/quizzes/:quizId/unpublish` | Owning teacher |
| GET | `/api/quizzes/:quizId/results` | Owning teacher |
| GET | `/api/quizzes/student/classrooms/:classroomId` | Enrolled student |
| POST | `/api/quizzes/:quizId/submit` | Enrolled student |
| GET | `/api/quizzes/student/attempts` | Student |

## Doubt discussion forum

| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/discussions/classrooms/:classroomId/doubts` | Enrolled student |
| GET | `/api/discussions/classrooms/:classroomId/doubts` | Classroom owner or enrolled student |
| POST | `/api/discussions/doubts/:doubtId/replies` | Classroom teacher or enrolled student; doubt must be open |
| PATCH | `/api/discussions/doubts/:doubtId/status` | Classroom teacher or doubt author |

## Notes

- Replace placeholders such as `:id`, `:classroomId`, `:assignmentId`, `:submissionId`, `:quizId`, and `:doubtId` with actual MongoDB ObjectIds.
- The assignment attachment endpoint returns PDF bytes, not JSON. Frontend clients must send the access token and handle the response as a Blob.
- `MODEL_API_URL` is required for ML prediction routes.
- `AI_SERVICE_URL` and `QUIZ_SERVICE_URL` are required for summarizer and AI quiz generation.
- Never expose JWT secrets, Cloudinary secrets, or Gemini API keys in frontend code.
- Classroom deletion and demo reset can permanently delete data. Test these operations on disposable data and retain backups.