# Changelog and Testing

## ML and AI service integration update

- Kept the existing Node.js/Express API, authentication, classroom, assignment, study-material, announcement, notification and analytics routes.
- Kept the existing teacher-only at-risk prediction integration and documented its required model profile fields.
- Added authenticated PDF notes summarization and flashcard generation through `AI_SERVICE_URL`.
- Added teacher-only quiz generation from topic/study text and from PDF through `QUIZ_SERVICE_URL`; quiz endpoints are teacher-only because responses contain correct answers.
- Added service URL validation, HTTPS enforcement for non-local URLs, 120-second timeouts, JSON response validation and consistent upstream errors.
- Added `.env.example` and `doc/AI-Features.md`. No live `.env` or API keys are included.
- No new npm dependencies were added; the project already includes `multer` and requires Node.js 18+ for built-in `fetch`, `FormData`, and `Blob`.

## Automated checks run for this archive

- `npm test`: 6 passing tests, 0 failures.
- `node --check` run for every JavaScript file under `src/`: passed.
- These checks cover client behavior and syntax; they do not prove that the remote summarizer/quiz services are deployed or that their environment URLs are configured correctly.

## Before deployment

1. Keep the existing local `.env` unchanged and add the three service URLs if missing.
2. In the Node.js backend Render service, configure `MODEL_API_URL`, `AI_SERVICE_URL`, and `QUIZ_SERVICE_URL` with the real public base URLs.
3. Deploy the backend and test with a real teacher/student access token.
4. Verify the quiz service's configured Gemini model ID is supported by its API key, as noted in the AI Quiz Generator guide.
5. Use representative and appropriate student data for ML risk predictions. Model estimates must not be the sole basis for high-impact decisions.
