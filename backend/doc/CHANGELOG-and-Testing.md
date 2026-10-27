# Changelog and Testing

## Documentation and route coverage update

- Updated `API-Index.md` to include the Doubt Forum endpoints and the persistent Quiz/QuizAttempt endpoints that are mounted in `src/app.js`.
- Updated `Data-Schemas.md` to cover all 11 Mongoose models, their constraints, indexes, enums, and relationships.
- Updated `README.md` to describe this repository/archive as the documentation source of truth, add the Doubt Forum and persistent quiz workflow, and distinguish automated tests from endpoint/integration testing.
- Updated `Study-Materials.md` so its update response documents `cloudinaryPublicId`, which the current controller returns with the material document. The list endpoint omits this field.
- Added the placeholder-only `.env.example` file to document environment variables read by the current backend. It contains no working credentials.
- `AI-Features.md` continues to distinguish remote AI content generation from the MongoDB-backed quiz save/publish/attempt workflow.

## ML and AI service integration in the current backend

- Existing Node.js/Express API routes include authentication, classroom, assignment, study-material, announcement, notification, analytics, ML prediction, doubt, and persistent quiz features.
- The teacher-only at-risk prediction integration uses `MODEL_API_URL` and the documented risk-profile fields.
- Authenticated PDF summarization/flashcard generation uses `AI_SERVICE_URL`.
- Teacher-only quiz generation from topic/study text and PDF uses `QUIZ_SERVICE_URL`; generated responses include answer keys, so the routes remain teacher-only.
- The AI service clients validate service URLs, enforce HTTPS for non-local URLs, use 120-second timeouts, validate JSON response shape, and normalize upstream errors as implemented in the source.
- No real `.env`, live API keys, or production credentials are included in this archive.

## Automated checks run for this archive

- `npm test`: **6 passing tests, 0 failures**.
- `node --check` run for every JavaScript file under `src/`: **passed**.
- These tests are focused on the AI/ML service clients and syntax. They do **not** establish end-to-end correctness for controllers, MongoDB behavior, Cloudinary, Gmail, Google sign-in, or separately deployed Python services.

## Known findings from this archive audit — not yet fixed in backend code

1. **Production CORS origin:** `src/app.js` includes `https://class-sphere-one.vercel.app/` with a trailing slash. Browser `Origin` values normally omit the slash, so the production origin does not match the allowlist. Remove the slash and verify the actual deployed frontend hostname before deployment.
2. **Classroom deletion cleanup:** `deleteClassroom` does not yet delete associated `Doubt`, `Quiz`, `QuizAttempt`, and `StudentRiskProfile` records. Add dependency-safe cleanup, deleting attempts before quizzes. Database and Cloudinary cleanup cannot be one atomic transaction.
3. **Demo reset cleanup:** `scripts/seedDemo.js` does not yet clear the newer Doubt, Quiz, and QuizAttempt models, and database reset can leave related Cloudinary assets behind. Preserve the existing reset safeguards.
4. **Teacher analytics population:** teacher submission analytics should use a consistent current-student population in numerator and denominator or explicitly report historical submissions separately.
5. **Announcement input validation:** validate input types and schema length limits before saving; invalid client input should return `400`, rather than be handled as a generic `500`.
6. **Quiz validation:** `totalMarks` controller validation currently accepts positive values below the schema minimum of `1`; published quiz answer-key validation does not reject empty/whitespace strings or verify answer-to-option consistency. Confirm the external AI output schema before tightening option checks.
7. **External service compatibility:** live summarizer/quiz and ML service deployments were not called in this archive audit. Configure real service URLs and verify the supported Gemini model and key in the service environment.

## Environment variables

Copy `.env.example` to `.env`, then supply real values. Never commit `.env`.

- Core database/auth/email: `MONGODB_URI`, `JWT_SECRET`, `JWT_REFRESH_SECRET`, `EMAIL_USER`, `EMAIL_APP_PASSWORD`.
- Google sign-in: `GOOGLE_CLIENT_ID`.
- Study-material file storage: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`.
- ML/AI: `MODEL_API_URL`, `AI_SERVICE_URL`, `QUIZ_SERVICE_URL`.
- Optional token expiry: `ACCESS_TOKEN_EXPIRES_IN` (default `15m`), `REFRESH_TOKEN_EXPIRES_IN` (default `7d`).
- Demo reset only: `ALLOW_DATABASE_RESET`, `RESET_DB_NAME`. The script requires `ALLOW_DATABASE_RESET=true` and an exact database-name match.

## Before deployment

1. Fix the CORS origin mismatch and verify the live frontend hostname.
2. Add cleanup for newer models to classroom deletion and guarded demo reset; decide and document the desired Cloudinary asset cleanup behavior.
3. Resolve validation and analytics-population issues listed above.
4. Configure the real `MODEL_API_URL`, `AI_SERVICE_URL`, and `QUIZ_SERVICE_URL` on the Node.js backend Render service.
5. Deploy and test with real teacher/student access tokens and disposable test data.
6. Test role restrictions, classroom membership checks, quiz publication/scoring/duplicate attempts, doubt replies/status transitions, and destructive cleanup against a test database.
7. Verify the quiz service's configured Gemini model ID is supported by its API key.
8. Use representative and appropriately authorized student data for ML risk predictions. Predictions are estimates and must not be the sole basis for high-impact decisions.