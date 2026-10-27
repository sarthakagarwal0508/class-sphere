# ML-Based Performance Insights — Backend Integration

This feature connects the existing ClassSphere Node.js API to the separately deployed ClassSphere FastAPI model service. It adds two teacher-only endpoints and does not replace the existing analytics endpoints.

## Environment setup

Set `MODEL_API_URL` in the local backend `.env` and in the **Node.js backend** Render service environment (not only on the ML service):

```env
MODEL_API_URL=https://student-performance-predictions-6jq9.onrender.com
```

Node.js 18 or newer is required because the integration uses the built-in `fetch` API. No new npm package is required.

## Endpoints

All requests require `Authorization: Bearer <ClassSphere accessToken>`. The requester must have the `teacher` role and must own the classroom in the URL.

### 1. Configure a student's model profile

`PUT /api/analytics/teacher/classrooms/:id/students/:studentId/risk-profile`

This is a per-student, per-classroom profile because some required input values do not exist in the current ClassSphere models. The controller verifies classroom ownership and that the student is enrolled. Profile fields are validated against the exact choices accepted by the deployed model.

Example request body:

```json
{
  "num_of_prev_attempts": 0,
  "studied_credits": 60,
  "date_registration": -45,
  "date_unregistration": null,
  "total_clicks": 320,
  "active_days": 25,
  "resources_visited": 12,
  "clicks_last_30_days": 90,
  "code_module": "AAA",
  "code_presentation": "2014J",
  "gender": "F",
  "region": "East Anglian Region",
  "highest_education": "A Level or Equivalent",
  "imd_band": "20-30",
  "age_band": "0-35",
  "disability": "N"
}
```

The values above are illustrative only. Submit values backed by actual/consented data and use the model's documented category labels exactly. `num_of_prev_attempts` defaults to `0` if omitted and `date_unregistration` may be stored as optional profile context; the backend does not send `date_unregistration` to the supplied prediction API because it is not in that API guide's accepted model input fields. All other example fields are required to configure a profile. The endpoint does not accept score fields—the scores are calculated from ClassSphere assignment/submission records. The model API input uses the documented 20 fields and a day-90 cutoff; `clicks_last_30_days` represents days 61–90.

Successful response:

```json
{
  "success": true,
  "message": "Student risk profile saved.",
  "data": {
    "studentId": "<studentId>",
    "classroomId": "<classroomId>",
    "profileConfigured": true,
    "updatedAt": "<timestamp>"
  }
}
```

### 2. Get predictions for students in a classroom

`GET /api/analytics/teacher/classrooms/:id/risk-predictions`

The controller loads enrolled students, assignments, submissions and profiles. It derives:

- `num_assessments_done`: number of submission records for the student in this classroom.
- `avg_score` and `min_score`: average and minimum percentages for graded submissions, normalized against each assignment's `maxMarks`.
- `weighted_score`: combined marks as a percentage of the combined maximum marks.
- `late_submissions`: submissions whose `submittedAt` is after their assignment `dueDate`.

Activity totals, course-context values and model-required categories come from the configured profile. These are not presently captured by the base ClassSphere models, so they must be supplied when configuring the profile. Students without a profile are returned with `status: "profile_required"` and are not sent to the model.

Predicted student result shape:

```json
{
  "student": { "id": "<studentId>", "name": "Student Name", "email": "student@example.com" },
  "status": "predicted",
  "prediction": {
    "at_risk": true,
    "risk_probability": 0.6721,
    "risk_level": "High"
  },
  "performanceMetrics": {
    "numAssessmentsDone": 4,
    "gradedAssessments": 3,
    "pendingAssessments": 1,
    "averageScore": 58.33,
    "minimumScore": 40,
    "weightedScore": 60,
    "lateSubmissions": 1
  }
}
```

A prediction is calculated live on each request; it is not stored in MongoDB. The model service's results are returned in input order. If the ML service is unavailable or returns an invalid response, the endpoint returns an appropriate 502/503/504 error.

## Required deployment settings

1. Ensure `MODEL_API_URL` is set on the Node.js backend's Render service.
2. Deploy this backend code after review.
3. The ML service must be reachable from the Node.js Render service over HTTPS.
4. Test both endpoints with a teacher access token and a classroom the teacher owns.

## Model/data compatibility notes

- The supplied model expects specific OULAD-style categories (`AAA`–`GGG`, `2013B`/`2013J`/`2014B`/`2014J`, and the listed demographic/category labels). ClassSphere subjects do not automatically map to those codes; do not guess the mappings.
- The supplied model was designed around activity/performance data up to day 90. Keep profile activity counters aligned to the same time window where the source data supports it.
- ClassSphere currently does not record literal LMS clicks, active days or resource visits in the schemas included with this backend archive. Those inputs are supplied through the risk profile API rather than fabricated by the server. For production-quality automation, add legitimate activity-event collection and define an explicit mapping to model training features.
- Demographic and socioeconomic attributes can be sensitive. Collect only with an appropriate basis/consent, restrict access, and avoid exposing profile values in prediction responses.
- These are model estimates, not guarantees or diagnoses. Do not use the risk output as the sole basis for decisions affecting a student; have a teacher review the underlying evidence.
