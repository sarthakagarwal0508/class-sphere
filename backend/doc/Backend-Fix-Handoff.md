# ClassSphere Backend Fix Handoff

## Changes in this patch

### 1. Login role enforcement
- `POST /api/auth/login` now requires `email`, `password`, and `role` (`student` or `teacher`).
- The backend compares the requested portal role against the role saved in MongoDB. A mismatch returns `403` with `code: ROLE_MISMATCH`; it does not change the stored role and does not issue tokens.
- Duplicate registration still returns `409`.
- Google login also requires the selected role and rejects a mismatch for an existing account.
- The JWT role always comes from the database user record.

**Frontend action required:** include `role: "student"` or `role: "teacher"` in both password-login and Google-login requests. On `403` with `code: ROLE_MISMATCH`, show the returned message and do not store tokens or navigate to the dashboard. On successful login, route based on `response.data.user.role`.

Example password-login body:
```json
{ "email": "user@example.com", "password": "your-password", "role": "teacher" }
```

Google login body:
```json
{ "idToken": "GOOGLE_SIGN_IN_ID_TOKEN", "role": "teacher" }
```

### 2. Orphaned data
- Classroom deletion now removes dependent quizzes, quiz attempts, student risk profiles, doubts, notifications, announcements, assignments, submissions, and study-material records.
- Added `scripts/auditOrphanedData.js`. It checks broken references across classrooms, assignments, submissions, quizzes, attempts, risk profiles, study materials, announcements, notifications, and doubts.
- The script is **dry-run by default**. Review its report and back up the database before running `node scripts/auditOrphanedData.js --apply` against the intended database.
- The script preserves historical submissions/quiz attempts when the referenced student still exists but has left the classroom. It does not delete Cloudinary remote files; remote asset cleanup is separate.

**Important:** this patch does not connect to or mutate the deployed MongoDB. Run the audit on the intended database yourself after backup. Do not run it during deployment.

### 3. Student at-risk ML API
- The backend continues to call `POST {MODEL_API_URL}/predict-batch`.
- Removed `date_unregistration` from the outgoing model payload because the supplied ML deployment guide lists the supported model fields without it. The value may remain stored in the backend profile but is not sent to the model.
- The backend validates risk prediction response count and fields. Keep `MODEL_API_URL` as the service **base URL only** (for example `https://your-risk-api.onrender.com`), not `/predict` or `/predict-batch`.
- ML input values must match the guide's exact allowed category labels; the model expects the day-90 activity window and `clicks_last_30_days` for days 61–90.

### 4. AI quiz generator integration
- The service contract from the ML guide is Flask: `GET /health`, `POST /generate-quiz` (JSON), `POST /generate-quiz-from-pdf` (multipart field `file`).
- `QUIZ_SERVICE_URL` must be the **base URL only**, not include an endpoint path. The backend appends the routes itself.
- Non-JSON responses now produce a safer diagnostic error indicating the upstream HTTP status, without forwarding upstream HTML. Check the quiz service's deployment logs if this appears.
- The quiz service must have `GEMINI_API_KEY` set in its own deployment environment. The backend's `QUIZ_SERVICE_URL` is not a substitute for that key.
- PDF generation needs a text-based PDF with at least 50 characters of extractable text; scanned/image-only PDFs will not work unless OCR is added by the AI team.

### 5. CORS
- Normalized the production Vercel origin by removing the accidental trailing slash in the allow-list. Browser `Origin` values do not contain a trailing slash.

## Environment variables to check
- Main Node backend: `MONGODB_URI`, `JWT_SECRET`, `JWT_REFRESH_SECRET`, `QUIZ_SERVICE_URL`, `MODEL_API_URL`, `AI_SERVICE_URL`, plus existing email/Cloudinary/Google settings.
- Quiz Flask service: `GEMINI_API_KEY`; optionally `GEMINI_MODEL` and `GEMINI_FALLBACK_MODEL`.
- Risk FastAPI service: deploy `main.py`, `predictor.py`, `best_model.pkl`, and pinned requirements together. The supplied guide specifies scikit-learn `1.9.1`.

Never commit real secrets to Git.

## Verification performed locally
- JavaScript syntax checks for changed backend files.
- `node --test`: all 8 backend service tests passed after the changes.
- Live Render, MongoDB production records, the external quiz service, and the ML service were not reachable/modified from this patching environment. Test the deployed services after pushing.

## Post-deploy smoke tests
1. Register a student account, verify OTP, then log in with `role: "student"` (should succeed).
2. Try the same email/password with `role: "teacher"` (should return `403 ROLE_MISMATCH`, no tokens).
3. Create a classroom with a teacher account (should return `201`).
4. Run the orphan audit in dry-run mode against a backup/staging DB first.
5. Open `GET {QUIZ_SERVICE_URL}/health` and expect `{"status":"ok"}`.
6. Test topic quiz and text-based PDF quiz generation; check both Node and Python service logs on errors.
7. Test the at-risk endpoint with a complete, valid profile and verify the model service returns a prediction list matching the student count.
