# ClassSphere Backend API Documentation

**Applies to:** the backend source files in this repository/archive.  
**Base URL (local):** `http://localhost:5000`  
**Content type:** JSON unless an endpoint explicitly uses `multipart/form-data` or returns PDF bytes.

This documentation is intended to match the current `src/routes/`, `src/controllers/`, `src/models/`, and `src/app.js` files in this backend archive. Deployment configuration and external services still need to be verified in the target environment.

## Start here

1. Register with `POST /api/auth/register`.
2. Verify email with `POST /api/auth/verify-otp`.
3. Log in with `POST /api/auth/login`, or use Google sign-in through `POST /api/auth/google`.
4. For protected routes, send `Authorization: Bearer <ACCESS_TOKEN>`.
5. Refresh tokens using `POST /api/auth/refresh`. Replace **both** returned access and refresh tokens after a successful refresh because refresh-token rotation is enabled.
6. A teacher creates a classroom; students join it using its `classCode`.
7. Teachers can create assignments, share study materials, post announcements, create/publish quizzes, and view classroom analytics. Students can submit assignments and quizzes, view course resources, and participate in the doubt forum.

## Roles

- `student`
- `teacher`

There is no `admin` role in the current User schema. Protected requests load the user from the database and use the stored role for authorization.

## Documentation files

- `API-Index.md` — complete route index covering authentication, classrooms, assignments, materials, announcements, notifications, analytics/ML, AI features, persistent quizzes, and doubts.
- `Authentication.md` — register, OTP, login, Google auth, refresh, logout, and current user.
- `Classroom-Management.md` — create/list/join/update/delete classrooms and manage members.
- `Assignments-and-Grading.md` — assignment creation, submissions, grading, and student submission lookup.
- `Study-Materials.md` — PDF upload, list, download, update, and delete.
- `Announcements-and-Notifications.md` — announcements and in-app notifications.
- `Analytics.md` — student and teacher analytics endpoints.
- `ML-Performance-Insights.md` — teacher-only risk-profile and prediction APIs, required profile fields, model-service configuration, and data compatibility caveats.
- `AI-Features.md` — PDF summarization/flashcards and teacher-only AI quiz generation; also explains how generated questions feed into the persistent quiz workflow.
- `Doubt-Forum.md` — doubt creation, list/filter/pagination, replies, and resolve/reopen endpoints.
- `Data-Schemas.md` — all Mongoose model schemas, enums, indexes, and relationships.
- `CHANGELOG-and-Testing.md` — documented changes, checks run against this archive, known gaps, and deployment checklist.

## Common headers

Protected JSON request:

```http
Authorization: Bearer <ACCESS_TOKEN>
Content-Type: application/json
```

For PDF upload, use `multipart/form-data` and let Postman/browser generate the multipart boundary. For PDF download, the response is `application/pdf`, not JSON.

## Common errors

```json
{
  "success": false,
  "message": "Invalid or expired access token."
}
```

- `400` — invalid or missing input.
- `401` — missing, invalid, or expired authentication token.
- `403` — authenticated user lacks the required role or resource access.
- `404` — resource not found or not accessible under the endpoint's checks.
- `409` — duplicate account, duplicate membership, or similar conflict where explicitly handled.
- `413` — uploaded PDF exceeds the configured 10 MB limit.
- `429` — rate limit, OTP cooldown, or verification attempt limit.
- `500` — unexpected server-side failure.
- `502` — external service or Cloudinary retrieval failure in relevant endpoints.
- `503` — required external service URL is missing/invalid or a service is unavailable, where handled.
- `504` — external service timed out, where handled.

Actual error codes vary by controller; use the feature-specific document for endpoint-level behavior.

## Environment configuration

Copy `.env.example` to `.env` and set real values locally. Never commit `.env` or put service secrets in frontend code. See `CHANGELOG-and-Testing.md` for variables and deployment checks.

- `MODEL_API_URL` — required for ML risk-prediction routes.
- `AI_SERVICE_URL` — required for PDF summarization and flashcard generation.
- `QUIZ_SERVICE_URL` — required for AI quiz generation.
- `MONGODB_URI`, JWT secrets, Gmail credentials, Google OAuth client ID, and Cloudinary credentials are used by their respective features.
- Demo reset requires the explicit `ALLOW_DATABASE_RESET=true` safeguard and the matching `RESET_DB_NAME`.

## Important integration and known-issue notes

- IDs such as `CLASSROOM_ID`, `ASSIGNMENT_ID`, `MATERIAL_ID`, `QUIZ_ID`, and `DOUBT_ID` must be actual MongoDB ObjectId strings.
- Do not send refresh tokens as bearer access tokens.
- Never return assignment/quiz answer keys or service secrets in student-facing responses.
- `GET /api/health` confirms that the HTTP API process responds; it does not prove MongoDB, email, Cloudinary, or ML/AI services are healthy.
- **Known CORS issue in this archive:** `src/app.js` currently lists the production Vercel origin with a trailing slash. Browser `Origin` values do not include that slash. Remove it and verify the real deployed frontend hostname before relying on production browser requests.
- **Known data-cleanup gap in this archive:** classroom deletion and demo reset do not yet delete every newer Doubt/Quiz/QuizAttempt/StudentRiskProfile record. See `Data-Schemas.md` and `CHANGELOG-and-Testing.md` before using destructive operations on real data.
- Classroom deletion is destructive. Test it only on a disposable classroom and keep a backup. MongoDB and Cloudinary deletion are not one atomic transaction.