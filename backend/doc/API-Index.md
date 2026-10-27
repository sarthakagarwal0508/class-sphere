# Complete API Endpoint Index

**Base URL (local):** `http://localhost:5000`  
**Authentication:** Protected endpoints require `Authorization: Bearer <ACCESS_TOKEN>`.  
**Roles:** `student` and `teacher`; the current User schema has no `admin` role.

Use JSON request bodies unless a row explicitly says `multipart/form-data` or the endpoint returns a PDF binary response. Replace path placeholders such as `:id`, `:classroomId`, `:quizId`, and `:doubtId` with real MongoDB ObjectId strings.

## Health and authentication

| Method | Endpoint | Access | Purpose / body |
|---|---|---|---|
| GET | `/api/health` | Public | Health check; confirms the API process responds, not that every integration is healthy |
| POST | `/api/auth/register` | Public | `{name,email,password,role?}`; starts email-verification flow |
| POST | `/api/auth/verify-otp` | Public, rate-limited | `{email,otp}` |
| POST | `/api/auth/resend-otp` | Public, rate-limited | `{email}` |
| POST | `/api/auth/login` | Public, rate-limited | `{email,password}` |
| POST | `/api/auth/google` | Public | `{idToken,role?}`; `role` is needed for a new Google account as defined by the Google-auth controller |
| POST | `/api/auth/refresh` | Public route; refresh token required in body | `{refreshToken}`; refresh-token rotation means replace both returned tokens |
| POST | `/api/auth/logout` | Public route; refresh token optional in body | `{refreshToken}` |
| GET | `/api/auth/me` | Authenticated user | No body; current user details |

## Classrooms

| Method | Endpoint | Access | Purpose / body |
|---|---|---|---|
| POST | `/api/classrooms` | Teacher | `{name,description?,subject?,semesterSection?}` |
| GET | `/api/classrooms` | Teacher or student | No body; teacher's classrooms or student's enrolled classrooms |
| POST | `/api/classrooms/join` | Student | `{classCode}` |
| GET | `/api/classrooms/:id` | Teacher or student; must own/be enrolled | No body |
| PATCH | `/api/classrooms/:id` | Owning teacher | Any supported subset of `{name,description,subject,semesterSection}` |
| DELETE | `/api/classrooms/:id/students/:studentId` | Owning teacher | No body; remove a student from the classroom |
| POST | `/api/classrooms/:id/leave` | Student | No body; leave classroom |
| DELETE | `/api/classrooms/:id` | Owning teacher | Destructive operation; see cleanup caveats in `README.md` and `CHANGELOG-and-Testing.md` |

## Assignments and grading

| Method | Endpoint | Access | Purpose / body |
|---|---|---|---|
| POST | `/api/classrooms/:id/assignments` | Teacher owning classroom | `{title,description?,dueDate,maxMarks}` |
| GET | `/api/classrooms/:id/assignments` | Teacher owner or enrolled student | No body |
| POST | `/api/assignments/:id/submit` | Enrolled student | `{answerText?,submissionUrl?}`; at least one must be supplied |
| GET | `/api/assignments/:id/submissions` | Teacher who owns the assignment's classroom | No body |
| PATCH | `/api/assignments/:assignmentId/submissions/:submissionId/grade` | Teacher who owns the assignment's classroom | `{marksObtained,feedback?}` |
| GET | `/api/assignments/:id/my-submission` | Enrolled student | No body; current student's submission |

## Study materials

| Method | Endpoint | Access | Purpose / body |
|---|---|---|---|
| POST | `/api/classrooms/:id/materials` | Owning teacher | `multipart/form-data`: PDF `file`, text `title`, optional `description`; maximum PDF size 10 MB |
| GET | `/api/classrooms/:id/materials` | Owning teacher or enrolled student | No body; list metadata without `cloudinaryPublicId` |
| GET | `/api/materials/:id/download` | Owning teacher or enrolled student | No body; returns PDF binary (`application/pdf`), not JSON |
| PATCH | `/api/materials/:id` | Owning teacher | `{title?,description?}`; at least one field required |
| DELETE | `/api/materials/:id` | Owning teacher | No body; deletes Cloudinary file and database row |

## Announcements and notifications

| Method | Endpoint | Access | Purpose / body |
|---|---|---|---|
| POST | `/api/classrooms/:id/announcements` | Owning teacher | `{title,content}` |
| GET | `/api/classrooms/:id/announcements` | Authenticated classroom member | No body |
| PATCH | `/api/announcements/:id` | Teacher; controller checks announcement ownership | `{title?,content?}` |
| DELETE | `/api/announcements/:id` | Teacher; controller checks announcement ownership | No body; deletes notifications linked to the announcement |
| GET | `/api/notifications` | Authenticated user | No body; only the current user's notifications |
| PATCH | `/api/notifications/:id/read` | Authenticated notification recipient | No body; marks own notification as read |

## Analytics and ML performance insights

| Method | Endpoint | Access | Purpose / body |
|---|---|---|---|
| GET | `/api/analytics/student/overview` | Student | No body; aggregate overview of the student's classrooms and assignments |
| GET | `/api/analytics/student/classrooms/:id` | Enrolled student | No body; assignment-level analytics for a classroom |
| GET | `/api/analytics/teacher/classrooms/:id` | Owning teacher | No body; classroom-level assignment/submission analytics |
| GET | `/api/analytics/teacher/classrooms/:id/students` | Owning teacher | No body; student-level analytics |
| PUT | `/api/analytics/teacher/classrooms/:id/students/:studentId/risk-profile` | Owning teacher; target student must be enrolled | Model profile fields; see `ML-Performance-Insights.md` |
| GET | `/api/analytics/teacher/classrooms/:id/risk-predictions` | Owning teacher | No body; sends configured student inputs to the deployed ML service; results are calculated live |

## AI summarizer, flashcards, and quiz generation

| Method | Endpoint | Access | Purpose / body |
|---|---|---|---|
| POST | `/api/ai/summarize` | Authenticated student or teacher | `multipart/form-data`, PDF field `file`, max 10 MB; returns summary and flashcards |
| POST | `/api/ai/quizzes/generate` | Teacher | `{topic?,study_material?,num_questions?,difficulty?}`; returns generated MCQs including answer keys |
| POST | `/api/ai/quizzes/generate-from-pdf` | Teacher | `multipart/form-data`: PDF `file`, optional `num_questions`, `difficulty`; returns generated MCQs including answer keys |

AI generation returns content and does not itself persist a quiz in MongoDB. For the persistent quiz workflow, use the endpoints in the next section.

## Persistent quizzes and attempts

| Method | Endpoint | Access | Purpose / body |
|---|---|---|---|
| POST | `/api/quizzes` | Teacher who owns the target classroom | Save questions as a draft or publish during creation; JSON fields include `title`, `classroomId`, `questions`, optional `topic`, `difficulty`, `source`, `status`, `totalMarks` |
| GET | `/api/quizzes/classrooms/:classroomId` | Teacher who owns the classroom | No body; list quizzes for that classroom; questions are omitted from this list response |
| PATCH | `/api/quizzes/:quizId/publish` | Teacher who owns the quiz's classroom | No body; publishes after answer-key validation |
| PATCH | `/api/quizzes/:quizId/unpublish` | Teacher who owns the quiz's classroom | No body; blocked when the quiz already has attempts |
| GET | `/api/quizzes/:quizId/results` | Teacher who owns the quiz's classroom | No body; saved attempts and student result details |
| GET | `/api/quizzes/student/classrooms/:classroomId` | Student enrolled in the classroom | No body; published quizzes with known answer-key fields removed |
| POST | `/api/quizzes/:quizId/submit` | Student enrolled in the quiz's classroom | `{answers:[{questionIndex,selectedAnswer}]}`; evaluates and saves the attempt |
| GET | `/api/quizzes/student/attempts` | Student | No body; the current student's attempt history |

Quiz question objects are stored as `Mixed`, so the precise question shape is supplied by the client/service. The current controller recognizes these answer-key property names: `correctAnswer`, `correct_answer`, `answer`, `correctOption`, and `correct_option`. Confirm the AI service's actual output schema and do not return answer keys to students.

## Doubt discussion forum

All routes below use the `/api/discussions` mount prefix and require a valid access token.

| Method | Endpoint | Access | Purpose / body |
|---|---|---|---|
| POST | `/api/discussions/classrooms/:classroomId/doubts` | Enrolled student | `{title,description}`; creates a new open doubt |
| GET | `/api/discussions/classrooms/:classroomId/doubts` | Classroom teacher or enrolled student | Optional query string: `status=open` or `status=resolved`, plus `page=1&limit=20`; lists doubts and replies |
| POST | `/api/discussions/doubts/:doubtId/replies` | Classroom teacher or enrolled student | `{message}`; only while the doubt is open |
| PATCH | `/api/discussions/doubts/:doubtId/status` | Classroom teacher or doubt author student | `{status:"open"}` or `{status:"resolved"}` |

Doubt title length is limited to 150 characters, description to 5000 characters, and reply message to 3000 characters. Only classroom members can read or reply to classroom doubts. Students can create doubts and change their own doubt status; teachers can change status for doubts in their classroom.

## Notes and deployment configuration

- `MODEL_API_URL` is required for ML prediction requests. See `ML-Performance-Insights.md`.
- `AI_SERVICE_URL` and `QUIZ_SERVICE_URL` are required for the AI summary/quiz generation routes. See `AI-Features.md`.
- `notificationRoutes` is mounted at `/api/notifications` in `src/app.js`.
- `app.js` currently hard-codes allowed CORS origins. Ensure the production Vercel origin is listed without a trailing slash; see `CHANGELOG-and-Testing.md` for the known issue identified by the archive audit.
- `GET /api/health` does not verify MongoDB or external-service readiness.
- Database/Cloudinary deletion is not a single atomic transaction; test destructive classroom deletion only on disposable data.