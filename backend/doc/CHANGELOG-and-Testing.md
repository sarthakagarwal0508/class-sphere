# Changelog and Testing

## Current backend updates

- Replaced the old risk-profile prediction input with the six-field XGBoost contract.
- Added `Classroom.courseStartDate` and a repeatable migration from legacy `createdAt` values.
- Added `ActivityEvent` tracking for meaningful student learning actions.
- Sends ML prediction requests on any course day; features use data through request time, capped at course day 90 inclusive.
- Adds `Assignment.weight` and retains late submission timestamps for the model's late-submission feature.
- Adds API-key header support for the separate FastAPI ML service.
- Removes all `StudentRiskProfile` model workflow references.
- Adds Cloudinary cleanup for assignment PDFs, student submission PDFs, and study-material PDFs when deleting a classroom.
- Adds a dry-run-by-default orphan audit script.
- Adds student quiz attempt review with their selected answer, correct answer, and correctness for each question.

## Automated tests

Run:

```bash
npm test