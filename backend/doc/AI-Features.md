# AI Features — Summarizer, Flashcards and Quiz Generator

These endpoints proxy requests from the authenticated ClassSphere API to separately deployed Python services. Configure the service base URLs in the Node.js backend's environment; do not put Gemini keys or service secrets in frontend code.

## Environment variables

```env
AI_SERVICE_URL=https://<deployed-summarizer-service-host>
QUIZ_SERVICE_URL=https://<deployed-quiz-generator-service-host>
```

Set both on the local backend `.env` and the Node.js backend's Render Environment page. Use the actual public base URLs supplied by the service owners, without `/summarize`, `/generate-quiz`, or trailing route paths. The URLs are not included in this archive because the integration guides did not specify deployed hostnames.

## 1. Summarize notes and create flashcards

`POST /api/ai/summarize`

Access: authenticated `student` or `teacher`.

Headers: `Authorization: Bearer <ACCESS_TOKEN>`.

Body: `multipart/form-data`, field `file` containing a PDF. Maximum size is 10 MB. The service extracts text and returns a Markdown-style summary and flashcards. Scanned/image-only PDFs without extractable text may fail because the service does not include OCR.

Successful response:

```json
{
  "success": true,
  "data": {
    "summary": "## Heading\n- Key point",
    "flashcards": [{ "question": "...", "answer": "..." }]
  }
}
```

## 2. Generate a quiz from a topic or study text

`POST /api/ai/quizzes/generate`

Access: authenticated `teacher` only. The response includes correct answers, so this endpoint must not be exposed to students directly.

JSON body:

```json
{
  "topic": "Photosynthesis",
  "study_material": "",
  "num_questions": 5,
  "difficulty": "mixed"
}
```

At least one of `topic` or `study_material` must be non-empty. `num_questions` is 1–20. `difficulty` is `easy`, `medium`, `hard`, or `mixed`. The external service can return fewer valid unique questions than requested; check `data.returned` and `data.warnings`.

## 3. Generate a quiz from PDF

`POST /api/ai/quizzes/generate-from-pdf`

Access: authenticated `teacher` only.

Body: `multipart/form-data`, `file` PDF, optional `num_questions` (1–20, default 5), optional `difficulty` (default `mixed`). The PDF service requires at least 50 characters of extractable text; OCR is not available in the supplied service.

## Error handling and security

- The main backend forwards service errors with an HTTP status and a stable `code` where possible.
- Service calls have a 120-second timeout. A timeout returns 504; an unreachable service returns 502; missing/invalid service URL returns 503.
- PDF uploads are memory-buffered and capped at 10 MB.
- The summarizer can return generated flashcards. Quiz responses include answer keys; keep quiz-generation routes teacher-only and do not return those answers to student quiz-taking views.
- The supplied guides do not include deployed URLs. Replace the placeholders in environment configuration with the actual deployed summarizer and quiz service URLs before using these endpoints in production.
- The supplied guides flag the quiz service's default Gemini model ID as something to verify with the API key. If the quiz service returns HTTP 500/502, check its Render logs, `GEMINI_API_KEY`, and supported `GEMINI_MODEL` value.
- These routes generate content but do not persist summaries, flashcards, or quizzes in MongoDB. Persistence and quiz attempts/grading are separate future work if the product requires them.
