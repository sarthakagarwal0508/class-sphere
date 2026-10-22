# Learning Analytics APIs

Base URL: `http://localhost:5000`. All endpoints require a ClassSphere access token.

Analytics are computed from classroom membership, assignments, submissions, grades and assignment maximum marks. These are deterministic calculations, not the separate ML Student Performance Predictor.

## 1. Student overall overview

**GET** `/api/analytics/student/overview` — student only; no body.

Success `200`:
```json
{
  "success": true,
  "data": {
    "totalClassrooms": 2,
    "totalAssignments": 8,
    "completedAssignments": 5,
    "gradedAssignments": 4,
    "pendingAssignments": 3,
    "averagePercentage": 82.5
  }
}
```
`averagePercentage` is `null` when there are no graded marks available. `completedAssignments` counts any submission record; `gradedAssignments` counts graded records.

## 2. Student analytics for one classroom

**GET** `/api/analytics/student/classrooms/CLASSROOM_ID` — enrolled student only.

Success `200` has `data.classroom`, totals, `averagePercentage`, and an `assignments` array. Each assignment item includes assignment details and submission status/marks where available.

Example response shape:
```json
{
  "success": true,
  "data": {
    "classroom": { "id": "671234567890abcdef123456", "name": "Data Structures" },
    "totalAssignments": 3,
    "completedAssignments": 2,
    "gradedAssignments": 1,
    "pendingAssignments": 1,
    "averagePercentage": 85,
    "assignments": [
      {
        "assignmentId": "671234567890abcdef123457",
        "title": "Binary Trees Worksheet",
        "maxMarks": 20,
        "dueDate": "2026-11-05T18:00:00.000Z",
        "status": "graded",
        "marksObtained": 17,
        "submittedAt": "2026-10-22T10:00:00.000Z",
        "gradedAt": "2026-10-22T10:30:00.000Z"
      }
    ]
  }
}
```
The response item keys above match the controller. IDs and timestamps are illustrative.

## 3. Teacher analytics for a classroom

**GET** `/api/analytics/teacher/classrooms/CLASSROOM_ID` — owning teacher only.

Success `200`:
```json
{
  "success": true,
  "data": {
    "classroom": { "id": "671234567890abcdef123456", "name": "Data Structures" },
    "totalStudents": 25,
    "totalAssignments": 4,
    "totalPossibleSubmissions": 100,
    "totalSubmissions": 72,
    "totalGradedSubmissions": 60,
    "pendingSubmissions": 28,
    "submissionRate": 72,
    "averageGradedPercentage": 78.4
  }
}
```
The average is `null` if no submissions have been graded.

## 4. Teacher analytics for students in a classroom

**GET** `/api/analytics/teacher/classrooms/CLASSROOM_ID/students` — owning teacher only.

Success `200`:
```json
{
  "success": true,
  "data": {
    "classroom": { "id": "671234567890abcdef123456", "name": "Data Structures" },
    "students": [
      {
        "student": { "id": "671234567890abcdef123457", "name": "Aarav Sharma", "email": "aarav@example.com" },
        "totalAssignments": 4,
        "submittedAssignments": 3,
        "gradedAssignments": 2,
        "pendingAssignments": 1,
        "averagePercentage": 81.25
      }
    ]
  }
}
```

## Error cases

- Invalid classroom ID: `400`.
- Student is not enrolled / teacher does not own classroom: `404` in these handlers.
- Unexpected server failure: `500`.
